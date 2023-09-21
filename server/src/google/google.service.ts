import {Injectable} from '@nestjs/common';
import {Common, drive_v3, google} from "googleapis";
import process from "process";
import fs from "fs";
import path from "path";
import {FileSystemService} from "../file-system/file-system.service";
import {
    DownloadMultipleNewFilesAndDeleteUnlistedFiles,
    DownloadSingleFile, GetFileListInFolder,
    GetFullFileStructure
} from "../../types/google.service.types";
import {fileSystem} from "../../utilities/fileSystem.utilities";
import { regExpConditionToCollectContentIntoSingleFolder } from 'system/environmental';

@Injectable()
export class GoogleService {
    constructor(private fileSystemService: FileSystemService) {}

    initializeGoogleDrive(){

        const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URL);
        oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});

        return google.drive(({
            version: "v3",
            auth: oauth2Client
        }));

    }

    async getFileListInFolder({searchId}: GetFileListInFolder):  Promise<Common.GaxiosResponse<drive_v3.Schema$FileList>> {

        const googleDriveInstance = this.initializeGoogleDrive();

        return await googleDriveInstance.files.list({
            q: `'${searchId || process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID}' in parents`,
            fields: "files(id, name, kind, mimeType, thumbnailLink)"
        });

    }

    async getFullFileStructure({
        searchId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID,
        name,
    }: GetFullFileStructure) {

        const fileList = await this.getFileListInFolder({searchId});
        const newArray = {
            [searchId]: fileList.data.files.filter((item)=> (
                item.mimeType !== "application/vnd.google-apps.folder"
            )),
            name: name,
            mimeType: "folder"
        };

        for await (const listItem of fileList.data.files) {
            if (listItem.mimeType.match("application/vnd.google-apps.folder")) {

                const content = await this.getFullFileStructure({
                    searchId: listItem.id,
                    name: listItem.name,
                });

                // @ts-ignore
                newArray[searchId]?.push(content);
            }

        }

        return newArray;
    }

    async downloadSingleFile({ fileID, folderPath }: DownloadSingleFile){
        const googleDriveInstance = this.initializeGoogleDrive();
        const fileMetaData = await googleDriveInstance.files.get({
                fileId: fileID,
                fields: 'name'
            },
        );

        const fileStream = fs.createWriteStream(
            path.join(
                folderPath,
                fileMetaData.data.name
            )
        );
        const fileData = await googleDriveInstance.files.get({
            fileId: fileID,
            alt: 'media',
        },{
            responseType: "stream"
        });

        fileData.data.pipe(fileStream);

    }

    async downloadNewFilesAndDeleteUnlistedFiles({
        googleSortedContent,
        contentItemPath
    }: DownloadMultipleNewFilesAndDeleteUnlistedFiles){

        const contentKeys = Object.keys(googleSortedContent);
        const folderStructurePath = process.env.EASESCREEN_MMS_MEDIA_FOLDER;

        // /* !!! ПАПКИ, КОТОРЫЕ СЛЕДУЕТ ИСКЛЮЧИТЬ ИЗ ПРОВЕРКИ И УДАЛЕНИЯ
        // (ОНИ ЖЕ ЯВЛЯЮТСЯ ПАПКАМИ, СОДЕРЖАЩИМИ ВЕСЬ ОСНОВНОЙ КОНТЕНТ) !!! */
        const exceptionFolders = ["1344x1152", "full"];

        for await (const singleContentKey of contentKeys){

            const contentItem = googleSortedContent[singleContentKey];
            const newContentItemPath = (contentItemPath ?
                fileSystem.joinPath([contentItemPath, singleContentKey]) :
                fileSystem.joinPath([folderStructurePath, singleContentKey])
            );

            if(Array.isArray(contentItem)){

                const parentFileSystemFolderContent = this.fileSystemService.getListOfItemsInFolder(newContentItemPath);
                const googleFileNames = contentItem.map(item => item.name);

                for await (const fileName of parentFileSystemFolderContent){
                    if( ![...exceptionFolders, ...googleFileNames].includes(fileName) ){

                        fs.rmSync(fileSystem.joinPath([newContentItemPath, fileName]), {recursive: true, force: true});

                        this.fileSystemService.consoleColorLog({
                            consoleString: `Item ${fileName} is deleted`,
                            colorWords: {
                                red: [fileName],
                            }
                        });

                    }
                }

                for await (const internalContentItem of contentItem){

                    if(!parentFileSystemFolderContent.includes(internalContentItem.name)){

                        await this.downloadSingleFile({
                            fileID: internalContentItem.id,
                            folderPath: newContentItemPath
                        });

                        this.fileSystemService.consoleColorLog({
                            consoleString: `New file ${internalContentItem.name} is downloaded`,
                            colorWords: {
                                green: ["file"],
                                blue: [internalContentItem.name]
                            }
                        });

                    }

                }

            } else {
                await this.downloadNewFilesAndDeleteUnlistedFiles({
                    googleSortedContent: contentItem,
                    contentItemPath: newContentItemPath
                })
            }

        }
    }

}

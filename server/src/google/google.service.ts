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
        mimeType
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
                    mimeType: listItem.mimeType
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
        contentItemId, googleFolder, contentItemPath
    }: DownloadMultipleNewFilesAndDeleteUnlistedFiles){

        let index = 0;
        const id = contentItemId || process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
        const folderStructurePath = fileSystem.joinPath([process.env.EASESCREEN_MMS_MEDIA_FOLDER]);
        const parentFileSystemFolderPath = contentItemPath ? contentItemPath : folderStructurePath;
        const parentFileSystemFolderContent = this.fileSystemService.getListOfItemsInFolder(parentFileSystemFolderPath);
        /* !!! ПАПКИ, КОТОРЫЕ СЛЕДУЕТ ИСКЛЮЧИТЬ ИЗ ПРОВЕРКИ И УДАЛЕНИЯ
        (ОНИ ЖЕ ЯВЛЯЮТСЯ ПАПКАМИ, СОДЕРЖАЩИМИ ВЕСЬ ОСНОВНОЙ КОНТЕНТ) !!! */
        const exceptionFolders = ["1344x1152", "full"];
        const googleFolderContent = googleFolder[id].map(item => item?.name);

        // удаление контента, которого нет в актуальном списке
        for(const contentItem of parentFileSystemFolderContent){
            /* удаление файла/папки осуществляется в том случае, если название файла/папки в файловой системе
            не содержится в массиве с именами файлов/папок из облачного хранилища google */
            if( ![...exceptionFolders, ...googleFolderContent].includes(contentItem) ){

                fs.rmSync(fileSystem.joinPath([parentFileSystemFolderPath, contentItem]), {recursive: true, force: true});

                this.fileSystemService.consoleColorLog({
                    consoleString: `Item ${contentItem} is deleted`,
                    colorWords: {
                        red: [contentItem],
                    }
                });

            }

        }

        // проход по контенту в конкретной папке с названием
        for await (const contentItem of googleFolder[id]){

            // для файлов
            if(contentItem.mimeType !== "folder"){

                const newFolderPath = contentItemPath ? contentItemPath : folderStructurePath;
                const fileName = contentItem.name;

                // если файла нет в текущем каталоге, тогда скачиваем его
                if(!parentFileSystemFolderContent.includes(fileName)){

                    await this.downloadSingleFile({
                        fileID: contentItem.id,
                        folderPath: newFolderPath
                    });

                    this.fileSystemService.consoleColorLog({
                        consoleString: `New file ${contentItem.name} is downloaded`,
                        colorWords: {
                            green: ["file"],
                            blue: [contentItem.name]
                        }
                    });

                }

                // для папок
            } else {

                const contentItemId = Object.keys(contentItem)[0];
                const folderName = contentItem.name;
                const newFolder = googleFolder[id][index];
                const newContentItemPath = contentItemPath ?
                    path.join(contentItemPath, folderName) :
                    path.join(folderStructurePath, folderName);

                if(!fs.existsSync(newContentItemPath)){

                    fs.mkdirSync(newContentItemPath);
                    this.fileSystemService.consoleColorLog({
                        consoleString: `New folder ${folderName} is created`,
                        colorWords: {
                            green: ["folder"],
                            blue: [folderName],
                        }
                    });

                }

                await this.downloadNewFilesAndDeleteUnlistedFiles({contentItemId, googleFolder: newFolder, contentItemPath: newContentItemPath});
            }

            index += 1;
        }

    }

}

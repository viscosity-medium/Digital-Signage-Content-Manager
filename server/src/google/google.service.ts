import {Injectable} from '@nestjs/common';
import {Common, drive_v3, google} from "googleapis";
import * as process from "process";
import * as fs from "fs";
import * as path from "path";
import {FileSystemService} from "../file-system/file-system.service";

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

    async getFileListInFolder({searchId}:{searchId?: string}):  Promise<Common.GaxiosResponse<drive_v3.Schema$FileList>> {
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
    }:{
        searchId?: string,
        name?: string,
        mimeType?: string
    }) {

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
                // console.log(listItem)
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

    async downloadSingleFile({fileID, folderPath}: {fileID: string, folderPath?: any}){
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

    async downloadMultipleFiles({
        folder,
        contentId,
        folderPath
    }: {contentId?: string, folderPath?: string, folder: string | { [p: string]: drive_v3.Schema$File[] }}){

        const folderStructurePath = path.join(process.cwd(), "folderStructure");

        if(!contentId){
            if(fs.existsSync(folderStructurePath)){
                fs.rmSync(folderStructurePath, {recursive: true, force: true});
                fs.mkdirSync(folderStructurePath)
            } else {
                fs.mkdirSync(folderStructurePath)
            }
        }

        const id = contentId || process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;

        let index = 0;
        for await (const content of folder[id] ){

            if(content.id){

                const newFolderPath = folderPath ? folderPath : folderStructurePath;

                await this.downloadSingleFile({
                    fileID: content.id,
                    folderPath: newFolderPath
                });
                
                this.fileSystemService.consoleColorLog({
                    consoleString: `New file ${content.name} is downloaded`,
                    colorWords: {
                        green: ["file"],
                        blue: [content.name]
                    }
                });

            } else {

                const key = Object.keys(content)[0];
                const newFolder = folder[id][index];

                const newFolderPath = folderPath ? path.join(folderPath, key) : path.join(folderStructurePath, key);
                if(!fs.existsSync(newFolderPath)){
                    fs.mkdirSync(newFolderPath);
                    this.fileSystemService.consoleColorLog({
                        consoleString: `New folder ${key} is downloaded`,
                        colorWords: {
                            green: ["folder"],
                            blue: [key],
                        }
                    });
                }

                await this.downloadMultipleFiles({contentId: key, folder: newFolder, folderPath: newFolderPath});
            }

            index += 1;
        }

    }

}

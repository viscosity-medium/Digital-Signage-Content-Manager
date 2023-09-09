import {Injectable} from "@nestjs/common";
import {GoogleService} from "./google/google.service";
import * as process from "process";
import * as fs from "fs";
import * as path from "path";
import {fileSystem} from "../utilities/fileSystem.utilities";
import {getActualGoogleFilesList} from "../utilities/recursiveCycle.utilities";
import {xmlUtilities} from "../utilities/xml.utilities";
import {jsonUtilities} from "../utilities/json.utilities";


@Injectable()
export class AppService {

    constructor(private googleService: GoogleService) {}

    async startApp(){

        console.log("__Программа стартовала__\n");

        const googleFolderFileStructure = await this.googleService.getFullFileStructure({
            searchId: process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID,
            name: "RootDirectory",
            mimeType: "folder"
        });
        const fileStructurePath = fileSystem.createAbsolutePathFromProjectRoot(["model", "googleFolderFileStructure.json"]);
        const previousData = fs.readFileSync(fileStructurePath).toString();
        const currentData = JSON.stringify(googleFolderFileStructure, null, 4);
        const previousDataToCompare = previousData.replace(/"thumbnailLink":.*$/gm, "");
        const currentDataToCompare = currentData.replace(/"thumbnailLink":.*$/gm, "");

        const actualFileListData = getActualGoogleFilesList(googleFolderFileStructure as any);
        const actualFileListPath = fileSystem.createAbsolutePathFromProjectRoot(["model", "actualFilesList.json"]);
        console.log(actualFileListData);
        fileSystem.writeFile(actualFileListPath, actualFileListData);

        fileSystem.createFoldersRecursively("C:\\mms\\Media\\ENKA\\yabloneviy\\day");
        fileSystem.createFoldersRecursively("C:\\mms\\Media\\ENKA\\yabloneviy\\night");
        fileSystem.createFoldersRecursively("C:\\mms\\Media\\ENKA\\uglovoi\\day");
        fileSystem.createFoldersRecursively("C:\\mms\\Media\\ENKA\\uglovoi\\night");

        const jsonPathsArray = xmlUtilities.createMultipleJsonFilesFromXmlAndReturnJsonPathsInArray(["yabloneviy", "uglovoi"]);

        //fileSystem.copyMultipleFilesFromMmsMedia(jsonPathsArray);

        // const actualYabloneviyFileList = xmlUtilities.getActualFilesListFromJson(yabloneviyJsonPath);
        // const actualUglovoiFileList = xmlUtilities.getActualFilesListFromJson(yabloneviyJsonPath);
        // console.log(jsonPathsArray)
    

        if(previousData !== currentData){
            fs.writeFileSync(fileStructurePath, JSON.stringify(googleFolderFileStructure, null, 4));
            
            //await this.googleService.downloadMultipleFiles({folder: googleFolderFileStructure});
        } else {
            console.log("Файлы в системе соответствуют файлам в облачном хранилище google\n")
        }

        console.log("__Сканирование закончено__\n");

    }

}

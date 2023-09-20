import {Injectable} from "@nestjs/common";
import {GoogleService} from "./google/google.service";
import process from "process";
import fs from "fs";
import path from "path";
import {fileSystem} from "../utilities/fileSystem.utilities";
import {getActualGoogleFilesList, getSeparatedScreenSchedules} from "../utilities/recursiveCycle.utilities";
import {xmlUtilities} from "../utilities/xml.utilities";
import {jsonUtilities} from "../utilities/json.utilities";


@Injectable()
export class AppService {

    constructor(private googleService: GoogleService) {}

    async startApp(){

        console.log("__Программа стартовала__\n");

        // I) Блок получения актуальной структуры файлов/папок на гугл диске и структуры, сохранённой в последний раз
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

        // II) Получение списка актуальных файлов на гугл диске
        const actualFileListData = getActualGoogleFilesList(googleFolderFileStructure);
        const actualFileListPath = fileSystem.createAbsolutePathFromProjectRoot(["model", "actualFilesList.json"]);

        fileSystem.writeFile(actualFileListPath, actualFileListData);

        fileSystem.createMultipleFoldersRecursively([
            "C:\\mms\\Media\\ENKA\\yabloneviy\\day",
            "C:\\mms\\Media\\ENKA\\yabloneviy\\night",
            "C:\\mms\\Media\\ENKA\\uglovoi\\day",
            "C:\\mms\\Media\\ENKA\\uglovoi\\night"
        ]);

        //const jsonPathsArray = xmlUtilities.createMultipleJsonFilesFromXmlAndReturnJsonPathsInArray(["yabloneviy", "uglovoi"]);

        //fileSystem.copyMultipleFilesFromMmsMedia(jsonPathsArray);

        // const actualYabloneviyFileList = xmlUtilities.getActualFilesListFromJson(yabloneviyJsonPath);
        // const actualUglovoiFileList = xmlUtilities.getActualFilesListFromJson(yabloneviyJsonPath);
        // console.log(jsonPathsArray)

        if(previousData !== currentData) {

            fs.writeFileSync(fileStructurePath, JSON.stringify(googleFolderFileStructure, null, 4));

            // const {
            //     Yabloneviy, Uglovoi
            // } = getSeparatedScreenSchedules(schedule);

            // скачивание файлов с google диска
            if(previousDataToCompare !== currentDataToCompare){
                console.log("OOO")
                await this.googleService.downloadNewFilesAndDeleteUnlistedFiles({googleFolder: googleFolderFileStructure});
            }

        } else {
            console.log("Файлы в системе соответствуют файлам в облачном хранилище google\n")
        }

        console.log("__Сканирование закончено__\n");

    }

}

import {Injectable} from "@nestjs/common";
import {GoogleService} from "./google/google.service";
import process from "process";
import {fileSystem} from "../utilities/fileSystem.utilities";
import {getActualGoogleFilesList, getSeparatedFileListFromGoogleStructure} from "../utilities/recursiveCycle.utilities";

@Injectable()
export class AppService {

    constructor(private googleService: GoogleService) {}

    async startApp(){

        console.log("__Программа стартовала__\n");

        // I) Блок получения актуальной структуры файлов/папок на гугл диске и структуры, сохранённой в последний раз
        const googleFolderFileStructure = await this.googleService.getFullFileStructure({
            searchId: process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID,
            name: "RootDirectory",
        });

        const fileStructurePath = fileSystem.createAbsolutePathFromProjectRoot(["model", "googleFolderFileStructure.json"]);

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

        const screensUniqueContent = getSeparatedFileListFromGoogleStructure(googleFolderFileStructure);

        // const jsonPathsArray = xmlUtilities.createMultipleJsonFilesFromXmlAndReturnJsonPathsInArray(["yabloneviy", "uglovoi"]);

        // fileSystem.copyMultipleFilesFromMmsMedia(jsonPathsArray);

        // const actualYabloneviyFileList = xmlUtilities.getActualFilesListFromJson(yabloneviyJsonPath);
        // const actualUglovoiFileList = xmlUtilities.getActualFilesListFromJson(yabloneviyJsonPath);
        // console.log(jsonPathsArray)

        fileSystem.writeFileSync(fileStructurePath, JSON.stringify(googleFolderFileStructure, null, 4));
        await this.googleService.downloadNewFilesAndDeleteUnlistedFiles({googleSortedContent: screensUniqueContent});

        console.log("__Сканирование закончено__\n");

    }

}

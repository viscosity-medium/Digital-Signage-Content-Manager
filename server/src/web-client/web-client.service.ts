import {Injectable} from '@nestjs/common';
import {FileSystemService} from "../file-system/file-system.service";
import fs from "fs";
import {ScheduleStructure} from "../../types/scheduleStucture.types";
import {ftpUtilities} from "../../utilities/ftp.utilitie";
import {fileSystem} from "../../utilities/fileSystem.utilities";
import {xmlUtilities} from "../../utilities/xml.utilities";
import {GoogleService} from "../google/google.service";
import {
    getActualGoogleFilesList,
    getSeparatedFileListFromGoogleStructure
} from "../../utilities/recursiveCycle.utilities";

@Injectable()
export class WebClientService {

    constructor(
        private fileSystemService: FileSystemService,
        private googleService: GoogleService
    ) {}

    async getActualGoogleData(){

        console.log("__Началась загрузка актуальных данных из хранилища google__\n");

        // I) Блок получения актуальной структуры файлов/папок на гугл диске и структуры, сохранённой в последний раз
        const googleFolderFileStructure = await this.googleService.getFullFileStructure({
            searchId: process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID,
            name: "RootDirectory",
        });

        console.log("Актуальная структура данных получена");

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
        const beautifiedGoogleFileStructure = JSON.stringify(googleFolderFileStructure, null, 4);

        // const jsonPathsArray = xmlUtilities.createMultipleJsonFilesFromXmlAndReturnJsonPathsInArray(["yabloneviy", "uglovoi"]);

        // fileSystem.copyMultipleFilesFromMmsMedia(jsonPathsArray);

        // const actualYabloneviyFileList = xmlUtilities.getActualFilesListFromJson(yabloneviyJsonPath);
        // const actualUglovoiFileList = xmlUtilities.getActualFilesListFromJson(yabloneviyJsonPath);
        // console.log(jsonPathsArray)

        fileSystem.writeFileSync(fileStructurePath, beautifiedGoogleFileStructure);
        console.log("Начинается (загрузка новых / удаление старых) файлов");
        await this.googleService.downloadNewFilesAndDeleteUnlistedFiles({googleSortedContent: screensUniqueContent});

        console.log("__Сканирование закончено__\n");

        return {
            schedule: JSON.parse(beautifiedGoogleFileStructure),
            response: "Файлы из облачного хранилища google были загружены на сервер"
        };

    }

    getGoogleDriveStructure(){

        const filePath = this.fileSystemService.getFolderAbsolutePath({
            pathArray: ["model", "googleFolderFileStructure.json"]
        });

        return JSON.parse(fs.readFileSync(filePath).toString());

    }

    getScheduleStructure(){

        const filePath = this.fileSystemService.getFolderAbsolutePath({
            pathArray: ["model", "scheduleStructure.json"]
        });

        return JSON.parse(fs.readFileSync(filePath).toString());

    }

    async updateScheduleStructure(newScheduleData: ScheduleStructure){

        const filePath = this.fileSystemService.getFolderAbsolutePath({
            pathArray: ["model", "scheduleStructure.json"]
        });

        fs.writeFileSync(filePath, JSON.stringify(newScheduleData, null, 4));

        xmlUtilities.separateXmlScheduleAndWriteXmlFilesToFileSystem({newScheduleData});

        return {
            schedule: newScheduleData,
            response: "Расписание сохранено в системе EaseScreen"
        };

    }

    async uploadXmlFilesToMms(newScheduleData: ScheduleStructure){

        const YabloneviyXmlPath = fileSystem.createAbsolutePathFromProjectRoot(["xml", "yabloneviy", "0_0_0.xml"]);
        const UglovoiXmlPath = fileSystem.createAbsolutePathFromProjectRoot(["xml", "uglovoi", "0_0_0.xml"]);

        xmlUtilities.separateXmlScheduleAndWriteXmlFilesToFileSystem({newScheduleData});

        return await ftpUtilities.uploadMultipleXmlFilesToMms([
            {
                playerName: "Test",
                playerId: "{318A5E69-E22C-4141-95F5-DBF77E176ABF}",
                fileSystemPath: YabloneviyXmlPath
            },
            // !!! РАСКОММЕНТИРОВАТЬ ТОЛЬКО ДЛЯ ПРОДАКШЕНА !!!
            /*
            {
                playerName: "Yabloneviy",
                playerId: "{01B9DB3D-481B-433E-82D6-A13198E77255}",
                fileSystemPath: YabloneviyXmlPath
            },
            {
                playerName: "Uglovoi",
                playerId: "{3A822102-2397-48D1-86BD-D08BF1D65C1E}",
                fileSystemPath: UglovoiXmlPath
            }
            */
        ])
    }



}

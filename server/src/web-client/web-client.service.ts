import {Injectable} from '@nestjs/common';
import {FileSystemService} from "../file-system/file-system.service";
import fs from "fs";
import {ScheduleStructure} from "../../types/scheduleStucture.types";
import {ftpUtilities} from "../../utilities/ftp.utilitie";
import {fileSystem} from "../../utilities/fileSystem.utilities";
import {xmlUtilities} from "../../utilities/xml.utilities";

@Injectable()
export class WebClientService {

    constructor(private fileSystemService: FileSystemService) {}

    getFolderStructure(){

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

        const {
            YabloneviyXmlSchedule, UglovoiXmlSchedule
        } = xmlUtilities.formSeparatedXmlFiles({schedule: newScheduleData});

        xmlUtilities.writeXmlFilesToFileSystem({ YabloneviyXmlSchedule, UglovoiXmlSchedule });

        return {
            schedule: newScheduleData,
            response: "Расписание сохранено в системе EaseScreen"
        };

    }

    async uploadXmlFilesToMms(){

        const YabloneviyXmlPath = fileSystem.createAbsolutePathFromProjectRoot(["xml", "yabloneviy", "0_0_0.xml"]);
        const UglovoiXmlPath = fileSystem.createAbsolutePathFromProjectRoot(["xml", "uglovoi", "0_0_0.xml"]);

        return await ftpUtilities.uploadMultipleXmlFilesToMms([
            {
                playerName: "Test",
                playerId: "{318A5E69-E22C-4141-95F5-DBF77E176ABF}",
                fileSystemPath: YabloneviyXmlPath
            },
            // !!! РАСКОМЕНТИРОВАТЬ ТОЛЬКО ДЛЯ ПРОДАКШЕНА !!!
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

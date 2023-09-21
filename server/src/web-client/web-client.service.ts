import {Injectable} from '@nestjs/common';
import {FileSystemService} from "../file-system/file-system.service";
import fs from "fs";
import {ScheduleStructure} from "../../types/scheduleStucture.types";
import {processSchedule} from "../../utilities/recursiveCycle.utilities";

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

        await processSchedule({schedule: newScheduleData});

        fs.writeFileSync(filePath, JSON.stringify(newScheduleData, null, 4));

        return newScheduleData;

    }

}

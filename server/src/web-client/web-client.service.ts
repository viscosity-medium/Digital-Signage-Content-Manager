import { Injectable } from '@nestjs/common';
import {FileSystemService} from "../file-system/file-system.service";
import * as fs from "fs";
import path from "path";
import process from "process";
import {ScheduleStructure} from "../../types/scheduleStucture.types";

@Injectable()
export class WebClientService {

    constructor(private fileSystemService: FileSystemService) {}

    getFolderStructure(){

        const filePath = this.fileSystemService.getFolderAbsolutePath({
            pathArray: ["model", "fileStructure.json"]
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

        return newScheduleData
    }

}

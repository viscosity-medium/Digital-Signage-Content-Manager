import {Body, Controller, Get, Put} from '@nestjs/common';
import {WebClientService} from "./web-client.service";
import {ScheduleStructure} from "../../types/scheduleStucture.types";

@Controller()
export class WebClientController {

    constructor(private webClientService: WebClientService) {}

    @Get("get-folder-structure")
    getFolderStructure() {
        return this.webClientService.getFolderStructure();
    }

    @Get("get-schedule-structure")
    getScheduleStructure(){
        return this.webClientService.getScheduleStructure();
    }

    @Put("update-schedule-structure")
    updateScheduleStructure(@Body() {scheduleStructure}: {
        scheduleStructure: ScheduleStructure})
    {
        return this.webClientService.updateScheduleStructure(scheduleStructure);
    }

    @Get("upload-xml-files-to-mms")
    uploadXmlFilesToMms(){
        return this.webClientService.uploadXmlFilesToMms()
    }
}

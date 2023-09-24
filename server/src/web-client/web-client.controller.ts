import {Body, Controller, Get, Put} from '@nestjs/common';
import {WebClientService} from "./web-client.service";
import {ScheduleStructure} from "../../types/scheduleStucture.types";
import {GoogleService} from "../google/google.service";

@Controller()
export class WebClientController {

    constructor(
        private webClientService: WebClientService,
    ) {}

    @Get("get-actual-google-data")
    getActualGoogleData() {
        return this.webClientService.getActualGoogleData();
    }

    @Get("get-google-drive-structure")
    getGoogleDriveStructure() {
        return this.webClientService.getGoogleDriveStructure();
    }

    @Get("get-schedule-structure")
    getScheduleStructure(){
        return this.webClientService.getScheduleStructure();
    }

    @Put("update-schedule-structure")
    updateScheduleStructure(@Body() {scheduleStructure}: {
        scheduleStructure: ScheduleStructure}
    )
    {
        return this.webClientService.updateScheduleStructure(scheduleStructure);
    }

    @Put("upload-xml-files-to-mms")
    uploadXmlFilesToMms(@Body() {scheduleStructure}: {
        scheduleStructure: ScheduleStructure}
    ){
        return this.webClientService.uploadXmlFilesToMms(scheduleStructure)
    }
}

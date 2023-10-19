import { Module } from '@nestjs/common';
import {WebClientController} from "./web-client.controller";
import {WebClientService} from "./web-client.service";
import {FileSystemService} from "../file-system/file-system.service";
import {GoogleService} from "../google/google.service";

@Module({
    controllers: [WebClientController],
    providers: [WebClientService, FileSystemService, GoogleService]
})
export class WebClientModule {}

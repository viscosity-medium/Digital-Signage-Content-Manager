import {Injectable} from "@nestjs/common";
import {GoogleService} from "./google/google.service";
import * as process from "process";
import * as fs from "fs";
import * as path from "path";


@Injectable()
export class AppService {

    constructor(private googleService: GoogleService) {}

    async startApp(){

        console.log("App is started");

        const fileStructure = await this.googleService.getFullFileStructure({});
        const fileStructurePath = path.join(process.cwd(), "model", "fileStructure.json");
        const previousData = fs.readFileSync(fileStructurePath);
        const prevDataText = JSON.stringify(JSON.parse(previousData.toString()), null, 4);
        const currentData = JSON.stringify(fileStructure, null, 4);

        // if(prevDataText !== currentData){
        //     fs.writeFileSync(fileStructurePath, JSON.stringify(fileStructure, null, 4));
        //     await this.googleService.downloadMultipleFiles({folder: fileStructure});
        // }

        console.log("Scan is finished");

    }

}

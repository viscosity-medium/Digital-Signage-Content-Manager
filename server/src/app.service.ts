import {Injectable} from "@nestjs/common";

@Injectable()
export class AppService {

    async startApp(){

        console.log("__Программа стартовала__\n");

    }

}

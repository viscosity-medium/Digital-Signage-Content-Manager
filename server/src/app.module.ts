import {Module, OnModuleInit} from '@nestjs/common';

import {AppService} from "./app.service";
import {GoogleService} from './google/google.service';
import {ConfigModule} from "@nestjs/config";
import { FileSystemService } from './file-system/file-system.service';
import { WebClientModule } from './web-client/web-client.module';
import { AuthModule } from './auth/auth.module';

@Module({
  providers: [AppService, GoogleService, FileSystemService],
    imports: [ConfigModule.forRoot({
        envFilePath: ".env"
    }), WebClientModule, AuthModule],
})
export class AppModule implements OnModuleInit{

    constructor(private appService: AppService) {}

    onModuleInit() {
        return this.appService.startApp()
    }

}

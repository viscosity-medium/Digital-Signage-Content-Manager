import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import process from "process";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.setGlobalPrefix('server-api');
    await app.listen(process.env.SERVER_PORT);
}
bootstrap();

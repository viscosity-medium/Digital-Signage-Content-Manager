import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import process from "process";
import { urlencoded, json } from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.setGlobalPrefix('server-api');
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    await app.listen(process.env.SERVER_PORT);
}
bootstrap();

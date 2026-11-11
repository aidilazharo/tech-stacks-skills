import 'reflect-metadata';
import {Controller,Get,Module} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder,SwaggerModule} from '@nestjs/swagger';
import {TasksController} from './tasks.controller';
import {migrate} from './database';
@Controller('api') class HealthController { @Get('health') health(){return {status:'ok',database:'sqlite'};} }
@Module({controllers:[HealthController,TasksController]}) export class AppModule {}
export async function main(){await migrate();const app=await NestFactory.create(AppModule);
 const spec=new DocumentBuilder().setTitle('ATGV NestJS Task API').setVersion('1.0').build();
 SwaggerModule.setup('api/docs',app,SwaggerModule.createDocument(app,spec));
 await app.listen(Number(process.env.PORT||3000),'127.0.0.1');
}
if (process.argv[1] && /(?:^|[\\/])(?:src|dist)[\\/]main\.(?:ts|js)$/.test(process.argv[1])) void main();

import 'reflect-metadata';
import { Controller, Get, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
@Controller() class HealthController { @Get('health') health(): string { return 'ok'; } }
@Module({controllers:[HealthController]}) class AppModule {}
async function main() { const app=await NestFactory.create(AppModule); await app.listen(process.env.PORT || 3000); }
void main();

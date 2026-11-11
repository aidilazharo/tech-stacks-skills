import { parseTaskId, parseTaskTitle } from './task-validation';
import {Body,Controller,Get,Post,Put,Delete,Param,NotFoundException,BadRequestException} from '@nestjs/common';
import {ApiTags,ApiOperation} from '@nestjs/swagger';
import {db,tasks} from './database';import {eq} from 'drizzle-orm';
@ApiTags('tasks') @Controller('api/tasks') export class TasksController {
 @Get() async all(){return db.select().from(tasks);}
 @Get(':id') async one(@Param('id') raw:string){const id=parseTaskId(raw);const [row]=await db.select().from(tasks).where(eq(tasks.id,id));if(!row)throw new NotFoundException();return row;}
 @Post() async create(@Body() body:{title?:string;status?:string;description?:string}){
 const title=parseTaskTitle(body?.title);
 const status=body.status||'todo';if(!['todo','doing','done'].includes(status))throw new BadRequestException('invalid status');
 const now=new Date().toISOString();const [row]=await db.insert(tasks).values({title,status,description:String(body.description||'').slice(0,4000),createdAt:now,updatedAt:now}).returning();return row;
 }
 @Put(':id') async update(@Param('id') raw:string,@Body() body:{title?:string;status?:string}){
 const id=parseTaskId(raw);const title=parseTaskTitle(body?.title);if(!['todo','doing','done'].includes(String(body.status)))throw new BadRequestException();
 const [row]=await db.update(tasks).set({title,status:body.status,updatedAt:new Date().toISOString()}).where(eq(tasks.id,id)).returning();if(!row)throw new NotFoundException();return row;
 }
 @Delete(':id') async remove(@Param('id') raw:string){const id=parseTaskId(raw);const rows=await db.delete(tasks).where(eq(tasks.id,id)).returning();if(!rows.length)throw new NotFoundException();return {deleted:true};}
}

import {createClient} from '@libsql/client';
import {drizzle} from 'drizzle-orm/libsql';
import {sqliteTable,integer,text} from 'drizzle-orm/sqlite-core';
import {mkdirSync} from 'node:fs';import {resolve,dirname} from 'node:path';
export const tasks=sqliteTable('tasks',{
 id:integer('id').primaryKey({autoIncrement:true}),
 title:text('title').notNull(),status:text('status').notNull().default('todo'),
 description:text('description').notNull().default(''),
 createdAt:text('created_at').notNull(),updatedAt:text('updated_at').notNull()});
const url=process.env.DATABASE_URL||'file:./data/app.db';
if(!url.startsWith('file:')||url==='file::memory:')throw Error('Use local file: SQLite database');
mkdirSync(dirname(resolve(url.slice(5))),{recursive:true});
export const client=createClient({url});
export const db=drizzle(client);
export async function migrate(){await client.execute(`CREATE TABLE IF NOT EXISTS tasks(
 id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'todo',
 description TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL,updated_at TEXT NOT NULL)`);}

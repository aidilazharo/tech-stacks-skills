import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
test('REST and ORM modules are present',()=>{
 const code=readFileSync(new URL('../src/tasks.controller.ts',import.meta.url),'utf8');
 assert.match(code,/@Controller\('api\/tasks'\)/);assert.match(code,/db\.insert\(tasks\)/);
});

import {Component,inject,signal} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {HttpClient,provideHttpClient} from '@angular/common/http';
interface Task {id:number;title:string;status:string}
@Component({selector:'app-root',standalone:true,template:`<main style="max-width:760px;margin:3rem auto;font-family:system-ui">
<h1>ATGV Angular + SQLite</h1><p><a href="http://127.0.0.1:3001/api/docs">Swagger docs</a></p>
<button (click)="load()">Refresh tasks</button><ul>@for (task of tasks();track task.id){<li>{{task.title}} ({{task.status}})</li>}</ul></main>`})
class AppComponent {private http=inject(HttpClient);tasks=signal<Task[]>([]);constructor(){this.load();}
load(){this.http.get<Task[]>('http://127.0.0.1:3001/api/tasks').subscribe({next:rows=>this.tasks.set(rows),error:console.error});}}
bootstrapApplication(AppComponent,{providers:[provideHttpClient()]}).catch(console.error);

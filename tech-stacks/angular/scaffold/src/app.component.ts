import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export interface Task { id: number; title: string; status: string }

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<main style="max-width:760px;margin:3rem auto;font-family:system-ui">
    <h1>ATGV Angular + SQLite</h1>
    <p><a href="/api/docs">Swagger docs</a></p>
    <button type="button" (click)="load()">Refresh tasks</button>
    @if (error()) { <p role="alert">{{ error() }}</p> }
    <ul>@for (task of tasks(); track task.id) { <li>{{ task.title }} ({{ task.status }})</li> }</ul>
  </main>`,
})
export class AppComponent {
  private readonly http = inject(HttpClient);
  readonly tasks = signal<Task[]>([]);
  readonly error = signal('');
  constructor() { this.load(); }
  load() {
    this.http.get<Task[]>('/api/tasks').subscribe({
      next: (rows) => { this.tasks.set(rows); this.error.set(''); },
      error: () => this.error.set('Unable to load tasks'),
    });
  }
}

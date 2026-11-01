import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
@Component({selector:'app-root',standalone:true,template:'<main><h1>ATGV Angular baseline</h1><p>Apply approved design tokens.</p></main>'}) class AppComponent {}
bootstrapApplication(AppComponent).catch(console.error);

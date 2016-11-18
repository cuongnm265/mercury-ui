import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from '@angular/material';
import { CollapseDirective } from 'ng2-bootstrap';

import { AppComponent } from './app.component';
import { ArticleComponent } from './article/article.component';
import { AppRoutes } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    ArticleComponent,
    CollapseDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(AppRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

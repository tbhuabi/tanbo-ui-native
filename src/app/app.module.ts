import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { routes } from './app.routing';

import {
    UIComponentsModule,
    UIDirectivesModule,
    UIFormsModule,
} from '../modules/index';

import { AppComponent } from './app';
import { Page1Component } from '../pages/page1/page1.component';
import { Page2Component } from '../pages/page2/page2.component';

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        BrowserAnimationsModule,
        UIComponentsModule.forRoot(),
        UIDirectivesModule,
        UIFormsModule,
        FormsModule,
        BrowserModule
    ],
    declarations: [
        AppComponent,
        Page1Component,
        Page2Component
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

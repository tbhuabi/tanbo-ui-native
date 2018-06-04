import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UIComponentsModule, UIDirectivesModule, UIFormsModule } from '@tanbo/ui-native';

import { routes } from './app.routing';


import { AppComponent } from './app.component';
import { TabComponent } from '../pages/tab/tab.component';
import { HomeComponent } from '../pages/home/home.component';
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
        BrowserModule,
        ReactiveFormsModule
    ],
    declarations: [
        AppComponent,
        TabComponent,
        Page1Component,
        Page2Component,
        HomeComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

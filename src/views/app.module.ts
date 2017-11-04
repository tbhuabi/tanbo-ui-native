import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { routes } from './app.routing';

import { UIComponentsModule, UIDirectivesModule, UIFormsModule, UIHttp } from '../modules/index';

import { PageTransferStationService } from '../services/page-transfer-station';

import { AppComponent } from './app';
import { RootPageComponent } from './root-page/root-page.component';
import { Page1Component } from './page1/page1.component';
import { Page2Component } from './page2/page2.component';
import { Tab1Component } from './tab1/tab1.component';
import { Tab2Component } from './tab2/tab2.component';
import { Tab3Component } from './tab3/tab3.component';

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        BrowserAnimationsModule,
        UIComponentsModule,
        UIDirectivesModule,
        UIFormsModule,
        FormsModule,
        BrowserModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        RootPageComponent,
        Page1Component,
        Page2Component,
        Tab1Component,
        Tab2Component,
        Tab3Component
    ],
    bootstrap: [AppComponent],
    providers: [
        PageTransferStationService,
        UIHttp
    ]
})
export class AppModule {
}

import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { UiComponentsModule, UiDirectivesModule, UiFormsModule, UiHttp } from '../modules/index';

import { PageTransferStationService } from '../services/page-transfer-station';

import { AppComponent } from './app';
import { RootPageComponent } from './root-page/root-page.component';
import { Page1Component } from './page1/page1.component';
import { Page2Component } from './page2/page2.component';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        UiComponentsModule,
        UiDirectivesModule,
        UiFormsModule,
        FormsModule,
        BrowserModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        RootPageComponent,
        Page1Component,
        Page2Component
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        RootPageComponent,
        Page1Component,
        Page2Component
    ],
    providers: [
        PageTransferStationService,
        UiHttp
    ]
})
export class AppModule {
}

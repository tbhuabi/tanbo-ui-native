import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { UiNativeModule, UiHttp } from '../modules/index';

import { PageTransferStationService } from '../services/page-transfer-station';

import { AppComponent } from './app';
import { RootPageComponent } from './root-page/root-page.component';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        UiNativeModule,
        BrowserModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        RootPageComponent
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        RootPageComponent
    ],
    providers: [
        PageTransferStationService,
        UiHttp
    ]
})
export class AppModule {
}

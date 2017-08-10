import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule }  from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { UiNativeModule, UiComponentsModule, UiFormsModule, UiHttp } from '../modules/index';

import { PageTransferStationService } from '../services/page-transfer-station';

import { AppComponent } from './app';
import { Page1Component } from './page1/page1';
import { Page2Component } from './page2/page2';
import { Page3Component } from './page3/page3';
import { TabComponent } from './tab/tab';
import { ChildComponent } from './tab/tab1/child/child';
import { Child2Component } from './tab/tab1/child2/child2';
import { Child3Component } from './tab/tab2/child/child';
import { Child4Component } from './tab/tab2/child2/child2';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        UiNativeModule,
        BrowserModule,
        UiComponentsModule,
        UiFormsModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        Page1Component,
        Page2Component,
        Page3Component,
        TabComponent,
        ChildComponent,
        Child2Component,
        Child3Component,
        Child4Component
    ],
    entryComponents: [
        Page1Component,
        Page2Component,
        Page3Component,
        TabComponent,
        ChildComponent,
        Child2Component,
        Child3Component,
        Child4Component
    ],
    bootstrap: [AppComponent],
    providers: [
        PageTransferStationService,
        UiHttp
    ]
})
export class AppModule {
}

import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app';

import { UINativeModule } from '../tanbo/ui-native/public_api';

import { HomeComponent } from '../pages/home/home';
import { DetailComponent } from '../pages/detail/detail.component';
import { routing } from './app.routing';
import { ApiInterceptor } from './api-interceptor';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    UINativeModule.forRoot(),
    routing
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    DetailComponent
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ApiInterceptor,
    multi: true
  }, {
    provide: APP_BASE_HREF,
    useValue: '/'
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}

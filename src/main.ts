import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './views/app.module';

import './assets/scss/index.scss';
import './assets/scss/native-index.scss';
// import 'codemirror/lib/codemirror.css';

if (process.env.ENV === 'production') {
    enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule);

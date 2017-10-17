import { Routes } from '@angular/router';

import { RootPageComponent } from './root-page/root-page.component';
import { Page1Component } from './page1/page1.component';
import { Page2Component } from './page2/page2.component';

export const routes: Routes = [{
    path: 'root',
    component: RootPageComponent
}, {
    path: 'page1',
    component: Page1Component
}, {
    path: 'page2',
    component: Page2Component
}, {
    path: '',
    redirectTo: '/root',
    pathMatch: 'full'
}];
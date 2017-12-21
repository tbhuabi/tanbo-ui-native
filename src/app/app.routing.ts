import { Routes } from '@angular/router';

import { Page1Component } from '../pages/page1/page1.component';
import { Page2Component } from '../pages/page2/page2.component';

export const routes: Routes = [{
    path: 'page1',
    component: Page1Component,
}, {
    path: 'page2',
    component: Page2Component,
}, {
    path: 'child',
    loadChildren: '../pages/test-module/test.module#TestModule'
}, {
    path: '',
    redirectTo: 'page1',
    pathMatch: 'full'
}];
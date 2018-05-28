import { Routes } from '@angular/router';

import { TabComponent } from '../pages/tab/tab.component';
import { Page1Component } from '../pages/page1/page1.component';
import { Page2Component } from '../pages/page2/page2.component';
import { HomeComponent } from '../pages/home/home.component';

export const routes: Routes = [{
    path: 'home',
    component: HomeComponent
}, {
    path: 'tab',
    component: TabComponent,
    children: [{
        path: 'page1',
        component: Page1Component,
        outlet: 'route1'
    }, {
        path: 'page2',
        component: Page2Component,
        outlet: 'route2'
    }, {
        path: '',
        redirectTo: '/tab/(route1:page1//route2:page2)',
        pathMatch: 'full'
    }]
}, {
    path: 'page1',
    component: Page1Component
}, {
    path: 'page2',
    component: Page2Component
}, {
    path: '',
    redirectTo: '/tab/',
    pathMatch: 'full'
}];
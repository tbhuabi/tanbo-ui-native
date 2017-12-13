import { Routes } from '@angular/router';

import { RootPageComponent } from '../pages/root-page/root-page.component';
import { Page1Component } from '../pages/page1/page1.component';
import { Page2Component } from '../pages/page2/page2.component';
import { Tab1Component } from '../pages/tab1/tab1.component';
import { Tab2Component } from '../pages/tab2/tab2.component';
import { Tab3Component } from '../pages/tab3/tab3.component';

export const routes: Routes = [{
    path: 'root',
    component: RootPageComponent,
    children: [{
        path: 'tab1',
        component: Tab1Component,
        outlet: 'route1'
    }, {
        path: 'tab2',
        component: Tab2Component,
        outlet: 'route2'
    }, {
        path: 'tab3',
        component: Tab3Component,
        outlet: 'route3'
    }, {
        path: 'page1',
        component: Page1Component,
        outlet: 'route1'
    }, {
        path: 'page2',
        component: Page2Component,
        outlet: 'route1'
    }]
}, {
    path: 'page1',
    component: Page1Component,
}, {
    path: 'page2',
    component: Page2Component,
}, {
    path: 'async',
    component: Page2Component
}, {
    path: 'child',
    loadChildren: '../pages/test-module/test.module#TestModule'
}, {
    path: '',
    redirectTo: 'page1',
    pathMatch: 'full'
}];
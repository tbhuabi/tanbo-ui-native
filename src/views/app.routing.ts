import { Routes } from '@angular/router';

import { RootPageComponent } from './root-page/root-page.component';
import { Page1Component } from './page1/page1.component';
import { Page2Component } from './page2/page2.component';
import { Tab1Component } from './tab1/tab1.component';
import { Tab2Component } from './tab2/tab2.component';
import { Tab3Component } from './tab3/tab3.component';

// export const routes: Routes = [{
//     path: 'root',
//     component: RootPageComponent,
//     children: [{
//         path: 'tab1',
//         component: Tab1Component,
//         outlet: 'route1'
//     }, {
//         path: 'tab2',
//         component: Tab2Component,
//         outlet: 'route2'
//     }, {
//         path: 'tab3',
//         component: Tab3Component,
//         outlet: 'route3'
//     }, {
//         path: 'page1',
//         component: Page1Component,
//         outlet: 'route1'
//     }, {
//         path: 'page2',
//         component: Page2Component,
//         outlet: 'route1'
//     }]
// }, {
//     path: '',
//     redirectTo: '/root/(route1:tab1//route2:tab2//route3:tab3)',
//     pathMatch: 'full'
// }];

export const routes: Routes = [{
    path: 'page1',
    component: Page1Component,
}, {
    path: 'page2',
    component: Page2Component
}, {
    path: '',
    redirectTo: '/page1',
    pathMatch: 'full'
}];
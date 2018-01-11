import { Routes } from '@angular/router';

import { Child1Component } from './components/child1/child1.component';
import { Child2Component } from './components/child2/child2.component';
import { Child3Component } from './components/child3/child3.component';

export const routes: Routes = [{
    path: '',
    component: Child1Component
}, {
    path: 'child2',
    component: Child2Component
}, {
    path: 'child3',
    component: Child3Component
}];
import { Routes } from '@angular/router';

import { Child1Component } from './components/child1/child1.component';
import { Child2Component } from './components/child2/child2.component';

export const routes: Routes = [{
    path: '',
    component: Child1Component
}, {
    path: 'child2',
    component: Child2Component
}];
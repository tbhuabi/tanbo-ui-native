import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UIComponentsModule } from '../../modules/index';

import { routes } from './test.routing';

import { Child1Component } from './components/child1/child1.component';
import { Child2Component } from './components/child2/child2.component';
import { Child3Component } from './components/child3/child3.component';

@NgModule({
    imports: [
        UIComponentsModule.forChild(),
        RouterModule.forChild(routes)
    ],
    declarations: [
        Child1Component,
        Child2Component,
        Child3Component,
    ]
})
export class TestModule {
}
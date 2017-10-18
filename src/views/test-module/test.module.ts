import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UIComponentsModule } from '../../modules/index';

import { routes } from './test.routing';

import { Child1Component } from './components/child1/child1.component';

@NgModule({
    imports: [
        UIComponentsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        Child1Component
    ]
})
export class TestModule {
}
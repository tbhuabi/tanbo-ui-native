import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';

import { ComponentHostDirective } from './component-host.directive';

@Component({
    selector: 'ui-view',
    templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit {
    @Input()
    component: any;
    @ViewChild(ComponentHostDirective)
    componentHost: ComponentHostDirective;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngOnInit() {
        if (this.component) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
            this.componentHost.viewContainerRef.createComponent(componentFactory);
        }
    }
}
import { Component, ComponentFactoryResolver, HostBinding, Input, OnInit, ViewChild } from '@angular/core';

import { ComponentHostDirective } from './component-host.directive';
import { ViewState } from '../navigation/view-state';

@Component({
    selector: 'ui-view',
    templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit {
    @Input()
    component: any;
    @Input()
    state: string;
    @ViewChild(ComponentHostDirective)
    componentHost: ComponentHostDirective;

    @HostBinding('class.activate')
    get activate() {
        return this.state === ViewState.Activate;
    }

    @HostBinding('class.reactivate')
    get reactivate() {
        return this.state === ViewState.Reactivate;
    }

    @HostBinding('class.destroy')
    get destroy() {
        return this.state === ViewState.Destroy;
    }

    @HostBinding('class.to-stack')
    get toStack() {
        return this.state === ViewState.ToStack;
    }

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngOnInit() {
        if (this.component) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
            this.componentHost.viewContainerRef.createComponent(componentFactory);
        }
    }
}
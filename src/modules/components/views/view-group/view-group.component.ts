import {
    Component,
    Input,
    ComponentFactoryResolver,
    ViewChild,
    AfterContentInit,
    OnInit
} from '@angular/core';

import { LifeCycleService } from '../life-cycle.service';
import { Event, EventType } from '../event';
import { ComponentHostDirective } from '../../../directives/component-host.directive';

@Component({
    selector: 'ui-view-group',
    templateUrl: './view-group.component.html'
})
export class ViewGroupComponent implements AfterContentInit, OnInit {
    @Input()
    component: any;
    @ViewChild(ComponentHostDirective)
    componentHost: ComponentHostDirective;

    private childInstance: any;

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private lifeCycleService: LifeCycleService) {
    }

    ngOnInit() {
        this.lifeCycleService.event$.subscribe((event: Event) => {
            if (event.component !== this.component) {
                return;
            }
            switch (event.type) {
                case EventType.Enter:
                    if (typeof this.childInstance['uiOnViewEnter'] === 'function') {
                        this.childInstance['uiOnViewEnter']();
                    }
                    break;
                case EventType.Leave:
                    if (typeof this.childInstance['uiOnViewLeave'] === 'function') {
                        this.childInstance['uiOnViewLeave']();
                    }
                    break;
            }
        });
    }

    ngAfterContentInit() {
        const viewContainerRef = this.componentHost.viewContainerRef;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
        this.childInstance = viewContainerRef.createComponent(componentFactory).instance;
    }

}
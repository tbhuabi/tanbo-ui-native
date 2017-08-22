import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';

import { ComponentHostDirective } from './component-host.directive';
import { ViewState, ViewStateService } from './view-state.service';
import { NavController } from '../navigation/navigation-controller.service';

@Component({
    selector: 'ui-view',
    templateUrl: './view.component.html',
    providers: [
        ViewStateService
    ]
})
export class ViewComponent implements OnInit {
    @Input()
    component: any;
    @ViewChild(ComponentHostDirective)
    componentHost: ComponentHostDirective;

    @Input()
    set state(value: ViewState) {
        this._state = value;
        this.viewStateService.publish(value);
    }

    get state() {
        return this._state;
    }

    private _state: ViewState;

    constructor(private viewStateService: ViewStateService,
                private navController: NavController,
                private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngOnInit() {
        this.viewStateService.initState = this.state;
        if (this.component) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
            this.componentHost.viewContainerRef.createComponent(componentFactory);
        }

        this.viewStateService.destroyEvent$.distinctUntilChanged().subscribe(() => {
            this.navController.destroy();
        });
    }
}
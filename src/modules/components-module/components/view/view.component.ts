import {
    Component,
    ComponentFactoryResolver,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';

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
export class ViewComponent implements OnInit, OnDestroy {
    @Input()
    component: any;
    @ViewChild(ComponentHostDirective)
    componentHost: ComponentHostDirective;

    @Input()
    set state(value) {
        this._state = value;
        // 根据视图不同状态，调用生命周期勾子
        if (this.childInstance) {
            switch (value) {
                case ViewState.Activate:
                case ViewState.Reactivate:
                    if (typeof this.childInstance['uiOnViewEnter'] === 'function') {
                        this.childInstance['uiOnViewEnter']();
                    }
                    break;
                case ViewState.ToStack:
                case ViewState.Destroy:
                    if (typeof this.childInstance['uiOnViewLeave'] === 'function') {
                        this.childInstance['uiOnViewLeave']();
                    }
                    break;
            }
        }
    }

    get state() {
        return this._state;
    }

    @HostBinding('class.activate')
    get activate() {
        return this.state === ViewState.Activate;
    }

    @HostBinding('class.destroy')
    get destroy() {
        return this.state === ViewState.Destroy;
    }

    @HostBinding('class.to-stack')
    get toStack() {
        return this.state === ViewState.ToStack;
    }

    @HostBinding('class.reactivate')
    get reactivate() {
        return this.state === ViewState.Reactivate;
    }

    @HostBinding('class.sleep')
    get sleep() {
        return this.state === ViewState.Sleep;
    }

    private _state: ViewState;
    private sub: Subscription;
    private childInstance: any;

    constructor(private viewStateService: ViewStateService,
                private navController: NavController,
                private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngOnInit() {
        if (this.component) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
            this.childInstance = this.componentHost.viewContainerRef.createComponent(componentFactory).instance;
            if (typeof this.childInstance['uiOnViewEnter'] === 'function') {
                this.childInstance['uiOnViewEnter']();
            }
        }

        this.sub = this.viewStateService.destroyEvent$.distinctUntilChanged().subscribe(() => {
            this.navController.destroy();
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    @HostListener('animationend', ['$event'])
    animationEnd(event: any) {
        if (/^ui-[-\w]+-destroy$/.test(event.animationName)) {
            this.viewStateService.destroy();
        }
    }
}
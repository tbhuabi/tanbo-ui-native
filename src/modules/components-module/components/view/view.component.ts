import {
    Component,
    ComponentFactoryResolver,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ComponentRef
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ComponentHostDirective } from './component-host.directive';
import { ViewState, ViewStateService } from './view-state.service';
import { ContentLoadingController } from '../content-loading/content-loading.service';
import { RouterService } from '../router/router.service';

@Component({
    selector: 'ui-view',
    templateUrl: './view.component.html',
    providers: [
        ViewStateService,
        ContentLoadingController
    ]
})
export class ViewComponent implements OnInit, OnDestroy {
    @Input()
    component: any;

    @Input()
    openMoveBack: boolean = false;

    @Input()
    set state(value) {
        this._state = value;

        this.viewStateService.publish({
            state: value,
            progress: 100
        });
        // 根据视图不同状态，调用生命周期勾子
        if (this.childInstance) {
            switch (value) {
                case ViewState.Activate:
                case ViewState.Reactivate:
                    if (typeof this.childInstance['uiOnViewEnter'] === 'function') {
                        this.childInstance['uiOnViewEnter']();
                    }
                    this.routerService.publish(this.componentRef);
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

    @ViewChild(ComponentHostDirective)
    componentHost: ComponentHostDirective;

    get state() {
        return this._state;
    }

    @HostBinding('class.sleep')
    get sleep() {
        return this.state === ViewState.Sleep;
    }

    private _state: ViewState;
    private subs: Array<Subscription> = [];
    private childInstance: any;
    private componentRef: ComponentRef<any>;

    constructor(private viewStateService: ViewStateService,
                private componentFactoryResolver: ComponentFactoryResolver,
                private routerService: RouterService) {
    }

    ngOnInit() {
        if (this.component) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
            this.componentRef = this.componentHost.viewContainerRef.createComponent(componentFactory);
            this.childInstance = this.componentRef.instance;
            this.routerService.publish(this.componentRef);
            if (typeof this.childInstance['uiOnViewEnter'] === 'function') {
                this.childInstance['uiOnViewEnter']();
            }
        }
        this.subs.push(this.routerService.animationProgress$.subscribe(progress => {
            if (this.state !== ViewState.Sleep) {
                this.viewStateService.publish({
                    state: this.state,
                    progress
                });
            }
        }));
        this.subs.push(this.routerService.moveBackProgress$.subscribe(progress => {
            if (this.state !== ViewState.Sleep && this.openMoveBack) {
                this.viewStateService.publish({
                    state: ViewState.Moving,
                    progress
                });
            }
        }));
    }

    ngOnDestroy() {
        this.subs.forEach(item => {
            item.unsubscribe();
        });
    }
}
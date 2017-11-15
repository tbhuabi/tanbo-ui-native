import {
    Component,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    Injector,
    ComponentRef,
    ViewContainerRef
} from '@angular/core';
import { ActivatedRoute, ChildrenOutletContexts } from '@angular/router';
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
    componentFactory: any;
    @Input()
    openMoveBack: boolean = false;
    @Input()
    parentContexts: any;
    @Input()
    activatedRoute: ActivatedRoute;

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
                private viewContainerRef: ViewContainerRef,
                private _activatedRoute: ActivatedRoute,
                private routerService: RouterService) {
    }

    ngOnInit() {
        if (this.componentFactory) {
            const injector = new ViewInjector(
                this.activatedRoute || this._activatedRoute,
                this.parentContexts,
                this.viewContainerRef.injector);
            this.componentRef = this.componentHost.viewContainerRef.createComponent(
                this.componentFactory,
                this.componentHost.viewContainerRef.length,
                injector);
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

class ViewInjector implements Injector {
    constructor(private route: ActivatedRoute, private childContexts: ChildrenOutletContexts,
                private parent: Injector) {
    }

    get(token: any, notFoundValue?: any): any {
        if (token === ActivatedRoute) {
            return this.route;
        }

        if (token === ChildrenOutletContexts) {
            return this.childContexts;
        }

        return this.parent.get(token, notFoundValue);
    }
}

import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    ComponentRef,
    ComponentFactory,
    ComponentFactoryResolver,
    Inject
} from '@angular/core';
import { ChildrenOutletContexts, ActivatedRoute, PRIMARY_OUTLET } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { UI_ROUTER_ANIMATION_STEPS } from '../../config';
import { ViewState } from '../view/view-state.service';
import { RouterService } from './router.service';
import { RouteCacheController } from './route-cache-controller';

export interface RouterItemConfig {
    state: ViewState;
    componentFactory: ComponentFactory<any>;
    activatedRoute: ActivatedRoute;
    childContexts: ChildrenOutletContexts;
}

@Component({
    selector: 'ui-router',
    templateUrl: './router.component.html',
    providers: [
        RouterService
    ]
})
export class RouterComponent implements OnInit, OnDestroy {
    /* tslint:disable */
    @Output('activate')
    activateEvents = new EventEmitter<any>();
    @Output('deactivate')
    deactivateEvents = new EventEmitter<any>();
    /* tslint:enable */

    @Input()
    name: string = PRIMARY_OUTLET;

    views: Array<RouterItemConfig> = [];

    get openMoveBack(): boolean {
        return this.views.length > 1;
    }

    get isActivated(): boolean {
        return !!this.activated;
    }

    get component(): Object {
        if (!this.activated) throw new Error('Outlet is not activated');
        return this.activated.instance;
    }

    get activatedRoute(): ActivatedRoute {
        if (!this.activated) throw new Error('Outlet is not activated');
        return this._activatedRoute as ActivatedRoute;
    }

    get activatedRouteData() {
        if (this._activatedRoute) {
            return this._activatedRoute.snapshot.data;
        }
        return {};
    }

    private subs: Array<Subscription> = [];
    private activated: ComponentRef<any> | null = null;
    private _activatedRoute: ActivatedRoute | null = null;
    private isMoveBack: boolean = false;
    private isBack: boolean = false;

    constructor(private parentContexts: ChildrenOutletContexts,
                private routerService: RouterService,
                private resolver: ComponentFactoryResolver,
                private routeCacheController: RouteCacheController,
                private location: Location,
                @Inject(UI_ROUTER_ANIMATION_STEPS) private steps: number) {
    }

    ngOnInit() {

        this.subs.push(this.routeCacheController.hasCache$.distinctUntilChanged().subscribe(b => {
            this.isBack = !b;
        }));

        this.parentContexts.onChildOutletCreated(this.name, this as any);

        if (!this.activated) {
            const context = this.parentContexts.getContext(this.name);
            if (context && context.route) {
                this.activateWith(context.route, context.resolver || null);
            }
        }

        // 订阅当前活动的组件
        this.subs.push(this.routerService.activated$.subscribe((componentRef: ComponentRef<any>) => {
            this.activated = componentRef;
        }));

        this.subs.push(this.routerService.moveBackProgress$.subscribe(progress => {
            if (progress <= 0) {
                this.setViewState([ViewState.Sleep, ViewState.Activate]);
            } else {
                this.setViewState([ViewState.ToStack, ViewState.Activate]);
            }
            if (progress >= this.steps && this.openMoveBack) {
                this.isMoveBack = true;
                this.location.back();
            }
        }));
    }

    ngOnDestroy() {
        this.parentContexts.onChildOutletDestroyed(this.name);
        this.subs.forEach(item => {
            item.unsubscribe();
        });
    }

    // 从子树分离时调用
    detach(): ComponentRef<any> {
        if (!this.activated) throw new Error('Outlet is not activated');
        const comp = this.activated;
        this._activatedRoute = null;
        this.activated = null;
        return comp;
    }

    // 将以前分离的子树重新附加时调用
    attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute) {
        this.activated = ref;
        this._activatedRoute = activatedRoute;
        this.routeCacheController.isCacheCurrentView(true);

        if (this.isMoveBack) {
            this.views.pop();
            this.isMoveBack = false;
            this.setViewState([ViewState.ToStack, ViewState.Reactivate]);
            setTimeout(() => {
                this.routerService.publishAnimationProgress(this.steps);
            });
            return;
        }

        this.setViewState([ViewState.Reactivate, ViewState.Destroy]);

        setTimeout(() => {
            this.setupRouterAnimation();
        });
    }

    activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver | null) {
        this._activatedRoute = activatedRoute;
        const snapshot = (activatedRoute as any)._futureSnapshot;
        const component = snapshot.routeConfig.component;

        resolver = resolver || this.resolver;
        const childContexts = this.parentContexts.getOrCreateContext(this.name).children;

        if (this.isBack) {
            this.setViewState([ViewState.Destroy]);
            this.views.unshift({
                state: ViewState.Reactivate,
                componentFactory: resolver.resolveComponentFactory(component),
                childContexts: childContexts,
                activatedRoute
            });
        } else {
            this.setViewState([ViewState.ToStack]);
            this.views.push({
                state: ViewState.Activate,
                componentFactory: resolver.resolveComponentFactory(component),
                childContexts: childContexts,
                activatedRoute
            });
        }
        this.routeCacheController.isCacheCurrentView(true);
        this.setupRouterAnimation();
    }

    deactivate() {
        this.activated = null;
        this._activatedRoute = null;
    }

    private setViewState(status: Array<ViewState>) {
        let i = this.views.length - 1;
        while (i >= 0) {
            this.views[i].state = status.pop() || ViewState.Sleep;
            i--;
        }
    }

    private setupRouterAnimation() {
        if (this.views.length === 1) {
            this.routerService.publishAnimationProgress(this.steps);
            return;
        }
        let i = 0;
        const fn = function () {
            if (i > this.steps) {
                switch (this.views[this.views.length - 1].state) {
                    case ViewState.Destroy:
                        this.views.pop();
                        this.setViewState([ViewState.Activate]);
                        break;
                    case ViewState.Activate:
                        this.setViewState([ViewState.Sleep, ViewState.Activate]);
                        break;
                }
            } else {
                requestAnimationFrame(fn);
                this.routerService.publishAnimationProgress(i);
                i++;
            }

        }.bind(this);

        fn();
    }
}
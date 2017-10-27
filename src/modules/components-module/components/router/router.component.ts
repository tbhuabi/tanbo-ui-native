import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    ComponentRef,
    HostListener,
    ComponentFactory,
    ComponentFactoryResolver
} from '@angular/core';
import { ChildrenOutletContexts, ActivatedRoute, PRIMARY_OUTLET } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { ViewState } from '../view/view-state.service';
import { RouterService } from './router.service';
import { UIRouter } from './router';
import { AppController } from '../app/app-controller.service';

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
        RouterService,
        UIRouter
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
    name = PRIMARY_OUTLET;

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
    private isBack: number = 0;
    private isMoveBack: boolean = false;

    constructor(private parentContexts: ChildrenOutletContexts,
                private routerService: RouterService,
                private uiRouter: UIRouter,
                private resolver: ComponentFactoryResolver,
                private appController: AppController,
                private location: Location) {
        parentContexts.onChildOutletCreated(this.name, this as any);
    }

    @HostListener('window:popstate')
    pop() {
        // TODO 由于浏览器限制，暂时无法实现以下功能：
        // 1、当点击浏览器前进按扭时，加载新的页面
        this.isBack++;
        this.appController.hasHistory(true);
    }

    ngOnInit() {

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
            if (progress >= 100 && this.openMoveBack) {
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

    activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver | null) {
        this._activatedRoute = activatedRoute;
        this.uiRouter.updateActivateRoute(activatedRoute);

        if (this.isMoveBack) {
            this.views.pop();
            this.isMoveBack = false;
            this.isBack--;
            this.setViewState([ViewState.ToStack, ViewState.Reactivate]);
            return;
        }

        const snapshot = (activatedRoute as any)._futureSnapshot;
        const component = snapshot.routeConfig.component;

        resolver = resolver || this.resolver;
        const childContexts = this.parentContexts.getOrCreateContext(this.name).children;

        if (this.isBack) {
            this.isBack--;
            if (this.views.length > 1) {
                this.setViewState([ViewState.ToStack, ViewState.Reactivate, ViewState.Destroy]);

                setTimeout(() => {
                    this.setupRouterAnimation();
                });
            } else {
                // 设置视图状态
                this.setViewState([ViewState.Destroy]);
                this.views.unshift({
                    state: ViewState.Reactivate,
                    componentFactory: resolver.resolveComponentFactory(component),
                    childContexts: childContexts,
                    activatedRoute
                });
                this.setupRouterAnimation();
            }
        } else {
            // 设置视图状态
            this.setViewState([ViewState.ToStack]);
            this.views.push({
                state: ViewState.Activate,
                componentFactory: resolver.resolveComponentFactory(component),
                childContexts: childContexts,
                activatedRoute
            });
            this.setupRouterAnimation();
        }
    }

    deactivate() {
        this.activated = null;
        this._activatedRoute = null;
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
        // debugger;
        // this.activated = ref;
        // this._activatedRoute = activatedRoute;
        // this.location.insert(ref.hostView);
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
            this.routerService.publishAnimationProgress(100);
            return;
        }
        let i = 0;

        const step = 3.6;

        const fn = function () {
            if (i >= 100) {
                i = 100;
                if (this.views[this.views.length - 1].state === ViewState.Destroy) {
                    this.views.pop();
                    this.setViewState([ViewState.ToStack, ViewState.Reactivate]);
                }
            } else {
                requestAnimationFrame(fn);
            }
            this.routerService.publishAnimationProgress(i);

            i += step;
        }.bind(this);

        fn();
    }
}
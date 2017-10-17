import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    ComponentRef,
    HostListener
} from '@angular/core';
import { ChildrenOutletContexts, ActivatedRoute, PRIMARY_OUTLET } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { ViewState } from '../view/view-state.service';
import { RouterService } from './router.service';

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
    name = PRIMARY_OUTLET;

    views: Array<any> = [];
    openAnimation: boolean = true;

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

    constructor(private parentContexts: ChildrenOutletContexts,
                private routerService: RouterService,
                private location: Location) {
        parentContexts.onChildOutletCreated(this.name, this as any);
    }

    @HostListener('window:popstate')
    pop() {
        this.isBack++;
    }

    ngOnInit() {
        if (!this.activated) {
            const context = this.parentContexts.getContext(this.name);
            if (context && context.route) {
                this.activateWith(context.route);
            }
        }

        // 订阅当前活动的组件
        this.subs.push(this.routerService.activated$.subscribe((componentRef: ComponentRef<any>) => {
            this.activated = componentRef;
        }));
    }

    ngOnDestroy() {
        this.parentContexts.onChildOutletDestroyed(this.name);
        this.subs.forEach(item => {
            item.unsubscribe();
        });
    }

    activateWith(activatedRoute: ActivatedRoute) {

        this._activatedRoute = activatedRoute;

        const snapshot = (activatedRoute as any)._futureSnapshot;
        const component = snapshot.routeConfig.component;
        const length = this.views.length;
        // 设置视图状态
        if (length) {
            let lastView = this.views[length - 1];
            lastView.state = ViewState.ToStack;

        }
        this.views.push({
            state: ViewState.Activate,
            component
        });

        let sleepViewSize = this.views.length - 3;
        while (sleepViewSize > -1) {
            this.views[sleepViewSize].state = ViewState.Sleep;
            sleepViewSize--;
        }

        this.setupRouterAnimation();
    }

    deactivate() {
        this.activated = null;
        this._activatedRoute = null;
    }

    detach() {
        this._activatedRoute = null;
        this.activated = null;
    }

    attach() {

    }

    setupRouterAnimation() {

        if (this.views.length === 0) {
            this.routerService.publishAnimationProgress(100);
        }
        let i = 0;
        const self = this;
        const step = 3.6;

        const fn = function () {
            if (i >= 100) {
                i = 100;
            } else {
                requestAnimationFrame(fn);
            }
            self.routerService.publishAnimationProgress(i);

            i += step;
        };

        fn();
    }
}

import {
    Component,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    Injector,
    ElementRef,
    ComponentRef,
    ViewContainerRef,
    ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, ChildrenOutletContexts } from '@angular/router';
import { Subscription } from 'rxjs';

import { ComponentHostDirective } from './component-host.directive';
import { ViewState, ViewStateService, UI_VIEW_INIT_STATE, UI_VIEW_INIT_TOUCH_BACK } from './view-state.service';
import { ContentLoadingController } from '../content-loading/content-loading.service';
import { RouterService } from '../router/router.service';
import { PullDownRefreshController } from '../../controllers/pull-down-refresh-controller';
import { PullUpLoadController } from '../../controllers/pull-up-load-controller';
import { ActionSheetService } from '../action-sheet/action-sheet.service';

@Component({
    selector: 'ui-view',
    templateUrl: './view.component.html',
    providers: [
        ViewStateService,
        ContentLoadingController,
        PullDownRefreshController,
        PullUpLoadController,
        ActionSheetService
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
        if (value === this._state) {
            return;
        }
        // 根据视图不同状态，调用生命周期勾子
        this.viewStateService.changeState(value);
        if (this.childInstance) {
            switch (value) {
                case ViewState.Activate:
                case ViewState.Reactivate:
                    if (this._state !== ViewState.Activate && this._state !== ViewState.Reactivate) {
                        if (typeof this.childInstance['uiOnViewEnter'] === 'function') {
                            this.childInstance['uiOnViewEnter']();
                        }
                        this.routerService.publish(this.componentRef);
                    }
                    break;
                case ViewState.ToStack:
                case ViewState.Destroy:
                    if (typeof this.childInstance['uiOnViewLeave'] === 'function') {
                        this.childInstance['uiOnViewLeave']();
                    }
                    break;
            }
            if (value === ViewState.Sleep) {
                this.changeDetectorRef.detach();
            } else {
                this.changeDetectorRef.reattach();
            }
        }

        this._state = value;
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
                private changeDetectorRef: ChangeDetectorRef,
                private actionSheetService: ActionSheetService,
                private elementRef: ElementRef,
                private routerService: RouterService) {
    }

    ngOnInit() {
        if (this.componentFactory) {
            const injector = new ViewInjector(
                this.activatedRoute || this._activatedRoute,
                this.parentContexts,
                this.state,
                this.openMoveBack,
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
                this.viewStateService.updateProgress(progress);
            }
        }));
        this.subs.push(this.routerService.moveBackProgress$.subscribe(progress => {
            if (this.state !== ViewState.Sleep && this.openMoveBack) {
                this.viewStateService.touching(progress);
            }
        }));
        this.subs.push(this.routerService.parentTouchProgress.subscribe(progress => {
            if (this.state !== ViewState.Sleep) {
                this.viewStateService.touching(progress);
            }
        }));

        this.subs.push(this.actionSheetService.onShow.subscribe(el => {
            this.elementRef.nativeElement.appendChild(el);
        }));
    }

    ngOnDestroy() {
        this.subs.forEach(item => {
            item.unsubscribe();
        });
    }
}

class ViewInjector implements Injector {
    constructor(private route: ActivatedRoute,
                private childContexts: ChildrenOutletContexts,
                private initState: ViewState,
                private isOpenTouchBack: boolean,
                private parent: Injector) {
    }

    get(token: any, notFoundValue?: any): any {
        if (token === ActivatedRoute) {
            return this.route;
        }

        if (token === ChildrenOutletContexts) {
            return this.childContexts;
        }

        if (token === UI_VIEW_INIT_STATE) {
            return this.initState;
        }

        if (token === UI_VIEW_INIT_TOUCH_BACK) {
            return this.isOpenTouchBack;
        }

        return this.parent.get(token, notFoundValue);
    }
}

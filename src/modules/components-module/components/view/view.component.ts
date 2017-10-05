import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ComponentHostDirective } from './component-host.directive';
import { ViewState, ViewStateService } from './view-state.service';
import { NavController } from '../navigation/navigation-controller.service';
import { ContentLoadingController } from '../content-loading/content-loading.service';

@Component({
    selector: 'ui-view',
    templateUrl: './view.component.html',
    providers: [
        ViewStateService,
        ContentLoadingController
    ]
})
export class ViewComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input()
    component: any;
    @ViewChild(ComponentHostDirective)
    componentHost: ComponentHostDirective;

    @Input()
    set state(value) {
        this._state = value;
        // 根据视图不同状态，调用生命周期勾子
        if (this.childInstance) {
            this.createTweenFactor();
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

    ngAfterViewInit() {
        this.createTweenFactor();
    }

    createTweenFactor() {
        if (this.state === ViewState.Sleep) {
            return
        }
        if (this.state === null) {
            this.viewStateService.publish({
                state: null,
                progress: 100
            });
            return;
        }

        let i = 0;
        const self = this;
        const fn = function () {
            i += 3;
            if (i > 100) {
                if (self.state === ViewState.Destroy) {
                    self.viewStateService.destroy();
                }
                i = 100;
                self.viewStateService.publish({
                    state: self.state,
                    progress: i
                });
                return;
            }
            self.viewStateService.publish({
                state: self.state,
                progress: i
            });
            requestAnimationFrame(fn);
        };
        requestAnimationFrame(fn);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
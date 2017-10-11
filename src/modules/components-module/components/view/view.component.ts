import {
    AfterContentInit,
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
export class ViewComponent implements OnInit, OnDestroy, AfterContentInit {
    @Input()
    component: any;
    @Input()
    openAnimation: boolean = true;
    @Input()
    viewIndex: number;

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

        this.subs.push(this.viewStateService.destroyEvent$.distinctUntilChanged().subscribe(() => {
            this.navController.destroy();
        }));

        this.subs.push(this.navController.moveBackProgress$.subscribe((progress: number) => {
            if (this.viewIndex === 0) {
                if (this.state === ViewState.Reactivate || this.state === ViewState.Activate) {
                    return;
                }
            }
            this.viewStateService.publish({
                state: ViewState.Moving,
                progress
            });
        }));
    }

    ngAfterContentInit() {
        this.createTweenFactor();
    }

    createTweenFactor() {
        if (this.state === ViewState.Sleep) {
            return;
        }
        if (this.state === ViewState.Activate && this.viewIndex === 0) {
            this.viewStateService.publish({
                state: this.state,
                progress: 100
            });
            return;
        }

        if (!this.openAnimation) {
            this.viewStateService.publish({
                state: this.state,
                progress: 100
            });
            return;
        }

        let i = 0;
        const self = this;

        const fn = function () {
            if (i >= 100) {
                i = 100;
                if (self.state === ViewState.Destroy) {
                    self.viewStateService.destroy();
                }
            } else {
                requestAnimationFrame(fn);
            }
            self.viewStateService.publish({
                state: self.state,
                progress: i
            });

            i += 3.6;
        };

        fn();
    }

    ngOnDestroy() {
        this.subs.forEach(item => {
            item.unsubscribe();
        });
    }
}
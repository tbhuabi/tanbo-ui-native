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
    state: ViewState;

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

    private sub: Subscription;

    constructor(private viewStateService: ViewStateService,
                private navController: NavController,
                private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngOnInit() {
        if (this.component) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
            this.componentHost.viewContainerRef.createComponent(componentFactory);
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
            console.log(333);
            this.viewStateService.destroy();
        }
    }
}
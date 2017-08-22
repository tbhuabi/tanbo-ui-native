import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

import { NavController } from '../navigation/navigation-controller.service';
import { ViewState, ViewStateService } from '../view/view-state.service';

@Component({
    selector: 'ui-back',
    templateUrl: './back.component.html',
    animations: [
        trigger('viewState', [
            state(ViewState.Init, style({
                transform: 'translateX(0)',
            })),
            state(ViewState.Destroy, style({
                transform: 'translateX(100%)',
                opacity: 0
            })),
            state(ViewState.ToStack, style({
                transform: 'translateX(-100%)',
                opacity: 0
            })),
            transition(`* => ${ViewState.Init}`, animate(3000, keyframes([
                style({
                    transform: 'translateX(100%)',
                    opacity: 0,
                    offset: 0
                }),
                style({
                    transform: 'translateX(0)',
                    opacity: 1,
                    offset: 1
                })
            ]))),
            transition(`* => ${ViewState.Destroy}`, animate(3000)),
            transition(`* <=> ${ViewState.ToStack}`, animate(3000))
        ])
    ]
})
export class BackComponent implements OnDestroy, OnInit {
    viewState: ViewState;
    private sub: Subscription;

    constructor(private viewStateService: ViewStateService,
                private navController: NavController) {
    }

    ngOnInit() {
        this.sub = this.viewStateService.state$.subscribe((value: ViewState) => {
            this.viewState = value;
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    @HostListener('click')
    click() {
        this.navController.pop();
    }

    done() {
        if (this.viewState === ViewState.Destroy) {
            this.viewStateService.destroy();
        }
    }
}
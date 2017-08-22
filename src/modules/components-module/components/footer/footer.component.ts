import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

import { ViewState, ViewStateService } from '../view/view-state.service';

@Component({
    selector: 'ui-footer',
    templateUrl: './footer.component.html',
    animations: [
        trigger('viewState', [
            state(ViewState.Init, style({
                transform: 'translateX(0)'
            })),
            state(ViewState.Destroy, style({
                transform: 'translateX(100%)'
            })),
            state(ViewState.ToStack, style({
                transform: 'translateX(-30%)'
            })),
            transition(`* => ${ViewState.Init}`, animate(3000, keyframes([
                style({
                    transform: 'translateX(100%)',
                    offset: 0
                }),
                style({
                    transform: 'translateX(0)',
                    offset: 1
                })
            ]))),
            transition(`* => ${ViewState.Destroy}`, animate(3000)),
            transition(`* <=> ${ViewState.ToStack}`, animate(3000))
        ])
    ]
})
export class FooterComponent implements OnInit, OnDestroy {
    @HostBinding('@viewState')
    viewState: ViewState;
    private sub: Subscription;

    constructor(private viewStateService: ViewStateService) {
    }

    ngOnInit() {
        this.viewState = this.viewStateService.initState;
        this.sub = this.viewStateService.state$.subscribe((value: ViewState) => {
            this.viewState = value;
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    @HostListener('@viewState.done')
    done() {
        if (this.viewState === ViewState.Destroy) {
            this.viewStateService.destroy();
        }
    }
}
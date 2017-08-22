import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

import { ViewState, ViewStateService } from '../view/view-state.service';

@Component({
    selector: 'ui-header',
    templateUrl: './header.component.html',
    animations: [
        trigger('viewState', [
            state(ViewState.Init, style({
                opacity: 1
            })),
            state(ViewState.Destroy, style({
                opacity: 0
            })),
            state(ViewState.ToStack, style({
                opacity: 1
            })),
            transition(`* => ${ViewState.Init}`, animate(3000, keyframes([
                style({
                    opacity: 0,
                    offset: 0
                }),
                style({
                    opacity: 1,
                    offset: 1
                })
            ]))),
            transition(`* => ${ViewState.Destroy}`, animate(3000)),
            transition(`* <=> ${ViewState.ToStack}`, animate(3000))
        ])
    ]
})

export class HeaderComponent implements OnInit, OnDestroy {
    @HostBinding('class.native')
    isNative: boolean = process.env.ENV === 'production';
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
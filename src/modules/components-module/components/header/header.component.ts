import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

import { animationTime, ViewState, ViewStateService } from '../view/view-state.service';

@Component({
    selector: 'ui-header',
    templateUrl: './header.component.html',
    animations: [
        trigger('viewStateHeader', [
            state(ViewState.Init, style({
                opacity: 1
            })),
            state(ViewState.Destroy, style({
                opacity: 0
            })),
            state(ViewState.ToStack, style({
                opacity: 1
            })),
            transition(`* => ${ViewState.Init}`, [
                style({
                    opacity: 0
                }),
                animate(animationTime, style({
                    opacity: 1
                }))
            ]),
            transition(`* => ${ViewState.Destroy}`, animate(animationTime)),
            transition(`* <=> ${ViewState.ToStack}`, animate(animationTime))
        ])
    ]
})

export class HeaderComponent implements OnInit, OnDestroy {
    @HostBinding('class.native')
    isNative: boolean = process.env.ENV === 'production';
    @HostBinding('@viewStateHeader')
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

    @HostListener('@viewStateHeader.done')
    done() {
        if (this.viewState === ViewState.Destroy) {
            this.viewStateService.destroy();
        }
    }
}
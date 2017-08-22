import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

import { animationTime, ViewState, ViewStateService } from '../view/view-state.service';

@Component({
    selector: 'ui-content',
    templateUrl: './content.component.html',
    animations: [
        trigger('viewStateContent', [
            state(ViewState.Init, style({
                transform: 'translateX(0)'
            })),
            state(ViewState.Destroy, style({
                transform: 'translateX(100%)'
            })),
            state(ViewState.ToStack, style({
                transform: 'translateX(-30%)'
            })),
            transition(`* => ${ViewState.Init}`, [
                style({
                    transform: 'translateX(100%)'
                }),
                animate(animationTime, style({
                    transform: 'translateX(0)'
                }))
            ]),
            transition(`* => ${ViewState.Destroy}`, animate(animationTime)),
            transition(`* <=> ${ViewState.ToStack}`, animate(animationTime))
        ])
    ]
})
export class ContentComponent implements OnInit, OnDestroy {
    @HostBinding('@viewStateContent')
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

    @HostListener('@viewStateContent.done')
    done() {
        if (this.viewState === ViewState.Destroy) {
            this.viewStateService.destroy();
        }
    }
}
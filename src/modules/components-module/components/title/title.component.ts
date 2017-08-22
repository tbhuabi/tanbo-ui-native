import { Component, ElementRef, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

import { animationTime, ViewState, ViewStateService } from '../view/view-state.service';

@Component({
    selector: 'ui-title',
    templateUrl: './title.component.html',
    animations: [
        trigger('viewStateTitle', [
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
                    transform: 'translateX(100%)',
                    offset: 0
                }), animate(animationTime, style({
                    transform: 'translateX(0)',
                    offset: 1
                }))
            ]),
            transition(`* => ${ViewState.Destroy}`, animate(animationTime)),
            transition(`* <=> ${ViewState.ToStack}`, animate(animationTime))
        ])
    ]
})
export class TitleComponent implements OnInit, OnDestroy {
    @HostBinding('@viewStateTitle')
    viewState: ViewState;
    private sub: Subscription;

    constructor(private ele: ElementRef,
                private viewStateService: ViewStateService) {
    }

    ngOnInit() {
        this.viewState = this.viewStateService.initState;
        console.log(this.ele.nativeElement.innerText);
        console.log(this.viewState);
        this.sub = this.viewStateService.state$.subscribe((value: ViewState) => {
            console.log(this.ele.nativeElement.innerText);
            console.log(value);
            this.viewState = value;
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    @HostListener('@viewStateTitle.done')
    done() {
        if (this.viewState === ViewState.Destroy) {
            this.viewStateService.destroy();
        }
    }
}
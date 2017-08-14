import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd } from '@angular/router';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ui-view-loading-bar',
    templateUrl: './view-loading-bar.component.html',
    animations: [trigger('loadingState', [state('*', style({
        opacity: 1
    })), transition(':leave', animate(600, keyframes([style({
        width: '100%',
        offset: 0.5
    }), style({
        opacity: 0,
        offset: 1
    })])))])]
})
export class ViewLoadingBarComponent implements OnInit, OnDestroy {
    step: number = 0;
    loadingState: string = 'normal';
    private sub: Subscription;
    private progress: Array<number> = [30, 60, 80, 85, 88, 90, 91, 92, 93];
    private timer: any = null;
    private stateIndex: number = 0;

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.sub = this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                this.loadingState = 'normal';
                this.stateIndex = 0;
                this.stepStart();
            } else if (event instanceof NavigationEnd) {
                clearInterval(this.timer);
                this.loadingState = 'loaded';
            }
        });
    }

    ngOnDestroy() {
        clearInterval(this.timer);
        this.sub.unsubscribe();
    }

    stepStart() {
        clearInterval(this.timer);
        this.step = this.progress[this.stateIndex];
        this.timer = setInterval(() => {
            this.stateIndex++;
            if (this.stateIndex === this.progress.length) {
                clearInterval(this.timer);
                return;
            }
            this.step = this.progress[this.stateIndex];
        }, 2000);
    }

    loaded() {
        this.loadingState = 'normal';
        this.step = 0;
    }
}
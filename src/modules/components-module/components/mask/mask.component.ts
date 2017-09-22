import { Component, EventEmitter, Input, Output } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'ui-mask',
    templateUrl: './mask.component.html',
    animations: [
        trigger('maskAnimation', [
            state('*', style({
                opacity: 1
            })),
            transition(':enter', [
                animate('300ms', keyframes([
                    style({
                        opacity: 0,
                        offset: 0
                    }),
                    style({
                        opacity: 1,
                        offset: 1
                    })
                ]))
            ]),
            transition(':leave', [
                animate('300ms', keyframes([
                    style({
                        opacity: 1,
                        offset: 0
                    }),
                    style({
                        opacity: 0,
                        offset: 1
                    })
                ]))
            ])
        ])
    ]
})
export class MaskComponent {
    @Input()
    show: boolean = false;

    @Output()
    hide = new EventEmitter<void>();

    done() {
        if (!this.show) {
            this.hide.emit();
        }
    }
}
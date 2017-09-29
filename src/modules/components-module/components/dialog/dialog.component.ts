import { Component, EventEmitter, Input, Output } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'ui-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    animations: [
        trigger('dialogContentAnimate', [transition(':enter', animate('0.15s', keyframes([
            style({
                transform: 'scale(1.2)',
                offset: 0
            }),
            style({
                transform: 'scale(1)',
                offset: 1
            })
        ]))), transition(':leave', animate('0.15s', keyframes([
            style({
                transform: 'scale(1)',
                offset: 0
            }),
            style({
                transform: 'scale(0.8)',
                offset: 1
            })
        ])))])
    ]
})
export class DialogComponent {
    @Input()
    show: boolean = false;

    @Output()
    hide = new EventEmitter<void>();

    animationEnd() {
        this.hide.emit();
    }
}
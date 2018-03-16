import { Component, Input, Output, EventEmitter, HostListener, Renderer2 } from '@angular/core';
import { Easing } from '@tweenjs/tween.js';

export interface PickerCell {
    value: string | number;
    text: string | number;
    disabled?: boolean;
    readonly?: boolean;
    children?: Array<PickerCell>;
}

@Component({
    selector: 'ui-picker-column',
    templateUrl: './picker-column.component.html'
})
export class PickerColumnComponent {
    @Input()
    cells: Array<PickerCell> = [];

    @Input()
    set value(cell: PickerCell) {
        this._value = cell;
        if (this.isTouched) {
            return;
        }
        for (let i = 0; i < this.cells.length; i++) {
            if (this.cells[i].value === cell.value) {
                this.distanceTop = -i * 30;
                break;
            }
        }
    }

    get value() {
        return this._value;
    }

    @Output()
    selected = new EventEmitter<PickerCell>();

    distanceTop: number = 0;

    private _value: PickerCell = null;
    private speed: number = 0;
    private animateId: number;

    private maxDistance: number = 0;
    private isTouched: boolean = false;

    private get minDistance(): number {
        return -30 * (this.cells.length - 1);
    }


    constructor(private renderer: Renderer2) {
    }

    @HostListener('touchstart', ['$event'])
    touchStart(event: any) {
        cancelAnimationFrame(this.animateId);
        this.speed = 0;
        this.isTouched = true;

        const startPoint = event.touches[0];
        const startY = startPoint.pageY;
        const oldDistance = this.distanceTop;

        let unbindTouchMoveFn: () => void;
        let unbindTouchEndFn: () => void;
        let unbindTouchCancelFn: () => void;

        unbindTouchMoveFn = this.renderer.listen('document', 'touchmove', (ev: any) => {
            const movePoint = ev.touches[0];
            const moveY = movePoint.pageY;
            this.speed = moveY - startY;
            this.distanceTop = oldDistance + this.speed;

            this.updateSelectedCell();
        });

        unbindTouchEndFn = this.renderer.listen('document', 'touchend', () => {
            unbindTouchMoveFn();
            unbindTouchEndFn();
            unbindTouchCancelFn();

            this.inertiaAnimate();
        });

        unbindTouchCancelFn = this.renderer.listen('document', 'touchcancel', () => {
            unbindTouchMoveFn();
            unbindTouchEndFn();
            unbindTouchCancelFn();

            this.inertiaAnimate();
        });
    }

    private inertiaAnimate() {
        let frames: Array<number> = [];

        let speed = this.speed;
        while (Math.abs(speed) >= 0.5) {
            speed *= 0.7;
            frames.push(speed > 0 ? Math.ceil(speed) : Math.floor(speed));
        }

        let targetDistance = this.distanceTop;

        frames.forEach(item => {
            targetDistance += item
        });

        // if (targetDistance < this.maxDistance && targetDistance > this.minDistance) {
        //     // 计算差值补全
        //     let n = Math.abs(targetDistance % 30);
        //
        //     let m: number;
        //     if (n < 15) {
        //         m = n / -frames.length;
        //     } else {
        //         m = (30 - n) / frames.length;
        //     }
        //
        //     frames = frames.map(item => {
        //         return item - m;
        //     });
        //
        // }
        const animateFn = () => {
            if (frames.length) {
                this.distanceTop += frames.shift();
                this.animateId = requestAnimationFrame(animateFn);
            } else if (this.distanceTop < this.minDistance || this.distanceTop > this.maxDistance) {
                this.animateBack();
            } else {
                this.updateSelectedCell();
            }
        };

        this.animateId = requestAnimationFrame(animateFn);
        // this.updateSelectedCell();
    }

    private animateBack() {
        let step = 20;
        const oldTop = this.distanceTop;
        let distance: number;
        let target: number;
        if (oldTop > this.maxDistance) {
            // 如果向下拖多了
            distance = oldTop;
            target = 0;
        } else {
            // 如果向上拖多了
            distance = oldTop - this.minDistance;
            target = this.minDistance;
        }

        const animateFn = () => {
            if (step > 0) {
                step--;
                this.distanceTop = Easing.Cubic.InOut(step / 20) * distance + target;
                this.animateId = requestAnimationFrame(animateFn);
            } else {
                this.updateSelectedCell();
            }
        };

        this.animateId = requestAnimationFrame(animateFn);
    }

    private updateSelectedCell() {
        let index = Math.floor((this.distanceTop) / -30 + 0.5);
        if (index < 0) {
            index = 0;
        } else if (index > this.cells.length - 1) {
            index = this.cells.length - 1;
        }
        // this._value = this.cells[index];
        this.selected.emit(this.cells[index]);
    }
}
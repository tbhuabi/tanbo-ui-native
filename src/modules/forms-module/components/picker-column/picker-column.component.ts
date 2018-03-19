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
    cellHeight: number = 36;

    @Input()
    set value(cell: PickerCell) {
        this._value = cell;
        if (this.isTouched) {
            return;
        }
        for (let i = 0; i < this.cells.length; i++) {
            if (this.cells[i].value === cell.value) {
                this.distanceTop = -i * this.cellHeight;
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
    private moveDiff: number = 0;
    private animateId: number;

    private maxDistance: number = 0;
    private isTouched: boolean = false;

    private get minDistance(): number {
        return -this.cellHeight * (this.cells.length - 1);
    }

    constructor(private renderer: Renderer2) {
    }

    @HostListener('touchstart', ['$event'])
    touchStart(event: any) {
        cancelAnimationFrame(this.animateId);
        this.moveDiff = 0;
        this.isTouched = true;

        if (this.cells.length === 0) {
            return;
        }

        const startPoint = event.touches[0];
        const startY = startPoint.pageY;
        const oldDistance = this.distanceTop;

        let unbindTouchMoveFn: () => void;
        let unbindTouchEndFn: () => void;
        let unbindTouchCancelFn: () => void;

        let t = Date.now();

        unbindTouchMoveFn = this.renderer.listen('document', 'touchmove', (ev: any) => {
            const movePoint = ev.touches[0];
            const moveY = movePoint.pageY;
            this.moveDiff = moveY - startY;
            if (this.distanceTop < this.minDistance || this.distanceTop > this.maxDistance) {
                this.moveDiff *= 0.33;
            }
            this.distanceTop = oldDistance + this.moveDiff;

            t = Date.now();
        });

        unbindTouchEndFn = this.renderer.listen('document', 'touchend', () => {
            unbindTouchMoveFn();
            unbindTouchEndFn();
            unbindTouchCancelFn();

            this.inertiaAnimate(Date.now() - t);
        });

        unbindTouchCancelFn = this.renderer.listen('document', 'touchcancel', () => {
            unbindTouchMoveFn();
            unbindTouchEndFn();
            unbindTouchCancelFn();

            this.inertiaAnimate(Date.now() - t);
        });
    }

    private inertiaAnimate(time: number) {
        let factor = this.moveDiff / time;
        if (factor > 1) {
            factor = 1;
        } else if (factor < -1) {
            factor = -1;
        }

        let t = Date.now();

        const animateFn = () => {
            const t2 = Date.now();
            const diff = t2 - t;
            t = t2;
            factor *= 0.88;
            const speed = diff * factor;
            if (Math.abs(speed) >= 0.5) {
                if (this.distanceTop + speed > this.maxDistance || this.distanceTop + speed < this.minDistance) {
                    factor *= 0.7;
                }
                this.distanceTop += speed;
                this.animateId = requestAnimationFrame(animateFn);
            } else if (this.distanceTop < this.minDistance || this.distanceTop > this.maxDistance) {
                this.animateBack();
            } else {
                this.alignCell();
            }
        };

        this.animateId = requestAnimationFrame(animateFn);

    }

    private alignCell() {
        const animateFn = () => {
            const n = Math.abs(Math.ceil(this.distanceTop % this.cellHeight));
            if (n === 0) {
                this.updateSelectedCell();
                return;
            }
            if (n < this.cellHeight / 2) {
                this.distanceTop++;
            } else {
                this.distanceTop--;
            }
            this.animateId = requestAnimationFrame(animateFn);
        };

        animateFn();
        this.animateId = requestAnimationFrame(animateFn);
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
        let index = Math.floor((this.distanceTop) / -this.cellHeight + 0.5);
        if (index < 0) {
            index = 0;
        } else if (index > this.cells.length - 1) {
            index = this.cells.length - 1;
        }
        this.selected.emit(this.cells[index]);
    }
}
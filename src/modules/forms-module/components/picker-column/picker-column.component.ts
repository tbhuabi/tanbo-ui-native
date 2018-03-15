import { Component, Input, Output, EventEmitter, HostListener, Renderer2 } from '@angular/core';

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

    constructor(private renderer: Renderer2) {
    }

    @HostListener('touchstart', ['$event'])
    touchStart(event: any) {
        const startPoint = event.touches[0];
        const startY = startPoint.pageY;
        const oldDistance = this.distanceTop;

        let unbindTouchMoveFn: () => void;
        let unbindTouchEndFn: () => void;
        let unbindTouchCancelFn: () => void;

        unbindTouchMoveFn = this.renderer.listen('document', 'touchmove', (ev: any) => {
            const movePoint = ev.touches[0];
            const moveY = movePoint.pageY;

            this.distanceTop = oldDistance + moveY - startY;

            let index = Math.floor((this.distanceTop) / -30 + 0.5);
            if (index < 0) {
                index = 0;
            } else if (index > this.cells.length - 1) {
                index = this.cells.length - 1;
            }
            this._value = this.cells[index];
        });

        unbindTouchEndFn = this.renderer.listen('document', 'touchend', () => {
            unbindTouchMoveFn();
            unbindTouchEndFn();
            unbindTouchCancelFn();
        });

        unbindTouchCancelFn = this.renderer.listen('document', 'touchcancel', () => {
            unbindTouchMoveFn();
            unbindTouchEndFn();
            unbindTouchCancelFn();
        });
    }
}
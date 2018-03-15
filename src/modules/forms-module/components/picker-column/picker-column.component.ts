import { Component, Input, Output, EventEmitter } from '@angular/core';

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

    onSelected(value: PickerCell) {
        this.selected.emit(value);
    }
}
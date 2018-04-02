import {
    Component,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    AfterViewInit,
    HostBinding,
    HostListener
} from '@angular/core';

import { SelectService } from '../select/select.service';

@Component({
    selector: 'ui-option',
    templateUrl: './option.component.html'
})
export class OptionComponent implements AfterViewInit {
    @Input()
    value: string = '';

    @Input()
    @HostBinding('class.disabled')
    set disabled(isDisabled: any) {
        this._disabled = isDisabled;
    }

    get disabled() {
        let isDisabled = (this as any).hasOwnProperty('_disabled');
        return isDisabled && this._disabled !== false;
    }

    @Input()
    @HostBinding('class.selected')
    set selected(isSelected: any) {
        this._selected = isSelected;
        if (isSelected) {
            this.selectService.checked(this);
        }
    }

    get selected() {
        let isSelected = (this as any).hasOwnProperty('_selected');
        return isSelected && this._selected !== false;
    }

    @Output()
    checked = new EventEmitter<OptionComponent>();
    nativeElement: HTMLElement;

    private _disabled: boolean = false;
    private _selected: boolean = false;

    constructor(private elementRef: ElementRef,
                private selectService: SelectService) {
    }

    @HostListener('click')
    click() {
        if (!this.disabled) {
            this.selected = true;
            this.checked.emit(this);
        }
    }

    ngAfterViewInit() {
        this.nativeElement = this.elementRef.nativeElement;
    }
}
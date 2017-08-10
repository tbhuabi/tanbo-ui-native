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
    }

    get selected() {
        let isSelected = (this as any).hasOwnProperty('_selected');
        return isSelected && this._selected !== false;
    }

    @Output()
    checked = new EventEmitter<OptionComponent>();
    text: string = '';

    private _disabled: boolean;
    private _selected: boolean;

    constructor(private elementRef: ElementRef) {
    }

    @HostListener('click') click() {
        if (!this.disabled) {
            this.checked.emit(this);
        }
    }

    ngAfterViewInit() {
        this.text = this.elementRef.nativeElement.innerText;
        if (this.selected) {
            this.checked.emit(this);
        }
    }
}
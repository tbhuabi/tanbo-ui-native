import {
    ChangeDetectorRef,
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    HostBinding,
    OnDestroy,
    Output,
    QueryList
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

import { OptionComponent } from '../option/option.component';
import { SelectService } from './select.service';

@Component({
    selector: 'ui-select',
    templateUrl: './select.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: SelectComponent,
        multi: true
    }, SelectService
    ]
})
export class SelectComponent implements ControlValueAccessor, AfterContentInit, OnDestroy, AfterViewInit {
    @ContentChildren(OptionComponent)
    options: QueryList<OptionComponent>;
    @Input()
    forId: string = '';
    @Input()
    name: string = '';
    @Input()
    placeholder: string = '';
    @Output()
    change = new EventEmitter<string>();
    @Input()
    selectedIndex: number = 0;

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
    @HostBinding('class.readonly')
    set readonly(isReadonly: any) {
        this._readonly = isReadonly;
    }

    get readonly() {
        let isReadonly = (this as any).hasOwnProperty('_readonly');
        return isReadonly && this._readonly !== false;
    }

    focus: boolean = false;
    text: string = '';
    private _disabled: boolean = false;
    private _readonly: boolean = false;

    private value: string = '';
    private onChange: (_: any) => any;
    private onTouched: (_: any) => any;
    private subs: Array<Subscription> = [];

    private defaultOption: OptionComponent;

    static getTextByElement(element: HTMLElement): string {
        if (element) {
            return element.innerText.replace(/^[\s\n\t\r]+|[\s\n\t\r]+$/g, '');
        }
        return '';
    }

    constructor(private selectService: SelectService,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    ngAfterContentInit() {
        let defaultOption: OptionComponent;
        this.options.forEach((option: OptionComponent, index: number) => {
            if (option.selected) {
                defaultOption = option;
                this.selectedIndex = index;
            }
        });
        if (!defaultOption) {
            defaultOption = this.options.toArray()[this.selectedIndex];
        }
        if (!defaultOption) {
            defaultOption = this.options.first;
            this.selectedIndex = 0;
        }
        if (defaultOption) {
            this.value = defaultOption.value;
            defaultOption.selected = true;
            this.defaultOption = defaultOption;
        }
        this.subs.push(this.selectService.onChecked.subscribe((option: OptionComponent) => {
            this.options.forEach((op: OptionComponent, index: number) => {
                if (op === option) {
                    this.value = option.value;
                    this.text = SelectComponent.getTextByElement(option.nativeElement);
                    this.selectedIndex = index;
                    if (this.onChange) {
                        this.onChange(this.value);
                    }
                    if (this.onTouched) {
                        this.onTouched(this.value);
                    }
                    this.change.emit(this.value);
                } else {
                    option.selected = false;
                }
            });
        }));
    }

    ngAfterViewInit() {
        if (this.defaultOption) {
            this.text = SelectComponent.getTextByElement(this.defaultOption.nativeElement);
            this.changeDetectorRef.detectChanges();
        }
    }

    ngOnDestroy() {
        this.subs.forEach(item => {
            item.unsubscribe();
        });
    }

    showOptions() {
        let isReadonly = (this as any).hasOwnProperty('readonly');
        isReadonly = isReadonly && this.readonly !== false;
        let isDisabled = (this as any).hasOwnProperty('disabled');
        isDisabled = isDisabled && this.disabled !== false;
        if (!isDisabled && !isReadonly) {
            this.focus = true;
        }
    }

    hideOptions() {
        this.focus = false;
    }

    writeValue(value: any) {
        this.value = value;
        if (this.options) {
            let selectedOption: OptionComponent;
            this.options.forEach((item: OptionComponent, index: number) => {
                item.selected = false;
                if (item.value === value || `${item.value}` === value || item.value === `${value}`) {
                    selectedOption = item;
                    this.selectedIndex = index;
                }
            });
            if (selectedOption) {
                this.text = SelectComponent.getTextByElement(selectedOption.nativeElement);
                selectedOption.selected = true;
            } else {
                this.text = '';
            }
        } else {
            this.text = '';
        }
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }
}
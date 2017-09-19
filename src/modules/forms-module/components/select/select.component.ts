import {
    AfterContentInit,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    EventEmitter,
    HostBinding,
    Input,
    OnDestroy,
    Output,
    QueryList
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

import { OptionComponent } from '../option/option.component';
import { ViewStateService } from '../../../components-module/index';

@Component({
    selector: 'ui-select',
    templateUrl: './select.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: SelectComponent,
        multi: true
    }],
    animations: [
        trigger('optionsContentAnimate', [
            state('in', style({
                transform: 'translateY(0)'
            })),
            state('out', style({
                transform: 'translateY(100%)'
            })),
            transition('out <=> in', animate('0.2s ease-out'))
        ]),
        trigger('optionsBgAnimate', [state('*', style({
            opacity: 0
        })), state('in', style({
            opacity: 1
        })), state('out', style({
            opacity: 0
        })), transition('in <=> out', animate('0.2s'))])
    ]
})
export class SelectComponent implements ControlValueAccessor, AfterContentInit, OnDestroy {
    @ContentChildren(OptionComponent)
    options: QueryList<OptionComponent>;

    @HostBinding('class.focus')
    focus: boolean = false;
    @Input()
    disabled: boolean;
    @Input()
    readonly: boolean;
    @Input()
    name: string = '';
    @Output()
    change = new EventEmitter<string>();
    @Input()
    selectedIndex: number = 0;

    get optionsBgState() {
        return this.animateState ? 'in' : 'out';
    }

    animateState: boolean = false;
    text: string = '';

    private value: string = '';
    private onChange: (_: any) => any;
    private onTouched: (_: any) => any;
    private subs: Array<Subscription> = [];

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private viewStateService: ViewStateService) {
    }

    showOptions() {
        let isReadonly = (this as any).hasOwnProperty('readonly');
        isReadonly = isReadonly && this.readonly !== false;
        let isDisabled = (this as any).hasOwnProperty('disabled');
        isDisabled = isDisabled && this.disabled !== false;
        if (!isDisabled && !isReadonly) {
            this.focus = true;
            this.animateState = true;
            this.viewStateService.isShowPopover(true);
        }
    }

    done() {
        // 当弹窗动画完成时，发布事件
        if (!this.animateState) {
            this.focus = false;
            this.viewStateService.isShowPopover(false);
        }
    }

    hideOptions() {
        this.animateState = false;
    }

    ngAfterContentInit() {
        let isInit = true;
        let defaultOption: OptionComponent;
        this.options.forEach((option: OptionComponent, index: number) => {
            if (option.selected) {
                defaultOption = option;
                this.selectedIndex = index;
            }
            let sub = option.checked.subscribe((params: OptionComponent) => {
                this.value = params.value;
                this.text = params.text;
                this.animateState = false;
                this.options.forEach((o: OptionComponent, i: number) => {
                    o.selected = false;
                    if (o === params) {
                        this.selectedIndex = i;
                    }
                });
                params.selected = true;
                if (isInit) {
                    isInit = false;
                    this.changeDetectorRef.detectChanges();
                    return;
                }
                if (this.onChange) {
                    this.onChange(this.value);
                }
                if (this.onTouched) {
                    this.onTouched(this.value);
                }
                this.change.emit(this.value);

            });
            this.subs.push(sub);
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
            this.text = defaultOption.text;
            defaultOption.selected = true;
        }
    }

    ngOnDestroy() {
        this.subs.forEach(item => {
            item.unsubscribe();
        });
    }

    writeValue(value: any) {
        this.value = value;
        if (this.options) {
            let selectedOption: OptionComponent;
            this.options.forEach((item: OptionComponent) => {
                item.selected = false;
                if (`${item.value}` === `${value}`) {
                    selectedOption = item;
                }
            });
            if (selectedOption) {
                this.text = selectedOption.text;
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
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
  Inject,
  QueryList
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

import { OptionComponent } from '../option/option.component';
import { SelectService } from './select.service';
import { UI_SELECT_ARROW_CLASSNAME } from '../helper';

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
  @Input()
  selectedIndex: number = 0;
  @Input()
  cancelText: string = '取消';
  @Input()
  arrowIconClassName: string = '';

  @Input()
  @HostBinding('class.ui-disabled')
  set disabled(isDisabled: any) {
    this._disabled = isDisabled;
  }

  get disabled() {
    const isDisabled = (this as any).hasOwnProperty('_disabled');
    return isDisabled && this._disabled !== false;
  }

  @Input()
  @HostBinding('class.ui-readonly')
  set readonly(isReadonly: any) {
    this._readonly = isReadonly;
  }

  get readonly() {
    const isReadonly = (this as any).hasOwnProperty('_readonly');
    return isReadonly && this._readonly !== false;
  }

  @Output()
  uiChange = new EventEmitter<string>();

  focus: boolean = false;
  text: string = '';
  private _disabled: boolean;
  private _readonly: boolean;

  private value: string = '';
  private onChange: (_: any) => any;
  private onTouched: (_: any) => any;
  private subs: Array<Subscription> = [];

  private defaultOption: OptionComponent;
  private isWrite: boolean = false;

  static getTextByElement(element: HTMLElement): string {
    if (element) {
      return element.innerText.replace(/^[\s\n\t\r]+|[\s\n\t\r]+$/g, '');
    }
    return '';
  }

  constructor(@Inject(UI_SELECT_ARROW_CLASSNAME) arrowIcon: string,
              private selectService: SelectService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.arrowIconClassName = arrowIcon;
  }

  ngAfterContentInit() {
    let defaultOption: OptionComponent;
    if (this.isWrite) {
      let isFindDefaultOption: boolean = false;
      for (const item of this.options.toArray()) {
        if (item.value === this.value && !isFindDefaultOption) {
          isFindDefaultOption = true;
          this.defaultOption = item;
          item.selected = true;
        } else {
          item.selected = false;
        }
      }
    } else {
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
        setTimeout(() => {
          defaultOption.selected = true;
        });
        this.defaultOption = defaultOption;
      }
    }
    this.subs.push(this.selectService.onChecked.subscribe((option: OptionComponent) => {
      this.options.forEach((op: OptionComponent, index: number) => {
        if (op === option) {
          op.selected = true;
          this.value = option.value;
          this.text = SelectComponent.getTextByElement(option.nativeElement);
          this.selectedIndex = index;
          if (this.onChange) {
            this.onChange(this.value);
          }
          if (this.onTouched) {
            this.onTouched(this.value);
          }
          this.uiChange.emit(this.value);
        } else {
          op.selected = false;
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
    if (!this.disabled && !this.readonly) {
      this.focus = true;
    }
  }

  hideOptions() {
    this.focus = false;
  }

  writeValue(value: any) {
    this.isWrite = true;
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
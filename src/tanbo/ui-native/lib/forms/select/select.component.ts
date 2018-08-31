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
import { delay } from 'rxjs/operators';

import { OptionComponent } from '../option/option.component';
import { SelectService } from './select.service';
import { UI_SELECT_ARROW_CLASSNAME, inputAttrToBoolean } from '../helper';

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
  forId: string;
  @Input()
  name: string;
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
    this._disabled = inputAttrToBoolean(isDisabled);
  }

  get disabled() {
    return this._disabled;
  }

  @Input()
  @HostBinding('class.ui-readonly')
  set readonly(isReadonly: any) {
    this._readonly = inputAttrToBoolean(isReadonly);
  }

  get readonly() {
    return this._readonly;
  }

  @Output()
  uiChange = new EventEmitter<string>();

  focus: boolean = false;
  text: string = '';
  private _disabled: boolean = false;
  private _readonly: boolean = false;

  private value: string = '';
  private onChange: (_: any) => any;
  private onTouched: () => any;
  private subs: Array<Subscription> = [];

  private selectedOption: OptionComponent;
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
    if (!this.isWrite) {
      this.updateBySelf();
    }
    this.subs.push(this.selectService.onChecked.subscribe((option: OptionComponent) => {
      this.options.forEach((op: OptionComponent, index: number) => {
        if (op === option) {
          if (op !== this.selectedOption) {
            this.selectedOption = op;
            op.selected = true;
            this.value = option.value;
            this.text = SelectComponent.getTextByElement(option.nativeElement);
            this.selectedIndex = index;
            if (this.onChange) {
              this.onChange(this.value);
            }
            if (this.onTouched) {
              this.onTouched();
            }
            this.uiChange.emit(this.value);
          }
        } else {
          op.selected = false;
        }
      });
    }));
    this.subs.push(this.options.changes.pipe(delay(0)).subscribe(() => {
      this.updateByNgModel();
    }));
  }

  ngAfterViewInit() {
    if (this.selectedOption) {
      this.text = SelectComponent.getTextByElement(this.selectedOption.nativeElement);
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

  private updateByNgModel() {
    let selectedOption: OptionComponent;
    this.options.forEach((item: OptionComponent, index: number) => {
      item.selected = false;
      if (item.value === this.value || `${item.value}` === this.value || item.value === `${this.value}`) {
        selectedOption = item;
        this.selectedIndex = index;
      }
    });
    if (selectedOption) {
      this.text = SelectComponent.getTextByElement(selectedOption.nativeElement);
      selectedOption.selected = true;
      this.selectedOption = selectedOption;
    } else {
      this.selectedIndex = -1;
      this.text = '';
      this.selectedOption = null;
    }
  }

  private updateBySelf() {
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
      setTimeout(() => {
        if (!this.isWrite) {
          defaultOption.selected = true;
        }
      });
      this.selectedOption = defaultOption;
    }
  }
}
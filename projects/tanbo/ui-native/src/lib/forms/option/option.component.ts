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
import { inputAttrToBoolean } from '../helper';

@Component({
  selector: 'ui-option',
  templateUrl: './option.component.html'
})
export class OptionComponent implements AfterViewInit {
  @Output() uiChecked = new EventEmitter<OptionComponent>();
  @Input() value: string = '';

  @Input()
  @HostBinding('class.ui-disabled')
  set disabled(isDisabled: any) {
    this._disabled = inputAttrToBoolean(isDisabled);
  }

  get disabled() {
    return this._disabled;
  }

  @Input()
  @HostBinding('class.ui-selected')
  set selected(isSelected: any) {
    this._selected = inputAttrToBoolean(isSelected);
  }

  get selected() {
    return this._selected;
  }

  nativeElement: HTMLElement;

  private _disabled: boolean = false;
  private _selected: boolean = false;

  constructor(private elementRef: ElementRef,
              private selectService: SelectService) {
  }

  @HostListener('click')
  click() {
    if (!this.disabled) {
      this.selectService.checked(this);
      this.uiChecked.emit(this);
    }
  }

  ngAfterViewInit() {
    this.nativeElement = this.elementRef.nativeElement;
  }
}
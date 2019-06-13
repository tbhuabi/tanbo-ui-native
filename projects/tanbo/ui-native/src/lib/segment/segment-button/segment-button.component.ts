import {
  Component,
  AfterViewInit,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  HostListener,
  ElementRef
} from '@angular/core';

import { SegmentService } from '../segment/segment.service';

function inputAttrToBoolean(value: any) {
  return value === '' || !!value;
}

@Component({
  selector: 'ui-segment-button',
  templateUrl: './segment-button.component.html'
})
export class SegmentButtonComponent implements AfterViewInit {
  @Output() uiChecked = new EventEmitter<SegmentButtonComponent>();
  @Input() value: any = '';

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
              private segmentService: SegmentService) {
  }

  @HostListener('click')
  click() {
    if (!this.disabled) {
      this.segmentService.checked(this);
      this.uiChecked.emit(this);
    }
  }

  ngAfterViewInit() {
    this.nativeElement = this.elementRef.nativeElement;
  }
}
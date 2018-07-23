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

@Component({
  selector: 'ui-segment-button',
  templateUrl: './segment-button.component.html'
})
export class SegmentButtonComponent implements AfterViewInit {
  @Input()
  value: any = '';

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
  @HostBinding('class.ui-selected')
  set selected(isSelected: any) {
    this._selected = isSelected;
  }

  get selected() {
    const isSelected = (this as any).hasOwnProperty('_selected');
    return isSelected && this._selected !== false;
  }

  @Output()
  uiChecked = new EventEmitter<SegmentButtonComponent>();
  nativeElement: HTMLElement;

  private _disabled: boolean;
  private _selected: boolean;

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
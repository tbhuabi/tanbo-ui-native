import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SegmentService } from './segment.service';
import { SegmentButtonComponent } from '../segment-button/segment-button.component';

@Component({
  selector: 'ui-segment',
  templateUrl: './segment.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: SegmentComponent,
    multi: true
  }, SegmentService]
})
export class SegmentComponent implements ControlValueAccessor, AfterContentInit, OnDestroy {
  @Input()
  selectedIndex: number = 0;
  @ContentChildren(SegmentButtonComponent)
  options: QueryList<SegmentButtonComponent>;
  value: any;

  @Output()
  change = new EventEmitter<string>();

  private onChange: (_: any) => any;
  private onTouched: (_: any) => any;
  private defaultOption: SegmentButtonComponent;
  private sub: Subscription;

  constructor(private segmentService: SegmentService) {
  }

  ngAfterContentInit() {
    let defaultOption: SegmentButtonComponent;
    this.options.forEach((option: SegmentButtonComponent, index: number) => {
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
    this.sub = this.segmentService.onChecked.subscribe((option: SegmentButtonComponent) => {
      this.options.forEach((op: SegmentButtonComponent, index: number) => {
        if (op === option) {
          op.selected = true;
          this.value = option.value;
          this.selectedIndex = index;
          if (this.onChange) {
            this.onChange(this.value);
          }
          if (this.onTouched) {
            this.onTouched(this.value);
          }
          this.change.emit(this.value);
        } else {
          op.selected = false;
        }
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  writeValue(value: any) {
    this.value = value;
    if (this.options) {
      let selectedOption: SegmentButtonComponent;
      this.options.forEach((item: SegmentButtonComponent, index: number) => {
        item.selected = false;
        if (item.value === value || `${item.value}` === value || item.value === `${value}`) {
          selectedOption = item;
          this.selectedIndex = index;
        }
      });
      if (selectedOption) {
        selectedOption.selected = true;
      }
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
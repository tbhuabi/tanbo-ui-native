import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { SegmentButtonComponent } from '../segment-button/segment-button.component';

@Injectable()
export class SegmentService {
  onChecked: Observable<SegmentButtonComponent>;

  private checkedSource = new Subject<SegmentButtonComponent>();

  constructor() {
    this.onChecked = this.checkedSource.asObservable();
  }

  checked(option: SegmentButtonComponent) {
    this.checkedSource.next(option);
  }
}
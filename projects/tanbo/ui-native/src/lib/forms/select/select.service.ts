import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { OptionComponent } from '../option/option.component';

@Injectable()
export class SelectService {
  onChecked: Observable<OptionComponent>;

  private checkedSource = new Subject<OptionComponent>();

  constructor() {
    this.onChecked = this.checkedSource.asObservable();
  }

  checked(option: OptionComponent) {
    this.checkedSource.next(option);
  }
}
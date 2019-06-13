import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ActionSheetService {
  onShow: Observable<HTMLElement>;
  private showEvent = new Subject<HTMLElement>();

  constructor() {
    this.onShow = this.showEvent.asObservable();
  }

  push(el: HTMLElement) {
    this.showEvent.next(el);
  }
}
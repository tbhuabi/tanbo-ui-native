import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { ScrollTabButtonComponent } from '../scroll-tab-button/scroll-tab-button.component';

@Injectable()
export class ScrollTabService {
  onSelected: Observable<ScrollTabButtonComponent>;

  private selectedEvent = new Subject<ScrollTabButtonComponent>();

  constructor() {
    this.onSelected = this.selectedEvent.asObservable();
  }

  selected(c: ScrollTabButtonComponent) {
    this.selectedEvent.next(c);
  }
}
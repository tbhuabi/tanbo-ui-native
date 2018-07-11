import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class ScrollService {
  onScroll: Observable<number>;

  private scrollEvent = new Subject<number>();

  constructor() {
    this.onScroll = this.scrollEvent.asObservable();
  }

  scroll(scrollTop: number) {
    this.scrollEvent.next(scrollTop);
  }
}
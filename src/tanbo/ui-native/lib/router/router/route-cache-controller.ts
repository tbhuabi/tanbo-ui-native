import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class RouteCacheController {
  hasCache: Observable<boolean>;
  private hasHistorySource = new Subject<boolean>();

  constructor() {
    this.hasCache = this.hasHistorySource.asObservable();
  }

  isCacheCurrentView(x: boolean) {
    this.hasHistorySource.next(x);
  }
}
import { ComponentRef, Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class RouterService {
  moveBackProgress: Observable<number>;
  animationProgress: Observable<number>;
  activated: Observable<ComponentRef<any>>;
  parentTouchProgress: Observable<number>;
  private parentTouchEvent = new Subject<number>();
  private activatedSource = new Subject<ComponentRef<any>>();
  private animationProgressSource = new Subject<number>();
  private moveBackProgressSource = new Subject<number>();

  constructor() {
    this.activated = this.activatedSource.asObservable();
    this.animationProgress = this.animationProgressSource.asObservable();
    this.moveBackProgress = this.moveBackProgressSource.asObservable();
    this.parentTouchProgress = this.parentTouchEvent.asObservable();
  }

  publish(activateView: ComponentRef<any>) {
    this.activatedSource.next(activateView);
  }

  publishAnimationProgress(progress: number) {
    this.animationProgressSource.next(progress);
  }

  publishMoveBackProgress(progress: number) {
    this.moveBackProgressSource.next(progress);
  }

  parentTouching(progress: number) {
    this.parentTouchEvent.next(progress);
  }
}
import { Injectable, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ModalController {
  template: Observable<TemplateRef<any>>;
  onHide: Observable<void>;
  private displayTemplate = new Subject<TemplateRef<any>>();
  private hideEvent = new Subject<void>();

  constructor() {
    this.template = this.displayTemplate.asObservable();
    this.onHide = this.hideEvent.asObservable();
  }

  show(template: TemplateRef<any>) {
    this.displayTemplate.next(template);
  }

  hide() {
    this.hideEvent.next();
  }
}
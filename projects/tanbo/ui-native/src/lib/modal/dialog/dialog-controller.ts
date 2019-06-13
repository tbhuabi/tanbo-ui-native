import { Injectable, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface DialogConfig {
  content: string | TemplateRef<any>;
  title?: string | TemplateRef<any>;
  btnsText?: Array<string>;
}

@Injectable()
export class DialogController {
  config: Observable<DialogConfig | string>;
  private action: Observable<boolean>;
  private actionEvent = new Subject<boolean>();
  private configSource = new Subject<DialogConfig | string>();

  constructor() {
    this.action = this.actionEvent.asObservable();
    this.config = this.configSource.asObservable();
  }

  show(params: DialogConfig | string): Promise<any> {
    this.configSource.next(typeof params === 'string' ? {
      content: params
    } : params);
    return new Promise((resolve) => {
      const sub = this.action.subscribe((result: boolean) => {
        resolve(result);
        sub.unsubscribe();
      });
    });
  }

  publishAction(result: boolean) {
    this.actionEvent.next(result);
  }
}
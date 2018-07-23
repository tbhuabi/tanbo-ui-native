import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-mask',
  templateUrl: './mask.component.html'
})
export class MaskComponent {
  @Input()
  show: boolean = false;

  @Output()
  uiHide = new EventEmitter<void>();

  done() {
    if (!this.show) {
      this.uiHide.emit();
    }
  }
}
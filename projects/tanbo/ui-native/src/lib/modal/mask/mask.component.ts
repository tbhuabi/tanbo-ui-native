import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-mask',
  templateUrl: './mask.component.html'
})
export class MaskComponent {
  @Output() uiHide = new EventEmitter<void>();
  @Input() show: boolean = false;

  done() {
    if (!this.show) {
      this.uiHide.emit();
    }
  }
}
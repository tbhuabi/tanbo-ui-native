import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-tab-bar-item',
  templateUrl: './tab-bar-item.component.html'
})
export class TabBarItemComponent {
  @HostBinding('class.ui-active')
  @Input()
  active: boolean = false;
  @Output()
  uiSelected = new EventEmitter();

  @HostListener('click')
  click() {
    this.uiSelected.emit();
  }
}
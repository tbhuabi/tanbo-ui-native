import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-tab-bar-item',
  templateUrl: './tab-bar-item.component.html'
})
export class TabBarItemComponent {
  @Output() uiSelected = new EventEmitter();
  @Input()
  @HostBinding('class.ui-active') active: boolean = false;

  @HostListener('click')
  click() {
    this.uiSelected.emit();
  }
}
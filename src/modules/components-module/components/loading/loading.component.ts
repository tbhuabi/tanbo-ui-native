import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'ui-loading',
    templateUrl: './loading.component.html'
})
export class LoadingComponent {
    @Input()
    scale: number = 1;
    @Input()
    color: string = '';

    @HostBinding('style.transform')
    get size() {
        return `scale(${this.scale})`;
    }
}
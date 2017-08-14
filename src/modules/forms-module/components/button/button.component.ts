import { Component, Input, HostBinding } from '@angular/core';
@Component({
    selector: 'ui-button',
    templateUrl: './button.component.html'
})
export class ButtonComponent {
    @Input()
    type: string = 'button';
    @Input()
    @HostBinding('class.loading')
    loading: boolean = false;

    @Input()
    @HostBinding('class.disabled')
    set disabled(isDisabled: any) {
        this._disabled = isDisabled;
    }

    get disabled() {
        let isDisabled = (this as any).hasOwnProperty('_disabled');
        return isDisabled && this._disabled !== false;
    }

    private _disabled: boolean;
}
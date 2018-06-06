import { Component, Input, HostBinding } from '@angular/core';
@Component({
    selector: 'ui-button',
    templateUrl: './button.component.html'
})
export class ButtonComponent {
    @Input()
    type: string = 'button';
    @Input()
    @HostBinding('class.ui-loading')
    loading: boolean = false;

    @Input()
    @HostBinding('class.ui-disabled')
    set disabled(isDisabled: any) {
        this._disabled = isDisabled;
    }

    get disabled() {
        const isDisabled = (this as any).hasOwnProperty('_disabled');
        return isDisabled && this._disabled !== false;
    }

    private _disabled: boolean;
}
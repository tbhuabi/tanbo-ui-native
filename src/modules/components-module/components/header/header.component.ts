import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'ui-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent {
    @HostBinding('class.native')
    isNative: boolean = process.env.ENV === 'production';
}
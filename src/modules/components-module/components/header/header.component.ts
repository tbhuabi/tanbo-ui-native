import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'ui-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent {
    // 当是生产环境时，需要把页面头部增高相对尺寸，以显示时间，电池电量等信息，这里通过样式来控制
    @HostBinding('class.native')
    isNative: boolean = process.env.ENV === 'production';
}
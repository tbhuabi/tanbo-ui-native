import { Component } from '@angular/core';

import { RootPageComponent } from './root-page/root-page.component';

@Component({
    selector: 'ui-test',
    templateUrl: 'app.html',
    styleUrls: ['./app.scss']
})
export class AppComponent {
    rootPage: any = RootPageComponent;
}

import { Component } from '@angular/core';

import { TabComponent } from './tab/tab';

@Component({
    selector: 'ui-test',
    templateUrl: 'app.html',
    styleUrls: ['./app.scss']
})
export class AppComponent {
    rootPage: any = TabComponent;
    date: string = 'fdsa';

    show(event: string) {
        this.date = event;
        console.log(event);
    }
}

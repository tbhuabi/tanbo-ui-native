import { Component } from '@angular/core';
import { AppController } from '../modules/index';

@Component({
    selector: 'ui-test',
    templateUrl: 'app.html',
    styleUrls: ['./app.scss']
})
export class AppComponent {
    constructor(private appController: AppController) {
        window['appController'] = appController;
        appController.onQuit$.subscribe(() => {
            console.log('退出了');
        });
    }
}

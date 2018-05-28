import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { ViewState } from '../view/view-state.service';

@Injectable()
@Injectable()
export class TabViewService {
    state: Observable<ViewState>;
    progress: Observable<number>;
    touchProgress: Observable<number>;

    private stateSource = new Subject<ViewState>();
    private progressSource = new Subject<number>();
    private touchEvent = new Subject<number>();

    constructor() {
        this.state = this.stateSource.asObservable();
        this.progress = this.progressSource.asObservable();
        this.touchProgress = this.touchEvent.asObservable();
    }

    changeState(state: ViewState) {
        this.stateSource.next(state);
    }

    updateProgress(n: number) {
        this.progressSource.next(n);
    }

    touching(progress: number) {
        this.touchEvent.next(progress);
    }
}
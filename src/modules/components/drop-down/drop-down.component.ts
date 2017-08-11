import {
    Component,
    HostBinding,
    Input,
    OnInit,
    QueryList,
    AfterContentInit,
    EventEmitter,
    Output,
    OnDestroy,
    Renderer2,
    ContentChildren
} from '@angular/core';
import { Subscription } from 'rxjs';

import { DropDownFixedComponent } from './drop-down-fixed/drop-down-fixed.component';
import { DropDownMenuComponent } from './drop-down-menu/drop-down-menu.component';

@Component({
    selector: 'ui-drop-down',
    templateUrl: './drop-down.component.html'
})

export class DropDownComponent implements AfterContentInit, OnInit, OnDestroy {
    @ContentChildren(DropDownFixedComponent)
    fixed: QueryList<DropDownFixedComponent>;
    @ContentChildren(DropDownMenuComponent)
    menu: QueryList<DropDownMenuComponent>;
    @Input()
    @HostBinding('class.open')
    open: boolean = false;
    @Output()
    escape = new EventEmitter();
    @Output()
    trigger = new EventEmitter();

    private subs: Array<Subscription> = [];
    private isTriggerEvent: boolean = false;

    constructor(private renderer: Renderer2) {
    }

    ngOnInit() {
        this.renderer.listen('document', 'click', () => {
            if (this.isTriggerEvent) {
                this.isTriggerEvent = false;
                return;
            }
            this.escape.emit();
        });
    }

    ngAfterContentInit() {
        this.fixed.forEach(item => {
            let sub = item.trigger.subscribe(() => {
                this.isTriggerEvent = true;
                this.trigger.emit();
            });
            this.subs.push(sub);
        });
    }

    ngOnDestroy() {
        this.subs.forEach(item => {
            item.unsubscribe();
        });
    }
}

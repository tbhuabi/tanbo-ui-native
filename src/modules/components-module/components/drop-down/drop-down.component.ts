import {
    AfterContentInit,
    Component,
    ContentChildren,
    EventEmitter,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    Renderer2
} from '@angular/core';
import { Subscription } from 'rxjs';

import { DropDownFixedComponent } from '../drop-down-fixed/drop-down-fixed.component';
import { DropDownMenuComponent } from '../drop-down-menu/drop-down-menu.component';

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
        // 当页面被点击时，关闭下拉框，同时排除是自己点击
        this.renderer.listen('document', 'click', () => {
            if (this.isTriggerEvent) {
                this.isTriggerEvent = false;
                return;
            }
            this.escape.emit();
        });
    }

    ngAfterContentInit() {
        // 订阅固定按扭部分被点击的事件，并修改状态，防止事件冒泡到全局，误隐藏下拉展开部分
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

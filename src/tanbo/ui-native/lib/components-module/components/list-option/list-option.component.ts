import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { ListEventService } from '../list-item/list-event.service';

@Component({
    selector: 'ui-list-option',
    templateUrl: './list-option.component.html'
})
export class ListOptionComponent implements AfterViewInit {
    constructor(private listEventService: ListEventService,
                private elementRef: ElementRef) {
    }

    ngAfterViewInit() {
        // 发布当前组件的 dom 元素，以便让 list-sliding 组件在划动时，计算最大划动宽度
        this.listEventService.addOption(this.elementRef);
    }
}
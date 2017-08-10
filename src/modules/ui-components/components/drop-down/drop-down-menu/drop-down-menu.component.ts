import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
@Component({
    selector: 'ui-drop-down-menu',
    templateUrl: './drop-down-menu.component.html'
})
export class DropDownMenuComponent implements OnInit {
    constructor(private elementRef: ElementRef, private renderer: Renderer2) {

    }

    ngOnInit() {
        this.renderer.listen(this.elementRef.nativeElement, 'click', (ev: any) => {
            ev.stopPropagation();
        });
    }
}
import { Component, OnInit, Inject, HostListener, Input } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
@Component({
    selector: 'ui-toolbar',
    templateUrl: './ui-toolbar.component.html'
})
export class ToolbarComponent implements OnInit {
    @Input()
    iconClassName: string = '';

    distanceTop: number = 0;
    private animateId: any = null;

    constructor(@Inject(DOCUMENT) private document: Document) {
    }

    @HostListener('window:scroll')
    ngOnInit() {
        this.distanceTop = this.document.body.scrollTop || this.document.documentElement.scrollTop;
    }

    toTop() {
        let n = 0;
        let m = 20;
        let rawDistance = this.distanceTop;
        let self = this;
        cancelAnimationFrame(this.animateId);
        function animateFn() {
            n++;
            let a = n / m;
            self.document.body.scrollTop = self.document.documentElement.scrollTop = rawDistance * (1 - Math.pow(a, 3));
            if (n === m) {
                return;
            }
            self.animateId = requestAnimationFrame(animateFn);
        }
        this.animateId = requestAnimationFrame(animateFn);
    }
}
import {
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    Output,
    Renderer2
} from '@angular/core';

@Component({
    selector: 'ui-scroll',
    templateUrl: './scroll.component.html'
})
export class ScrollComponent {
    @Input()
    openRefresh: boolean = false;
    @Input()
    openInfinite: boolean = false;

    // @Input()
    // maxDistanceTop: number;
    // @Input()
    // maxDistanceBottom: number;

    @HostBinding('style.transform')
    transform: string;

    @Output()
    refresh = new EventEmitter<number>();
    @Output()
    infinite = new EventEmitter<number>();

    constructor(private renderer: Renderer2,
                private elementRef: ElementRef) {
    }

    @HostListener('touchstart', ['$event'])
    scroll(event: any) {
        if (!this.openInfinite && !this.openRefresh) {
            return;
        }
        const oldPoint = event.touches[0];

        const oldY = oldPoint.pageY;
        const element = this.elementRef.nativeElement;
        const oldScrollTop = element.scrollTop;
        const containerHeight = element.offsetHeight;
        const maxScrollHeight = Math.max(element.scrollHeight, containerHeight) - containerHeight;

        this.renderer.setStyle(element, 'transitionDuration', '0ms');

        const cancelTouchMoveFn = this.renderer.listen('document', 'touchmove', (ev: any) => {
            const newPoint = ev.touches[0];
            const newY = newPoint.pageY;
            const distance = newY - oldY;

            let translateY = 0;

            if (this.openRefresh && distance > 0) {
                const distanceTop = distance - oldScrollTop;
                if (distanceTop > 0) {
                    translateY = distanceTop;
                    this.refresh.emit(distanceTop);
                }
            } else if (this.openInfinite && distance < 0) {
                const distanceBottom = maxScrollHeight - oldScrollTop + distance;
                if (distanceBottom < 0) {
                    translateY = distanceBottom;
                    this.infinite.emit(distanceBottom);
                }
            }

            this.transform = `translateY(${translateY}px)`;
            if (translateY === 0) {
                if (this.openRefresh) {
                    this.refresh.emit(0);
                }
                if (this.openInfinite) {
                    this.infinite.emit(0);
                }
            } else {
                ev.preventDefault();
                return false;
            }

        });
        let cancelTouchCancelFn: () => void;
        let cancelTouchEndFn: () => void;

        const touchedFn = function () {
            this.renderer.setStyle(element, 'transition-duration', '');
            this.transform = null;
            cancelTouchMoveFn();
            cancelTouchEndFn();
            cancelTouchCancelFn();
        }.bind(this);

        cancelTouchCancelFn = this.renderer.listen('document', 'touchend', touchedFn);
        cancelTouchEndFn = this.renderer.listen('document', 'touchend', touchedFn);
    }
}
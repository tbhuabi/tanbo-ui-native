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

    @Input()
    actionDistanceTop: number = 100;
    @Input()
    actionDistanceBottom: number = 100;

    @HostBinding('style.transform')
    transform: string;

    @Output()
    rolling = new EventEmitter<number>();
    @Output()
    refresh = new EventEmitter<() => void>();
    @Output()
    infinite = new EventEmitter<() => void>();

    private translateY: number = 0;

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

        const oldTranslateY = this.translateY;

        const cancelTouchMoveFn = this.renderer.listen('document', 'touchmove', (ev: any) => {
            const newPoint = ev.touches[0];
            const newY = newPoint.pageY;
            const distance = newY - oldY;

            let translateY = 0;

            const distanceTop = Math.ceil((distance - oldScrollTop) / 3) + oldTranslateY;
            if (distanceTop > 0 && this.openRefresh) {
                translateY = distanceTop;
            } else if (this.openInfinite) {
                const distanceBottom = Math.ceil((maxScrollHeight - oldScrollTop + distance) / 3) + oldTranslateY;
                if (distanceBottom < 0) {
                    translateY = distanceBottom;
                }
            }

            if (this.translateY !== translateY) {
                this.translateY = translateY;
                this.rolling.emit(translateY);
                this.transform = `translateY(${translateY}px)`;
            }
            if (translateY !== 0) {
                ev.preventDefault();
                return false;
            }

        });
        let cancelTouchCancelFn: () => void;
        let cancelTouchEndFn: () => void;

        const complete = function () {
            this.translateY = 0;
            this.transform = null;
        }.bind(this);

        const touchedFn = function () {
            let distanceTop = Math.abs(Number(this.actionDistanceTop) || 100);
            let distanceBottom = Math.abs(Number(this.actionDistanceBottom) || 100) * -1;

            this.renderer.setStyle(element, 'transition-duration', '');

            if (this.translateY > 0 && this.translateY > distanceTop) {
                this.translateY = distanceTop;
                this.transform = `translateY(${distanceTop}px)`;
                this.rolling.emit(distanceTop);
                this.refresh.emit(complete);
            } else if (this.translateY < 0 && this.translateY < distanceBottom) {
                this.translateY = distanceBottom;
                this.transform = `translateY(${distanceBottom}px)`;
                this.rolling.emit(distanceBottom);
                this.infinite.emit(complete);
            } else {
                this.rolling.emit(0);
                this.translateY = 0;
                this.transform = null;
            }
            cancelTouchMoveFn();
            cancelTouchEndFn();
            cancelTouchCancelFn();
        }.bind(this);

        cancelTouchCancelFn = this.renderer.listen('document', 'touchend', touchedFn);
        cancelTouchEndFn = this.renderer.listen('document', 'touchend', touchedFn);
    }
}
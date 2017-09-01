import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    OnDestroy,
    Output,
    Renderer2
} from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

@Component({
    selector: 'ui-scroll',
    templateUrl: './scroll.component.html'
})
export class ScrollComponent implements AfterViewInit, OnDestroy {
    @Input()
    openRefresh: boolean = false;
    @Input()
    actionDistanceTop: number = 60;
    @Input()
    actionDistanceBottom: number = 200;

    @HostBinding('style.transform')
    transform: string;

    @Output()
    rolling = new EventEmitter<number>();
    @Output()
    refresh = new EventEmitter<() => void>();
    @Output()
    infinite = new EventEmitter<() => void>();

    private translateY: number = 0;
    private unBindFnList: Array<() => void> = [];

    private infinite$: Observable<void>;
    private infiniteSource = new Subject<void>();
    private sub: Subscription;

    constructor(private renderer: Renderer2,
                private elementRef: ElementRef) {

        this.infinite$ = this.infiniteSource.asObservable();
    }

    ngAfterViewInit() {
        if (this.openRefresh) {
            this.bindingRefresher();
        }

        const element = this.elementRef.nativeElement;
        let oldScrollTop: number = null;

        this.sub = this.infinite$.debounceTime(300).subscribe(() => {
            if (element.scrollTop >= oldScrollTop) {
                oldScrollTop = null;
                this.infinite.emit();
            }
        });

        const fn = this.renderer.listen(element, 'scroll', () => {
            const maxScrollY = Math.max(element.scrollHeight, element.offsetHeight) - element.offsetHeight;
            if (maxScrollY - element.scrollTop < this.actionDistanceBottom) {
                if (oldScrollTop === null) {
                    oldScrollTop = element.scrollTop;
                }
                this.infiniteSource.next();
            }
        });
        this.unBindFnList.push(fn);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.unBindFnList.forEach(item => {
            item();
        });
    }

    bindingRefresher() {
        const element = this.elementRef.nativeElement;
        const fn = this.renderer.listen(element, 'touchstart', (event: any) => {
            const oldPoint = event.touches[0];

            const oldY = oldPoint.pageY;
            const oldScrollTop = element.scrollTop;

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
                let distanceTop = Math.abs(Number(this.actionDistanceTop));

                this.renderer.setStyle(element, 'transition-duration', '');

                if (this.translateY > 0 && this.translateY > distanceTop) {
                    this.translateY = distanceTop;
                    this.transform = `translateY(${distanceTop}px)`;
                    this.rolling.emit(distanceTop);
                    this.refresh.emit(complete);
                } else {
                    this.rolling.emit(0);
                    this.translateY = 0;
                    this.transform = null;
                }
                cancelTouchMoveFn();
                cancelTouchEndFn();
                cancelTouchCancelFn();
            }.bind(this);

            cancelTouchCancelFn = this.renderer.listen('document', 'touchcancel', touchedFn);
            cancelTouchEndFn = this.renderer.listen('document', 'touchend', touchedFn);
        });

        this.unBindFnList.push(fn);
    }
}
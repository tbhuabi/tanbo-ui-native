import { Directive, Input, ElementRef, OnInit, OnDestroy } from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { throttleTime } from "rxjs/operators";

@Directive({
  selector: 'img[uiLazySrc]'
})

export class LazySrcDirective implements OnInit, OnDestroy {
  @Input() uiLazySrc: string; // 需要懒加载的图片
  @Input() errorImage?: string; // 加载出错图片
  @Input() offset?: number; // 图片进入视图加载的提前量，单位px
  private $pageScroll: Subscription;
  private $imageError: Subscription;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.checkImage();
    const getScrollAncestorElement = (node: HTMLElement) => {
      if (node instanceof Element) {
        const overflow = getComputedStyle(node).overflow;
        if (overflow === 'hidden' || overflow === 'visible') {
          node = node.parentNode as HTMLElement;
          if (node) {
            return getScrollAncestorElement(node);
          }
        }
        return node;
      }
      return window;
    };
    const element = this.elementRef.nativeElement;
    const scrollAncestorElement = getScrollAncestorElement(element);
    this.$pageScroll = fromEvent(scrollAncestorElement, 'scroll').pipe(throttleTime(500)).subscribe(() => {
      this.checkImage();
    });
    if (this.errorImage) {
      this.$imageError = fromEvent(element, 'error').subscribe(() => {
        this.setErrorImage();
      });
    }
  }


  ngOnDestroy() {
    if (this.$pageScroll) {
      this.$pageScroll.unsubscribe();
    }
    if (this.$imageError) {
      this.$imageError.unsubscribe();
    }
  }

  setErrorImage() {
    const imageElement = this.elementRef.nativeElement;
    imageElement.setAttribute('src', this.errorImage);
  }

  // 判断元素是否在可视区域内
  isElementInViewport(el, offset = 0) {
    const box = el.getBoundingClientRect(),
      top = (box.top <= (window.innerHeight || document.documentElement.clientHeight) + offset),
      left = (box.left <= (window.innerWidth || document.documentElement.clientWidth) + offset);
    return (top && left);
  }

  // 检查图片是否加载
  checkImage() {
    const imageElement = this.elementRef.nativeElement;
    if (this.isElementInViewport(imageElement, this.offset)) {
      if (!!this.uiLazySrc) {
        imageElement.setAttribute('src', this.uiLazySrc);
        this.uiLazySrc = '';
      }
    }
  }
}

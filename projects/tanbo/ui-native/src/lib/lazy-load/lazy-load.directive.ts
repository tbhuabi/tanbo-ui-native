import { Directive, Input, ElementRef, OnInit, OnDestroy } from "@angular/core";
import { fromEvent } from "rxjs";
import { throttleTime } from "rxjs/operators";

@Directive({
  selector: '[uiLazyLoad]'
})

export class LazyLoadDirective implements OnInit, OnDestroy {
  @Input() uiLazyLoad: string; // 需要懒加载的图片
  @Input() defaultImage?: string; // 没有加载时候的默认图片
  @Input() errorImage?: string; // 加载出错图片
  @Input() offset?: number; // 图片进入视图加载的提前量，单位px
  private elementRef: ElementRef;
  private $pageScroll: any;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    if (!!this.defaultImage) {
      this.handleDefaultImage();
    }
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
    const scrollAncestorElement = getScrollAncestorElement(this.elementRef.nativeElement);
    scrollAncestorElement.removeEventListener('scroll', this.checkImage);
    this.$pageScroll = fromEvent(scrollAncestorElement, 'scroll').pipe(throttleTime(500)).subscribe(() => {
      this.checkImage();
    });
  }


  ngOnDestroy() {
    if (this.$pageScroll) {
      this.$pageScroll.unsubscribe();
    }
  }

  handleDefaultImage() {
    const imageElement = this.elementRef.nativeElement;
    imageElement.setAttribute('src', this.defaultImage);
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
      if (!!this.uiLazyLoad) {
        imageElement.setAttribute('src', this.uiLazyLoad);
        this.uiLazyLoad = '';
      }
    }
  }
}

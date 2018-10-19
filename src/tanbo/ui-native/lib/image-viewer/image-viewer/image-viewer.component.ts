import {
  Component, OnInit, OnDestroy, HostBinding, HostListener, ElementRef, ViewChildren, Renderer2,
  QueryList
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ImageViewerController, ImageViewItem } from '../image-viewer-controller';

export interface ImageViewProp extends ImageViewItem {
  styles?: { [key: string]: string | number };
}

@Component({
  selector: 'ui-image-viewer',
  templateUrl: './image-viewer.component.html'
})
export class ImageViewerComponent implements OnDestroy, OnInit {
  @ViewChildren('img')
  imgElements: QueryList<ElementRef<HTMLImageElement>>;
  @HostBinding('class.ui-show')
  isShow = false;
  isShowSlide = false;
  images: ImageViewProp[] = [];
  viewIndex = 0;

  opacity = 0;

  private subs: Subscription[] = [];

  constructor(private imageViewerService: ImageViewerController,
              private renderer2: Renderer2,
              private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.subs.push(this.imageViewerService.images.subscribe(images => {
      this.images = images;
    }));
    this.subs.push(this.imageViewerService.display.subscribe(config => {
      this.isShow = config.show;
      if (config.show) {
        this.isShowSlide = true;
        const index = this.findIndex(config.firstSrc);
        this.viewIndex = index > -1 ? index : 0;
        this.setupInitStyles();
      }
    }));
  }

  ngOnDestroy() {
    this.subs.forEach(item => item.unsubscribe());
  }

  @HostListener('click')
  click() {
    const current = this.images[this.viewIndex];
    if (current.srcElement) {
      const rect = current.srcElement.getBoundingClientRect();
      this.renderer2.setStyle(current.srcElement, 'opacity', 0);
      const fn = this.renderer2.listen(
        this.imgElements.toArray()[this.viewIndex].nativeElement, 'transitionend', () => {
          this.opacity = 0;
          this.isShowSlide = false;
          this.renderer2.setStyle(current.srcElement, 'opacity', 1);
          fn();
        });
      current.styles = {
        left: rect.left + 'px',
        top: rect.top + 'px',
        width: rect.width + 'px',
        height: rect.height + 'px',
        transition: 'all .3s'
      };
    }
    this.imageViewerService.hide();
  }

  setViewIndex(index: number) {
    this.viewIndex = index;
  }

  private findIndex(src: string) {
    for (let i = 0; i < this.images.length; i++) {
      if (this.images[i].src === src) {
        return i;
      }
    }
    return -1;
  }

  private setupInitStyles() {
    this.images.forEach((item, index) => {
      item.styles = {};
      if (index === this.viewIndex) {
        if (item.srcElement) {
          const rect = item.srcElement.getBoundingClientRect();
          item.styles = {
            left: rect.left + 'px',
            top: rect.top + 'px',
            width: rect.width + 'px',
            height: rect.height + 'px',
            transition: 'all .3s'
          };
        }
      }
      requestAnimationFrame(() => {
        if (item.srcElement) {
          if (index === this.viewIndex) {
            this.renderer2.setStyle(item.srcElement, 'opacity', 0);
            const fn = this.renderer2.listen(
              this.imgElements.toArray()[this.viewIndex].nativeElement, 'transitionend',
              () => {
                this.renderer2.setStyle(item.srcElement, 'opacity', 1);
                item.styles.transition = 'none';
                fn();
              });
          }

          const containerRect = this.elementRef.nativeElement.getBoundingClientRect();
          const contentWidth = item.srcElement.width;
          const contentHeight = item.srcElement.height;
          const proportion = (containerRect.width / containerRect.height) / (contentWidth / contentHeight);
          if (proportion > 1) {
            const width = contentWidth * containerRect.height / contentHeight;
            item.styles.height = containerRect.height + 'px';
            item.styles.width = width + 'px';
            item.styles.top = 0;
            item.styles.left = (containerRect.width - width) / 2 + 'px';
          } else {
            const height = contentHeight * containerRect.width / contentWidth;
            item.styles.height = height + 'px';
            item.styles.width = containerRect.width + 'px';
            item.styles.top = (containerRect.height - height) / 2 + 'px';
            item.styles.left = 0;
          }
        }
        requestAnimationFrame(() => {
          this.opacity = 1;
        });
      });
    });
  }
}
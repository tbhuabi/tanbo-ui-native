import {
  Component,
  OnInit,
  OnDestroy,
  HostBinding,
  HostListener,
  ElementRef,
  ViewChildren,
  Renderer2,
  QueryList
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ImageViewerController, ImageViewItem } from '../image-viewer-controller';
import { PanEvent, PinchEvent } from '../../touch/index';

export interface ImageViewProp extends ImageViewItem {
  styles?: { [key: string]: string | number };
  defaultStyles?: { [key: string]: number };
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
  @HostBinding('style.backgroundColor')
  bgColor = '';

  @HostBinding('style.transition')
  get transition() {
    return this.bgColor ? 'none' : '';
  };

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
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        transition: 'all .3s'
      };
    }
    this.imageViewerService.hide();
  }

  pinch(ev: PinchEvent, imageView: ImageViewProp) {

    const containerRect = this.elementRef.nativeElement.getBoundingClientRect();
    const imgRect = this.imgElements.toArray()[this.viewIndex].nativeElement.getBoundingClientRect();

    const left = Math.min(containerRect.left, imgRect.left);
    const top = Math.min(containerRect.top, imgRect.top);
    const right = Math.max(containerRect.right, imgRect.right);
    const bottom = Math.max(containerRect.bottom, imgRect.bottom);

    const px = (ev.moveX - left) / (right - left);
    const py = (ev.moveY - top) / (bottom - top);

    // const rect =

    imageView.styles.transition = 'none';
    imageView.styles.width = ev.cumulativeScale * imageView.defaultStyles.width;
    imageView.styles.height = ev.cumulativeScale * imageView.defaultStyles.height;
    imageView.styles.left = ev.moveX + -imageView.styles.width * px;
    imageView.styles.top = ev.moveY + -imageView.styles.height * py;
    ev.srcEvent.stopPropagation();
  }

  drag(ev: PanEvent, imageView: ImageViewProp) {

    if (ev.firstDirection === 'down') {
      const scale = ev.cumulativeDistanceY < 0 ? 1 :
        (1 - ev.cumulativeDistanceY / 4 / Number(imageView.styles.height));
      const transforms = [
        `translate(${ev.cumulativeDistanceX}px, ${ev.cumulativeDistanceY}px)`,
        `scale(${scale})`
      ];
      imageView.styles.transition = 'none';
      imageView.styles.transform = transforms.join(' ');

      const alpha = ev.cumulativeDistanceY < 0 ? 1 : (1 - ev.cumulativeDistanceY / Number(imageView.styles.height));

      this.bgColor = `rgba(0,0,0,${alpha < 0.5 ? 0.5 : alpha})`;

      if (ev.type === 'touchend') {
        this.bgColor = '';
        ev.resetCumulative();
        if (ev.cumulativeDistanceY > this.elementRef.nativeElement.offsetHeight / 4) {
          this.imageViewerService.hide();
          const rect = imageView.srcElement.getBoundingClientRect();
          const fn = this.renderer2.listen(
            this.imgElements.toArray()[this.viewIndex].nativeElement, 'transitionend', () => {
              this.opacity = 0;
              this.isShowSlide = false;
              this.renderer2.setStyle(imageView.srcElement, 'opacity', 1);
              fn();
            });
          imageView.styles = {
            width: rect.width,
            height: rect.height,
            left: rect.left,
            top: rect.top,
            transition: 'all .3s'
          };
        } else {
          imageView.styles.transform = 'none';
          imageView.styles.transition = 'all .3s';
        }
      }
    } else {
      ev.resetCumulative();
      ev.stop();
    }
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
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
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
          const contentWidth = item.srcElement.naturalWidth;
          const contentHeight = item.srcElement.naturalHeight;
          const proportion = (containerRect.width / containerRect.height) / (contentWidth / contentHeight);
          item.defaultStyles = {};
          if (contentHeight <= containerRect.height && contentWidth <= containerRect.width) {
            item.defaultStyles.height = contentHeight;
            item.defaultStyles.width = contentWidth;
            item.defaultStyles.top = (containerRect.height - contentHeight) / 2;
            item.defaultStyles.left = (containerRect.width - contentWidth) / 2;
          } else {
            if (proportion > 1) {
              // 高比宽大
              const width = contentWidth * containerRect.height / contentHeight;
              item.defaultStyles.height = containerRect.height;
              item.defaultStyles.width = width;
              item.defaultStyles.top = 0;
              item.defaultStyles.left = (containerRect.width - width) / 2;
            } else {
              // 高比宽小
              const height = contentHeight * containerRect.width / contentWidth;
              item.defaultStyles.height = height;
              item.defaultStyles.width = containerRect.width;
              item.defaultStyles.top = (containerRect.height - height) / 2;
              item.defaultStyles.left = 0;
            }
          }
          Object.assign(item.styles, item.defaultStyles);
        }
        requestAnimationFrame(() => {
          this.opacity = 1;
        });
      });
    });
  }
}
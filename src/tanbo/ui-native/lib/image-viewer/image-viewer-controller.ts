import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ImageViewItem {
  src: string;
  srcElement?: HTMLImageElement;
}

@Injectable()
export class ImageViewerController {
  images: Observable<ImageViewItem[]>;
  display: Observable<{ show: boolean, firstSrc?: string }>;
  private imageSource = new Subject<ImageViewItem[]>();
  private displayEvent = new Subject<{ show: boolean, firstSrc?: string }>();
  private imageList: ImageViewItem[] = [];

  constructor() {
    this.images = this.imageSource.asObservable();
    this.display = this.displayEvent.asObservable();
  }

  addImage(src: string, srcElement?: HTMLImageElement) {
    if (this.findIndex(src) === -1) {
      this.imageList.push({
        srcElement,
        src
      });
      this.imageSource.next(this.imageList);
    }
  }

  removeImage(src: string) {
    const index = this.findIndex(src);
    if (index > -1) {
      this.imageList.splice(index, 1);
      this.imageSource.next(this.imageList);
    }
  }

  show(firstSrc: string) {
    this.displayEvent.next({
      firstSrc,
      show: true
    });
  }

  hide() {
    this.displayEvent.next({
      show: false
    });
  }

  private findIndex(src: string) {
    for (let i = 0; i < this.imageList.length; i++) {
      if (this.imageList[i].src === src) {
        return i;
      }
    }
    return -1;
  }
}
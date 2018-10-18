import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class ImageViewerController {
  images: Observable<string[]>;
  display: Observable<boolean>;
  private imageSource = new Subject<string[]>();
  private displayEvent = new Subject<boolean>();
  private imageList: string[] = [];

  constructor() {
    this.images = this.imageSource.asObservable();
    this.display = this.displayEvent.asObservable();
  }

  addImage(src: string) {
    if (this.imageList.indexOf(src) > -1) {
      this.imageList.push(src);
      this.imageSource.next(this.imageList);
    }
  }

  removeImage(src: string) {
    const index = this.imageList.indexOf(src);
    if (index > -1) {
      this.imageList.splice(index, 1);
      this.imageSource.next(this.imageList);
    }
  }

  show() {
    this.displayEvent.next(true);
  }

  hide() {
    this.displayEvent.next(false);
  }
}
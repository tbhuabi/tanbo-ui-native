import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ImageViewerController } from '../image-viewer-controller';

@Component({
  selector: 'ui-image-viewer',
  templateUrl: './image-viewer.component.html'
})
export class ImageViewerComponent implements OnDestroy, OnInit {
  images: string[] = [];
  isShow = false;
  private subs: Subscription[] = [];

  constructor(private imageViewerService: ImageViewerController) {
  }

  ngOnInit() {
    this.subs.push(this.imageViewerService.images.subscribe(images => {
      this.images = images;
    }));
    this.subs.push(this.imageViewerService.display.subscribe(b => {
      this.isShow = b;
    }));
  }

  ngOnDestroy() {
    this.subs.forEach(item => item.unsubscribe());
  }
}
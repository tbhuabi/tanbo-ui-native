import { Directive, HostListener, Input, OnDestroy } from '@angular/core';

import { ImageViewerController } from './image-viewer-controller';

@Directive({
  selector: '[ui-image-viewable]'
})
export class ImageViewableDirective implements OnDestroy {
  @Input()
  set src(v: string) {
    if (v && typeof v === 'string') {
      this.imageViewerService.removeImage(this._src);
      this._src = v;
      this.imageViewerService.addImage(v);
    }
  }

  get src() {
    return this._src;
  }

  private _src: string;

  constructor(private imageViewerService: ImageViewerController) {
  }

  ngOnDestroy() {
    this.imageViewerService.removeImage(this.src);
  }

  @HostListener('click')
  click() {
    this.imageViewerService.show();
  }
}
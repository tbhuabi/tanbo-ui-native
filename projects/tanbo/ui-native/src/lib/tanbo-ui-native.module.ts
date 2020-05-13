import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { UIAppModule } from './app/app.module';
import { UICollectionModule } from './collection/collection.module';
import { UIFlexModule } from './flex/flex.module';
import { UIFormsModule } from './forms/forms.module';
import { UIImageViewerModule } from './image-viewer/image-viewer.module';
import { UILayoutModule } from './layout/layout.module';
import { UIListModule } from './list/list.module';
import { UIModalModule } from './modal/modal.module';
import { UIOtherModule } from './other/other.module';
import { UIRouterModule } from './router/router.module';
import { UIScrollModule } from './scroll/scroll.module';
import { UISegmentModule } from './segment/segment.module';
import { UISlideModule } from './slide/slide.module';
import { UITouchModule } from './touch/touch.module';
import { UILazyLoadModule } from './lazy-load/lazy-load.module';

import { UI_BROWSER_ENV, UI_SCREEN_SCALE } from './helper';
import { getDeviceType, AppController } from './app/index';
import { ListActivatedService } from './list/index';
import {
  UIRouteReuseStrategy,
  RouteCacheController,
  UI_BACK_ICON_CLASSNAME,
  UI_ROUTER_ANIMATION_STEPS,
  ViewStateService
} from './router/index';
import { UI_DO_REFRESH_DISTANCE, UI_DO_LOAD_DISTANCE } from './scroll/index';
import { AlertController, DialogController, ToastController, ModalController } from './modal/index';

import { ImageViewerController } from './image-viewer/image-viewer-controller';

@NgModule({
  exports: [
    UIAppModule,
    UICollectionModule,
    UIFlexModule,
    UIFormsModule,
    UIImageViewerModule,
    UILayoutModule,
    UIListModule,
    UIModalModule,
    UIOtherModule,
    UIRouterModule,
    UIScrollModule,
    UISegmentModule,
    UISlideModule,
    UITouchModule,
    UILazyLoadModule
  ]
})
export class UINativeModule {
  static forRoot(): ModuleWithProviders<UINativeModule> {
    return {
      ngModule: UINativeModule,
      providers: [{
        provide: RouteReuseStrategy,
        useClass: UIRouteReuseStrategy
      }, {
        provide: UI_BACK_ICON_CLASSNAME,
        useValue: 'ui-icon-arrow-back'
      }, {
        provide: UI_ROUTER_ANIMATION_STEPS,
        useValue: navigator.userAgent.indexOf('web-2.0') > -1 ? 1 : 30
      }, {
        provide: UI_DO_REFRESH_DISTANCE,
        useValue: 40
      }, {
        provide: UI_DO_LOAD_DISTANCE,
        useValue: 600
      }, {
        provide: UI_BROWSER_ENV,
        useFactory: getDeviceType
      }, {
        provide: UI_SCREEN_SCALE,
        useValue: 1
      },
        AppController,
        RouteCacheController,
        AlertController,
        DialogController,
        ListActivatedService,
        ModalController,
        ToastController,
        ViewStateService,
        ImageViewerController
      ]
    };
  }
}

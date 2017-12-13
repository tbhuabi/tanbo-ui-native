import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
// 组件
import { ActionSheetComponent } from './components/action-sheet/action-sheet.component';
import { AlertComponent } from './components/alert/alert.component';
import { AppComponent } from './components/app/app.component';
import { BackComponent } from './components/back/back.component';
import { ButtonsComponent } from './components/buttons/buttons.component';
import { CollectionComponent } from './components/collection/collection.component';
import { CollectionItemComponent } from './components/collection-item/collection-item.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ContentComponent } from './components/content/content.component';
import { ContentLoadingComponent } from './components/content-loading/content-loading.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { FlexComponent } from './components/flex/flex.component';
import { FlexItemComponent } from './components/flex-item/flex-item.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ListComponent } from './components/list/list.component';
import { ListHeaderComponent } from './components/list-header/list-header.component';
import { ListInnerComponent } from './components/list-inner/list-inner.component';
import { ListItemComponent } from './components/list-item/list-item.component';
import { ListOptionComponent } from './components/list-option/list-option.component';
import { ListSlidingComponent } from './components/list-sliding/list-sliding.component';
import { ListThumbnailComponent } from './components/list-thumbnail/list-thumbnail.component';
import { LoadingComponent } from './components/loading/loading.component';
import { MaskComponent } from './components/mask/mask.component';
import { NavBarComponent } from './components/navbar/navbar.component';
import { PageComponent } from './components/page/page.component';
import { RefresherComponent } from './components/refresher/refresher.component';
import { RouterComponent } from './components/router/router.component';
import { ScrollComponent } from './components/scroll/scroll.component';
import { SlideComponent } from './components/slide/slide.component';
import { SlideItemComponent } from './components/slide-item/slide-item.component';
import { TabComponent } from './components/tab/tab.component';
import { TabBarComponent } from './components/tab-bar/tab-bar.component';
import { TabBarItemComponent } from './components/tab-bar-item/tab-bar-item.component';
import { TabViewComponent } from './components/tab-view/tab-view.component';
import { TabViewItemComponent } from './components/tab-view-item/tab-view-item.component';
import { TitleComponent } from './components/title/title.component';
import { ToastComponent } from './components/toast/toast.component';
import { ViewComponent } from './components/view/view.component';
// 指令
import { ComponentHostDirective } from './components/view/component-host.directive';

// 服务
import { RouteCacheController } from './components/router/route-cache-controller';
import { AppController } from './components/app/app-controller';

import { AlertController } from './components/alert/alert-controller.service';
import { ConfirmController } from './components/confirm/confirm-controller.service';
import { ListActivatedService } from './components/list-item/list-activated.service';
import { ToastController } from './components/toast/toast-controller.service';
import { ViewStateService } from './components/view/view-state.service';
import { UIRouteReuseStrategy } from './components/router/route-reuse-strategy';

import { UI_ROUTER_ANIMATION_STEPS, UI_BACK_ICON_CLASSNAME } from './config';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ActionSheetComponent,
        AlertComponent,
        AppComponent,
        BackComponent,
        ButtonsComponent,
        CollectionComponent,
        CollectionItemComponent,
        ConfirmComponent,
        ContentComponent,
        ContentLoadingComponent,
        DialogComponent,
        FlexComponent,
        FlexItemComponent,
        FooterComponent,
        HeaderComponent,
        ListComponent,
        ListHeaderComponent,
        ListInnerComponent,
        ListItemComponent,
        ListOptionComponent,
        ListSlidingComponent,
        ListThumbnailComponent,
        LoadingComponent,
        MaskComponent,
        NavBarComponent,
        PageComponent,
        RefresherComponent,
        RouterComponent,
        ScrollComponent,
        SlideComponent,
        SlideItemComponent,
        TabComponent,
        TabBarComponent,
        TabBarItemComponent,
        TabViewComponent,
        TabViewItemComponent,
        TitleComponent,
        ToastComponent,
        ViewComponent,

        // 指令
        ComponentHostDirective
    ],
    exports: [
        ActionSheetComponent,
        AlertComponent,
        AppComponent,
        BackComponent,
        ButtonsComponent,
        CollectionComponent,
        CollectionItemComponent,
        ConfirmComponent,
        ContentComponent,
        ContentLoadingComponent,
        DialogComponent,
        FlexComponent,
        FlexItemComponent,
        FooterComponent,
        HeaderComponent,
        ListComponent,
        ListHeaderComponent,
        ListInnerComponent,
        ListItemComponent,
        ListOptionComponent,
        ListSlidingComponent,
        ListThumbnailComponent,
        LoadingComponent,
        MaskComponent,
        NavBarComponent,
        PageComponent,
        RefresherComponent,
        RouterComponent,
        ScrollComponent,
        SlideComponent,
        SlideItemComponent,
        TabComponent,
        TabBarComponent,
        TabBarItemComponent,
        TabViewComponent,
        TabViewItemComponent,
        TitleComponent,
        ToastComponent,
        ViewComponent
    ],
    providers: [
        RouteCacheController,
        {
            provide: AppController,
            useFactory(appController?: AppController): AppController {
                if (appController) {
                    return appController;
                }
                return new AppController();
            },
            deps: [
                [AppController, new Optional(), new SkipSelf()]
            ]
        },

        AlertController,
        ConfirmController,
        ListActivatedService,
        ToastController,
        ViewStateService,

        {
            provide: UI_ROUTER_ANIMATION_STEPS,
            useFactory(steps?: number): number {
                if (typeof steps === 'number' && steps >= 0) {
                    return steps;
                }
                return 25;
            },
            deps: [
                [UI_ROUTER_ANIMATION_STEPS, new Optional(), new SkipSelf()]
            ]
        },
        {
            provide: UI_BACK_ICON_CLASSNAME,
            useFactory(name?: string): string {
                if (name) {
                    return name;
                }
                return 'ui-icon-arrow-back';
            },
            deps: [
                [UI_BACK_ICON_CLASSNAME, new Optional(), new SkipSelf()]
            ]
        },
        {
            provide: RouteReuseStrategy,
            useFactory(routeCacheController: RouteCacheController,
                       routeReuseStrategy?: UIRouteReuseStrategy): UIRouteReuseStrategy {
                if (routeReuseStrategy) {
                    return routeReuseStrategy;
                }
                return new UIRouteReuseStrategy(routeCacheController);
            },
            deps: [
                RouteCacheController,
                [UIRouteReuseStrategy, new Optional(), new SkipSelf()]
            ]
        }
    ]
})

export class UIComponentsModule {
}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { NavigationComponent } from './components/navigation/navigation.component';
import { PageComponent } from './components/page/page.component';
import { RefresherComponent } from './components/refresher/refresher.component';
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
        NavigationComponent,
        PageComponent,
        RefresherComponent,
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
        NavigationComponent,
        PageComponent,
        RefresherComponent,
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
    ]
})

export class UiComponentsModule {
}
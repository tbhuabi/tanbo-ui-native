import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// 组件
import { AlertComponent } from './components/alert/alert.component';
import { AppComponent } from './components/app/app.component';
import { BackComponent } from './components/back/back.component';
import { ButtonsComponent } from './components/buttons/buttons.component';
import { ColumnComponent } from './components/column/column.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ContentComponent } from './components/content/content.component';
import { DropDownComponent } from './components/drop-down/drop-down.component';
import { DropDownFixedComponent } from './components/drop-down-fixed/drop-down-fixed.component';
import { DropDownMenuComponent } from './components/drop-down-menu/drop-down-menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NavBarComponent } from './components/navbar/navbar.component';
import { PageComponent } from './components/page/page.component';
import { RowComponent } from './components/row/row.component';
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
import { ViewGroupComponent } from './components/view-group/view-group.component';
import { ViewLoadingBarComponent } from './components/view-loading-bar/view-loading-bar.component';
import { ViewsComponent } from './components/views/views.component';

// 指令
import { ComponentHostDirective } from './directives/component-host.directive';

// 服务
import { AlertController } from './components/alert/alert-controller.service';
import { ConfirmController } from './components/confirm/confirm-controller.service';
import { ToastController } from './components/toast/toast-controller.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        AlertComponent,
        AppComponent,
        BackComponent,
        ButtonsComponent,
        ColumnComponent,
        ConfirmComponent,
        ContentComponent,
        DropDownComponent,
        DropDownFixedComponent,
        DropDownMenuComponent,
        FooterComponent,
        HeaderComponent,
        NavBarComponent,
        PageComponent,
        RowComponent,
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
        ViewGroupComponent,
        ViewLoadingBarComponent,
        ViewsComponent,

        // 指令
        ComponentHostDirective
    ],
    exports: [
        AlertComponent,
        AppComponent,
        BackComponent,
        ButtonsComponent,
        ColumnComponent,
        ConfirmComponent,
        ContentComponent,
        DropDownComponent,
        DropDownFixedComponent,
        DropDownMenuComponent,
        FooterComponent,
        HeaderComponent,
        NavBarComponent,
        PageComponent,
        RowComponent,
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
        ViewGroupComponent,
        ViewLoadingBarComponent,
        ViewsComponent
    ],
    providers: [
        AlertController,
        ConfirmController,
        ToastController
    ]
})

export class UiComponentsModule {
}
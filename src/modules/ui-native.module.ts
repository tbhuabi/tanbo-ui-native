import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 组件
import { AlertComponent } from './components/alert/alert.component';
import { AppComponent } from './components/app/app.component';
import { BackComponent } from './components/back/back.component';
import { ButtonComponent } from './components/button/button.component';
import { ButtonsComponent } from './components/buttons/buttons.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ColumnComponent } from './components/column/column.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ContentComponent } from './components/content/content.component';
import { DateComponent } from './components/date/date.component';
import { DropDownComponent } from './components/drop-down/drop-down.component';
import { DropDownFixedComponent } from './components/drop-down-fixed/drop-down-fixed.component';
import { DropDownMenuComponent } from './components/drop-down-menu/drop-down-menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NavBarComponent } from './components/navbar/navbar.component';
import { OptionComponent } from './components/option/option.component';
import { PageComponent } from './components/page/page.component';
import { RadioComponent } from './components/radio/radio.component';
import { RangeComponent } from './components/range/range.component';
import { RowComponent } from './components/row/row.component';
import { ScrollComponent } from './components/scroll/scroll.component';
import { SelectComponent } from './components/select/select.component';
import { SlideComponent } from './components/slide/slide.component';
import { SlideItemComponent } from './components/slide-item/slide-item.component';
import { SwitchComponent } from './components/switch/switch.component';
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
import { FormValidatorDirective } from './directives/form-validator.directive';
import { ModelValidatorDirective } from './directives/model-validator.directive';
import { UiCheckboxRequiredValidatorDirective } from './directives/required-validator.directive';
import { StopPropagationDirective } from './directives/stop-propagation.directive';

// 服务
import { AlertController } from './components/alert/alert-controller.service';
import { ConfirmController } from './components/confirm/confirm-controller.service';
import { RadioStateService } from './components/radio/radio-state.service';
import { ToastController } from './components/toast/toast-controller.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        // 组件
        AlertComponent,
        AppComponent,
        BackComponent,
        ButtonComponent,
        ButtonsComponent,
        CheckboxComponent,
        ColumnComponent,
        ConfirmComponent,
        ContentComponent,
        DateComponent,
        DropDownComponent,
        DropDownFixedComponent,
        DropDownMenuComponent,
        FooterComponent,
        HeaderComponent,
        NavBarComponent,
        OptionComponent,
        PageComponent,
        RadioComponent,
        RangeComponent,
        RowComponent,
        ScrollComponent,
        SelectComponent,
        SlideComponent,
        SlideItemComponent,
        SwitchComponent,
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
        ComponentHostDirective,
        FormValidatorDirective,
        ModelValidatorDirective,
        UiCheckboxRequiredValidatorDirective,
        StopPropagationDirective
    ],
    exports: [
        // 组件
        AlertComponent,
        AppComponent,
        BackComponent,
        ButtonComponent,
        ButtonsComponent,
        CheckboxComponent,
        ColumnComponent,
        ConfirmComponent,
        ContentComponent,
        DateComponent,
        DropDownComponent,
        DropDownFixedComponent,
        DropDownMenuComponent,
        FooterComponent,
        HeaderComponent,
        NavBarComponent,
        OptionComponent,
        PageComponent,
        RadioComponent,
        RangeComponent,
        RowComponent,
        ScrollComponent,
        SelectComponent,
        SlideComponent,
        SlideItemComponent,
        SwitchComponent,
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
        ComponentHostDirective,
        FormValidatorDirective,
        ModelValidatorDirective,
        UiCheckboxRequiredValidatorDirective,
        StopPropagationDirective
    ],
    providers: [
        AlertController,
        ConfirmController,
        ToastController,
        RadioStateService
    ]
})
export class UiNativeModule {
}
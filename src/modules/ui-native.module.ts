import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// 组件
import { AlertComponent } from './components/alert/alert.component';
import { AppComponent } from './components/app/app.component';
// import { ButtonComponent } from './components/button/button.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
// import { ContentComponent } from './components/content/content.component';
// import { DropDownComponent } from './components/drop-down/drop-down.component';
// import { DropDownFixedComponent } from './components/drop-down/drop-down-fixed/drop-down-fixed.component';
// import { DropDownMenuComponent } from './components/drop-down/drop-down-menu/drop-down-menu.component';
// import { FooterComponent } from './components/footer/footer.component';
// import { RowComponent } from './components/grid/row.component';
// import { ColumnComponent } from './components/grid/column/column.component';
// import { HeaderComponent } from './components/header/header.component';
// import { InputComponent } from './components/input/input.component';
// import { CheckboxComponent } from './components/input/checkbox/checkbox.component';
// import { DateComponent } from './components/input/date/date.component';
// import { RadioComponent } from './components/input/radio/radio.component';
// import { RangeComponent } from './components/input/range/range.component';
import { NotifyComponent } from './components/notify/notify.component';
// import { PageComponent } from './components/page/page.component';
// import { ScrollComponent } from './components/scroll/scroll.component';
// import { SelectComponent } from './components/select/select.component';
// import { OptionComponent } from './components/select/option/option.component';
// import { SlideComponent } from './components/slide/slide.component';
// import { SlideItemComponent } from './components/slide/slide-item/slide-item.component';
// import { SwitchComponent } from './components/switch/switch.component';
// import { TabComponent } from './components/tab/tab.component';
// import { TabBarComponent } from './components/tab/tab-bar/tab-bar.component';
// import { TabBarItemComponent } from './components/tab/tab-bar/tab-bar-item/tab-bar-item.component';
// import { TabViewComponent } from './components/tab/tab-view/tab-view.component';
// import { TabViewItemComponent } from './components/tab/tab-view/tab-view-item/tab-view-item.component';
// import { ViewLoadingBarComponent } from './components/view-loading-bar/view-loading-bar.component';
import { ViewsComponent } from './components/views/views.component';
import { ViewGroupComponent } from './components/views/view-group/view-group.component';

// 指令
// import { ComponentHostDirective } from './directives/component-host.directive';
// import { FormValidatorDirective } from './directives/form-validator.directive';
// import { InputHostDirective } from './directives/input-host.directive';
// import { ModelValidatorDirective } from './directives/model-validator.directive';
// import { UiCheckboxRequiredValidatorDirective } from './directives/required-validator.directive';
// import { StopPropagationDirective } from './directives/stop-propagation.directive';

// 服务
import { AlertController } from './components/alert/alert-controller.service';
import { ConfirmController } from './components/confirm/confirm-controller.service';
// import { InputStateService } from './services/input-state.service';
import { NotifyController } from './components/notify/notify-controller.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        AlertComponent,
        AppComponent,
        ConfirmComponent,
        NotifyComponent,
        ViewsComponent,
        ViewGroupComponent
    ],
    exports: [
        AppComponent
    ],
    providers: [
        AlertController,
        ConfirmController,
        NotifyController
    ]
})
export class UiNativeModule {
}
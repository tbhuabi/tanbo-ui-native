import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UIDirectivesModule } from '../directives-module/directives.module';
import { UIComponentsModule } from '../components-module/components.module';
// 组件
import { ButtonComponent } from './components/button/button.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { OptionComponent } from './components/option/option.component';
import { PickerComponent } from './components/picker/picker.component';
import { PickerColumnComponent } from './components/picker-column/picker-column.component';
import { RadioComponent } from './components/radio/radio.component';
import { RangeComponent } from './components/range/range.component';
import { SelectComponent } from './components/select/select.component';
import { SwitchComponent } from './components/switch/switch.component';
// 指令
import { FormValidatorDirective } from './directives/form-validator.directive';
import { ModelValidatorDirective } from './directives/model-validator.directive';
import {
    UICheckboxRequiredValidatorDirective,
    UISelectRequiredValidatorDirective,
    UIRadioRequiredValidatorDirective,
    UISwitchRequiredValidatorDirective
} from './directives/required-validator.directive';
// 服务
import { RadioStateService } from './components/radio/radio-state.service';

@NgModule({
    imports: [
        CommonModule,
        UIDirectivesModule,
        UIComponentsModule,
        FormsModule
    ],
    declarations: [
        // 组件
        ButtonComponent,
        CheckboxComponent,
        OptionComponent,
        RadioComponent,
        PickerComponent,
        PickerColumnComponent,
        RangeComponent,
        SelectComponent,
        SwitchComponent,

        // 指令
        FormValidatorDirective,
        ModelValidatorDirective,
        UICheckboxRequiredValidatorDirective,
        UISelectRequiredValidatorDirective,
        UIRadioRequiredValidatorDirective,
        UISwitchRequiredValidatorDirective
    ],
    exports: [
        // 组件
        ButtonComponent,
        CheckboxComponent,
        OptionComponent,
        PickerComponent,
        PickerColumnComponent,
        RadioComponent,
        RangeComponent,
        SelectComponent,
        SwitchComponent,

        // 指令
        FormValidatorDirective,
        ModelValidatorDirective,
        UICheckboxRequiredValidatorDirective,
        UISelectRequiredValidatorDirective,
        UIRadioRequiredValidatorDirective,
        UISwitchRequiredValidatorDirective
    ],
    providers: [
        RadioStateService
    ]
})

export class UIFormsModule {
}
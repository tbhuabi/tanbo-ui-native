import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UIOtherModule } from '../other/other.module';
import { UIFlexModule } from '../flex/flex.module';
// 组件
import { ButtonComponent } from './button/button.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { DateComponent } from './date/date.component';
import { OptionComponent } from './option/option.component';
import { PickerComponent } from './picker/picker.component';
import { PickerColumnComponent } from './picker-column/picker-column.component';
import { RadioComponent } from './radio/radio.component';
import { RangeComponent } from './range/range.component';
import { SelectComponent } from './select/select.component';
import { SwitchComponent } from './switch/switch.component';
// 指令
import {
  CheckboxRequiredValidator,
  SwitchRequiredValidator,
  RadioRequiredValidator,
  SelectRequiredValidator,
  DateRequiredValidator
} from './required-validator.directive';
import { SubmitDirective } from './submit.directive';
// 服务
import { RadioStateService } from './radio/radio-state.service';

import { UI_SELECT_ARROW_CLASSNAME } from './helper';

@NgModule({
  imports: [
    CommonModule,
    UIOtherModule,
    FormsModule,
    UIFlexModule
  ],
  declarations: [
    // 组件
    ButtonComponent,
    CheckboxComponent,
    DateComponent,
    OptionComponent,
    RadioComponent,
    PickerComponent,
    PickerColumnComponent,
    RangeComponent,
    SelectComponent,
    SwitchComponent,

    // 指令
    CheckboxRequiredValidator,
    SwitchRequiredValidator,
    RadioRequiredValidator,
    SelectRequiredValidator,
    DateRequiredValidator,
    SubmitDirective
  ],
  exports: [
    // 组件
    ButtonComponent,
    CheckboxComponent,
    DateComponent,
    OptionComponent,
    PickerComponent,
    PickerColumnComponent,
    RadioComponent,
    RangeComponent,
    SelectComponent,
    SwitchComponent,

    // 指令
    CheckboxRequiredValidator,
    SwitchRequiredValidator,
    RadioRequiredValidator,
    SelectRequiredValidator,
    DateRequiredValidator,
    SubmitDirective
  ],
  providers: [
    RadioStateService, {
      provide: UI_SELECT_ARROW_CLASSNAME,
      useValue: 'ui-caret'
    }
  ]
})

export class UIFormsModule {
}
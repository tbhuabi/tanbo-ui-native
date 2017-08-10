import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiComponentsModule } from '../ui-components/ui-components.module';
import { UiDirectivesModule } from '../ui-directives/ui-directives.module';

import { UiCheckboxRequiredValidatorDirective } from './directives/required-validator.directive';
import { ModelValidatorDirective } from './directives/model-validator.directive';
import { FormValidatorDirective } from './directives/form-validator.directive';
import { InputHostDirective } from './directives/input-host.directive';

import { SelectComponent } from './components/select/select.component';
import { OptionComponent } from './components/select/option/option.component';
import { InputComponent } from './components/input/input.component';
import { CheckboxComponent } from './components/input/checkbox/checkbox.component';
import { RadioComponent } from './components/input/radio/radio.component';
import { RangeComponent } from './components/input/range/range.component';
import { DateComponent } from './components/input/date/date.component';
import { ButtonComponent } from './components/button/button.component';
import { SwitchComponent } from './components/switch/switch.component';
import { EditorComponent } from './components/editor/editor.component';

import { InputStateService } from './services/input-state.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        UiComponentsModule,
        UiDirectivesModule
    ],
    declarations: [
        SelectComponent,
        OptionComponent,
        InputComponent,
        CheckboxComponent,
        RadioComponent,
        RangeComponent,
        DateComponent,
        ButtonComponent,
        SwitchComponent,
        EditorComponent,

        UiCheckboxRequiredValidatorDirective,
        ModelValidatorDirective,
        FormValidatorDirective,
        InputHostDirective
    ],
    providers: [
        InputStateService
    ],
    exports: [
        SelectComponent,
        OptionComponent,
        InputComponent,
        ButtonComponent,
        SwitchComponent,
        EditorComponent,

        UiCheckboxRequiredValidatorDirective,
        ModelValidatorDirective,
        FormValidatorDirective
    ]
})
export class UiFormsModule {
}
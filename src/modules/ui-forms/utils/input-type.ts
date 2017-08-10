export interface InputType {
    disabled: boolean;
    readonly: boolean;
    checked?: boolean;
    value?: number | string;
    checkedIcon?: string;
    uncheckedIcon?: string;
    min?: number | string;
    max?: number | string;
}
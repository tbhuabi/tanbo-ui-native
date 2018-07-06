import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ActionSheetComponent } from './action-sheet.component';

describe('ComponentModule: action-sheet 组件 ->', () => {

    let component: ActionSheetComponent;
    let fixture: ComponentFixture<ActionSheetComponent>;
    let ele: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ActionSheetComponent
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        });

        fixture = TestBed.createComponent(ActionSheetComponent);

        component = fixture.componentInstance;
        ele = fixture.debugElement.nativeElement;
    });
    it('未输入，默认为 false 时', () => {
        expect(ele.className).toEqual('');
    });

    it('当输入属性为 true 时', () => {
        component.show = true;
        fixture.detectChanges();
        expect(ele.className).toEqual('show');
    });
    it('当输入属性为 false 时', () => {
        component.show = false;
        fixture.detectChanges();
        expect(ele.className).toEqual('');
    });
});
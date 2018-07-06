import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { AlertController, AlertConfig } from './alert-controller.service';
import { AlertComponent } from './alert.component';
import { DialogComponent } from '../dialog/dialog.component';
import { MaskComponent } from '../mask/mask.component';

describe('ComponentModule: alert 组件 ->', () => {
    let component: AlertComponent;
    let fixture: ComponentFixture<AlertComponent>;
    let debugEle: DebugElement;
    let alertController: AlertController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                BrowserAnimationsModule
            ],
            declarations: [
                AlertComponent,
                DialogComponent,
                MaskComponent
            ],
            providers: [
                AlertController
            ]
        });

        fixture = TestBed.createComponent(AlertComponent);
        alertController = fixture.debugElement.injector.get(AlertController);
        component = fixture.componentInstance;
        debugEle = fixture.debugElement;
    }));

    it('当发送新的弹出事件时', () => {
        const config: AlertConfig = {
            title: '测试标题',
            content: '测试内容',
            btnText: '测试按扭文字'
        };
        fixture.detectChanges();
        alertController.show(config);
        expect(component.show).toEqual(true);
        expect(component.title).toEqual(config.title);
        expect(component.content).toEqual(config.content);
        expect(component.btnText).toEqual(config.btnText);

        fixture.detectChanges();
        component.checked();
        fixture.detectChanges();
        expect(component.show).toEqual(false);
    });

});
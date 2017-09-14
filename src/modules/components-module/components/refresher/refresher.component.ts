import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'ui-refresher',
    templateUrl: './refresher.component.html'
})
export class RefresherComponent implements AfterViewInit {
    // 进度条进度
    @Input()
    set progress(value: number) {
        this._progress = value;
        if (this.context) {
            this.drawProgress();
        }
    }

    get progress() {
        return this._progress;
    }
    // 进度条到100%的临界值
    @Input()
    threshold: number = 60;
    // 开始触发进度条的临界值
    @Input()
    startThreshold = 30;

    // 是否为loading状态
    get loading() {
        return this.progress >= this.threshold;
    }
    // 进度条颜色
    @Input()
    progressColor: string;
    @ViewChild('canvas')
    canvasRef: ElementRef;

    private _progress: number = 0;

    private canvasElement: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    ngAfterViewInit() {
        this.canvasElement = this.canvasRef.nativeElement;
        this.width = this.canvasElement.offsetWidth * 2;
        this.height = this.canvasElement.offsetHeight * 2;
        this.canvasElement.width = this.width;
        this.canvasElement.height = this.height;
        this.context = this.canvasElement.getContext('2d');
        this.context.translate(this.width / 2, this.height / 2);
        this.context.rotate(-Math.PI / 2);
    }

    drawProgress() {
        const context = this.context;
        const width = this.width;
        const height = this.height;

        context.clearRect(-width / 2, -height / 2, width, height);
        const progress = this.progress > this.threshold ? this.threshold : this.progress;
        context.beginPath();
        context.arc(0, 0, width / 4, 0, this.toRadian(progress));
        context.lineWidth = width / 2;
        context.strokeStyle = this.progressColor || '#2d8cf0';
        context.stroke();
    }

    private toRadian(progress: number) {
        if (progress < this.startThreshold) {
            return 0;
        }
        return (progress - this.startThreshold) / (this.threshold - this.startThreshold) * Math.PI * 2;
    }
}
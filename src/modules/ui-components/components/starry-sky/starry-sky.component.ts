import { Component, ElementRef, Input, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';

export interface StarrySkyLine {
    beginX: number;
    beginY: number;
    closeX: number;
    closeY: number;
    opacity: number;
}
export interface StarrySkyCircle {
    x: number;
    y: number;
    r: number;
    moveX?: number;
    moveY?: number;
}

@Component({
    selector: 'ui-starry-sky',
    templateUrl: './starry-sky.component.html'
})
export class StarrySkyComponent implements AfterViewInit, OnDestroy {
    @Input()
    lineColor: string = 'rgba(45,140,210,0.2)';
    @Input()
    roundColor: string = 'rgba(45,140,210,0.1)';
    @ViewChild('canvas')
    canvas: ElementRef;
    canvasElement: HTMLCanvasElement;
    private timer: any = null;
    // 生成max和min之间的随机数
    static rangeRandom(max: number, min: number = 0): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // 线条：开始xy坐标，结束xy坐标，线条透明度
    static line(beginX: number, beginY: number, closeX: number, closeY: number, opacity: number): StarrySkyLine {
        return {
            beginX,
            beginY,
            closeX,
            closeY,
            opacity
        };
    }

    // 点：圆心xy坐标，半径，每帧移动xy的距离
    static circle(x: number, y: number, r: number, moveX: number, moveY: number): StarrySkyCircle {
        return {
            x,
            y,
            r,
            moveX,
            moveY
        };
    }

    // 绘制原点
    static drawCircle(context: CanvasRenderingContext2D,
                      x: number,
                      y: number,
                      r: number,
                      moveX?: number,
                      moveY?: number): StarrySkyCircle {
        let circle: StarrySkyCircle = StarrySkyComponent.circle(x, y, r, moveX, moveY);
        context.beginPath();
        context.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        return circle;
    }

    // 绘制线条
    static drawLine(context: CanvasRenderingContext2D,
                    beginX: number,
                    beginY: number,
                    closeX: number,
                    closeY: number,
                    opacity: number) {
        context.beginPath();
        context.strokeStyle = 'rgba(0,0,0,' + opacity + ')';
        context.moveTo(beginX, beginY);
        context.lineTo(closeX, closeY);
        context.closePath();
        context.stroke();

    }

    ngAfterViewInit() {
        this.canvasElement = this.canvas.nativeElement;
        // // 定义画布宽高和生成点的个数
        let docWidth = this.canvasElement.offsetWidth;
        let docHeight = this.canvasElement.offsetHeight;
        let point = 35;

        let canvas = this.canvasElement;
        canvas.width = docWidth;
        canvas.height = docHeight;
        let context: CanvasRenderingContext2D = canvas.getContext('2d');
        context.strokeStyle = this.lineColor;
        context.lineWidth = 1;
        context.fillStyle = this.roundColor;
        let circleArr: Array<any> = [];

        // 每帧绘制
        function draw() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < point; i++) {
                StarrySkyComponent.drawCircle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r);
            }
            for (let i = 0; i < point; i++) {
                for (let j = 0; j < point; j++) {
                    if (i + j < point) {
                        let A = Math.abs(circleArr[i + j].x - circleArr[i].x);
                        let B = Math.abs(circleArr[i + j].y - circleArr[i].y);
                        let lineLength = Math.sqrt(A * A + B * B);
                        let C = 1 / lineLength * 7 - 0.009;
                        let lineOpacity = C > 0.03 ? 0.03 : C;
                        if (lineOpacity > 0) {
                            StarrySkyComponent.drawLine(context,
                                circleArr[i].x,
                                circleArr[i].y,
                                circleArr[i + j].x,
                                circleArr[i + j].y,
                                lineOpacity);
                        }
                    }
                }
            }
        }

        // 初始化生成原点
        function init() {
            circleArr = [];
            for (let i = 0; i < point; i++) {
                circleArr.push(StarrySkyComponent.drawCircle(
                    context,
                    StarrySkyComponent.rangeRandom(docWidth),
                    StarrySkyComponent.rangeRandom(docHeight),
                    StarrySkyComponent.rangeRandom(15, 2),
                    StarrySkyComponent.rangeRandom(10, -10) / 40,
                    StarrySkyComponent.rangeRandom(10, -10) / 40)
                );
            }
            draw();
        }

        // 调用执行
        init();
        this.timer = setInterval(function () {
            for (let i = 0; i < point; i++) {
                let cir = circleArr[i];
                cir.x += cir.moveX;
                cir.y += cir.moveY;
                if (cir.x > docWidth) {
                    cir.x = 0;
                } else if (cir.x < 0) {
                    cir.x = docWidth;
                }
                if (cir.y > docHeight) {
                    cir.y = 0;
                } else if (cir.y < 0) {
                    cir.y = docHeight;
                }
            }
            draw();
        }, 10);
    }

    ngOnDestroy() {
        clearInterval(this.timer);
    }
}

/// <reference path="_ref.ts" />


/**
 * Applies a filter covering the entire screen that makes it grayscale.
 */
class ScreenFilter extends DrawerComponent {

    constructor() {
        super();
        this.anchored = true;
        this.order = 999;
    }

    grayscale: boolean = false;
    invert: boolean = false;

    draw = (context: CanvasRenderingContext2D): void => {

        if (this.grayscale) {

            context.globalCompositeOperation = "saturation";
            context.fillStyle = "hsl(0,0%,50%)";
            context.fillRect(0, 0, Camera.canvasWidth, Camera.canvasHeight);

        }

        if (this.invert) {

            context.globalCompositeOperation = "difference";
            context.fillStyle = "#FFFFFF";
            context.fillRect(0, 0, Camera.canvasWidth, Camera.canvasHeight);

        }

    }

}


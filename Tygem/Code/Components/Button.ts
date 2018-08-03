/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export class Button extends DrawerComponent {

        constructor() {
            super();
            this.name = "Button";

            this.anchored = true;
        }

        /**
         * Color/style used for the fill of the rectangle.
         */
        fillStyle: string | CanvasGradient | CanvasPattern = "#FF0000";
        /**
         * Color/style used for the stroke of the rectangle.
         */
        borderStyle: string | CanvasGradient | CanvasPattern = "#00FF00";
        borderWidth: number = 1;

        width: number = 100;
        height: number = 50;

        textFont: string = "12px Verdana";
        textColor: string = "#FFFFFF";
        
        draw = (context: CanvasRenderingContext2D): void => {
            
            // draw rectangle
            context.fillStyle = this.fillStyle;
            context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            context.lineWidth = this.borderWidth;
            context.strokeStyle = this.borderStyle;
            context.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

            // draw text
            context.font = this.textFont;
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = this.textColor;

            context.fillText(
                "test text",
                0,
                0);

        }

    }

}
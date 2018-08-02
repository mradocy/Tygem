/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export class DotGraphic extends DrawerComponent {

        constructor() {
            super();
            this.name = "DotGraphic";
        }

        color: string = "#FF0000";
        radius: number = 5;

        draw = (context: CanvasRenderingContext2D): void => {

            context.beginPath();
            context.fillStyle = this.color;
            context.arc(0, 0, this.radius, 0, Math.PI * 2);
            context.fill();

        }

    }

}
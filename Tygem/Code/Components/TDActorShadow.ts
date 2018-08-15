/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export class TDActorShadow extends DrawerComponent {

        color: string = "#2A2A2A66";

        offsetX: number = 0;
        offsetY: number = 0;
        radiusX: number = 10;
        radiusY: number = 5;

        constructor() {
            super();
            this.name = "TDActorShadow";

            this.componentProperties.requireComponent(TDActor);

            this.order = -9999;
        }

        setSize = (offsetX: number, offsetY: number, radiusX: number, radiusY: number): void => {
            this.offsetX = offsetX;
            this.offsetY = offsetY;
            this.radiusX = radiusX;
            this.radiusY = radiusY;
        }
        
        onStart = (): void => {
            this.tdActor = this.getComponent(TDActor);
        }
        
        onUpdate = (): void => { }
        
        draw = (context: CanvasRenderingContext2D): void => {
            
            let x: number = this.offsetX;
            let y: number = this.tdActor.offsetY + this.offsetY;
            let radiusX: number = this.radiusX;
            let radiusY: number = this.radiusY;
            
            // draw ellipse
            context.fillStyle = this.color;
            context.beginPath();
            (context as any).ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
            context.fill();
            
        }
        
        onDestroy = (): void => {
            this.tdActor = null;
        }

        private tdActor: TDActor = null;

    }

}
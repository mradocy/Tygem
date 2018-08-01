/// <reference path="../../Tygem/_ref.ts" />

/// <reference path="DotGraphic.ts" />

namespace Comps {

    export class DotFollowsMouse extends DotGraphic {

        constructor() {
            super();
            this.name = "DotFollowsMouse";

            this.anchored = false;
            this.layer = DrawLayer.UI;
        }
        
        onUpdate = (): void => {

            if (this.anchored) {
                this.getTransform().setGlobalPosition(Mouse.x, Mouse.y);
            } else {
                let v: Vec2 = Camera.canvasToGlobal(Mouse.x, Mouse.y);

                // extra testing
                Camera.globalToCanvas(v.x, v.y, v);
                Camera.canvasToGlobal(v.x, v.y, v);

                this.getTransform().setGlobalPosition(v.x, v.y);
            }

        }


    }

}
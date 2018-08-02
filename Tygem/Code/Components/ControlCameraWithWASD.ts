/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export class ControlCameraWithWASD extends Component {

        constructor() {
            super();
            this.name = "ControlCameraWithWASD";
        }
        
        onStart = (): void => {

        }

        panSpeed: number = 100;
        scaleMult: number = 1.2;

        onUpdate = (): void => {

            let v: Vec2 = new Vec2();

            if (Keys.keyHeld(Key.A)) {
                v.x = -this.panSpeed;
            } else if (Keys.keyHeld(Key.D)) {
                v.x = this.panSpeed;
            } else {
                v.x = 0;
            }

            if (Keys.keyHeld(Key.W)) {
                v.y = -this.panSpeed;
            } else if (Keys.keyHeld(Key.S)) {
                v.y = this.panSpeed;
            } else {
                v.y = 0;
            }

            if (Keys.keyPressed(Key.Q)) {
                Camera.scale *= this.scaleMult;
            }
            if (Keys.keyPressed(Key.E)) {
                Camera.scale /= this.scaleMult;
            }
            
            Camera.centerX -= v.x * Game.deltaTime;
            Camera.centerY -= v.y * Game.deltaTime;
            
        }
        

    }

}
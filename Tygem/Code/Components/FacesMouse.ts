/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export class FacesMouse extends Component {

        constructor() {
            super();
            this.name = "FacesMouse";

            //this.componentProperties.requireComponent();
        }
        
        // called once per frame, during the update step.  Is not called if the component is disabled.
        onUpdate = (): void => {

            let pos: Vec2 = this.transform.getGlobalPosition();
            let targetPos: Vec2 = Camera.canvasToGlobal(Mouse.x, Mouse.y);

            this.transform.setGlobalRotation(Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x) * M.radToDeg);
            
        }
        
    }

}
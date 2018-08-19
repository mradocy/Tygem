/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export class CameraFollow extends Component {

        constructor() {
            super();
            this.name = "CameraFollow";

            //this.componentProperties.requireComponent();
        }
        
        
        onLateUpdate = (): void => {

            this.transform.getGlobalPosition(this.tempVec2);
            Camera.centerX = this.tempVec2.x;
            Camera.centerY = this.tempVec2.y;
            
        }
        

        private tempVec2: Vec2 = new Vec2();

    }

}
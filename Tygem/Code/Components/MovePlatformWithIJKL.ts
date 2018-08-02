/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export class MovePlatformWithIJKL extends Component {

        constructor() {
            super();
            this.name = "MovePlatformWithIJKL";

            this.componentProperties.requireComponent(Platform);
        }

        speed: number = 40;

        
        // Called once for a Component.  Either called when a scene finishes loading, or just before update().
        onStart = (): void => {
            this.platform = this.getComponent(Platform);
        }

        private platform: Platform;
        
        // called once per frame, during the update step.  Is not called if the component is disabled.
        onUpdate = (): void => {

            if (Keys.keyHeld(Key.J)) {
                this.platform.vx = -this.speed;
            } else if (Keys.keyHeld(Key.L)) {
                this.platform.vx = this.speed;
            } else {
                this.platform.vx = 0;
            }

            if (Keys.keyHeld(Key.I)) {
                this.platform.vy = -this.speed;
            } else if (Keys.keyHeld(Key.K)) {
                this.platform.vy = this.speed;
            } else {
                this.platform.vy = 0;
            }
            
        }
        
        // called just before the component is destroyed.
        onDestroy = (): void => { }

    }

}
/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export class TestRectOverlap extends Component {

        constructor() {
            super();
            this.name = "TestRectOverlap";

            this.componentProperties.requireComponent(Actor);
        }
        
        // Called once for a Component.  Either called when a scene finishes loading, or just before update().
        onStart = (): void => {
            this.actor = this.getComponent(Actor);
        }

        private actor: Actor = null;
        
        // called once per frame, during the update step.  Is not called if the component is disabled.
        onUpdate = (): void => {

            let overlaps: Array<Collision.PlatformObject> = [];
            let rect: Rect = this.actor.getRect();
            Collision.rectOverlapAllPlatformObjectsNonAlloc(overlaps, rect, this.actor.collisionMask);

            console.log(overlaps.length > 0);

        }
        
        // called just before the component is destroyed.
        onDestroy = (): void => { }

    }

}
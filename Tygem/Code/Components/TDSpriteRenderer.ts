/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    /**
     * Extension of SpriteRenderer that automatically sets order to the attached TDActor's foot.
     */
    export class TDSpriteRenderer extends SpriteRenderer {

        constructor() {
            super();
            this.name = "TDSpriteRenderer";

            this.componentProperties.requireComponent(TDActor);
        }

        onStart = (): void => {
            this.tdActor = this.getComponent(TDActor);
        }
        
        onUpdate = (): void => {
            this.onUpdateAnimation();
            this.order = this.tdActor.getFoot();
        }

        onDestroy = (): void => {
            this.tdActor = null;
        }

        private tdActor: TDActor = null;
        
    }

}
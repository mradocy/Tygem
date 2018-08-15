/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    /**
     * Extension of SpriteRenderer that automatically sets order to the attached TDActor's foot.
     */
    export class TDSpriteRenderer extends SpriteRenderer {

        constructor() {
            super();
            this.name = "TDSpriteRenderer";

        }

        onStart = (): void => {

        }
        
        onUpdate = (): void => {
            this.onUpdateAnimation();

            if (this.tdActor === null) {
                this.tdActor = this.getComponent(TDActor);
            }
            if (this.tdActor === null)
                return;

            this.order = this.tdActor.getFoot();
        }

        onDestroy = (): void => {
            this.tdActor = null;
        }

        private tdActor: TDActor = null;
        
    }

}
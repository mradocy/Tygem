/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export class Template extends Component {

        constructor() {
            super();
            this.name = "";

            //this.componentProperties.requireComponent();
        }
        
        // Called once for a Component.  Either called when a scene finishes loading, or just before update().
        onStart = (): void => { }
        
        // called once per frame, during the update step.  Is not called if the component is disabled.
        onUpdate = (): void => { }
        
        // called just before the component is destroyed.
        onDestroy = (): void => { }

    }

}
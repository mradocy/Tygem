/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export class TestCharacter extends Component {

        constructor() {
            super();
            this.name = "TestCharacter";

            this.componentProperties.requireComponent(Character);
        }
        
        // Called once for a Component.  Either called when a scene finishes loading, or just before update().
        onStart = (): void => {
            this.character = this.getComponent(Character);

            console.log("TestCharacter: Press 1 to walk to Hero");
        }
        
        // called once per frame, during the update step.  Is not called if the component is disabled.
        onUpdate = (): void => {

            if (Keys.keyPressed(Key.Num1)) {
                let hero: TDActor = GameObject.findObject("Hero").getComponent(TDActor);
                this.character.walkToTDActor(hero, Direction.RIGHT);
            }
            
        }
        
        // called just before the component is destroyed.
        onDestroy = (): void => { }

        character: Character = null;

    }

}
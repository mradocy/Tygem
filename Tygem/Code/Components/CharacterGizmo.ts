/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export class CharacterGizmo extends DrawerComponent {

        constructor() {
            super();
            this.name = "CharacterGizmo";

            this.componentProperties.requireComponent(Character);
        }
        
        onStart = (): void => {
            this.character = this.getComponent(Character);
        }
        
        estRangeColor: string = "gray";

        draw = (context: CanvasRenderingContext2D): void => {

            if (this.character === null) {
                console.error("CharacterGizmo needs Character as a sibling component");
                return;
            }

            let action: Actions.Info = this.character.getActionInfo(0);
            if (action !== null) {
                // draw circle for action's estimated range
                context.beginPath();
                context.strokeStyle = this.estRangeColor;
                context.lineWidth = 1;
                context.arc(this.character.offsetX, this.character.offsetY, action.estRange, 0, Math.PI * 2);
                context.stroke();
            }
            
        }

        protected character: Character = null;

    }

}
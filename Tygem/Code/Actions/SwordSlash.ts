/// <reference path="Base.ts" />

namespace Actions {

    export class SwordSlash extends Base {

        duration: number = .25;

        constructor(character: Comps.Character) {
            super(character);
        }
        

        /**
         * Called when Action starts.  To be overridden.
         */
        onStart = (): void => {

            this.character.applyFriction = true;

            this.time = 0;

            // spawn slash effect
            let slashOffsetMag: number = 16;
            let rect: Rect = this.character.getRect();
            let ssGO: GameObject = Prefabs.SwordSlash();

            let charAnim: string = this.character.animPrefix + "_attack";
            switch (this.character.getDirection()) {
                case Direction.LEFT:
                    charAnim += this.character.symmetrical ? "_right" : "_left"; // hero is flipped
                    ssGO.transform.x = rect.x - slashOffsetMag;
                    ssGO.transform.y = rect.y + rect.height / 2;
                    ssGO.transform.scaleX = -1;
                    break;
                case Direction.RIGHT:
                    charAnim += "_right";
                    ssGO.transform.x = rect.x + rect.width + slashOffsetMag;
                    ssGO.transform.y = rect.y + rect.height / 2;
                    break;
                case Direction.UP:
                    charAnim += "_up";
                    ssGO.transform.x = rect.x + rect.width / 2;
                    ssGO.transform.y = rect.y - slashOffsetMag;
                    ssGO.transform.rotation = -90;
                    break;
                case Direction.DOWN:
                    charAnim += "_down";
                    ssGO.transform.x = rect.x + rect.width / 2;
                    ssGO.transform.y = rect.y + rect.height + slashOffsetMag;
                    ssGO.transform.rotation = 90;
                    break;
            }
            this.character.getComponent(SpriteRenderer).playAnimation(charAnim);

        }
        /**
         * Called each frame.  To be overridden.
         */
        onUpdate = (): void => {

            this.time += Game.deltaTime;

            // end action when time runs out
            if (this.time >= this.duration) {
                this.stop();
            }
            
        }
        /**
         * Called just before the Action ends (or is forced to end early).  To be overridden.
         */
        onEnd = (): void => { }

        private time: number = 0;

    }

}
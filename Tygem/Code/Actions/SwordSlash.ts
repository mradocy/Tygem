/// <reference path="Base.ts" />

namespace Actions {
    
    export class SwordSlash extends Base {

        duration: number = .25;

        constructor(character: Comps.Character) {
            super(character);

            this.power = 1;
        }
        

        /**
         * Called when Action starts.  To be overridden.
         */
        onStart = (): void => {

            this.character.applyFriction = true;

            this.time = 0;

            // create slash effect
            let ssGO: GameObject = new GameObject();
            let sr: SpriteRenderer = ssGO.addComponent(SpriteRenderer);
            sr.playAnimation("hero_sword_slash");
            let ve: VisualEffect = ssGO.addComponent(VisualEffect);

            // create hit circle
            let hitCircle: Comps.HitCircle = ssGO.addComponent(Comps.HitCircle);
            hitCircle.actionRef = this;
            switch (this.character.team) {
                case Team.PLAYERS:
                    hitCircle.teamTargeting = Team.ENEMIES;
                    break;
                case Team.ENEMIES:
                    hitCircle.teamTargeting = Team.PLAYERS;
                    break;
                default:
                    hitCircle.teamTargeting = Team.ALL;
            }
            hitCircle.offsetX = -3;
            hitCircle.offsetY = 0;
            hitCircle.radius = 13;
            hitCircle.attackDelay = .03;
            hitCircle.attackDuration = .06;
            hitCircle.headingMode = Comps.HitCircle_HeadingMode.CHARACTER_POSITION;
            //hitCircle.manualHeading = 0;

            // position effect
            let slashOffsetMag: number = 16;
            let rect: Rect = this.character.getRect();
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
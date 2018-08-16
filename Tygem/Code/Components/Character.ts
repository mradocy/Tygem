/// <reference path="../../Tygem/_ref.ts" />

/// <reference path="TDActor.ts" />

namespace Comps {

    export enum Character_State {
        NONE,

        IDLE,
        WALK,


        // TODO: custom actions defined by functions

        //ACTION_1,
        //ACTION_2,
    }

    export class Character extends TDActor {

        constructor() {
            super();
            this.name = "Character";

            this.componentProperties.requireComponent(TDSpriteRenderer);
        }

        animPrefix: string = "[define animPrefix here]";

        /**
         * If true, facing left will use animations for facing right, but flipped.
         */
        symmetrical: boolean = true;

        canWalk: boolean = true;

        walkSpeed: number = 70;
        walkAccel: number = 500;
        walkFriction: number = 700;

        idle = (): void => {
            this._state = Character_State.IDLE;
            this._time = 0;

            this.updateAnimation();
        }

        faceDirection = (direction: Direction): void => {
            
            this._direction = direction;
            this.idle();
        }



        getState = (): Character_State => {
            return this._state;
        }

        /**
         * Gets the direction the character is facing.
         */
        getDirection = (): Direction => {
            return this._direction;
        }
        
        // Called once for a Component.  Either called when a scene finishes loading, or just before update().
        onStart = (): void => {
            this.health = this.maxHealth;

            this.tdSpriteRenderer = this.getComponent(TDSpriteRenderer);

            this.idle();

        }
        
        // called once per frame, during the update step.  Is not called if the component is disabled.
        onUpdate = (): void => {

            this.updateAnimation();

        }
        
        // called just before the component is destroyed.
        onDestroy = (): void => {
            this.tdSpriteRenderer = null;
        }


        protected updateAnimation = (): void => {

            let anim: string = this.animPrefix;
            let flipped: boolean = false;
            switch (this._state) {
                case Character_State.IDLE:
                    anim += "_idle";
                    break;
                case Character_State.WALK:
                    anim += "_walk";
                    break;
            }
            switch (this._direction) {
                case Direction.NONE:
                    return;
                case Direction.LEFT:
                    if (this.symmetrical) {
                        flipped = true;
                        anim += "_right";
                    } else {
                        anim += "_left";
                    }
                    break;
                case Direction.RIGHT:
                    anim += "_right";
                    break;
                case Direction.UP:
                    anim += "_up";
                    break;
                case Direction.DOWN:
                    anim += "_down";
                    break;
            }

            if (flipped === this.transform.scaleX > 0) {
                this.transform.scaleX *= -1;
            }

            if (this.tdSpriteRenderer.getAnimation() === null ||
                this.tdSpriteRenderer.getAnimation().name !== anim) {
                this.tdSpriteRenderer.playAnimation(anim);
            }

        }
        

        protected tdSpriteRenderer: TDSpriteRenderer = null;

        protected _state: Character_State = Character_State.NONE;
        protected _time: number = 0;
        protected _direction: Direction = Direction.DOWN;

    }

}
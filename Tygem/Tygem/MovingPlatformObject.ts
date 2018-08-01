/// <reference path="_ref.ts" />

namespace Collision {

    export class MovingPlatformObject extends PlatformObject {

        constructor(platform: Platform) {
            super(platform);
            MovingPlatformObject._allMovingPlatformObjects.push(this);
        }

        enable = (): void => {
            this.MovingPlatformObject_enable();
        }
        
        disable = (): void => {
            this.MovingPlatformObject_disable();
        }
        
        /**
         * Attach an actor.
         */
        attachActor = (actor: Actor): void => {
            if (this.attachedActors.indexOf(actor) !== -1) // don't attach if already attached
                return;

            // actors can only be attached to one PlatformObject at a time.  First detach actor from previous PlatformObject if needed.
            if (actor.getAttachedMovingPlatformObject() !== null) {
                actor.getAttachedMovingPlatformObject().detachActor(actor);
            }

            this.attachedActors.push(actor);
            
            // send attach message
            actor.gameObject.sendMessage("onPlatformAttach", this);
            this._platform.gameObject.sendMessage("onPlatformAttach", actor);
        }

        /**
         * Detaches an actor from the platform object.  This sends the onPlatformDetach(movingPlatformObject: Collision.MovingPlatformObject) event to the actor.
         * @param actor the Actor to detach.
         */
        detachActor = (actor: Actor): void => {
            let index: number = this.attachedActors.indexOf(actor);
            if (index !== -1) {
                this.attachedActors.splice(index, 1);
                actor.gameObject.sendMessage("onPlatformDetach", this);
                this._platform.gameObject.sendMessage("onPlatformDetach", actor);
                return;
            }
        }
        
        /**
         * Detaches all actors from the platform object.
         */
        detachAllActors = (): void => {
            while (this.attachedActors.length > 0) {
                this.detachActor(this.attachedActors[this.attachedActors.length - 1]);
            }
        }

        /**
         * Called by Handler.  Fills the given CollisionResponse, describing what happens when this platform moves towards the given actor.
         */
        movingPlatformCollision = (response: Response, stationaryActor: StationaryActor): void => {

            // to be overridden
            response.hit = false;

        }

        /**
         * Called by Handler.  Fills the given newPosition Vec2 with the position the given attached actor should be next frame.
         */
        moveAttachedActor = (newPosition: Vec2, stationaryActor: StationaryActor): void => {

            // can be overridden.  default code moves attached actor the same way the platform moved this frame.
            let diffX: number = this._platform.vx * Game.deltaTime;
            let diffY: number = this._platform.vy * Game.deltaTime;
            newPosition.setValues(
                stationaryActor.pos.x + diffX,
                stationaryActor.pos.y + diffY
            );
        }

        destroy = (): void => {
            this.MovingPlatformObject_destroy();
        }

        protected attachedActors: Array<Actor> = [];

        protected MovingPlatformObject_destroy = (): void => {
            this.detachAllActors();

            let index: number = MovingPlatformObject._allMovingPlatformObjects.indexOf(this);
            if (index != -1) {
                MovingPlatformObject._allMovingPlatformObjects.splice(index, 1);
            }

            this.PlatformObject_destroy();
        }

        protected MovingPlatformObject_enable = (): void => {
            if (this._enabled) return;
            this._enabled = true;
        }

        protected MovingPlatformObject_disable = (): void => {
            if (!this._enabled) return;
            this._enabled = false;
            this.detachAllActors();
        }

        static _allMovingPlatformObjects: Array<MovingPlatformObject> = [];

    }
}
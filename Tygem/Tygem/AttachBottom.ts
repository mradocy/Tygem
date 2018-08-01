/// <reference path="_ref.ts" />

/**
 * Will automatically attach the bottom of the actor to the top of moving platform objects.
 */
class AttachBottom extends Component {

    constructor() {
        super();
        this.name = "AttachBottom";
        this.componentProperties.requireComponent(Actor);
    }
        
    onStart = (): void => {
        this.actor = this.getComponent(Actor);
    }

    onUpdate = (): void => {
            

    }

    onCollisionEnter = (response: Collision.Response): void => {
        
        if (!this.isEnabled()) return;

        if (response.platformObject instanceof Collision.MovingPlatformObject) {
            if (response.getNormalDirection() === Direction.UP) {
                // attach actor
                let mpo: Collision.MovingPlatformObject = response.platformObject as Collision.MovingPlatformObject;
                mpo.attachActor(this.actor);
            }
        }

    }
    
    onCollisionExit = (response: Collision.Response): void => {
        
        if (this.actor.getAttachedMovingPlatformObject() === null) return;
        
        if (response.platformObject instanceof Collision.MovingPlatformObject) {
            let mpo: Collision.MovingPlatformObject = response.platformObject as Collision.MovingPlatformObject;
            if (mpo === this.actor.getAttachedMovingPlatformObject()) {
                // detach actor
                mpo.detachActor(this.actor);
            }
        }
        
    }
        

    private actor: Actor;

}


/// <reference path="_ref.ts" />

/**
 * Platform is a Component containing PlatformObjects
 */
/**
 * - Platform is a Component containing PlatformObjects.
 * - PlatformObjects only collide with Actor.
 *
 * Messages received:

    // called when an Actor first begins colliding with a PlatformObject.  Note this can be called for different PlatformObjects belonging to the same Platform.
    onCollisionEnter = (response: Collision.Response): void => { }

    // called every frame the Actor collides with a PlatformObject.
    onCollisionStay = (response: Collision.Response): void => { }
    
    // called when an Actor stops colliding with a PlatformObject.
    onCollisionExit = (response: Collision.Response): void => { }
    
    // called when an Actor is attached from a MovingPlatformObject belonging to this Platform.
    onPlatformAttach = (actor: Actor): void => { }
    
    // called when an Actor is detached from a MovingPlatformObject belonging to this Platform.
    onPlatformDetach = (actor: Actor): void => { }

 */
class Platform extends Component {

    constructor() {
        super();
        this.name = "Platform";
        this.componentProperties.only1 = true;
        this.componentProperties.excludeComponent(Actor);
    }
    
    onAwake = (): void => {
        Platform.allPlatforms.push(this);
    }

    /**
     * Gets position of this transform in the global space.
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    getGlobalPosition = (outPos: Vec2 = null): Vec2 => {
        return this.transform.getGlobalPosition(outPos);
    }

    /**
     * Sets position of this transform in the global space.
     */
    setGlobalPosition = (x: number, y: number): void => {
        this.transform.setGlobalPosition(x, y);
    }
    
    /**
     * velocity x 
     */
    vx: number = 0;
    /**
     * velocity y
     */
    vy: number = 0;

    /**
     * Sets velocity such that the platform will be in the given position when the frame ends.
     */
    setVelocityForNextPosition = (x: number, y: number): void => {
        if (Game.deltaTime < .0001) {
            this.setGlobalPosition(x, y);
            return;
        }
        this.getGlobalPosition(this.tempVec2);
        this.vx = (x - this.tempVec2.x) / Game.deltaTime;
        this.vy = (y - this.tempVec2.y) / Game.deltaTime;
    }

    /**
     * Sets the collision layers for each PlatformObject belonging to this Platform.
     */
    setCollisionLayers = (collisionLayers: number): void => {
        this.platformObjects.forEach(
            function (platformObject: Collision.PlatformObject): void {
                platformObject.collisionLayers = collisionLayers;
            }
        );
    }
    
    onDestroy = (): void => {
        // clear platformObjects
        this.platformObjects.forEach(
            function (platformObject: Collision.PlatformObject): void {
                platformObject.destroy();
            }
        );
        this.platformObjects.splice(0);

        // remove from allPlatforms
        let index: number = Platform.allPlatforms.indexOf(this);
        if (index !== -1) {
            Platform.allPlatforms.splice(index, 1);
        }

    }

    /**
     * Calls forEach() on all the platforms.
     * @param callbackFn Function to call on all the platforms.
     */
    static forEach(callbackFn: (Platform: Platform) => void): void {
        Platform.allPlatforms.forEach(callbackFn);
    }

    protected platformObjects: Array<Collision.PlatformObject> = [];

    private tempVec2: Vec2 = new Vec2();

    private static allPlatforms: Array<Platform> = [];


}


/// <reference path="_ref.ts" />

/**
 * - Actors are things that move around in the world.
 * - Actors only collide with PlatformObjects.
 * - Do not override Actor.
 *
 * Messages received:

    // called when an Actor first begins colliding with a PlatformObject.  Note this can be called for different PlatformObjects belonging to the same Platform.
    onCollisionEnter = (response: Collision.Response): void => { }

    // called every frame the Actor collides with a PlatformObject.
    onCollisionStay = (response: Collision.Response): void => { }
    
    // called when an Actor stops colliding with a PlatformObject.
    onCollisionExit = (response: Collision.Response): void => { }
    
    // called when an Actor is attached from a MovingPlatformObject.
    onPlatformAttach = (movingPlatformObject: Collision.MovingPlatformObject): void => { }
    
    // called when an Actor is detached from a MovingPlatformObject.
    onPlatformDetach = (movingPlatformObject: Collision.MovingPlatformObject): void => { }
    
    // called when an Actor would be crushed between 2 PlatformObjects.  (Crush detections not working)
    onCollisionCrush = (crush: Collision.Crush): void => { }
    
 */

class Actor extends ReceivesDamage {

    constructor() {
        super();
        this.name = "Actor";
        this.componentProperties.only1 = true;
        this.componentProperties.excludeComponent(Platform);
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
     * Collision.gravity accel is multiplied by this before being added to actor's velocity.
     */
    gravityScale: number = 1;

    /**
     * Extra x velocity from the wind.
     */
    windX: number = 0;
    /**
     * Extra y velocity from the wind.
     */
    windY: number = 0;

    offsetX: number = 0;

    offsetY: number = 0;

    halfWidth: number = 0;

    halfHeight: number = 0;

    /**
     * Quickly sets the offsetX, offsetY, halfWidth, halfHeight properties of this Actor.
     * Meant for initialization.
     */
    setBounds = (offsetX: number, offsetY: number, halfWidth: number, halfHeight: number): void => {
        this.Actor_setBounds(offsetX, offsetY, halfWidth, halfHeight);
    }
    protected Actor_setBounds = (offsetX: number, offsetY: number, halfWidth: number, halfHeight: number): void => {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.halfWidth = halfWidth;
        this.halfHeight = halfHeight;
    }
    
    getRect(outRect: Rect = null): Rect {

        this.getGlobalPosition(this.tempVec2);
        let x: number = this.tempVec2.x;
        let y: number = this.tempVec2.y;

        if (outRect === null) {
            let ret: Rect = new Rect(
                x + this.offsetX - this.halfWidth,
                y + this.offsetY - this.halfHeight,
                this.halfWidth * 2,
                this.halfHeight * 2
            );
            return ret;
        }

        outRect.x = x + this.offsetX - this.halfWidth;
        outRect.y = y + this.offsetY - this.halfHeight;
        outRect.width = this.halfWidth * 2;
        outRect.height = this.halfHeight * 2;
        return null;
    }

    /**
     * Determines how an Actor is repositioned upon hitting a platform.
     * When false, Actors will stop immediately when hitting a platform.
     */
    projectCollision: boolean = true;

    /**
     * When true, automatically sets x/y velocity to 0 upon hitting a horizontal/vertical wall.
     */
    zeroVelocityOnCollision: boolean = true;
    
    /**
     * This actor's gameObject will be sent onCollisionCrush events if the angle (degrees) between collision normals is more than this amount.
     */
    crushAngleThreshold: number = 91;
    
    /**
     * Angle (in degrees) of the diagonal of the dimensions
     */
    getDimensionRatioAngle = (): number => {
        return Math.atan2(this.halfHeight, this.halfWidth) * M.radToDeg;
    }
    
    /**
     * A reference to the MovingPlatformObject this Actor is attached to, or null if isn't attached to a MovingPlatformObject.  Actors can only be attached to one platform at a time.
     */
    getAttachedMovingPlatformObject = (): Collision.MovingPlatformObject => {
        return this.attachedMovingPlatformObject;
    }

    /**
     * The bits of this integer represent the layers this Actor will collide with.
     * "I will collide with".
     */
    collisionMask: number = 0x7FFFFFFF;
    
    
    /**
     * Performs a raycast.
     * @param raycastHit put the results of the raycast here, rather than allocating a new RaycastHit.
     * @param origin origin of the ray being cast.
     * @param direction normalized direction of the ray being cast.
     * @param distance distance of the ray being cast.
     * @param teamMask collision will be detected only if this actor is included in this team.
     */
    raycast = (raycastHit: Collision.RaycastHit, origin: Vec2, direction: Vec2, distance: number = Number.POSITIVE_INFINITY, teamMask: Team = Team.ALL): void => {

        if (!this.isInTeam(teamMask)) {
            raycastHit.hit = false;
            return;
        }
        
        let pos: Vec2 = this.tempVec2;
        this.getGlobalPosition(pos);

        let left: number = pos.x + this.offsetX - this.halfWidth;
        let top: number = pos.y + this.offsetY - this.halfHeight;
        let right: number = pos.x + this.offsetX + this.halfWidth;
        let bottom: number = pos.y + this.offsetY + this.halfHeight;

        // do not consider a hit if ray starts inside the actor
        if (left < origin.x && origin.x < right &&
            top < origin.y && origin.y < bottom) {
            raycastHit.hit = false;
            return;
        }

        let vertTime: number = -1;
        let horizTime: number = -1;

        if (direction.y < 0) {
            // going up, hitting bottom side
            vertTime = M.rayHorizontalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, bottom, left, right, distance);
        } else if (direction.y > 0) {
            // going down, hitting top side
            vertTime = M.rayHorizontalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, top, left, right, distance);
        }
        if (direction.x < 0) {
            // going left, hitting right side
            horizTime = M.rayVerticalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, right, top, bottom, distance);
        } else if (direction.x > 0) {
            // going right, hitting left side
            horizTime = M.rayVerticalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, left, top, bottom, distance);
        }
        
        let time: number = -1;
        if (horizTime != -1 && (vertTime == -1 || horizTime <= vertTime)) {
            // hit horizontal wall
            time = horizTime;
            if (direction.x > 0) {
                raycastHit.normal.setValues(-1, 0);
            } else {
                raycastHit.normal.setValues(1, 0);
            }
        } else if (vertTime != -1 && (horizTime == -1 || vertTime <= horizTime)) {
            // hit vertical wall
            time = vertTime;
            if (direction.y > 0) {
                raycastHit.normal.setValues(0, -1);
            } else {
                raycastHit.normal.setValues(0, 1);
            }
        } else {
            // didn't hit anything
            raycastHit.hit = false;
            return;
        }

        // fill rest of raycastHit
        raycastHit.hit = true;
        raycastHit.actor = this;
        raycastHit.t = time;
        raycastHit.point.setValues(origin.x + direction.x * time, origin.y + direction.y * time);
        
    }

    /**
     * Returns if the given rectangle overlaps with this actor.
     */
    rectOverlaps = (rect: Rect, teamMask: Team = Team.ALL): boolean => {

        if (!this.isInTeam(teamMask)) {
            return false;
        }
        
        this.getRect(this.tempRect);
        return rect.overlaps(this.tempRect);
    }
    
    
    /**
     * Called when a Component is added to a GameObject.  Adds Actor to the list containing all Actors.
     */
    onAwake = (): void => {
        Actor.allActors.push(this);
    }

    onStart = (): void => {
        this.health = this.maxHealth;
    }

    onUpdate = (): void => { }

    onEnable = (): void => { }

    onDisable = (): void => {
        // detach from platform
        if (this.attachedMovingPlatformObject != null) {
            this.attachedMovingPlatformObject.detachActor(this);
        }
    }

    onPlatformAttach = (movingPlatformObject: Collision.MovingPlatformObject): void => {
        this.attachedMovingPlatformObject = movingPlatformObject;
    }

    onPlatformDetach = (movingPlatformObject: Collision.MovingPlatformObject): void => {
        this.attachedMovingPlatformObject = null;
    }

    /**
     * Removes this actor from the list of all actors.
     */
    onDestroy = (): void => {
        // detach from platform
        if (this.attachedMovingPlatformObject != null) {
            this.attachedMovingPlatformObject.detachActor(this);
        }
        let index: number = Actor.allActors.indexOf(this);
        if (index === -1) return;
        Actor.allActors.splice(index, 1);
    }



    /**
     * Calls forEach() on all the actors.
     * @param callbackFn Function to call on all the actors.
     */
    static forEach(callbackFn: (actor: Actor) => void): void {
        Actor.allActors.forEach(callbackFn);
    }




    private attachedMovingPlatformObject: Collision.MovingPlatformObject = null;

    protected tempVec2: Vec2 = new Vec2();
    protected tempRect: Rect = new Rect();
    private static allActors: Array<Actor> = [];


}


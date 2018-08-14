/// <reference path="_ref.ts" />

namespace Collision {

    export class PlatformObject {

        constructor(platform: Platform) {
            this._platform = platform;
            PlatformObject._allPlatformObjects.push(this);
        }

        /**
         * Gets the Platform this PlatformObject belongs to.
         */
        getPlatform = (): Platform => {
            return this._platform;
        }

        /**
         * Gets position of this PlatformObject, which is the global position of the transform of the gameObject of the Platform component it belongs to.
         * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
         */
        getPosition = (outPos: Vec2 = null): Vec2 => {
            return this._platform.transform.getGlobalPosition(outPos);
        }

        /**
         * PlatformObjects that aren't enabled won't be considered for collision.
         */
        isEnabled = (): boolean => {
            return this._enabled;
        }

        enable = () => {
            this._enabled = true;
        }

        disable = () => {
            this._enabled = false;
        }

        /**
         * The bits of this integer represent the layers this PlatformObject will collide with.
         * "I am a"
         */
        collisionLayers: number = 0x1;

        /**
         * Called by Handler.  Fills the given CollisionResponse, describing what happens when the given actor moves toward it.
         * This assumes platformObject's position after movement.
         */
        movingActorCollision = (response: Response, movingActor: MovingActor, projectCollision: boolean): void => {

            // to be overridden
            response.hit = false;

        }
        
        /**
         * Performs a raycast.
         * @param raycastHit put the results of the raycast here, rather than allocating a new RaycastHit.
         * @param origin origin of the ray being cast.
         * @param direction normalized direction of the ray being cast.
         * @param distance distance of the ray being cast.
         * @param collisionMask Bits representing the collision layers the ray will collide with.  Default is 0x7FFFFFFF.
         */
        raycast = (raycastHit: RaycastHit, origin: Vec2, direction: Vec2, distance: number = Number.POSITIVE_INFINITY, collisionMask: number = 0x7FFFFFFF): void => {

            // to be overridden
            raycastHit.hit = false;

        }

        /**
         * Returns if the given rectangle overlaps with this platform object.
         */
        rectOverlaps = (rect: Rect, collisionMask: number = 0x7FFFFFFF): boolean => {

            // to be overridden
            return false;
        }

        /**
         * Removes references, self from allPlatformObjects.
         */
        destroy = (): void => {
            this.PlatformObject_destroy();
        }

        protected PlatformObject_destroy = (): void => {
            let index: number = PlatformObject._allPlatformObjects.indexOf(this);
            if (index != -1) {
                PlatformObject._allPlatformObjects.splice(index, 1);
            }
            this._platform = null;
        }

        /**
         * Calls forEach() on all the platform objects.
         * @param callbackFn Function to call on all the platform objects.
         */
        static forEach(callbackFn: (platformObject: PlatformObject) => void): void {
            PlatformObject._allPlatformObjects.forEach(callbackFn);
        }


        protected _platform: Platform = null;
        protected _enabled: boolean = true;
        protected tempVec2: Vec2 = new Vec2();
        protected tempRect: Rect = new Rect();

        static _allPlatformObjects: Array<PlatformObject> = [];

    }

}
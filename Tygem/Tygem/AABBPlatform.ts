/// <reference path="_ref.ts" />

class AABBPlatform extends Platform {

    constructor() {
        super();
        this.name = "AABBPlatform";
        this.platformObject = new Collision.AABBPlatformObject(this);
        this.platformObjects.push(this.platformObject);
    }

    /**
     * Sets dimensions of the AABBPlatformObject.
     */
    setAABB = (offsetX: number, offsetY: number, halfWidth: number, halfHeight: number): void => {
        this.platformObject.offsetX = offsetX;
        this.platformObject.offsetY = offsetY;
        this.platformObject.halfWidth = halfWidth;
        this.platformObject.halfHeight = halfHeight;
    }

    

    platformObject: Collision.AABBPlatformObject = null;

}
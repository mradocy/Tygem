/// <reference path="_ref.ts" />

namespace Collision {

    export class AABBPlatformObject extends MovingPlatformObject {

        constructor(platform: Platform) {
            super(platform);
        }

        offsetX: number = 0;
        offsetY: number = 0;
        halfWidth: number = 0;
        halfHeight: number = 0;
        
        
        
        /**
         * Gets x coordinate of the left edge of the AABB.
         */
        getLeft = (): number => {
            this.getPosition(this.tempVec2);
            return this.tempVec2.x + this.offsetX - this.halfWidth;
        }        
        /**
         * Gets x coordinate of the right edge of the AABB.
         */
        getRight = (): number => {
            this.getPosition(this.tempVec2);
            return this.tempVec2.x + this.offsetX + this.halfWidth;
        }
        /**
         * Gets y coordinate of the top edge of the AABB.
         */
        getTop = (): number => {
            this.getPosition(this.tempVec2);
            return this.tempVec2.y + this.offsetY - this.halfHeight;
        }
        /**
         * Gets y coordinate of the bottom edge of the AABB.
         */
        getBottom = (): number => {
            this.getPosition(this.tempVec2);
            return this.tempVec2.y + this.offsetY + this.halfHeight;
        }

        /**
         * Gets Rect defining the bounds of this AABBPlatformObject.
         * @param outRect If given, this Rect will be filled instead of creating a new Rect (and null will be returned instead).
         */
        getRect = (outRect: Rect): Rect => {
            this.getPosition(this.tempVec2);
            if (outRect == null) {
                return new Rect(
                    this.tempVec2.x + this.offsetX - this.halfWidth,
                    this.tempVec2.y + this.offsetY - this.halfHeight,
                    this.halfWidth * 2,
                    this.halfHeight * 2
                );
            } else {
                outRect.setValues(
                    this.tempVec2.x + this.offsetX - this.halfWidth,
                    this.tempVec2.y + this.offsetY - this.halfHeight,
                    this.halfWidth * 2,
                    this.halfHeight * 2
                );
            }
        }
        

        /**
         * Called by Handler.  Fills the given CollisionResponse, describing what happens when the given actor moves toward it.
         * This assumes platformObject's position after movement.
         */
        movingActorCollision = (response: Response, movingActor: MovingActor, projectCollision: boolean): void => {

            response.hit = false;
            response.actor = movingActor.actor;
            response.platformObject = this;

            this.getRect(this.tempRect);
            let left: number = this.tempRect.x + this._platform.vx * Game.deltaTime;
            let top: number = this.tempRect.y + this._platform.vy * Game.deltaTime;
            let right: number = this.tempRect.x + this.tempRect.width + this._platform.vx * Game.deltaTime;
            let bottom: number = this.tempRect.y + this.tempRect.height + this._platform.vy * Game.deltaTime;

            let aDiffX: number = movingActor.pos1.x - movingActor.pos0.x;
            let aDiffY: number = movingActor.pos1.y - movingActor.pos0.y;
            let aLeft: number = movingActor.pos0.x + movingActor.offset.x - movingActor.halfWidth;
            let aRight: number = movingActor.pos0.x + movingActor.offset.x + movingActor.halfWidth;
            let aTop: number = movingActor.pos0.y + movingActor.offset.y - movingActor.halfHeight;
            let aBottom: number = movingActor.pos0.y + movingActor.offset.y + movingActor.halfHeight;

            let EPSILON: number = .0001;
            
            if (aDiffX > 0) {
                // test actor moving right to hit left side
                let t: number = (left - aRight) / aDiffX - EPSILON;
                if (-EPSILON < t && t <= 1) {
                    if (aTop + aDiffY * t <= bottom + EPSILON &&
                        aBottom + aDiffY * t >= top - EPSILON) {
                        // confirmed hit
                        response.hit = true;
                        response.time = t;
                        response.normal.setValues(-1, 0);
                        response.point.setValues(
                            left,
                            (Math.max(aTop + aDiffY * t, top) + Math.min(aBottom + aDiffY * t, bottom)) / 2
                        );
                        // bullet reposition
                        response.reposition.setValues(
                            movingActor.pos0.x + aDiffX * t - EPSILON * 2,
                            movingActor.pos0.y + aDiffY * t
                        );
                        // project reposition
                        if (projectCollision) {
                            response.repositionProject.setValues(
                                left - movingActor.offset.x - movingActor.halfWidth - EPSILON * 2,
                                movingActor.pos1.y
                            );
                            response.type = ResponseType.PROJECT;
                        } else {
                            response.type = ResponseType.BULLET;
                        }
                        return;
                    }
                }

            } else if (aDiffX < 0) {
                // test actor moving left to hit right side
                let t: number = (right - aLeft) / aDiffX - EPSILON;
                if (-EPSILON < t && t <= 1) {
                    if (aTop + aDiffY * t <= bottom + EPSILON &&
                        aBottom + aDiffY * t >= top - EPSILON) {
                        // confirmed hit
                        response.hit = true;
                        response.time = t;
                        response.normal.setValues(1, 0);
                        response.point.setValues(
                            right,
                            (Math.max(aTop + aDiffY * t, top) + Math.min(aBottom + aDiffY * t, bottom)) / 2
                        );
                        // bullet reposition
                        response.reposition.setValues(
                            movingActor.pos0.x + aDiffX * t + EPSILON * 2,
                            movingActor.pos0.y + aDiffY * t
                        );
                        // project reposition
                        if (projectCollision) {
                            response.repositionProject.setValues(
                                right - movingActor.offset.x + movingActor.halfWidth + EPSILON * 2,
                                movingActor.pos1.y
                            );
                            response.type = ResponseType.PROJECT;
                        } else {
                            response.type = ResponseType.BULLET;
                        }
                        return;
                    }
                }

            }


            if (aDiffY > 0) {
                // test actor moving down to hit top side
                let t: number = (top - aBottom) / aDiffY - EPSILON;
                if (-EPSILON < t && t <= 1) {
                    if (aLeft + aDiffX * t <= right + EPSILON &&
                        aRight + aDiffX * t >= left - EPSILON) {
                        // confirmed hit
                        response.hit = true;
                        response.time = t;
                        response.normal.setValues(0, -1);
                        response.point.setValues(
                            (Math.max(aLeft + aDiffX * t, left) + Math.min(aRight + aDiffX * t, right)) / 2,
                            top
                        );
                        // bullet reposition
                        response.reposition.setValues(
                            movingActor.pos0.x + aDiffX * t,
                            movingActor.pos0.y + aDiffY * t - EPSILON * 2
                        );
                        // project reposition
                        if (projectCollision) {
                            response.repositionProject.setValues(
                                movingActor.pos1.x,
                                top - movingActor.offset.y - movingActor.halfHeight - EPSILON * 2
                            );
                            response.type = ResponseType.PROJECT;
                        } else {
                            response.type = ResponseType.BULLET;
                        }
                        return;
                    }
                }

            } else if (aDiffY < 0) {
                // test actor moving up to hit bottom side
                let t: number = (bottom - aTop) / aDiffY - EPSILON;
                if (-EPSILON < t && t <= 1) {
                    if (aLeft + aDiffX * t <= right + EPSILON &&
                        aRight + aDiffX * t >= left - EPSILON) {
                        // confirmed hit
                        response.hit = true;
                        response.time = t;
                        response.normal.setValues(0, 1);
                        response.point.setValues(
                            (Math.max(aLeft + aDiffX * t, left) + Math.min(aRight + aDiffX * t, right)) / 2,
                            bottom
                        );
                        // bullet reposition
                        response.reposition.setValues(
                            movingActor.pos0.x + aDiffX * t,
                            movingActor.pos0.y + aDiffY * t + EPSILON * 2
                        );
                        // project reposition
                        if (projectCollision) {
                            response.repositionProject.setValues(
                                movingActor.pos1.x,
                                bottom - movingActor.offset.y + movingActor.halfHeight + EPSILON * 2
                            );
                            response.type = ResponseType.PROJECT;
                        } else {
                            response.type = ResponseType.BULLET;
                        }
                        return;
                    }
                }

            }

            //// test for actor intersecting ("discrete" collision)
            //bool intersectCollision = false; // should be true
            //if (intersectCollision) {
            //    Shape.AABB actorBox = Handler.movingActorPos1BoundingBox(movingActor);
            //    if (Shape.intersects(actorBox, currentBoundingBox)) {
            //        // pos1 of actor intersects this platform, reposition it somewhere

            //        colResp.type = Handler.CollisionResponse.Type.INTERSECT;

            //        float ax = movingActor.pos1.x + movingActor.offset.x;
            //        float ay = movingActor.pos1.y + movingActor.offset.y;

            //        bool preferRight = ax > center.x; // prefer repositioning right if actor is more to the right
            //        bool preferUp = ay > center.y; // prefer repositioning up if actor is more above
            //        bool preferHoriz = (halfWidth - Mathf.Abs(ax - center.x)) < (halfHeight - Mathf.Abs(ay - center.y)); // prefer horizontal reposition or vertical reposition

            //        if (preferHoriz) {
            //            if (preferRight) {
            //                // reposition to right
            //                colResp.time = 0;
            //                colResp.normal = new Vector2(1, 0);
            //                colResp.point = new Vector2(right,
            //                    (Mathf.Max(aBottom + aDiff.y, bottom) + Mathf.Min(aTop + aDiff.y, top)) / 2);
            //                colResp.reposition = new Vector2(right - movingActor.offset.x + movingActor.halfWidth, movingActor.pos1.y);
            //                colResp.reposition.x += EPSILON * 2;
            //                return colResp;
            //            } else {
            //                // reposition to left
            //                colResp.time = 0;
            //                colResp.normal = new Vector2(-1, 0);
            //                colResp.point = new Vector2(left,
            //                    (Mathf.Max(aBottom + aDiff.y, bottom) + Mathf.Min(aTop + aDiff.y, top)) / 2);
            //                colResp.reposition = new Vector2(left - movingActor.offset.x - movingActor.halfWidth, movingActor.pos1.y);
            //                colResp.reposition.x -= EPSILON * 2;
            //                return colResp;
            //            }
            //        } else {
            //            if (preferUp) {
            //                // reposition above
            //                colResp.time = 0;
            //                colResp.normal = new Vector2(0, 1);
            //                colResp.point = new Vector2(
            //                    (Mathf.Max(aLeft + aDiff.x, left) + Mathf.Min(aRight + aDiff.x, right)) / 2,
            //                    top);
            //                colResp.reposition = new Vector2(movingActor.pos1.x, top - movingActor.offset.y + movingActor.halfHeight);
            //                colResp.reposition.y += EPSILON * 2;
            //                return colResp;
            //            } else {
            //                // reposition below
            //                colResp.time = 0;
            //                colResp.normal = new Vector2(0, -1);
            //                colResp.point = new Vector2(
            //                    (Mathf.Max(aLeft + aDiff.x, left) + Mathf.Min(aRight + aDiff.x, right)) / 2,
            //                    top);
            //                colResp.reposition = new Vector2(movingActor.pos1.x, bottom - movingActor.offset.y - movingActor.halfHeight);
            //                colResp.reposition.y -= EPSILON * 2;
            //                return colResp;
            //            }
            //        }

            //    }

            //}
            
        }

        /**
         * Called by Handler.  Fills the given CollisionResponse, describing what happens when this platform moves towards the given actor.
         */
        movingPlatformCollision = (response: Response, stationaryActor: StationaryActor): void => {

            if (this._platform.vx === 0 && this._platform.vy === 0) return;

            response.hit = false;
            response.actor = stationaryActor.actor;
            response.platformObject = this;
            response.type = ResponseType.MOVING_PLATFORM;

            this.getRect(this.tempRect);
            let left: number = this.tempRect.x;
            let top: number = this.tempRect.y;
            let right: number = this.tempRect.x + this.tempRect.width;
            let bottom: number = this.tempRect.y + this.tempRect.height;
            let diffX: number = this._platform.vx * Game.deltaTime;
            let diffY: number = this._platform.vy * Game.deltaTime;
            
            let aLeft: number = stationaryActor.pos.x + stationaryActor.offset.x - stationaryActor.halfWidth;
            let aRight: number = stationaryActor.pos.x + stationaryActor.offset.x + stationaryActor.halfWidth;
            let aTop: number = stationaryActor.pos.y + stationaryActor.offset.y - stationaryActor.halfHeight;
            let aBottom: number = stationaryActor.pos.y + stationaryActor.offset.y + stationaryActor.halfHeight;
            

            let EPSILON: number = .0001;
            let t: number = 0;

            if (diffX > 0) {
                // platform moving right to hit left of actor
                t = (aLeft - right) / diffX;
                if (-EPSILON < t && t <= 1) {
                    if (top + diffY * t <= aBottom + EPSILON &&
                        bottom + diffY * t >= aTop - EPSILON) {
                        // confirmed hit
                        response.hit = true;
                        response.time = t;
                        response.normal.setValues(1, 0);
                        response.point.setValues(
                            right + diffX,
                            (Math.max(top + diffY * t, aTop) + Math.min(bottom + diffY * t, aBottom)) / 2
                        );
                        response.reposition.setValues(
                            right + diffX - stationaryActor.offset.x + stationaryActor.halfWidth + EPSILON * 2,
                            stationaryActor.pos.y
                        );
                        return;
                    }
                }
            } else if (diffX < 0) {
                // platform moving left to hit right of actor
                t = (aRight - left) / diffX;
                if (-EPSILON < t && t <= 1) {
                    if (top + diffY * t <= aBottom + EPSILON &&
                        bottom + diffY * t >= aTop - EPSILON) {
                        // confirmed hit
                        response.hit = true;
                        response.time = t;
                        response.normal.setValues(-1, 0);
                        response.point.setValues(
                            left + diffX,
                            (Math.max(top + diffY * t, aTop) + Math.min(bottom + diffY * t, aBottom)) / 2
                        );
                        response.reposition.setValues(
                            left + diffX - stationaryActor.offset.x - stationaryActor.halfWidth - EPSILON * 2,
                            stationaryActor.pos.y
                        );
                        return;
                    }
                }
            }

            if (diffY > 0) {
                // platform moving down to hit top of actor
                t = (aTop - bottom) / diffY;
                if (-EPSILON < t && t <= 1) {
                    if (left + diffX * t <= aRight + EPSILON &&
                        right + diffX * t >= aLeft - EPSILON) {
                        // confirmed hit
                        response.hit = true;
                        response.time = t;
                        response.normal.setValues(0, 1);
                        response.point.setValues(
                            (Math.max(left + diffX * t, aLeft) + Math.min(right + diffX * t, aRight)) / 2,
                            bottom + diffY
                        );
                        response.reposition.setValues(
                            stationaryActor.pos.x,
                            bottom + diffY - stationaryActor.offset.y + stationaryActor.halfHeight + EPSILON * 2
                        );
                        return;
                    }
                }
            } else if (diffY < 0) {
                // platform moving up to hit bottom of actor
                t = (aBottom - top) / diffY;
                if (-EPSILON < t && t <= 1) {
                    if (left + diffX * t <= aRight + EPSILON &&
                        right + diffX * t >= aLeft - EPSILON) {
                        // confirmed hit
                        response.hit = true;
                        response.time = t;
                        response.normal.setValues(0, -1);
                        response.point.setValues(
                            (Math.max(left + diffX * t, aLeft) + Math.min(right + diffX * t, aRight)) / 2,
                            top + diffY
                        );
                        response.reposition.setValues(
                            stationaryActor.pos.x,
                            top + diffY - stationaryActor.offset.y - stationaryActor.halfHeight - EPSILON * 2
                        );
                        return;
                    }
                }
            }


        }

        /**
         * Performs a raycast.
         * @param raycastHit put the results of the raycast here, rather than allocating a new RaycastHit.
         * @param origin origin of the ray being cast.
         * @param direction normalized direction of the ray being cast.
         * @param distance distance of the ray being cast.
         * @param collisionMask Bits representing the collision layers the ray will collide with.  Default is 0x7FFFFFFF.
         */
        raycast = (raycastHit: Collision.RaycastHit, origin: Vec2, direction: Vec2, distance: number = Number.POSITIVE_INFINITY, collisionMask: number = 0x7FFFFFFF): void => {

            // return immediately if collision mask won't collide with this' collision layers.
            if (!Collision.maskCollidesWithLayers(collisionMask, this.collisionLayers)) {
                raycastHit.hit = false;
                return;
            }

            let pos: Vec2 = this.tempVec2;

            let left: number = this.getLeft();
            let top: number = this.getTop();
            let right: number = this.getRight();
            let bottom: number = this.getBottom();

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
            raycastHit.platformObject = this;
            raycastHit.t = time;
            raycastHit.point.setValues(origin.x + direction.x * time, origin.y + direction.y * time);
        }

        /**
         * Returns if the given rectangle overlaps with this platform object.
         */
        rectOverlaps = (rect: Rect, collisionMask: number = 0x7FFFFFFF): boolean => {

            if (!Collision.maskCollidesWithLayers(collisionMask, this.collisionLayers))
                return false;

            this.getRect(this.tempRect);
            return rect.overlaps(this.tempRect);

        }


        
    }

    

}
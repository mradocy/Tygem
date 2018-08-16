/// <reference path="_ref.ts" />

enum Direction {
    NONE,
    RIGHT,
    DOWN,
    LEFT,
    UP
}

namespace Collision {

    /**
     * Gravity acceleration in the x direction.  Affects Actor movement.
     */
    export let gravityX: number = 0;
    /**
     * Gravity acceleration in the y direction.  Affects Actor movement.
     */
    export let gravityY: number = 600;


    export class RaycastHit {
        /**
         * Whether or not the ray hit something.
         */
        hit: boolean = false;
        actor: Actor = null;
        platformObject: PlatformObject = null;
        
        /**
         * Point in global space where the ray hit the object.
         */
        point: Vec2 = new Vec2();
        /**
         * raycast origin + raycast direction * t = point
         */
        t: number = 0;
        /**
         * The (normalized) normal vector of the surface hit by the ray.
         */
        normal: Vec2 = new Vec2();

        /**
         * Clones this RaycastHit.
         */
        clone = (): RaycastHit => {
            let ret: RaycastHit = new RaycastHit();
            ret.setRaycastHit(this);
            return ret;
        }
        
        /**
         * Sets these values to match the values of the given RaycastHit.
         */
        setRaycastHit = (raycastHit: RaycastHit): void => {
            this.hit = raycastHit.hit;
            this.actor = raycastHit.actor;
            this.platformObject = raycastHit.platformObject;
            this.point.setValues(raycastHit.point.x, raycastHit.point.y);
            this.t = raycastHit.t;
            this.normal.setValues(raycastHit.normal.x, raycastHit.normal.y);
        }

    }

    export function raycastAllActorsNonAlloc(raycastHit: Collision.RaycastHit, originX: number, originY: number, directionX: number, directionY: number, distance: number = Number.POSITIVE_INFINITY, teamMask: Team = Team.ALL): void {

        raycastHit.hit = false;
        raycastHit.t = Number.MAX_VALUE;

        tempOrigin.setValues(originX, originY);
        tempDirection.setValues(directionX, directionY);

        Actor.forEach(
            function (actor: Actor): void {
                tempRaycastHit.hit = false;
                actor.raycast(tempRaycastHit, tempOrigin, tempDirection, distance, teamMask);
                if (tempRaycastHit.hit && tempRaycastHit.t < raycastHit.t) {
                    // hit actor and before last hit actor
                    raycastHit.setRaycastHit(tempRaycastHit);
                }
            }
        );
        
    }

    export function raycastAllPlatformObjectsNonAlloc(raycastHit: Collision.RaycastHit, originX: number, originY: number, directionX: number, directionY: number, distance: number = Number.POSITIVE_INFINITY, collisionMask: number = 0x7FFFFFFF): void {

        raycastHit.hit = false;
        raycastHit.t = Number.MAX_VALUE;

        tempOrigin.setValues(originX, originY);
        tempDirection.setValues(directionX, directionY);

        PlatformObject.forEach(
            function (platformObject: PlatformObject): void {
                tempRaycastHit.hit = false;
                if (Collision.maskCollidesWithLayers(collisionMask, platformObject.collisionLayers)) {
                    platformObject.raycast(tempRaycastHit, tempOrigin, tempDirection, distance, collisionMask);
                    if (tempRaycastHit.hit && tempRaycastHit.t < raycastHit.t) {
                        // hit platform object and before last hit platform object
                        raycastHit.setRaycastHit(tempRaycastHit);

                    }
                }
            }
        );
        
    }

    /**
     * Fills the given platformObjects array with all the platformObjects the given rect overlaps.
     * Note that since actors are repositioned with a tiny bit of space between them and the platform they collided with,
     * an actor's rect should not be overlapping with the platform it collided with.
     * @param platformObjects Out parameter that will be filled with PlatformObjects.
     * @param rect The rectangle to test.
     * @param collisionMask Collision mask to filter collision.
     */
    export function rectOverlapAllPlatformObjectsNonAlloc(platformObjects: Array<PlatformObject>, rect: Rect, collisionMask: number = 0x7FFFFFFF): void {

        platformObjects.splice(0);

        PlatformObject.forEach(
            function (platformObject: PlatformObject): void {
                if (Collision.maskCollidesWithLayers(collisionMask, platformObject.collisionLayers)) {
                    if (platformObject.rectOverlaps(rect, collisionMask)) {
                        platformObjects.push(platformObject);
                    }
                }
            }
        );

    }

    /**
     * Fills the given actors array with all the actors the given rect overlaps.
     * Note that since platform object are repositioned with a tiny bit of space between them and the actor they collided with,
     * a platform object's rect should not be overlapping with the actor it collided with.
     * @param actors Out parameter that will be filled with Actors.
     * @param rect The rectangle to test.
     * @param collisionMask Collision mask to filter collision.
     */
    export function rectOverlapAllActorsNonAlloc(actors: Array<Actor>, rect: Rect, teamMask: Team = Team.ALL): void {

        actors.splice(0);

        Actor.forEach(
            function (actor: Actor): void {
                if (actor.isInTeam(teamMask)) {
                    if (actor.rectOverlaps(rect, teamMask)) {
                        actors.push(actor);
                    }
                }
            }
        );
        
    }

    
    /**
     * Returns if an Actor with the given collisionMask will collide with a PlatformObject with the given collisionLayers.
     * @param collisionMask
     * @param collisionLayers
     */
    export function maskCollidesWithLayers(collisionMask: number, collisionLayers: number): boolean {
        return (collisionMask & collisionLayers) !== 0;
    }


    /**
     * Returns the Direction of the normal angle.
     * @param normalX x of the normal vector
     * @param normalY y of the normal vector
     * @param thresholdAngleDegrees Angle in (0, 90).  The returned direction will be RIGHT iff the normal angle is in between -threshold and threshold.
     */
    export function getNormalDirection(normalX: number, normalY: number, thresholdAngleDegrees: number = 45): Direction {
        let thresholdAngle: number = thresholdAngleDegrees * M.degToRad;
        let normalAngle: number = Math.atan2(normalY, normalX);
        if (normalAngle < 0) normalAngle += Math.PI * 2; // keep angle in [0, 2pi)
        if (normalAngle < thresholdAngle) {
            return Direction.RIGHT;
        } else if (normalAngle < Math.PI - thresholdAngle) {
            return Direction.DOWN;
        } else if (normalAngle < Math.PI + thresholdAngle) {
            return Direction.LEFT;
        } else if (normalAngle < Math.PI * 2 - thresholdAngle) {
            return Direction.UP;
        }
        return Direction.RIGHT;
    }

    /**
     * Describes the current position of an actor.
     */
    export class StationaryActor {

        /**
         * Position of the actor.
         */
        pos: Vec2 = new Vec2();
        /**
         * Center in the actor's local space.
         */
        offset: Vec2 = new Vec2();
        halfWidth: number;
        halfHeight: number;

        collisionMask: number;

        /**
         * reference to actor if needed.  Do not use values from the actor, instead use the values in this class instance.
         */
        actor: Actor;

    }

    /**
     * Describes movement of an actor over 1 frame.
     */
    export class MovingActor {

        /**
         * Position of the actor at time 0.
         */
        pos0: Vec2 = new Vec2();
        /**
         * Position of the actor at time 1.
         */
        pos1: Vec2 = new Vec2();
        /**
         * Center in the actor's local space.
         */
        offset: Vec2 = new Vec2();
        halfWidth: number;
        halfHeight: number;

        collisionMask: number;

        /**
         * reference to actor if needed.  Do not use values from the actor, instead use the values in this class instance.
         */
        actor: Actor;

    }

    export enum ResponseType {
        /**
         * Actor hits PlatformObject at time t (time property).  Reposition Actor at that moment.
         */
        BULLET,
        /**
         * Actor hits PlatformObject at time t (time property), but it should be positioned somewhere else (given by reposition property).
         */
        PROJECT,
        /**
         * Actor started intersecting the platform, reposition it outside the platform (given by the reposition property).  Time should be 0 in this case.
         */
        INTERSECT,
        /**
         * Actor (considered stationary) is pushed by a moving platform.
         */
        MOVING_PLATFORM,
    }

    /**
     * Describes the calculated collision between an Actor and a PlatformObject.
     */
    export class Response {
        /**
         * Whether or not a collision occurred.
         */
        hit: boolean = false;
        /**
         * The Actor involved in the collision.
         */
        actor: Actor;
        /**
         * The PlatformObject involved in the collision.
         */
        platformObject: PlatformObject;
        /**
         * Time in [0, 1] of when the collision occurred.
         */
        time: number;
        /**
         * What the actor's position should be set to as a result of the collision.  Usually pos0+(pos1-pos0)*time with an epsilon offset.
         */
        reposition: Vec2 = new Vec2();
        /**
         * Reposition as the result of a projection.  Only needed if type is PROJECT.
         */
        repositionProject: Vec2 = new Vec2();
        /**
         * Point in global space where the collision occurred.
         */
        point: Vec2 = new Vec2();
        /**
         * Normal of the collision, from the platform towards the actor.  Has a magnitude of 1.
         */
        normal: Vec2 = new Vec2();
        /**
         * Type of collision.
         */
        type: ResponseType;

        /**
         * Returns the Direction of the normal angle.
         * @param thresholdAngleDegrees Angle in (0, 90).  The returned direction will be RIGHT iff the normal angle is in between -threshold and threshold.  If not given, this value is set to 90 - actor.getDimensionRatioAngle().
         */
        getNormalDirection = (thresholdAngleDegrees: number = undefined): Direction => {
            if (thresholdAngleDegrees == undefined)
                thresholdAngleDegrees = 90 - this.actor.getDimensionRatioAngle();
            return Collision.getNormalDirection(this.normal.x, this.normal.y, thresholdAngleDegrees);
        }
        
        toString = (): string => {
            return "hit: " + this.hit + " type: " + ResponseType[this.type] + " actor: " + this.actor + " platformObject: " + this.platformObject + " time: " + this.time + " point: " + this.point + " normal: " + this.normal + " reposition: " + this.reposition + " reposition project: " + this.repositionProject;
        }

        /**
         * Creates a new collision response, or returns a recycled response.
         */
        static _create(): Response {
            if (Response.recycledResponses.length > 0) {
                let ret: Response = Response.recycledResponses.pop();
                ret.recycled = false;
                return ret;
            }
            return new Response();
        }

        static _recycle(response: Response): void {
            if (response.recycled) return;
            response.recycled = true;
            Response.recycledResponses.push(response);
        }

        private static recycledResponses: Array<Response> = [];
        private recycled: boolean = false;

    }

    /**
     * Contains 2 collisions the happened this frame that would crush an Actor.
     * Like the responses, do not keep a reference to this class instance.
     */
    export class Crush {

        constructor(response0: Response, response1: Response) {
            this.response0 = response0;
            this.response1 = response1;
        }

        response0: Response;
        response1: Response;

        /**
         * The angle (in degrees) between the normals of the two collision responses.
         */
        getAngle = (): number => {
            return M.angleBetweenVectors(this.response0.normal.x, this.response0.normal.y, this.response1.normal.x, this.response1.normal.y) * M.radToDeg;
        }

    }
    
    export class Handler {
        
        static MAX_RESOLVE_PASSES: number = 3;


        static _update(): void {
            
            // set collisions that happened previous frame
            Handler.collisionsPrevFrame.splice(0);
            for (let i: number = 0; i < Handler.collisionsThisFrame.length; i++) {
                Handler.collisionsPrevFrame.push(Handler.collisionsThisFrame[i]);
            }
            Handler.collisionsThisFrame.splice(0);
            



            
            // move and resolve actors
            let actorCols: Array<Response> = [];
            Actor.forEach(
                function (actor: Actor): void {

                    Handler.resolveActor(actorCols, actor, PlatformObject._allPlatformObjects, MovingPlatformObject._allMovingPlatformObjects);

                    // record collision responses
                    for (let i: number = 0; i < actorCols.length; i++) {
                        Handler.collisionsThisFrame.push(actorCols[i]);
                    }
                    actorCols.splice(0);

                }
            );



            // move Platform components
            Platform.forEach(
                function (platform: Platform): void {
                    platform.getGlobalPosition(Handler.tempVec2);
                    Handler.tempVec2.x += platform.vx * Game.deltaTime;
                    Handler.tempVec2.y += platform.vy * Game.deltaTime;
                    platform.setGlobalPosition(Handler.tempVec2.x, Handler.tempVec2.y);
                }
            );



            // enter and stay collision messages
            Handler.collisionsThisFrame.forEach(
                function (response: Response): void {

                    // if collision did not happen previous frame, send enter message
                    if (Handler.responseSearch(Handler.collisionsPrevFrame, response.actor, response.platformObject) === null) {
                        response.actor.gameObject.sendMessage("onCollisionEnter", response);
                        response.platformObject.getPlatform().gameObject.sendMessage("onCollisionEnter", response);
                    }

                    response.actor.gameObject.sendMessage("onCollisionStay", response);
                    response.platformObject.getPlatform().gameObject.sendMessage("onCollisionStay", response);

                    if (response.actor.zeroVelocityOnCollision) {
                        // zero velocity
                        let normalDirection: Direction = response.getNormalDirection();
                        if (normalDirection === Direction.LEFT || normalDirection === Direction.RIGHT) {
                            response.actor.vx = 0;
                        } else if (normalDirection === Direction.UP || normalDirection === Direction.DOWN) {
                            response.actor.vy = 0;
                        }
                    }

                }
            );
            
            // exit collision messages
            Handler.collisionsPrevFrame.forEach(
                function (response: Response): void {
                    // if collision did not happen this frame, send enter message
                    if (Handler.responseSearch(Handler.collisionsThisFrame, response.actor, response.platformObject) === null) {
                        response.actor.gameObject.sendMessage("onCollisionExit", response);
                        response.platformObject.getPlatform().gameObject.sendMessage("onCollisionExit", response);
                    }
                }
            );



            // recycle collision responses
            Handler.collisionsPrevFrame.forEach(
                function (response: Response): void {
                    Response._recycle(response);
                }
            );
            Handler.collisionsPrevFrame.splice(0);

        }

        private static collisionsPrevFrame: Array<Response> = [];
        private static collisionsThisFrame: Array<Response> = [];

        /**
         * Searches for a Response from the given array between the given actor and platformObject.  Returns null if Response doesn't exist.
         */
        private static responseSearch(responses: Array<Response>, actor: Actor, platformObject: PlatformObject): Response {
            for (let i: number = 0; i < responses.length; i++) {
                if (responses[i].actor === actor && responses[i].platformObject === platformObject)
                    return responses[i];
            }
            return null;
        }


        /**
         * Put new responses in outResponses.
         */
        private static resolveActor(outResponses: Array<Response>, actor: Actor, platformObjects: Array<PlatformObject>, movingPlatformObjects: Array<MovingPlatformObject>): void {

            outResponses.splice(0);

            let actorIsActiveAndEnabled: boolean = actor.isActiveAndEnabled();

            // how much stationary actor was pushed by moving platforms
            let pushDistanceX: number = 0;
            let pushDistanceY: number = 0;

            // get initial position of actor
            actor.getGlobalPosition(Handler.tempVec2);
            let actorX0: number = Handler.tempVec2.x;
            let actorY0: number = Handler.tempVec2.y;

            let stationaryActor: StationaryActor = Handler.stationaryActor;
            stationaryActor.actor = actor;
            stationaryActor.offset.setValues(actor.offsetX, actor.offsetY);
            stationaryActor.halfWidth = actor.halfWidth;
            stationaryActor.halfHeight = actor.halfHeight;
            stationaryActor.collisionMask = actor.collisionMask;
            stationaryActor.pos.setValues(actorX0, actorY0); // note this is the pre-physics position
            

            // moving platforms collision
            for (let i: number = 0; i < movingPlatformObjects.length; i++) {
                let mpo: MovingPlatformObject = movingPlatformObjects[i];

                if (!mpo.isEnabled() || !mpo.getPlatform().isActiveAndEnabled() || !actorIsActiveAndEnabled)
                    continue;
                if (!maskCollidesWithLayers(actor.collisionMask, mpo.collisionLayers))
                    continue;

                let resp: Response = Response._create();
                resp.hit = false;
                resp.actor = actor;
                resp.platformObject = mpo;
                mpo.movingPlatformCollision(resp, stationaryActor);

                if (resp.hit) {
                    if (resp.type === ResponseType.MOVING_PLATFORM) {
                        // hit, record response.  Note can be hit by multiple moving platforms.
                        outResponses.push(resp);
                    } else {
                        console.error("Response type for moving platform collision must be MOVING_PLATFORM");
                    }
                } else {
                    // not hit, recycle response
                    Response._recycle(resp);
                }

            }

            if (outResponses.length > 0) {
                // actor hit by moving platform, reposition
                stationaryActor.pos.setValuesVec2(outResponses[0].reposition);

                //appliedCollisionResponses.AddRange(movingPlatformCollisionResponses);
            }
            pushDistanceX = stationaryActor.pos.x - actorX0;
            pushDistanceY = stationaryActor.pos.y - actorY0;
            
            // attached actor moving the platform.  This affects pushDistance, which only affects movingActor.pos1
            if (actor.getAttachedMovingPlatformObject() !== null) {

                // temporarily give stationaryActor its original values
                let sapx: number = stationaryActor.pos.x;
                let sapy: number = stationaryActor.pos.y;
                stationaryActor.pos.setValues(actorX0, actorY0);

                // get push distance as a result of the platform object moving
                actor.getAttachedMovingPlatformObject().moveAttachedActor(this.tempVec2, stationaryActor);
                pushDistanceX = this.tempVec2.x - actorX0;
                pushDistanceY = this.tempVec2.y - actorY0;

                // give newset pos values back to stationaryActor
                stationaryActor.pos.setValues(sapx, sapy);
            }

            let movingActor: MovingActor = Handler.movingActor;
            movingActor.actor = actor;
            movingActor.offset.setValues(actor.offsetX, actor.offsetY);
            movingActor.halfWidth = actor.halfWidth;
            movingActor.halfHeight = actor.halfHeight;
            movingActor.collisionMask = actor.collisionMask;
            movingActor.pos0.setValues(stationaryActor.pos.x, stationaryActor.pos.y); // is actor's pre-physics position, unless a moving platform moved the actor
            
            // pos1 is what actor's position will be after the resolution
            let dt: number = Game.deltaTime;
            actor.vx += actor.gravityScale * gravityX * dt;
            actor.vy += actor.gravityScale * gravityY * dt;
            movingActor.pos1.x = actorX0 + actor.vx * dt + actor.windX * dt + pushDistanceX;
            movingActor.pos1.y = actorY0 + actor.vy * dt + actor.windY * dt + pushDistanceY;
            
            
            let skipPlatformObject: PlatformObject = null; // don't consider this platform in collision checks
            let projectCollision: boolean = actor.projectCollision; // use projection when repositioning after collision
            
            for (let i: number = 0; i < this.MAX_RESOLVE_PASSES; i++) {

                // can only collide with 1 platformObject per resolve pass
                let response: Response = null;

                for (let j: number = 0; j < platformObjects.length; j++) {
                    let platformObject: PlatformObject = platformObjects[j];
                    if (platformObject == null) continue;
                    if (platformObject === skipPlatformObject) continue;
                    if (!platformObject.isEnabled() || !platformObject.getPlatform().isActiveAndEnabled() || !actorIsActiveAndEnabled) continue;
                    if (!maskCollidesWithLayers(actor.collisionMask, platformObject.collisionLayers)) continue;

                    // get response for moving actor colliding with the platformObject.
                    let resp: Response = Response._create();
                    resp.hit = false;
                    resp.actor = actor;
                    resp.platformObject = platformObject;
                    platformObject.movingActorCollision(resp, movingActor, projectCollision);

                    if (resp.hit && (response === null || resp.time < response.time)) {
                        // moving actor hit platform earliest, use for response
                        if (response !== null) Response._recycle(response);
                        response = resp;
                    } else {
                        // don't use for response
                        Response._recycle(resp);
                    }
                    
                }

                // done if there's no collision
                if (response === null) break;

                // collision happened
                
                // alter movingActor position from collision
                switch (response.type) {
                    case ResponseType.BULLET:
                        // bullet collision.  Reposition to where collision happened, do not project.
                        movingActor.pos0.setValuesVec2(response.reposition);
                        movingActor.pos1.setValuesVec2(response.reposition);
                        break;
                    case ResponseType.PROJECT:
                        // project collision.  Reposition to the given project position.

                        // updating pos0 was causing problems earlier, I don't remember why.  It seems to work fine now.
                        movingActor.pos0.setValuesVec2(response.reposition); // reposition with no projection
                        movingActor.pos1.setValuesVec2(response.repositionProject); // reposition with projection

                        //// check to make sure projection doesn't go behind a wall it already collided with
                        //foreach(CollisionResponse prevCollisionResponse in movingActorCollisionResponses) {
                        //    if (PrimitiveTest.angleBetweenVectors(prevCollisionResponse.normal, movingActor.diff) > Mathf.PI / 2) {
                        //        // projection would move actor behind a wall it already collided with.  Cancel projection, and reposition in a way that considers both walls.
                        //        Vector2 crossReposition = PrimitiveTest.lineLineIntersectionPoint(
                        //            prevCollisionResponse.reposition,
                        //            prevCollisionResponse.reposition + new Vector2(-prevCollisionResponse.normal.y, prevCollisionResponse.normal.x),
                        //            collisionResponse.reposition,
                        //            collisionResponse.reposition + new Vector2(-collisionResponse.normal.y, collisionResponse.normal.x));
                        //        if (!float.IsInfinity(crossReposition.x) && !float.IsInfinity(crossReposition.y)) {
                        //            movingActor.pos0 = crossReposition;
                        //        }
                        //        movingActor.diff = Vector2.zero;
                        //        break;
                        //    }
                        //}
                        break;
                    case ResponseType.INTERSECT:
                        // intersect collision.  diff between pos0 and pos1 is unchanged
                        let diffX: number = movingActor.pos1.x - movingActor.pos0.x;
                        let diffY: number = movingActor.pos1.y - movingActor.pos0.y;
                        movingActor.pos0.setValuesVec2(response.reposition);
                        movingActor.pos1.setValues(movingActor.pos0.x + diffX, movingActor.pos0.y + diffY);
                        break;
                    default:
                        console.error("Don't use collision response type " + response.type + " for moving actor collision.");
                        break;
                }
                
                // add collision response to record
                outResponses.push(response);

                if (movingActor.pos0.equalsVec2(movingActor.pos1)) {
                    // no projection.  No more collisions can happen
                    break;
                } else {
                    // actor is still moving, so need to check again

                    // new: maybe we shouldn't do this
                    //skipPlatformObject = response.platformObject; // don't check this platform again

                    if (i + 2 >= this.MAX_RESOLVE_PASSES) {
                        // next pass will be the last.  So the next collision should be final (i.e. no projections)
                        projectCollision = false;
                    }
                }

            } // ends resolve passes for loop
            
            // apply collision reposition to actor
            actor.setGlobalPosition(movingActor.pos1.x, movingActor.pos1.y);

            
            // crush collision messages
            for (let i: number = 0; i < outResponses.length; i++) {
                let resp1: Response = outResponses[i];
                for (let j: number = i + 1; j < outResponses.length; j++) {
                    let resp2: Response = outResponses[j];
                    if (resp1.type != ResponseType.MOVING_PLATFORM && resp2.type != ResponseType.MOVING_PLATFORM)
                        continue; // need at least one moving platform to have a crush
                    if (M.angleBetweenVectors(resp1.normal.x, resp1.normal.y, resp2.normal.x, resp2.normal.y) * M.radToDeg > actor.crushAngleThreshold) {
                        // crush detected, send message
                        let crush: Crush = new Crush(resp1, resp2);
                        actor.gameObject.sendMessage("onCollisionCrush", crush);
                    }
                }
            }
            
        }
        
        private static stationaryActor: StationaryActor = new StationaryActor();
        private static movingActor: MovingActor = new MovingActor();

        private static tempVec2: Vec2 = new Vec2();

    }
    
    
    let tempRaycastHit: RaycastHit = new RaycastHit();
    let tempOrigin: Vec2 = new Vec2();
    let tempDirection: Vec2 = new Vec2();

}


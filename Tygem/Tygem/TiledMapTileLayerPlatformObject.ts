/// <reference path="_ref.ts" />

namespace Collision {

    export class TiledMapTileLayerPlatformObject extends MovingPlatformObject {

        constructor(platform: Platform) {
            super(platform);

            // represents all collision layers of tiles
            this.collisionLayers = 0x7FFFFFFF;
        }
        
        /**
         * The TileLayer data this platform object is detecting collision for.
         */
        tiledMapLayer: TiledMap.TileLayer = null;

        /**
         * Performs a raycast.
         * @param raycastHit put the results of the raycast here, rather than allocating a new RaycastHit.
         * @param origin origin of the ray being cast.
         * @param direction normalized direction of the ray being cast.
         * @param distance distance of the ray being cast.
         * @param collisionMask Bits representing the collision layers the ray will collide with.  Default is 0x7FFFFFFF.
         */
        raycast = (raycastHit: RaycastHit, origin: Vec2, direction: Vec2, distance: number = Number.POSITIVE_INFINITY, collisionMask: number = 0x7FFFFFFF): void => {

            let originX: number = origin.x;
            let originY: number = origin.y;

            // offset by Platform's global position
            this.getPosition(this.tempGlobalPos);
            originX -= this.tempGlobalPos.x;
            originY -= this.tempGlobalPos.y;

            // getting information about the tile layer
            let numCols: number = this.tiledMapLayer.width;
            let numRows: number = this.tiledMapLayer.height;
            let tileWidth: number = this.tiledMapLayer.mapData.tileWidth;
            let tileHeight: number = this.tiledMapLayer.mapData.tileHeight;
            
            let t: number = 0;
            let col: number = 0;
            let row: number = 0;
            let x: number = 0;
            let y: number = 0;
            let tileInfo: TiledMap.TileInfo = null;

            let horizT: number = -1;
            let horizX: number = 0;
            let horizY: number = 0;

            if (direction.x > 0) {

                // test hitting vertical wall going right
                col = Math.ceil(originX / tileWidth);
                for (; col < numCols; col++) {

                    // getting next tile and point of collision
                    x = col * tileWidth;
                    t = (x - originX) / direction.x;
                    y = originY + t * direction.y;
                    row = Math.floor(y / tileHeight);

                    // break if y is going off the map
                    if (row < 0 || row >= numRows)
                        break;

                    // break if going too far
                    if (t > distance)
                        break;
                    
                    // check collision mask and layers
                    tileInfo = this.tiledMapLayer.getTileInfo(col, row);
                    if (!Collision.maskCollidesWithLayers(collisionMask, tileInfo.collisionLayers))
                        continue;

                    // collides with this tile
                    horizT = t;
                    horizX = x;
                    horizY = y;
                    break;
                }

            } else if (direction.x < 0) {

                // test hitting vertical wall going left
                col = Math.floor(originX / tileWidth) - 1;
                for (; col >= 0; col--) {

                    // getting next tile and point of collision
                    x = (col + 1) * tileWidth;
                    t = (x - originX) / direction.x;
                    y = originY + t * direction.y;
                    row = Math.floor(y / tileHeight);

                    // break if y is going off the map
                    if (row < 0 || row >= numRows)
                        break;

                    // break if going too far
                    if (t > distance)
                        break;
                    
                    // check collision mask and layers
                    tileInfo = this.tiledMapLayer.getTileInfo(col, row);
                    if (!Collision.maskCollidesWithLayers(collisionMask, tileInfo.collisionLayers))
                        continue;

                    // collides with this tile
                    horizT = t;
                    horizX = x;
                    horizY = y;
                    break;
                }

            }

            let vertT: number = -1;
            let vertX: number = 0;
            let vertY: number = 0;

            if (direction.y > 0) {

                // test hitting horizontal wall going down
                row = Math.ceil(originY / tileHeight);
                for (; row < numRows; row++) {

                    // getting next tile and point of collision
                    y = row * tileHeight;
                    t = (y - originY) / direction.y;
                    x = originX + t * direction.x;
                    col = Math.floor(x / tileWidth);

                    // break if x is going off the map
                    if (col < 0 || col >= numCols)
                        break;

                    // break if going too far
                    if (t > distance)
                        break;
                    
                    // check collision mask and layers
                    tileInfo = this.tiledMapLayer.getTileInfo(col, row);
                    if (!Collision.maskCollidesWithLayers(collisionMask, tileInfo.collisionLayers))
                        continue;

                    // collides with this tile
                    vertT = t;
                    vertX = x;
                    vertY = y;
                    break;
                }

            } else if (direction.y < 0) {

                // test hitting horizontal wall going up
                row = Math.floor(originY / tileHeight) - 1;
                for (; row >= 0; row--) {

                    // getting next tile and point of collision
                    y = (row + 1) * tileHeight;
                    t = (y - originY) / direction.y;
                    x = originX + t * direction.x;
                    col = Math.floor(x / tileWidth);

                    // break if x is going off the map
                    if (col < 0 || col >= numCols)
                        break;

                    // break if going too far
                    if (t > distance)
                        break;
                    
                    // check collision mask and layers
                    tileInfo = this.tiledMapLayer.getTileInfo(col, row);
                    if (!Collision.maskCollidesWithLayers(collisionMask, tileInfo.collisionLayers))
                        continue;

                    // collides with this tile
                    vertT = t;
                    vertX = x;
                    vertY = y;
                    break;
                }

            }


            // resolve
            if (horizT == -1 && vertT == -1) {
                // didn't hit anything
                raycastHit.hit = false;
            } else if (horizT !== -1 && (vertT === -1 || horizT < vertT)) {
                // hit horizontal
                raycastHit.hit = true;
                raycastHit.t = horizT;
                raycastHit.point.setValues(horizX, horizY);
                if (direction.x > 0) {
                    raycastHit.normal.setValues(-1, 0);
                } else {
                    raycastHit.normal.setValues(1, 0);
                }
            } else {
                // hit vertical
                raycastHit.hit = true;
                raycastHit.t = vertT;
                raycastHit.point.setValues(vertX, vertY);
                if (direction.y > 0) {
                    raycastHit.normal.setValues(0, -1);
                } else {
                    raycastHit.normal.setValues(0, 1);
                }
            }
            
            if (raycastHit.hit) {

                raycastHit.platformObject = this;

                // offset by Platform's global position
                raycastHit.point.x += this.tempGlobalPos.x;
                raycastHit.point.y += this.tempGlobalPos.y;
                
            }

        }




        /**
         * Called by Handler.  Fills the given CollisionResponse, describing what happens when the given actor moves toward it.
         * This assumes platformObject's position after movement.
         */
        movingActorCollision = (response: Response, movingActor: MovingActor, projectCollision: boolean): void => {

            // getting information about the actor
            let aDiffX: number = movingActor.pos1.x - movingActor.pos0.x;
            let aDiffY: number = movingActor.pos1.y - movingActor.pos0.y;
            let aCollisionMask: number = movingActor.collisionMask;
            let aX: number = movingActor.pos0.x;
            let aY: number = movingActor.pos0.y;
            // offset by Platform's global position
            this.getPosition(this.tempGlobalPos);
            this.tempGlobalPos.x += this._platform.vx * Game.deltaTime;
            this.tempGlobalPos.y += this._platform.vy * Game.deltaTime;
            aX -= this.tempGlobalPos.x;
            aY -= this.tempGlobalPos.y;
            
            let aLeft: number = aX + movingActor.offset.x - movingActor.halfWidth;
            let aTop: number = aY + movingActor.offset.y - movingActor.halfHeight;
            let aRight: number = aLeft + movingActor.halfWidth * 2;
            let aBottom: number = aTop + movingActor.halfHeight * 2;
            
            // getting information about the tile layer
            let numCols: number = this.tiledMapLayer.width;
            let numRows: number = this.tiledMapLayer.height;
            let tileWidth: number = this.tiledMapLayer.mapData.tileWidth;
            let tileHeight: number = this.tiledMapLayer.mapData.tileHeight;

            let t: number = 0;
            let col: number = 0;
            let x: number = 0;
            let yTop: number = 0;
            let yBottom: number = 0;
            let rowTop: number = 0;
            let rowBottom: number = 0;
            let row: number = 0;
            let y: number = 0;
            let xLeft: number = 0;
            let xRight: number = 0;
            let colLeft: number = 0;
            let colRight: number = 0;
            let tileInfo: TiledMap.TileInfo = null;
            let EPSILON: number = .0001;

            let horizT: number = -1;
            let horizX: number = 0;
            let horizY: number = 0;

            let vertT: number = -1;
            let vertX: number = 0;
            let vertY: number = 0;

            if (aDiffX > 0) {

                // test hitting vertical wall going right
                col = Math.ceil((aRight - EPSILON) / tileWidth);
                for (; col < numCols; col++) {

                    // getting next tile and point of collision
                    x = col * tileWidth;
                    t = (x - aRight) / aDiffX;
                    yTop = aTop + t * aDiffY;
                    yBottom = aBottom + t * aDiffY;
                    rowTop = Math.max(0, Math.floor(yTop / tileHeight));
                    rowBottom = Math.min(numRows - 1, Math.floor(yBottom / tileHeight));

                    // break if y is going off the map
                    if (rowBottom < 0 || rowTop >= numRows)
                        break;

                    // break if going past aDiffX
                    if (t > 1)
                        break;

                    for (let r: number = rowTop; r <= rowBottom; r++) {

                        // check collision mask and layers
                        tileInfo = this.tiledMapLayer.getTileInfo(col, r);
                        if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                            continue;

                        // collides with this tile
                        horizT = t;
                        horizX = x; // set to col * tileWidth
                        horizY = (yTop + yBottom) / 2;
                        break;

                    }

                    // break if got hit
                    if (horizT !== -1)
                        break;

                }

            } else if (aDiffX < 0) {
                
                // test hitting vertical wall going left
                col = Math.floor((aLeft + EPSILON) / tileWidth) - 1;
                for (; col >= 0; col--) {

                    // getting next tile and point of collision
                    x = (col + 1) * tileWidth;
                    t = (x - aLeft) / aDiffX;
                    yTop = aTop + t * aDiffY;
                    yBottom = aBottom + t * aDiffY;
                    rowTop = Math.max(0, Math.floor(yTop / tileHeight));
                    rowBottom = Math.min(numRows - 1, Math.floor(yBottom / tileHeight));

                    // break if y is going off the map
                    if (rowBottom < 0 || rowTop >= numRows)
                        break;

                    // break if going past aDiffX
                    if (t > 1)
                        break;

                    for (let r: number = rowTop; r <= rowBottom; r++) {

                        // check collision mask and layers
                        tileInfo = this.tiledMapLayer.getTileInfo(col, r);
                        if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                            continue;

                        // collides with this tile
                        horizT = t;
                        horizX = x; // set to (col + 1) * tileWidth
                        horizY = (yTop + yBottom) / 2;
                        break;

                    }

                    // break if got hit
                    if (horizT !== -1)
                        break;

                }

            }



            // work here on vertical
            if (aDiffY > 0) {

                // test hitting horizontal wall going down
                row = Math.ceil((aBottom - EPSILON) / tileHeight);
                for (; row < numRows; row++) {

                    // getting next tile and point of collision
                    y = row * tileHeight;
                    t = (y - aBottom) / aDiffY;
                    xLeft = aLeft + t * aDiffX;
                    xRight = aRight + t * aDiffX;
                    colLeft = Math.max(0, Math.floor(xLeft / tileWidth));
                    colRight = Math.min(numCols - 1, Math.floor(xRight / tileWidth));

                    // break if x is going off the map
                    if (colLeft < 0 || colRight >= numCols)
                        break;

                    // break if going past aDiffY
                    if (t > 1)
                        break;

                    for (let c: number = colLeft; c <= colRight; c++) {

                        // check collision mask and layers
                        tileInfo = this.tiledMapLayer.getTileInfo(c, row);
                        if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                            continue;

                        // collides with this tile
                        vertT = t;
                        vertY = y; // set to row * tileHeight
                        vertX = (xLeft + xRight) / 2;
                        break;

                    }

                    // break if got hit
                    if (vertT !== -1)
                        break;

                }

            } else if (aDiffY < 0) {

                // test hitting horizontal wall going up
                row = Math.floor((aTop + EPSILON) / tileHeight) - 1;
                for (; row >= 0; row--) {

                    // getting next tile and point of collision
                    y = (row + 1) * tileHeight;
                    t = (y - aTop) / aDiffY;
                    xLeft = aLeft + t * aDiffX;
                    xRight = aRight + t * aDiffX;
                    colLeft = Math.max(0, Math.floor(xLeft / tileWidth));
                    colRight = Math.min(numCols - 1, Math.floor(xRight / tileWidth));

                    // break if x is going off the map
                    if (colLeft < 0 || colRight >= numCols)
                        break;

                    // break if going past aDiffY
                    if (t > 1)
                        break;

                    for (let c: number = colLeft; c <= colRight; c++) {

                        // check collision mask and layers
                        tileInfo = this.tiledMapLayer.getTileInfo(c, row);
                        if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                            continue;

                        // collides with this tile
                        vertT = t;
                        vertY = y; // set to (row + 1) * tileHeight
                        vertX = (xLeft + xRight) / 2;
                        break;

                    }

                    // break if got hit
                    if (vertT !== -1)
                        break;

                }

            }









            // resolve
            if (horizT == -1 && vertT == -1) {
                // didn't hit anything
                response.hit = false;
            } else if (horizT !== -1 && (vertT === -1 || horizT < vertT)) {
                // hit horizontal
                response.hit = true;
                response.time = horizT;

                if (aDiffX > 0) {
                    // going right, reposition to left
                    response.normal.setValues(-1, 0);
                    response.point.setValues(
                        horizX,
                        horizY
                    );
                    // bullet reposition
                    response.reposition.setValues(
                        aX + aDiffX * horizT - EPSILON * 2,
                        aY + aDiffY * horizT
                    );
                    // project reposition
                    if (projectCollision) {
                        response.repositionProject.setValues(
                            horizX - movingActor.offset.x - movingActor.halfWidth - EPSILON * 2,
                            aY + aDiffY
                        );
                        response.type = ResponseType.PROJECT;
                    } else {
                        response.type = ResponseType.BULLET;
                    }
                    
                } else {
                    // going left, reposition to right
                    response.normal.setValues(1, 0);
                    response.point.setValues(
                        horizX,
                        horizY
                    );
                    // bullet reposition
                    response.reposition.setValues(
                        aX + aDiffX * horizT + EPSILON * 2,
                        aY + aDiffY * horizT
                    );
                    // project reposition
                    if (projectCollision) {
                        response.repositionProject.setValues(
                            horizX - movingActor.offset.x + movingActor.halfWidth + EPSILON * 2,
                            aY + aDiffY
                        );
                        response.type = ResponseType.PROJECT;
                    } else {
                        response.type = ResponseType.BULLET;
                    }
                }

            } else {
                // hit vertical
                response.hit = true;
                response.time = vertT;
                
                if (aDiffY > 0) {
                    // going down, reposition to top
                    response.normal.setValues(0, -1);
                    response.point.setValues(
                        vertX,
                        vertY
                    );
                    // bullet reposition
                    response.reposition.setValues(
                        aX + aDiffX * vertT,
                        aY + aDiffY * vertT - EPSILON * 2
                    );
                    // project reposition
                    if (projectCollision) {
                        response.repositionProject.setValues(
                            aX + aDiffX,
                            vertY - movingActor.offset.y - movingActor.halfHeight - EPSILON * 2
                        );
                        response.type = ResponseType.PROJECT;
                    } else {
                        response.type = ResponseType.BULLET;
                    }

                } else {
                    // going up, reposition to bottom
                    response.normal.setValues(0, 1);
                    response.point.setValues(
                        vertX,
                        vertY
                    );
                    // bullet reposition
                    response.reposition.setValues(
                        aX + aDiffX * vertT,
                        aY + aDiffY * vertT + EPSILON * 2
                    );
                    // project reposition
                    if (projectCollision) {
                        response.repositionProject.setValues(
                            aX + aDiffX,
                            vertY - movingActor.offset.y + movingActor.halfHeight + EPSILON * 2
                        );
                        response.type = ResponseType.PROJECT;
                    } else {
                        response.type = ResponseType.BULLET;
                    }
                }


            }















            if (response.hit) {

                response.platformObject = this;
                response.actor = movingActor.actor;

                // offset by Platform's global position
                response.point.x += this.tempGlobalPos.x;
                response.reposition.x += this.tempGlobalPos.x;
                response.repositionProject.x += this.tempGlobalPos.x;
                response.point.y += this.tempGlobalPos.y;
                response.reposition.y += this.tempGlobalPos.y;
                response.repositionProject.y += this.tempGlobalPos.y;

            }
            
        }




        /**
         * Called by Handler.  Fills the given CollisionResponse, describing what happens when this platform moves towards the given actor.
         */
        movingPlatformCollision = (response: Response, stationaryActor: StationaryActor): void => {

            // getting information about platform's movement
            if (this._platform.vx === 0 && this._platform.vy === 0) return;
            let diffX: number = this._platform.vx * Game.deltaTime;
            let diffY: number = this._platform.vy * Game.deltaTime;
            
            // getting information about the actor
            let aCollisionMask: number = stationaryActor.collisionMask;
            let aX: number = stationaryActor.pos.x;
            let aY: number = stationaryActor.pos.y;
            // offset by Platform's global position
            this.getPosition(this.tempGlobalPos);
            aX -= this.tempGlobalPos.x;
            aY -= this.tempGlobalPos.y;

            let aLeft: number = aX + stationaryActor.offset.x - stationaryActor.halfWidth;
            let aTop: number = aY + stationaryActor.offset.y - stationaryActor.halfHeight;
            let aRight: number = aLeft + stationaryActor.halfWidth * 2;
            let aBottom: number = aTop + stationaryActor.halfHeight * 2;



            // getting information about the tile layer
            let numCols: number = this.tiledMapLayer.width;
            let numRows: number = this.tiledMapLayer.height;
            let tileWidth: number = this.tiledMapLayer.mapData.tileWidth;
            let tileHeight: number = this.tiledMapLayer.mapData.tileHeight;

            let t: number = 0;
            let col: number = 0;
            let x: number = 0;
            let yTop: number = 0;
            let yBottom: number = 0;
            let rowTop: number = 0;
            let rowBottom: number = 0;

            let row: number = 0;
            let y: number = 0;
            let xLeft: number = 0;
            let xRight: number = 0;
            let colLeft: number = 0;
            let colRight: number = 0;

            let tileInfo: TiledMap.TileInfo = null;
            let EPSILON: number = .0001;

            let horizT: number = -1;
            let horizX: number = 0;
            let horizY: number = 0;

            let vertT: number = -1;
            let vertX: number = 0;
            let vertY: number = 0;


            if (diffX < 0) {

                // test going left, hitting actor's right side
                col = Math.ceil((aRight - EPSILON) / tileWidth);
                for (; col < numCols; col++) {

                    // getting next tile and point of collision
                    x = col * tileWidth;
                    t = (x - aRight) / -diffX;
                    yTop = aTop + t * -diffY;
                    yBottom = aBottom + t * -diffY;
                    rowTop = Math.max(0, Math.floor(yTop / tileHeight));
                    rowBottom = Math.min(numRows - 1, Math.floor(yBottom / tileHeight));

                    // break if y is going off the map
                    if (rowBottom < 0 || rowTop >= numRows)
                        break;

                    // break if going past diffX
                    if (t > 1)
                        break;

                    for (let r: number = rowTop; r <= rowBottom; r++) {

                        // check collision mask and layers
                        tileInfo = this.tiledMapLayer.getTileInfo(col, r);
                        if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                            continue;

                        // collides with this tile
                        horizT = t;
                        horizX = x; // set to col * tileWidth
                        horizY = (yTop + yBottom) / 2;
                        break;

                    }

                    // break if got hit
                    if (horizT !== -1)
                        break;

                }

            } else if (diffX > 0) {
                
                // test going right, hitting actor's left side
                col = Math.floor((aLeft + EPSILON) / tileWidth) - 1;
                for (; col >= 0; col--) {

                    // getting next tile and point of collision
                    x = (col + 1) * tileWidth;
                    t = (x - aLeft) / -diffX;
                    yTop = aTop + t * -diffY;
                    yBottom = aBottom + t * -diffY;
                    rowTop = Math.max(0, Math.floor(yTop / tileHeight));
                    rowBottom = Math.min(numRows - 1, Math.floor(yBottom / tileHeight));

                    // break if y is going off the map
                    if (rowBottom < 0 || rowTop >= numRows)
                        break;

                    // break if going past diffX
                    if (t > 1)
                        break;

                    for (let r: number = rowTop; r <= rowBottom; r++) {

                        // check collision mask and layers
                        tileInfo = this.tiledMapLayer.getTileInfo(col, r);
                        if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                            continue;

                        // collides with this tile
                        horizT = t;
                        horizX = x; // set to (col + 1) * tileWidth
                        horizY = (yTop + yBottom) / 2;
                        break;

                    }

                    // break if got hit
                    if (horizT !== -1)
                        break;

                }

            }

            if (diffY < 0) {

                // test going up, hitting actor's bottom side
                row = Math.ceil((aBottom - EPSILON) / tileHeight);
                for (; row < numRows; row++) {

                    // getting next tile and point of collision
                    y = row * tileHeight;
                    t = (y - aBottom) / -diffY;
                    xLeft = aLeft + t * -diffX;
                    xRight = aRight + t * -diffX;
                    colLeft = Math.max(0, Math.floor(xLeft / tileWidth));
                    colRight = Math.min(numCols - 1, Math.floor(xRight / tileWidth));

                    // break if x is going off the map
                    if (colRight < 0 || colLeft >= numCols)
                        break;

                    // break if going past diffY
                    if (t > 1)
                        break;

                    for (let c: number = colLeft; c <= colRight; c++) {

                        // check collision mask and layers
                        tileInfo = this.tiledMapLayer.getTileInfo(c, row);
                        if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                            continue;

                        // collides with this tile
                        vertT = t;
                        vertX = (xLeft + xRight) / 2;
                        vertY = y; // set to row * tileHeight
                        break;

                    }

                    // break if got hit
                    if (vertT !== -1)
                        break;

                }

            } else if (diffY > 0) {
                
                // test going down, hitting actor's top side
                row = Math.floor((aTop + EPSILON) / tileHeight) - 1;
                for (; row >= 0; row--) {

                    // getting next tile and point of collision
                    y = (row + 1) * tileHeight;
                    t = (y - aTop) / -diffY;
                    xLeft = aLeft + t * -diffX;
                    xRight = aRight + t * -diffX;
                    colLeft = Math.max(0, Math.floor(xLeft / tileWidth));
                    colRight = Math.min(numCols - 1, Math.floor(xRight / tileWidth));

                    // break if x is going off the map
                    if (colRight < 0 || colLeft >= numCols)
                        break;

                    // break if going past diffY
                    if (t > 1)
                        break;

                    for (let c: number = colLeft; c <= colRight; c++) {

                        // check collision mask and layers
                        tileInfo = this.tiledMapLayer.getTileInfo(c, row);
                        if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                            continue;

                        // collides with this tile
                        vertT = t;
                        vertX = (xLeft + xRight) / 2;
                        vertY = y; // set to (row + 1) * tileHeight
                        break;

                    }

                    // break if got hit
                    if (vertT !== -1)
                        break;

                }

            }



            // resolve
            if (horizT == -1 && vertT == -1) {
                // didn't hit anything
                response.hit = false;
            } else if (horizT !== -1 && (vertT === -1 || horizT < vertT)) {
                // hit horizontal
                response.hit = true;
                response.time = horizT;

                if (diffX < 0) {
                    // going left, reposition actor to left
                    response.normal.setValues(-1, 0);
                    response.point.setValues(
                        horizX + diffX,
                        horizY + diffY
                    );
                    // reposition
                    //response.reposition.setValues(
                    //    horizX + diffX - stationaryActor.offset.x - stationaryActor.halfWidth - EPSILON * 2,
                    //    aY
                    //);
                    response.reposition.setValues(
                        horizX + diffX - stationaryActor.offset.x - stationaryActor.halfWidth - EPSILON * 2,
                        aY + diffY * (1 - horizT)
                    );

                } else {
                    // going right, reposition actor to right
                    response.normal.setValues(1, 0);
                    response.point.setValues(
                        horizX + diffX,
                        horizY + diffY
                    );
                    // reposition
                    //response.reposition.setValues(
                    //    horizX + diffX - stationaryActor.offset.x + stationaryActor.halfWidth + EPSILON * 2,
                    //    aY
                    //);
                    response.reposition.setValues(
                        horizX + diffX - stationaryActor.offset.x + stationaryActor.halfWidth + EPSILON * 2,
                        aY + diffY * (1 - horizT)
                    );

                }

            } else {
                // hit vertical
                response.hit = true;
                response.time = vertT;

                if (diffY < 0) {
                    // going up, reposition actor to top
                    response.normal.setValues(0, -1);
                    response.point.setValues(
                        vertX + diffX,
                        vertY + diffY
                    );
                    // reposition
                    //response.reposition.setValues(
                    //    aX,
                    //    vertY + diffY - stationaryActor.offset.y - stationaryActor.halfHeight - EPSILON * 2
                    //);
                    response.reposition.setValues(
                        aX + diffX * (1 - vertT),
                        vertY + diffY - stationaryActor.offset.y - stationaryActor.halfHeight - EPSILON * 2
                    );

                } else {
                    // going down, reposition actor to bottom
                    response.normal.setValues(0, 1);
                    response.point.setValues(
                        vertX + diffX,
                        vertY + diffY
                    );
                    // reposition
                    //response.reposition.setValues(
                    //    aX,
                    //    vertY + diffY - stationaryActor.offset.y + stationaryActor.halfHeight + EPSILON * 2
                    //);
                    response.reposition.setValues(
                        aX + diffX * (1 - vertT),
                        vertY + diffY - stationaryActor.offset.y + stationaryActor.halfHeight + EPSILON * 2
                    );

                }

            }






            if (response.hit) {

                response.platformObject = this;
                response.actor = stationaryActor.actor;
                response.type = ResponseType.MOVING_PLATFORM;
                
                // offset by Platform's global position
                response.point.x += this.tempGlobalPos.x;
                response.reposition.x += this.tempGlobalPos.x;
                response.point.y += this.tempGlobalPos.y;
                response.reposition.y += this.tempGlobalPos.y;
                
            }
            

        }









        /**
         * Returns if the given rectangle overlaps with this platform object.
         */
        rectOverlaps = (rect: Rect, collisionMask: number = 0x7FFFFFFF): boolean => {

            let left: number = rect.x;
            let top: number = rect.y;

            // offset by Platform's global position
            this.getPosition(this.tempGlobalPos);
            left -= this.tempGlobalPos.x;
            top -= this.tempGlobalPos.y;

            let right: number = left + rect.width;
            let bottom: number = top + rect.height;

            let numCols: number = this.tiledMapLayer.width;
            let numRows: number = this.tiledMapLayer.height;
            let tileWidth: number = this.tiledMapLayer.mapData.tileWidth;
            let tileHeight: number = this.tiledMapLayer.mapData.tileHeight;
            let tileInfo: TiledMap.TileInfo = null;
            
            let colMin: number = Math.max(0, Math.floor(left / tileWidth));
            let colMax: number = Math.min(numCols - 1, Math.floor(right / tileWidth));
            let rowMin: number = Math.max(0, Math.floor(top / tileHeight));
            let rowMax: number = Math.min(numRows - 1, Math.floor(bottom / tileHeight));

            for (let col: number = colMin; col <= colMax; col++) {
                for (let row: number = rowMin; row <= rowMax; row++) {

                    tileInfo = this.tiledMapLayer.getTileInfo(col, row);
                    if (Collision.maskCollidesWithLayers(collisionMask, tileInfo.collisionLayers))
                        return true;

                }
            }
            
            return false;
        }


        destroy = (): void => {
            this.tiledMapLayer = null;

            this.MovingPlatformObject_destroy();
        }

        private tempGlobalPos: Vec2 = new Vec2();
        
    }
}
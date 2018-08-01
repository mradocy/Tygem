/// <reference path="_ref.ts" />

class TiledMapTileLayerPlatform extends Platform {

    constructor() {
        super();
        this.name = "TiledMapTileLayerPlatform";
        this.platformObject = new Collision.TiledMapTileLayerPlatformObject(this);
        this.platformObjects.push(this.platformObject);
    }
    

    platformObject: Collision.TiledMapTileLayerPlatformObject = null;


}
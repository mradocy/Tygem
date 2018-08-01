/// <reference path="_ref.ts" />

/*/////////////////////////////////////////////////////////////////////////////////////

Rules:
- Maps and tilesets must both be exported in .json format.
- No tilemap may have the same name (even in different folders).
- No tileset may have the same name (even in different folders). 
- TiledMap.tilesetImageDirectory must be set to the directory containing the tileset images before creating maps.

Recognized custom properties for tiles:
- material: name of a material as added with Material.addMaterial().
- col: set to "true" to enable collision for this tile.  Specifically sets its tileInfo.collisionLayers = 0x1.
    - Not needed if material is set because setting material will grab its material's collisionLayers property.
    - Set to "false" to disable collision for this tile.
    - Set to a number (e.g. 2, 0xFF) to manually set tileInfo.collisionLayers to a specific value.


*//////////////////////////////////////////////////////////////////////////////////////


namespace TiledMap {

    // Adding maps and tilesets:

    /**
     * The directory of the tileset images in TexPackManager.
     * Must be set before creating maps.
     */
    export let tilesetImageDirectory: string = "";

    /**
     * Adds a tileset.  No two tilesets may have the same name (even if they're in different folders).
     * @param name Name of the tileset.  Must match the name the tileset is referred to by tilemaps.
     * @param tilesetJSON The JSON object to be parsed to create the tileset.
     */
    export function addTileset(name: string, tilesetJSON: any): void {

        if (tilesetJSONDictionary.hasOwnProperty(name) && tilesetJSONDictionary[name] !== "") {
            console.error("Cannot add tileset with name \"" + name + "\" because a tileset with that name has already been added.");
            return;
        }

        tilesetJSONDictionary[name] = tilesetJSON;
    }

    /**
     * Adds a map.  No two maps may have the same name (even if they're in different folders).
     * @param name Name of the map.
     * @param mapJSON The JSON object to be parsed to create the map.
     */
    export function addMap(name: string, mapJSON: any): void {

        if (mapJSONDictionary.hasOwnProperty(name)) {
            console.error("Cannot add map \"" + name + "\" because a map with that name already exists.");
            return;
        }

        mapJSONDictionary[name] = mapJSON;
    }
    

    // Creating maps:
    
    /**
     * Creates MapData for the TiledMap with the given name.  Assumes the JSON for the tiledMap and all tilesets used are already added and loaded.
     * @param mapName Name of the tiledMap to create.
     */
    export function createTiledMapData(mapName: string): MapData {

        if (!mapJSONDictionary.hasOwnProperty(mapName)) {
            console.error("TiledMap " + mapName + " doesn't exist.");
            return null;
        }

        let mapJSON: any = mapJSONDictionary[mapName];
        let map: MapData = new MapData();
        map.parse(mapJSON);
        return map;

    }

    /**
     * Maps the given type to a given function that will parse the objectProperties of all tiled objects that have the given type.
     * @param type The type, as defined by the 'Type' field for an object's properties in Tiled.
     * @param parseFunc Function that parses the objectProperties and returns the GameObject created from it.
     */
    export function addObjectParser(type: string, parseFunc: (objectProperties: TiledMap.Object) => GameObject): void {

        if (type == null || type === "") {
            console.error("Cannot map an empty type to an object parse function");
            return;
        }
        if (objectParserDictionary.hasOwnProperty(type)) {
            console.error("Tiled object parser type " + type + " already exists.");
            return;
        }

        objectParserDictionary[type] = parseFunc;
    }

    /**
     * Uses parse functions added with addObjectParser() to parse the given mapObject.  Returns the GameObject created, or null if no parser for the given map object could be found.
     * @param mapObject The map object to parse.  Its type property determines which parse function to use.
     */
    export function parseMapObject(mapObject: TiledMap.Object): GameObject {
        if (mapObject == null)
            return null;
        if (mapObject.type === "") {
            console.warn("Map objects with type \"\" cannot be parsed.");
            return;
        }
        if (objectParserDictionary.hasOwnProperty(mapObject.type)) {
            return objectParserDictionary[mapObject.type](mapObject);
        }

        console.warn("No object parser found mapped to the type \"" + mapObject.type + "\".  Add a parse function in addObjectParser().");
        return null;
    }

    /**
     * Represents a layer of a TiledMap.  Overridden by TileLayer and ObjectLayer.
     */
    export class Layer {

        constructor() {
            this.type = LayerType.NONE;
        }

        /**
         * Name of the layer.
         */
        name: string = "";

        /**
         * Type of the layer.
         */
        type: LayerType;

        /**
         * Reference to the TiledMap the layer belongs to.
         */
        mapData: MapData = null;
        /**
         * Index of this layer in the TiledMap the layer belongs to.
         */
        layerIndex: number = 0;

        /**
         * Width of the layer in tiles.  Should be the same as the map's width.
         */
        width: number = 0;
        /**
         * Width of the layer in tiles.  Should be the same as the map's width.
         */
        height: number = 0;

        /**
         * Opacity of the layer as set in Tiled.  Not used currently.
         */
        opacity: number = 1;
        /**
         * Visibility of the layer as set in Tiled.  Not used currently.
         */
        visible: boolean = true;

        /**
         * Object of custom properties defined by the layer.  Guaranteed to be not null and not undefined.
         */
        customProperties: any;

        /**
         * Parses a JSON object exported from Tiled to construct the layer.  No error checking is done.
         */
        parse = (jsonObj: any): void => {
            this.Layer_parse(jsonObj);
        }

        protected Layer_parse = (jsonObj: any): void => {
            this.name = jsonObj.name;
            this.opacity = jsonObj.opacity;
            this.width = jsonObj.width;
            this.height = jsonObj.height;
            this.visible = jsonObj.visible;
            this.customProperties = jsonObj.properties;
            if (this.customProperties == undefined)
                this.customProperties = {};
        }

        dispose = (): void => {
            this.Layer_dispose();
        }

        protected Layer_dispose = (): void => {
            this.mapData = null;
            this.customProperties = null;

            console.log("layer disposed");
        }

    }

    export class TileLayer extends Layer {

        constructor() {
            super();
            this.type = LayerType.TILE_LAYER;
        }
    
        /**
         * Direct access to the tile data.
         */
        tileData: Array<number>;

        /**
         * Gets the number at the given coordinates, or 0 if coordinates are invalid. 
         */
        getTileData = (x: number, y: number): number => {
            if (!this.coordinatesAreValid(x, y)) {
                return 0;
            }
            return this.tileData[x + y * this.width];
        }
    
        /**
         * Gets the global tile id at the given coordinates, stripped of its transform flags.
         */
        getGID = (x: number, y: number): number => {
            let data: number = this.getTileData(x, y);
            // clear transform flags
            let gid = data & ~(
                FLIPPED_HORIZONTALLY_FLAG |
                FLIPPED_VERTICALLY_FLAG |
                FLIPPED_DIAGONALLY_FLAG);

            return gid;
        }

        /**
         * Gets the TileInfo of the tile at the given coordinates, or null if coordinates are invalid. 
         */
        getTileInfo = (x: number, y: number): TileInfo => {
            return this.mapData.getTileInfo(this.getGID(x, y));
        }

        /**
         * Sets the number at the given coordinates.
         */
        setTileData = (x: number, y: number, data: number): void => {
            if (!this.coordinatesAreValid(x, y)) {
                console.warn("Cannot set GID at x: " + x + " y: " + y + ", coordinates are invalid");
                return;
            }

            this.tileData[x + y * this.width] = data;
        }

        /**
         * Sets the global tile id at the given coordinates.
         */
        setGID = (x: number, y: number, gid: number, flippedHoriz: boolean = false, flippedVert: boolean = false, flippedDiag: boolean = false): void => {

            let val: number = gid;
            if (flippedHoriz)
                val |= FLIPPED_HORIZONTALLY_FLAG;
            if (flippedVert)
                val |= FLIPPED_VERTICALLY_FLAG;
            if (flippedDiag)
                val |= FLIPPED_DIAGONALLY_FLAG;

            this.setTileData(x, y, val);
        }
    
        /**
         * Gets if the given coordinates are valid (i.e. are contained in the map).
         */
        coordinatesAreValid = (x: number, y: number): boolean => {
            if (isNaN(x)) return false;
            if (isNaN(y)) return false;
            if (x < 0 || x >= this.width) return false;
            if (y < 0 || y >= this.height) return false;
            return true;
        }

        /**
         * Parses a JSON object exported from Tiled to construct the layer.  No error checking is done.
         */
        parse = (jsonObj: any): void => {
            this.Layer_parse(jsonObj);

            this.tileData = jsonObj.data;
        }

        
        /*
        bool flipped_horizontally = (global_tile_id & FLIPPED_HORIZONTALLY_FLAG);
        bool flipped_vertically = (global_tile_id & FLIPPED_VERTICALLY_FLAG);
        bool flipped_diagonally = (global_tile_id & FLIPPED_DIAGONALLY_FLAG);
        */


        dispose = (): void => {
            this.tileData.splice(0);
            this.tileData = null;

            this.Layer_dispose();
        }


    }

    // Flags used for tile rotation.  Currently these flags are removed from tile gids, but no tile rotation is supported.
    export const FLIPPED_HORIZONTALLY_FLAG: number = 0x80000000;
    export const FLIPPED_VERTICALLY_FLAG: number = 0x40000000;
    export const FLIPPED_DIAGONALLY_FLAG: number = 0x20000000;

    export enum LayerType {
        NONE,
        TILE_LAYER,
        OBJECT_GROUP,
        IMAGE_LAYER
    }


    /**
     * Class containing info for a tile.  Can be obtained with MapData.getTileInfo(gid).
     */
    export class TileInfo {
        
        /**
         * id of the tile within its tileset.
         */
        id: number = 0;

        /**
         * Reference to the tileset this tile belongs to.
         */
        tileset: Tileset = null;

        /**
         * Material of this tile.  Set by setting a custom property for a tile with the name "material" in Tiled.
         * Value should match a tile added by Material.addMaterial().
         */
        material: string = "";

        /**
         * Collision layers for this tile.  Set by grabbing the collisionLayers property from the material defined by the "material" custom property in Tiled.
         * The bits of this integer represent the masks this PlatformObject will collide with.  Note that 0 means no collision.
         * "I am a"
         */
        collisionLayers: number = 0;

        /**
         * Object of all custom properties defined for the tile in Tiled.
         */
        customProperties: any;

        /**
         * TileInfo representing a tile with a gid of 0.
         */
        static get empty(): TileInfo { return TileInfo._empty; }
        private static _empty: TileInfo = new TileInfo();
        
        /**
         * Creates a new TileInfo, using a recycled TileInfo if possible.
         * @param tileset Tileset the tile belongs to.
         * @param id id of the tile in the Tileset.
         */
        static createNew(tileset: Tileset, id: number): TileInfo {
            let ret: TileInfo = null;
            if (TileInfo.recycledTileInfos.length > 0) {
                ret = TileInfo.recycledTileInfos.pop();
                ret.recycled = false;
            } else {
                ret = new TileInfo();
            }
            ret.tileset = tileset;
            ret.id = id;
            ret.material = "";
            ret.collisionLayers = 0;
            ret.customProperties = null;
            return ret;
        }
        /**
         * Recycles a TileInfo to be used later.  Dereferences properties on the tileInfo as well.
         * @param tileInfo
         */
        static recycle(tileInfo: TileInfo): void {
            if (tileInfo == null) return;
            if (tileInfo.recycled) return;
            // dispose
            tileInfo.tileset = null;
            tileInfo.customProperties = null;
            TileInfo.recycledTileInfos.push(tileInfo);
            tileInfo.recycled = true;
        }
        private recycled: boolean = false;
        private static recycledTileInfos: Array<TileInfo> = [];

    }

    
    export class Tileset {
        
        /**
         * Key used to access the packed image for this tileset.
         */
        packedImageFilename: string = "";

        /**
         * Reference to the packed image for this tileset.
         */
        packedImage: TexPackManager.PackedImage = null;
        
        /**
         * Number of tiles defined in this tileset.
         */
        numTiles: number = 0;

        /**
         * Width of the image in pixels.
         */
        imageWidth: number = 0;
        /**
         * Height of the image in pixels.
         */
        imageHeight: number = 0;
    
        /**
         * Width of each tile, in pixels
         */
        tileWidth: number = 0;
        /**
         * Height of each tile, in pixels
         */
        tileHeight: number = 0;

        /**
         * Object of custom properties for the tileset defined in Tiled.  Guaranteed to not be null.
         */
        customProperties: any;
    
        /**
         * Calculates the number of columns in this tileset (it's not provided for some reason).  Calculation currently does not take into account margin or spacing.
         */
        getNumColumns = (): number => {
            return Math.floor(this.imageWidth / this.tileWidth);
        }
    
        /**
         * Array of info for all the tiles in this tileset.  tileInfos[id] is the TileInfo for the tile with id id.
         * Guaranteed to contain an entry for every tile id in this tileset.
         */
        tileInfos: Array<TileInfo>;
        
    
        /**
         * Parses the tileset from a given JSON object made in Tiled for the tileset.
         */
        parse = (tilesetJSON: any): void => {

            if (tilesetImageDirectory == null || tilesetImageDirectory == "") {
                console.error("TiledMap.tilesetImageDirectory must be defined before creating tilesets.");
            }

            this.packedImageFilename = tilesetImageDirectory + nameFromUrl(tilesetJSON.image) + ".png";
            this.packedImage = TexPackManager.getPackedImage(this.packedImageFilename);

            if (this.packedImage === null) {
                console.error("tileset image \"" + this.packedImageFilename + "\" does not exist.");
                return;
            }

            this.imageWidth = tilesetJSON.imagewidth;
            this.imageHeight = tilesetJSON.imageHeight;

            if (tilesetJSON.margin != 0) {
                console.warn("the \"margin\" property for tilesets is currently not implemented.");
            }
            if (tilesetJSON.spacing != 0) {
                console.warn("the \"spacing\" property for tilesets is currently not implemented.");
            }

            this.tileWidth = tilesetJSON.tilewidth;
            this.tileHeight = tilesetJSON.tileheight;
            this.numTiles = tilesetJSON.tilecount;
            this.customProperties = tilesetJSON.properties;
            if (this.customProperties == null)
                this.customProperties = {};
            
            // create tile infos
            this.dispose();
            this.tileInfos = [];
            for (let i: number = 0; i < this.numTiles; i++) {
                let ti: TileInfo = TileInfo.createNew(this, i);
                this.tileInfos.push(ti);
            }
            if (tilesetJSON.tileproperties != undefined) {
                for (var id in tilesetJSON.tileproperties) {
                    let tileInfo: TileInfo = this.tileInfos[id];
                    let props: any = tilesetJSON.tileproperties[id];

                    // parsing tile custom properties
                    tileInfo.customProperties = props;
                    if (props.hasOwnProperty("material")) {
                        tileInfo.material = props.material;
                        let material: any = Material.getMaterial(tileInfo.material);
                        if (material === null) {
                            this.logTileError(id, "Material " + tileInfo.material + " does not exist.  Was it mispelled in Tiled or not added? ");
                        } else {
                            tileInfo.collisionLayers = Material.getNumber(tileInfo.material, "collisionLayers", 0);
                        }
                    }
                    if (props.hasOwnProperty("col")) {
                        if (props.col === "true" || props.col === "TRUE") {
                            tileInfo.collisionLayers = 0x1;
                        } else if (props.col === "false" || props.col === "FALSE") {
                            tileInfo.collisionLayers = 0;
                        } else {
                            tileInfo.collisionLayers = Number.parseInt(props.col);
                            if (isNaN(tileInfo.collisionLayers)) {
                                this.logTileError(id, "collisionLayers must be set to an integer.");
                                tileInfo.collisionLayers = 0;
                            }
                        }
                    }
                    
                }
            }


        }

        /**
         * Recycles all the TileInfos defined in this Tileset, then gets rid of the array containing them.
         * Clears references.
         */
        dispose = (): void => {

            if (this.tileInfos == null) return;
            for (let i: number = 0; i < this.tileInfos.length; i++) {
                TileInfo.recycle(this.tileInfos[i]);
            }
            this.tileInfos.splice(0);
            this.tileInfos = null;

            this.packedImage = null;
            this.customProperties = null;
        }

        private logTileError = (id: number, message: string): void => {
            console.error("(Tileset using image " + this.packedImageFilename + ", tile id " + id + "): " + message);
        }

    }

    

    /**
     * Class for parsed objects from Tiled object layers.
     */
    export class Object {

        /**
         * Name of the object, as defined in Tiled.
         */
        name: string = "";

        /**
         * Type as defined by the used in Tiled.
         */
        type: string = "";

        /**
         * ID, which is automatically set in Tiled.
         */
        id: number = 0;

        x: number = 0;
        y: number = 0;
        rotation: number = 0;
        width: number = 0;
        height: number = 0;

        objectType: ObjectType;

    
        /**
         * Points for the polygon/polyline, if this object is the POLYGON or POLYLINE type.
         */
        points: Array<Vec2> = [];

        /**
         * Object of custom properties defined in Tiled.  Guaranteed to be not null and not undefined.
         */
        customProperties: any;

        /**
         * The ObjectGroup this object comes from.
         */
        objectGroup: ObjectGroup = null;

        /**
         * Parses from a JSON exported from Tiled.
         */
        parse = (jsonObject: any): void => {

            let objPoints: any = null;

            this.name = jsonObject.name;
            this.type = jsonObject.type;
            this.id = jsonObject.id;
            this.x = jsonObject.x;
            this.y = jsonObject.y;
            this.rotation = jsonObject.rotation;
            this.width = jsonObject.width;
            this.height = jsonObject.height;

            if (jsonObject.ellipse != undefined && jsonObject.ellipse == true) {
                this.objectType = ObjectType.ELLIPSE;
            } else if (jsonObject.polygon != undefined) {
                this.objectType = ObjectType.POLYGON;
                objPoints = jsonObject.polygon;
            } else if (jsonObject.polyline != undefined) {
                this.objectType = ObjectType.POLYLINE;
                objPoints = jsonObject.polyline;
            } else {
                this.objectType = ObjectType.RECTANGLE;
            }

            if (objPoints != null) {
                // parse points
                for (let i: number = 0; i < objPoints.length; i++) {
                    this.points.push(new Vec2(objPoints[i].x, objPoints[i].y));
                }
            }

            this.customProperties = jsonObject.properties;
            if (this.customProperties == null)
                this.customProperties = {};

        }
        
    }


    export enum ObjectType {
        NONE,
        RECTANGLE,
        ELLIPSE,
        POLYGON,
        POLYLINE
    }



    export class ObjectGroup extends Layer {

        constructor() {
            super();
            this.type = LayerType.OBJECT_GROUP;
        }

        /**
         * Array of all the TiledMapObjects defined in this group.
         */
        mapObjects: Array<Object> = [];

        /**
         * Parses a JSON object exported from Tiled to construct the object group.  No error checking is done.
         */
        parse = (jsonObj: any): void => {
            this.Layer_parse(jsonObj);

            for (let i: number = 0; i < jsonObj.objects.length; i++) {
                let mapObj: Object = new Object();
                mapObj.parse(jsonObj.objects[i]);
                mapObj.objectGroup = this;
                this.mapObjects.push(mapObj);
            }

        }

        dispose = (): void => {

            this.mapObjects.splice(0);
            this.mapObjects = null;

            this.Layer_dispose();
        }

    }

    

    

    

    export class MapData {
        
        /**
         * Parse a JSON object exported from Tiled.
         */
        parse = (jsonObj: any): void => {

            if (this._parsed) {
                console.error("TileMap already parsed, cannot be parsed again.");
                return;
            }

            this.height = jsonObj.height;
            this.width = jsonObj.width;
            this.tileWidth = jsonObj.tilewidth;
            this.tileHeight = jsonObj.tileheight;
            this.customProperties = jsonObj.properties;
            if (this.customProperties == undefined)
                this.customProperties = {};

            for (let i: number = 0; i < jsonObj.layers.length; i++) {
                let layer: Layer = null;

                // get type of layer
                let type: LayerType;
                let typeStr: string = jsonObj.layers[i].type;
                if (typeStr === "tilelayer") {
                    type = LayerType.TILE_LAYER;
                } else if (typeStr === "objectgroup") {
                    type = LayerType.OBJECT_GROUP;
                } else if (typeStr === "imagelayer") {
                    type = LayerType.IMAGE_LAYER;
                }
                switch (type) {
                    case LayerType.TILE_LAYER:
                        layer = new TileLayer();
                        break;
                    case LayerType.OBJECT_GROUP:
                        layer = new ObjectGroup();
                        break;
                    case LayerType.IMAGE_LAYER:
                        layer = null;
                        break;
                }

                // parse layer
                if (layer == null) {
                    console.error("Layer type " + LayerType[type] + " not supported yet.");
                } else {
                    layer.mapData = this;
                    layer.layerIndex = i;
                    layer.parse(jsonObj.layers[i]);

                    this.layers.push(layer);
                }

            }


            // parsing tilesets
            this._tilesets.splice(0);
            for (let i: number = 0; i < jsonObj.tilesets.length; i++) {

                let firstGID: number = jsonObj.tilesets[i].firstgid;
                let tileset: Tileset = null;

                if (jsonObj.tilesets[i].source == undefined) {
                    // defines tileset

                    tileset = new Tileset();
                    tileset.parse(jsonObj.tilesets[i]);

                } else {
                    // references external tileset

                    let tilesetName: string = nameFromUrl(jsonObj.tilesets[i].source);

                    if (MapData.externalTilesetExists(tilesetName)) {
                        tileset = MapData.getExternalTileset(tilesetName);

                    } else {
                        // need to create tileset first

                        tileset = new Tileset();

                        let tilesetJSON: any = null;
                        if (tilesetJSONDictionary.hasOwnProperty(tilesetName)) {
                            tilesetJSON = tilesetJSONDictionary[tilesetName];
                        }
                        if (tilesetJSON == null || tilesetJSON == "") {
                            console.error("JSON for external tileset \"" + tilesetName + "\" does not exist.");
                            continue;
                        }

                        tileset.parse(tilesetJSON);

                        // adds external tileset for later use
                        MapData.addExternalTileset(tilesetName, tileset);

                    }

                }

                // add to list of tilesets for this map
                this._tilesets.push(new TilesetElement(firstGID, tileset));

            }

            // sort tilesets for this map by firstGID
            this._tilesets.sort(
                function (t1: TilesetElement, t2: TilesetElement): number {
                    return t1.firstGID - t2.firstGID;
                }
            );


            this._parsed = true;

        }

        /**
         * Height of the map, in number of tiles.
         */
        height: number = 0;

        /**
         * Width of the map, in number of tiles.
         */
        width: number = 0;

        /**
         * Width of the tiles, in pixels.
         */
        tileWidth: number = 0;

        /**
         * Height of the tiles, in pixels.
         */
        tileHeight: number = 0;

        /**
         * Object of custom properties defined by the map.  Guaranteed to be not null and not undefined.
         */
        customProperties: any;

        /**
         * The layers contained in this map.
         */
        layers: Array<Layer> = [];

        /**
         * Returns the TiledMapLayer with the given name, or null if no layer with the name exists in this map.
         */
        getLayerByName = (name: string): Layer => {
            for (let i: number = 0; i < this.layers.length; i++) {
                if (this.layers[i].name === name)
                    return this.layers[i];
            }
            return null;
        }

        /**
         * Returns the TiledMapTileLayer with the given name, or null if no tile layer with the name exists in this map.
         */
        getTileLayerByName = (name: string): TileLayer => {
            for (let i: number = 0; i < this.layers.length; i++) {
                if (this.layers[i].name === name &&
                    (this.layers[i] instanceof TileLayer))
                    return this.layers[i] as TileLayer;
            }
            return null;
        }
        
        /**
         * Gets info for the tile with the given global id.
         * Returns TileInfo.empty if the gid is 0.
         * Returns null if the gid is invalid.
         */
        getTileInfo = (gid: number): TileInfo => {
            if (gid < 0) return null;
            if (gid === 0) return TileInfo.empty;

            // get tileset
            let tilesetElement: TilesetElement = null;
            for (let i: number = 1; i < this._tilesets.length; i++) {
                if (gid < this._tilesets[i].firstGID) {
                    tilesetElement = this._tilesets[i - 1];
                    break;
                }
            }
            if (tilesetElement === null)
                tilesetElement = this._tilesets[this._tilesets.length - 1];

            // get info
            let id: number = gid - tilesetElement.firstGID;
            if (id < 0 || id >= tilesetElement.tileset.tileInfos.length)
                return null;
            return tilesetElement.tileset.tileInfos[id];
        }

        /**
         * Creates a GameObject, where each child is a GameObject with a TiledMapTileLayerRenderer component corresponding to each tile layer.
         * Then every map Object is parsed with functions given by addObjectParser().
         * Returns the created GameObject.
         */
        createGameObject = (): GameObject => {
            if (!this._parsed) {
                console.error("Cannot create GameObject, TiledMap hasn't been parsed");
                return null;
            }

            let rootGO: GameObject = new GameObject();
            let tiledMapComponent: TiledMapComponent = rootGO.addComponent(TiledMapComponent);
            tiledMapComponent.mapData = this;

            for (let i: number = 0; i < this.layers.length; i++) {
                if (this.layers[i].type !== LayerType.TILE_LAYER)
                    continue;

                let tileLayer: TileLayer = (this.layers[i] as TileLayer);
                let tileLayerGO: GameObject = new GameObject();
                let renderer: TiledMapTileLayerRenderer = tileLayerGO.addComponent(TiledMapTileLayerRenderer);
                renderer.tiledMapLayer = tileLayer;

                let platform: TiledMapTileLayerPlatform = tileLayerGO.addComponent(TiledMapTileLayerPlatform);
                platform.platformObject.tiledMapLayer = tileLayer;

                tileLayerGO.transform.setParent(rootGO.transform);
            }

            this.callOnAllMapObjects(parseMapObject);

            return rootGO;
        }

        /**
         * Calls a function on all TiledMapObjects in the map.
         */
        callOnAllMapObjects = (func: (mapObject: Object) => void): void => {

            for (let i: number = 0; i < this.layers.length; i++) {
                if (this.layers[i].type !== LayerType.OBJECT_GROUP)
                    continue;

                let objectGroup: ObjectGroup = (this.layers[i] as ObjectGroup);
                objectGroup.mapObjects.forEach(func);
            }

        }
        

        dispose = (): void => {

            this.layers.forEach(
                function (layer: Layer): void {
                    layer.dispose();
                }
            );
            this.layers = null;

            this._tilesets.forEach(
                function (tilesetElement: TilesetElement): void {
                    tilesetElement.tileset.dispose();
                }
            );
            this._tilesets = null;

            this.customProperties = null;

            console.log("map data disposed");

        }


        private _tilesets: Array<TilesetElement> = [];


        private _parsed: boolean = false;

        private static addExternalTileset(tilesetName: string, tileset: Tileset): void {
            if (MapData.externalTilesetExists(tilesetName)) {
                console.warn("Tileset with name \"" + tilesetName + "\" already exists.");
                return;
            }

            MapData.externalTilesets[tilesetName] = tileset;
        }

        private static getExternalTileset(tilesetSource: string): Tileset {
            if (MapData.externalTilesetExists(tilesetSource)) {
                console.error("Tileset \"" + tilesetSource + "\" does not exist.");
                return null;
            }

            return MapData.externalTilesets[tilesetSource];
        }

        private static externalTilesetExists(tilesetName: string): boolean {
            return MapData.externalTilesets.hasOwnProperty(tilesetName);
        }

        private static externalTilesets: { [name: string]: Tileset; } = {};

    }
    
    /**
     * Object containing a reference to a tileset and the first global id represented by that tileset in the current map.
     */
    class TilesetElement {
        constructor(firstGID: number, tileset: Tileset) {
            this.firstGID = firstGID;
            this.tileset = tileset;
        }
        firstGID: number;
        tileset: Tileset;
    }
    
    /**
     * Strips the directory and path from the given url, leaving only the name.
     */
    function nameFromUrl(url: string): string {

        let index: number = Math.max(url.lastIndexOf("/"), url.lastIndexOf("\\"));
        let trimmedStr: string;
        if (index == -1) {
            trimmedStr = url;
        } else {
            trimmedStr = url.slice(index + 1);
        }
        index = trimmedStr.lastIndexOf(".");
        if (index != -1) {
            trimmedStr = trimmedStr.slice(0, index);
        }

        return trimmedStr;
    }
    
    let mapJSONDictionary: { [key: string]: any; } = {};
    let tilesetJSONDictionary: { [key: string]: any; } = {};
    let objectParserDictionary: { [key: string]: (objectProperties: TiledMap.Object) => GameObject; } = {};

}
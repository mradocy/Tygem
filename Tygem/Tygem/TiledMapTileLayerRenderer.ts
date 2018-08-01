/// <reference path="_ref.ts" />

class TiledMapTileLayerRenderer extends DrawerComponent {

    constructor() {
        super();
        this.name = "TiledMapTileLayerRenderer";
    }

    /**
     * The TileLayer data this renderer is drawing.
     */
    tiledMapLayer: TiledMap.TileLayer = null;

    /**
     * Gets the map data this tile layer is a part of.
     */
    getMapData = (): TiledMap.MapData => {
        return this.tiledMapLayer.mapData;
    }

    /**
     * Gets the TiledMapComponent representing the map data this tile layer is a part of.
     * TiledMapComponent should be in the parent transform.
     */
    getTiledMapComponent = (): TiledMapComponent => {
        return this.getTransform().getParent().gameObject.getComponent(TiledMapComponent);
    }
    

    /**
     * Won't draw tiles that aren't on the camera.  Assumes the map doesn't scale or rotate, isn't the child of another Transform.
     */
    cameraCulling: boolean = true;



    onAwake = (): void => {
        this._transform = this.getTransform();
    }

    draw = (context: CanvasRenderingContext2D): void => {

        if (this.tiledMapLayer == null) {
            console.error("Must set TiledMapTileLayerRenderer.tiledMapLayer");
            return;
        }

        // disable image smoothing for a pixelated look.  Also helps with texture bleeding
        (context as any).imageSmoothingEnabled = false;

        let tileXMin: number = 0;
        let tileXMax: number = this.tiledMapLayer.width;
        let tileYMin: number = 0;
        let tileYMax: number = this.tiledMapLayer.height;
        let tileWidth: number = this.tiledMapLayer.mapData.tileWidth;
        let tileHeight: number = this.tiledMapLayer.mapData.tileHeight;

        // restricting tiles drawn to only those visible on screen
        if (this.cameraCulling) {

            let boundXMin: number = Camera.leftBound;
            let boundYMin: number = Camera.topBound;
            let boundXMax: number = Camera.rightBound;
            let boundYMax: number = Camera.bottomBound;

            let minPoint: Vec2 = this._transform.globalToLocal(boundXMin, boundYMin);
            let maxPoint: Vec2 = this._transform.globalToLocal(boundXMax, boundYMax);

            tileXMin = Math.max(0, Math.min(this.tiledMapLayer.width - 1, Math.floor(minPoint.x / tileWidth - 2)));
            tileYMin = Math.max(0, Math.min(this.tiledMapLayer.height - 1, Math.floor(minPoint.y / tileHeight - 2)));
            tileXMax = Math.max(1, Math.min(this.tiledMapLayer.width, Math.floor(maxPoint.x / tileWidth + 2) + 1));
            tileYMax = Math.max(1, Math.min(this.tiledMapLayer.height, Math.floor(maxPoint.y / tileHeight + 2) + 1));

        }

        let data: number = 0;
        let gid: number = 0;
        let id: number = 0;
        let tileData: Array<number> = this.tiledMapLayer.tileData;
        let layerWidth: number = this.tiledMapLayer.width;
        let flagCombo: number = TiledMap.FLIPPED_HORIZONTALLY_FLAG | TiledMap.FLIPPED_VERTICALLY_FLAG | TiledMap.FLIPPED_DIAGONALLY_FLAG;
        let tileInfo: TiledMap.TileInfo = null;
        let tileset: TiledMap.Tileset = null;
        let packedImage: TexPackManager.PackedImage = null;
        let numColumns: number = 0;
        let tilesetX: number = 0;
        let tilesetY: number = 0;

        let rectX: number = 0;
        let rectY: number = 0;
        let rectWidth: number = 0;
        let rectHeight: number = 0;
        let canvasOffsetX: number = 0;
        let canvasOffsetY: number = 0;

        let piLeft: number = 0;
        let piRight: number = 0;
        let piPivotX: number = 0;
        let piTop: number = 0;
        let piBottom: number = 0;
        let piPivotY: number = 0;

        for (let x: number = tileXMin; x < tileXMax; x++) {
            for (let y: number = tileYMin; y < tileYMax; y++) {

                data = tileData[x + y * layerWidth];
                if (data === 0) continue;

                gid = data & ~flagCombo;
                tileInfo = this.tiledMapLayer.mapData.getTileInfo(gid);
                tileset = tileInfo.tileset;
                id = tileInfo.id;

                numColumns = tileset.getNumColumns();
                tilesetX = id % numColumns;
                tilesetY = Math.floor(id / numColumns);
                
                rectX = tilesetX * tileset.tileWidth;
                rectY = tilesetY * tileset.tileHeight;
                rectWidth = tileset.tileWidth;
                rectHeight = tileset.tileHeight;
                canvasOffsetX = x * this.tiledMapLayer.mapData.tileWidth;
                canvasOffsetY = y * this.tiledMapLayer.mapData.tileHeight;
                
                // get positions from the packed image
                packedImage = tileset.packedImage;
                piLeft = packedImage.frameX + Math.max(0, rectX - packedImage.trimLeft);
                piRight = packedImage.frameX + Math.min(packedImage.frameWidth, rectX + rectWidth - packedImage.trimLeft);
                piPivotX = packedImage.frameX + rectX + - packedImage.trimLeft;
                piTop = packedImage.frameY + Math.max(0, rectY - packedImage.trimTop);
                piBottom = packedImage.frameY + Math.min(packedImage.frameHeight, rectY + rectHeight - packedImage.trimTop);
                piPivotY = packedImage.frameY + rectY + - packedImage.trimTop;
                piPivotX = Math.floor(piPivotX + .001);
                piPivotY = Math.floor(piPivotY + .001);

                // rotations not implemented

                // draw image normally, without effects
                context.drawImage(packedImage.atlasImage,
                    piLeft, piTop, piRight - piLeft, piBottom - piTop,
                    canvasOffsetX + piLeft - piPivotX, canvasOffsetY + piTop - piPivotY, piRight - piLeft, piBottom - piTop);
                

            }
        }


    }

    onDestroy = (): void => {
        this.tiledMapLayer = null;
    }

    private _transform: Transform;

}


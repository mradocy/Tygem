/// <reference path="_ref.ts" />

/**
 * Component containing the map data and layers for a tiled map.
 * The root GameObject created with TiledMap.createGameObject() has this component.
 */
class TiledMapComponent extends Component {

    constructor() {
        super();
        this.name = "TiledMapComponent";
    }

    mapData: TiledMap.MapData = null;




    onDestroy = (): void => {
        this.mapData.dispose();
        this.mapData = null;
    }


}
/// <reference path="../../Tygem/_ref.ts" />

namespace Scenes {

    export class TestScene3 extends Scene {

        onLoad = (): void => {

            // zoom in camera
            Camera.scale = 2;

            // no gravity
            Collision.gravityX = 0;
            Collision.gravityY = 0;
            
            // creating tiled map
            let tm: TiledMap.MapData = TiledMap.createTiledMapData("test5");

            // create tile layers and parse objects
            let tmGO: GameObject = tm.createGameObject();

            let go: GameObject;

            //go = new GameObject();
            //go.addComponent(Comps.ControlCameraWithWASD);
            

            // center camera on hero
            go = GameObject.findObject("Hero");
            Camera.setCenter(go.transform.getGlobalPosition());
            





        }
        
    }

}

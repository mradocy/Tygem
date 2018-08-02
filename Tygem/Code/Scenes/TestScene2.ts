/// <reference path="../../Tygem/_ref.ts" />

namespace Scenes {

    export class TestScene2 extends Scene {
        
        onLoad = (): void => {

            // zoom in camera
            Camera.scale = 2;


            // make GameObjects
            
            //let thing2: GameObject = Prefabs.Thing2();
            //thing2.name = "thing 2";
            //thing2.transform.x = -50;
            //thing2.transform.y = -100;


            //let sealime: GameObject = Prefabs.Sealime();
            //sealime.name = "sealime";
            //sealime.transform.x = 10;
            //sealime.transform.y = 10;


            let platformGO: GameObject = Prefabs.TestPlatform();
            platformGO.name = "PlatformGO";
            platformGO.transform.x = -10;
            platformGO.transform.y = 100;

            platformGO = Prefabs.TestPlatform();
            platformGO.transform.x = 50;
            platformGO.transform.y = 80;


            let platformGO2: GameObject = Prefabs.TestPlatform2();
            platformGO2.transform.x = -60;
            platformGO2.transform.y = -100;



            // creating tiled map
            let tm: TiledMap.MapData = TiledMap.createTiledMapData("test4");

            // create tile layers and parse objects
            let tmGO: GameObject = tm.createGameObject();
            //let tmGO: GameObject = tm.createGameObject(
            //    function (mapObject: TiledMap.Object): void {

            //        console.log(mapObject);
            //        console.log("idea: map mapObject.type to a (objectProperties: TiledMap.Object) => GameObject, which are the prefab functions.");

            //    }
            //);
            //tmGO.transform.setGlobalPosition(-300, -200);
            // moving tiled map
            let tilePlatforms: Array<TiledMapTileLayerPlatform> = tmGO.getComponentsInChildren(TiledMapTileLayerPlatform);
            tilePlatforms.forEach(
                function (tilePlatform: TiledMapTileLayerPlatform): void {
                    tilePlatform.gameObject.addComponent(Comps.MovePlatformWithIJKL);
                }
            );
            



            let go: GameObject = new GameObject();
            let fm: Comps.FacesMouse = go.addComponent(Comps.FacesMouse);
            let rtg: RaycastTestGizmo = go.addComponent(RaycastTestGizmo);
            rtg.distance = 300;

            go = new GameObject();
            go.addComponent(Comps.ControlCameraWithWASD);

            go = new GameObject();
            go.addComponent(Comps.DotFollowsMouse);
            


            go = new GameObject();
            go.addComponent(Comps.TestSound);


        }

        onUnload = (): void => { }

    }

}

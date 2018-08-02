/// <reference path="../../Tygem/_ref.ts" />

namespace Scenes {

    export class TestScene extends Scene {
        
        onLoad = (): void => {

            // make GameObjects

            let gridGO: GameObject = new GameObject();
            let gridPir: PackedImageRenderer = gridGO.addComponent(PackedImageRenderer);
            gridPir.setImageByName("grid.png");
            gridPir.setImageRect(0, 0, 200, 200);
            gridPir.order = -1;


            let thing1: GameObject = Prefabs.Thing1();
            thing1.name = "thing 1";
            thing1.transform.y = 100;

            let thing2: GameObject = Prefabs.Thing2();

            thing2.sendMessage("messageF", 4);
            
            


            // creating tiled map
            let tm: TiledMap.MapData = TiledMap.createTiledMapData("test2");
            tm.createGameObject();
            

            // testing SaveBox
            //localStorage.clear();

            let sb: SaveBox;
            if (SaveBox.getSaveFileIndices().indexOf(0) == -1) {
                sb = SaveBox.createNewSaveBox();
                sb.fileIndex = 0;
            } else {
                sb = SaveBox.openSaveBox(0);
            }
            sb.setNumber("n1", 23);
            sb.setNumber("n2", -5);
            sb.setBool("b1", true);
            sb.setString("s1", "ok");
            sb.setString("s2", "\"quote\"s");
            sb.setString("s3", "\nnewlines\ns");
            sb.setString("s4", "|bar|s");
            sb.setString("s5 - js< on[{]}: th % i\"'ng|s$%0%", "js<on[{]}: th%i\"'ng|s$%0%");
            sb.setStringObject("s6", {what: "are", you: "doing"});
            sb.addNumberListElement("nl2", 1);
            sb.setNumberListElements("nl", [0, 1, 2, 3, 4, 5]);
            sb.setNumberListElements("nl2", [6, 7, 8]);
            sb.addNumberListElement("nl2", 8, true);
            
            sb.saveToLocalStorage();

            let lssb: SaveBox = new SaveBox();
            lssb.fileIndex = sb.fileIndex;
            lssb.loadFromLocalStorage();
            lssb = lssb.clone(1);

            // console logs testing SaveBox
            //console.log(sb.saveToString());
            //console.log(lssb.saveToString());
            //console.log(sb.saveToString() == lssb.saveToString());

            


        }

        onUnload = (): void => { }

    }

}
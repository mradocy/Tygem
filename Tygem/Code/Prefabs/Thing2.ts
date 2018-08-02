/// <reference path="../../Tygem/_ref.ts" />

namespace Prefabs {

    export function Thing2(): GameObject {

        let go: GameObject = new GameObject();
        
        // adding component
        let pir: PackedImageRenderer = go.addComponent(PackedImageRenderer);
        pir.setImageByName("sealime.png");
        pir.setImageRect(128, 0, 128, 64);
        pir.order = 1.1;

        let dg: Comps.DotGraphic = go.addComponent(Comps.DotGraphic);
        dg.order = 999;
        
        // adding child gameObject
        let child: GameObject = new GameObject();
        child.transform.setParent(go.transform);
        child.name = "pengrunt";

        // adding component to child
        let childPir: PackedImageRenderer = child.addComponent(PackedImageRenderer);
        childPir.setImageByName("pengrunt.png");
        childPir.setImageRect(0, 0, 64, 64);
        childPir.order = 1.0;

        // testing effect stuff
        childPir.imageSmoothingEnabled = false;
        childPir.tintColor = "#FF0000";
        childPir.tintAmount = .6;

        // adding Thing2 component
        let thing2: Comps.Thing2 = go.addComponent(Comps.Thing2);
        thing2.pir = pir;
        thing2.child = child;
        thing2.childPir = childPir;

        return go;

    }
    
}
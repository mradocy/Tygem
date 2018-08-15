﻿/// <reference path="../../Tygem/_ref.ts" />

namespace Prefabs {

    export function Log(props: TiledMap.Object): GameObject {

        let go: GameObject = new GameObject();
        
        let tdsr: Comps.TDSpriteRenderer = go.addComponent(Comps.TDSpriteRenderer);
        tdsr.imageSmoothingEnabled = false;
        
        


        // create 'Log' from the Character component
        let character: Comps.Character = go.addComponent(Comps.Character);
        character.animPrefix = "log";
        character.setBounds(0, 10, 6, 6);




        //let actorGizmo: ActorGizmo = go.addComponent(ActorGizmo);
        
        let tdas: Comps.TDActorShadow = go.addComponent(Comps.TDActorShadow);
        tdas.setSize(0, 4, 5, 2);

        return go;
    }
    TiledMap.addObjectParser("Log", Log);

}

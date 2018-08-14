/// <reference path="../../Tygem/_ref.ts" />

namespace Prefabs {

    export function Hero(props: TiledMap.Object): GameObject {

        let go: GameObject = new GameObject();

        let tdActor: Comps.TDActor = go.addComponent(Comps.TDActor);
        tdActor.setBounds(0, 6, 6, 6);

        go.addComponent(ActorGizmo);
        
        let hero: Comps.Hero = go.addComponent(Comps.Hero);

        let tdsr: Comps.TDSpriteRenderer = go.addComponent(Comps.TDSpriteRenderer);
        tdsr.imageSmoothingEnabled = false;

        return go;
    }
    TiledMap.addObjectParser("Hero", Hero);

}

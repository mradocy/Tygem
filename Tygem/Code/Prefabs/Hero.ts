/// <reference path="../../Tygem/_ref.ts" />

namespace Prefabs {

    export function Hero(props: TiledMap.Object): GameObject {

        let go: GameObject = new GameObject();

        let tdActor: Comps.TDActor = go.addComponent(Comps.TDActor);
        tdActor.setBounds(0, 6, 6, 6);

        let actorGizmo: ActorGizmo = go.addComponent(ActorGizmo);
        actorGizmo.disable();
        
        let hero: Comps.Hero = go.addComponent(Comps.Hero);

        let tdsr: Comps.TDSpriteRenderer = go.addComponent(Comps.TDSpriteRenderer);
        tdsr.imageSmoothingEnabled = false;

        let tdas: Comps.TDActorShadow = go.addComponent(Comps.TDActorShadow);
        tdas.setSize(0, 4, 5, 2);

        return go;
    }
    TiledMap.addObjectParser("Hero", Hero);

}

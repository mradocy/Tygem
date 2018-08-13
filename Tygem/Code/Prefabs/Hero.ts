/// <reference path="../../Tygem/_ref.ts" />

namespace Prefabs {

    export function Hero(props: TiledMap.Object): GameObject {

        let go: GameObject = new GameObject();

        let actor: Actor = go.addComponent(Actor);
        actor.offsetX = 0;
        actor.offsetY = 6;
        actor.halfWidth = 6;
        actor.halfHeight = 6;

        go.addComponent(ActorGizmo);

        let sr: SpriteRenderer = go.addComponent(SpriteRenderer);
        sr.imageSmoothingEnabled = false;

        let hero: Comps.Hero = go.addComponent(Comps.Hero);
        
        return go;
    }
    TiledMap.addObjectParser("Hero", Hero);

}

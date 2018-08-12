/// <reference path="../../Tygem/_ref.ts" />

namespace Prefabs {
    
    export function Sealime(props: TiledMap.Object): GameObject {

        let go: GameObject = new GameObject();

        let actor: Actor = go.addComponent(Actor);
        actor.offsetX = 0;
        actor.offsetY = 2;
        actor.halfWidth = 19;
        actor.halfHeight = 17;

        go.addComponent(ActorGizmo);

        go.addComponent(AttachBottom);
        
        let actorTestController: Comps.ArrowTestController = go.addComponent(Comps.ArrowTestController);
        
        let sr: SpriteRenderer = go.addComponent(SpriteRenderer);
        sr.imageSmoothingEnabled = false;
        sr.playAnimationByName("sealime_leap", "sealime_idle");
        sr.order = 1.0;
        sr.tintColor = "blue";
        sr.tintAmount = .5;
        
        return go;
    }
    TiledMap.addObjectParser("Sealime", Sealime);

}

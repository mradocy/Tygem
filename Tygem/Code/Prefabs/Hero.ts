/// <reference path="../../Tygem/_ref.ts" />

namespace Prefabs {

    export function Hero(props: TiledMap.Object): GameObject {
        
        let go: GameObject = new GameObject();

        let tdsr: Comps.TDSpriteRenderer = go.addComponent(Comps.TDSpriteRenderer);
        



        // create 'Hero' from the Character component
        let character: Comps.Character = go.addComponent(Comps.Character);
        character.animPrefix = "hero";
        character.setBounds(0, 6, 6, 6);
        character.maxHealth = 10;
        character.team = Team.PLAYERS;
        character.setAction(0, Actions.ID.SWORD_SLASH);
        character.walkSpeed = 90;
        character.walkAccel = 500;
        character.friction = 800;
        

        // start off as this character
        character.enableInput();
        go.addComponent(Comps.CameraFollow);


        //let actorGizmo: ActorGizmo = go.addComponent(ActorGizmo);
        
        let tdas: Comps.TDActorShadow = go.addComponent(Comps.TDActorShadow);
        tdas.setSize(0, 4, 5, 2);

        return go;

    }
    TiledMap.addObjectParser("Hero", Hero);

}

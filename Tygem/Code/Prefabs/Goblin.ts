/// <reference path="../../Tygem/_ref.ts" />

namespace Prefabs {

    export function Goblin(props: TiledMap.Object): GameObject {

        let go: GameObject = new GameObject();

        let tdsr: Comps.TDSpriteRenderer = go.addComponent(Comps.TDSpriteRenderer);
        



        // create 'Goblin' from the Character component
        let character: Comps.Character = go.addComponent(Comps.Character);
        character.animPrefix = "goblin";
        character.setBounds(0, 7, 6, 6);
        character.maxHealth = 10;
        character.team = Team.ENEMIES;
        character.setAction(0, Actions.ID.SWORD_SLASH);

        

        let actorGizmo: ActorGizmo = go.addComponent(ActorGizmo);
        
        let tdas: Comps.TDActorShadow = go.addComponent(Comps.TDActorShadow);
        tdas.setSize(0, 3, 6, 2);

        return go;
    }
    TiledMap.addObjectParser("Goblin", Goblin);

}

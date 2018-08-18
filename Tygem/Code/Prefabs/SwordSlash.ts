/// <reference path="../../Tygem/_ref.ts" />

namespace Prefabs {

    export function SwordSlash(): GameObject {

        let go: GameObject = new GameObject();

        let sr: SpriteRenderer = go.addComponent(SpriteRenderer);
        sr.imageSmoothingEnabled = false;
        sr.playAnimation("hero_sword_slash");

        let ve: VisualEffect = go.addComponent(VisualEffect);

        return go;
    }

}

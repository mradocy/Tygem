/// <reference path="../../Tygem/_ref.ts" />

namespace Prefabs {

    export function Thing1(): GameObject {

        let go: GameObject = new GameObject();
        
        let pir: PackedImageRenderer = go.addComponent(PackedImageRenderer);
        pir.setImageByName("sealime.png");
        pir.order = 1.0;
        pir.setImageRect(64, 64, 128, 64);

        return go;
    }

}

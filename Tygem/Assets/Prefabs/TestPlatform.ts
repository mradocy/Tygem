/// <reference path="../../Tygem/_ref.ts" />

namespace Prefabs {

    export function TestPlatform(): GameObject {

        let go: GameObject = new GameObject();

        let platform: AABBPlatform = go.addComponent(AABBPlatform);
        platform.setAABB(0, 0, 96 / 2, 32 / 2);
        
        let pir: PackedImageRenderer = go.addComponent(PackedImageRenderer);
        pir.setImageByName("platform.png");
        pir.setImageRect(16, 16, 96, 32);
        pir.imageSmoothingEnabled = false;
        pir.layer = DrawLayer.PLATFORMS;
        pir.tintColor = "red";
        pir.tintAmount = .5;


        return go;
    }

}

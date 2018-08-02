/// <reference path="../../Tygem/_ref.ts" />

namespace Scenes {
    
    export class Preload extends Scene {
        
        onLoad = (): void => {

            // wait for game to finish loading

            let go: GameObject = new GameObject();
            go.addComponent(Comps.Preloader);
            
        }

        onUnload = (): void => { }

    }

}
/// <reference path="_ref.ts" />


/**
 * The first scene loaded by the game by default.  Only contains one GameObject with the BasePreloader component, which starts Game.startScene when all the game's assets are finished loading.
 */
class BasePreloadScene extends Scene {

    onLoad = (): void => {

        // wait for game to finish loading

        let go: GameObject = new GameObject();
        go.addComponent(BasePreloader);

    }

    onUnload = (): void => { }

}
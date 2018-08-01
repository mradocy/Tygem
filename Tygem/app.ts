/// <reference path="tygem/_ref.ts" />


// typescript handbook: http://www.typescriptlang.org/docs/handbook/basic-types.html
// typescript game tutorial: http://www.typescriptgames.com/



// adding assets:

/// <reference path="assets/add_Materials.ts" />
/// <reference path="assets/add_Textures.ts" />
/// <reference path="assets/add_Sounds.ts" />
/// <reference path="assets/add_Scenes.ts" />
/// <reference path="assets/add_Tilemaps.ts" />



Game.preloadScene = "Preload"; // this is optional, default is "BasePreloadScene" which will automatically start Game.startScene once the game is done loading.
Game.startScene = "TestScene2"; // this must be set.




window.onload = () => {
    
    // get canvas and context (must be defined in html already)
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");


    
    // initialize and start game
    Game.initialize(canvas);
    
    
};

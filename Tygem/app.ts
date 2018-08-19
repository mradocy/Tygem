/// <reference path="Tygem/_ref.ts" />


// typescript handbook: http://www.typescriptlang.org/docs/handbook/basic-types.html
// typescript game tutorial: http://www.typescriptgames.com/



// adding assets:

/// <reference path="Code/add_Materials.ts" />
/// <reference path="Code/add_Textures.ts" />
/// <reference path="Code/add_Sounds.ts" />
/// <reference path="Code/add_Scenes.ts" />
/// <reference path="Code/add_Tilemaps.ts" />



Game.preloadScene = "Preload"; // this is optional, default is "BasePreloadScene" which will automatically start Game.startScene once the game is done loading.
Game.startScene = "TestScene3"; // this must be set.

PackedImageRenderer.IMAGE_SMOOTHING_ENABLED_DEFAULT = false; // pixel art style by default for images



window.onload = () => {
    
    // get canvas and context (must be defined in html already)
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");


    
    // initialize and start game
    Game.initialize(canvas);
    



    // setting up the "Download Save Data" button
    document.getElementById("download_save_data").onclick = SaveManager.downloadSaveData;
    

};

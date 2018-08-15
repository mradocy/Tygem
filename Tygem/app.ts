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




window.onload = () => {
    
    // get canvas and context (must be defined in html already)
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");


    
    // initialize and start game
    Game.initialize(canvas);
    


    setUpSaveButtons();
    
};





function setUpSaveButtons(): void {
    document.getElementById("the_button").onclick = thisFunc;
}

function thisFunc(): void {

    if (saveDownloadURL != "") {
        window.URL.revokeObjectURL(saveDownloadURL);
    }

    let data: any = { "a": 1, "b": "1 \n 2 \n \"3\"" };

    let blob: Blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

    saveDownloadURL = window.URL.createObjectURL(blob);
    console.log(saveDownloadURL);
    window.open(saveDownloadURL);
}
let saveDownloadURL: string = "";

//window.URL.createObjectURL("a b c \n d")

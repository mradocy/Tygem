/// <reference path="_ref.ts" />


/**
 * A basic component that loads Game.startScene when all the game's assets are finished loading.
 * Can be overridden.
 */
class BasePreloader extends DrawerComponent {
    
    textFont: string = "24px Verdana";
    textColor: string = "#FFFFFF";

    constructor() {
        super();
        this.name = "BasePreloader";

        this.anchored = true;
    }

    /**
     * Draws percent loaded to the context.
     */
    draw = (context: CanvasRenderingContext2D): void => {

        context.font = this.textFont;
        context.textAlign = "center";
        context.fillStyle = this.textColor;

        let text: string = "";

        if (Game.percentLoaded >= 1 && !Game.userInputSatisfied) {
            text = "Press any key to begin";
        } else {
            text = Math.floor(Game.percentLoaded * 100) + "%";
        }

        context.fillText(
            text,
            Camera.getCanvasWidth() / 2,
            Camera.getCanvasHeight() / 2);

    }

    onUpdate = (): void => {

        this.onUpdate_BasePreloader();

    }

    protected onUpdate_BasePreloader = (): void => {

        // wait for the game to finish loading
        if (Game.ready) {
            if (Game.startScene == "") {
                console.error("Game.startScene must be defined.  This is the scene that will start once the game finishes loading.");
            } else {
                Scene.loadScene(Game.startScene);
            }
        }

    }

}


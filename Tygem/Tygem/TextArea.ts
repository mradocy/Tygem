/// <reference path="_ref.ts" />


class TextArea extends DrawerComponent {
    

    
    textFont: string = "12px Verdana";
    textColor: string = "#FFFFFF";
    textLineSpacing: number = 20;
    
    text: string = "";

    /**
     * Width of the text area in pixels 
     */
    width: number = 100;

    /**
     * Height of the text area in pixels
     */
    height: number = 50;

    constructor() {
        super();
        this.name = "TextArea";

        this.anchored = true;
    }

    /**
     * Draws text the context.
     */
    draw = (context: CanvasRenderingContext2D): void => {

        context.font = this.textFont;
        context.textAlign = "center";
        context.fillStyle = this.textColor;



        let start: number = 0;
        let end: number = 0;

        

        if (context.measureText(this.text.substring(start, end)).width > this.width) {
        }
        




        context.fillText(
            this.text,
            Camera.canvasWidth / 2,
            Camera.canvasHeight / 2);

    }
    
}


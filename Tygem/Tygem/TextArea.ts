/// <reference path="_ref.ts" />


enum HorizAlign {
    LEFT,
    CENTER,
    RIGHT
}
enum VertAlign {
    TOP,
    MIDDLE,
    BOTTOM
}

class TextArea extends DrawerComponent {
    
    font: string = "12px Verdana";
    color: string = "#FFFFFF";
    lineSpacing: number = 16;

    horizAlign: HorizAlign = HorizAlign.LEFT;
    vertAlign: VertAlign = VertAlign.TOP;
    
    text: string = "";
    

    /**
     * Width of the text area in pixels 
     */
    width: number = 100;

    /**
     * Height of the text area in pixels
     */
    height: number = 50;


    /**
     * Width of the border rectangle surrounding the text.  Set to 0 (the default) to not draw a border.
     */
    borderWidth: number = 0;
    /*
     * Color/style used for the stroke of the border rectangle.
     */
    borderStyle: string | CanvasGradient | CanvasPattern = "#FFFFFF";



    constructor() {
        super();
        this.name = "TextArea";

        this.anchored = true;
    }

    /**
     * Draws text the context.
     */
    draw = (context: CanvasRenderingContext2D): void => {

        // draw border
        if (this.borderWidth > 0) {
            context.beginPath();
            context.strokeStyle = this.borderStyle;
            context.lineWidth = this.borderWidth
            context.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
            context.stroke();
        }

        // get lines
        context.font = this.font;  
        let lines: Array<string> = StringUtils.splitToLines(this.text, this.width, context);

        // determine positioning
        let x: number = 0;
        let y0: number = 0;
        switch (this.horizAlign) {
            case HorizAlign.LEFT:
                context.textAlign = "left";
                x = -this.width / 2;
                break;
            case HorizAlign.CENTER:
                context.textAlign = "center";
                x = 0;
                break;
            case HorizAlign.RIGHT:
                context.textAlign = "right";
                x = this.width / 2;
                break;
        }
        switch (this.vertAlign) {
            case VertAlign.TOP:
                context.textBaseline = "top";
                y0 = -this.height / 2;
                break;
            case VertAlign.MIDDLE:
                context.textBaseline = "middle";
                y0 = 0 - this.lineSpacing * (lines.length - 1.0) / 2;
                break;
            case VertAlign.BOTTOM:
                context.textBaseline = "bottom";
                y0 = this.height / 2 - this.lineSpacing * (lines.length - 1);
                break;
        }
        
        context.fillStyle = this.color;

        // draw lines
        for (let i: number = 0; i < lines.length; i++) {
            context.fillText(
                lines[i],
                x,
                y0 + i * this.lineSpacing
            );
        }
        
    }
    
}


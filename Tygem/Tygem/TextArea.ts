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

    /**
     * Note that tags are implemented "on the stack", and shouldn't criss-cross.
     * This is <a> how <b> NOT </a> to </b> implement tags.
     */

    /**
     * Color used for the <imp></imp> tag.
     */
    static IMPORTANT_COLOR: string = "#FFDE3A";
    /**
     * Returns the font fill style associated with the given tag.
     * Returns null if tag isn't defined.
     */
    static fontFillStyleFromTag(tag: string): any {
        if (tag === "imp") {
            return TextArea.IMPORTANT_COLOR;
        } else if (tag === "transparent") {
            return "transparent";
        }
        return null;
    }

    
    font: string = "12px Verdana";
    color: string = "#FFFFFF";
    lineSpacing: number = 16;

    horizAlign: HorizAlign = HorizAlign.LEFT;
    vertAlign: VertAlign = VertAlign.TOP;
    
    text: string = "";

    /**
     * Set to true (default) to handle color formatting tags.  If false, text will be considered as raw text.
     * Tags currently implemented:
     *   <imp></imp> - Colors the contained text the color defined by TextArea.IMPORTANT_COLOR.
     *   <transparent></transparent> - Makes the contained text transparent.
     */
    useColorTags: boolean = true;
    

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
        let lines: Array<string> = StringUtils.splitToLines(this.text, this.width, context, this.useColorTags);

        // determine positioning
        let y0: number = 0;
        context.textAlign = "left";
        let lineXs: Array<number> = Array<number>(lines.length);
        for (let i: number = 0; i < lines.length; i++) {
            let lineWidth: number = context.measureText(this.useColorTags ? StringUtils.trimRight(StringUtils.trimHTMLTags(lines[i])) : StringUtils.trimRight(lines[i])).width;
            switch (this.horizAlign) {
                case HorizAlign.LEFT:
                    lineXs[i] = -this.width / 2;
                    break;
                case HorizAlign.CENTER:
                    lineXs[i] = -lineWidth / 2;
                    break;
                case HorizAlign.RIGHT:
                    lineXs[i] = this.width / 2 - lineWidth;
                    break;
            }
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
        
        // start stack of fill styles
        context.fillStyle = this.color;
        let styleStack: Array<any> = [];
        styleStack.push(context.fillStyle);

        // draw text lines
        for (let i: number = 0; i < lines.length; i++) {

            let line: string = lines[i];
            let x: number = lineXs[i];
            let y: number = y0 + i * this.lineSpacing;

            if (this.useColorTags) {

                let start: number = 0;
                let tagStart: number = 0;
                let inTag: boolean = false;
                
                for (let j: number = 0; j < line.length; j++) {

                    let c: number = line.charCodeAt(j);

                    if (inTag) {
                        // look for tag end
                        if (c === 62) { // '>'

                            // interpret tag
                            let tag: string = line.substring(tagStart, j).trim();
                            if (tag.indexOf("/") === 0) {
                                // pop off stack
                                if (styleStack.length <= 1) {
                                    console.error("Improperly placed tag '" + tag + "' in text '" + this.text + "'");
                                } else {
                                    styleStack.pop();
                                }
                            } else {
                                // push to stack
                                let style: any = TextArea.fontFillStyleFromTag(tag);
                                if (style === null) {
                                    console.error("Tag '" + tag + "' not defined.");
                                } else {
                                    styleStack.push(style);
                                }
                            }
                            context.fillStyle = styleStack[styleStack.length - 1];
                            
                            // end tag
                            inTag = false;
                            start = j + 1;
                        }
                    } else {
                        // look for tag begin
                        if (c === 60) { // '<'

                            // draw line up until this point
                            let subStr: string = line.substring(start, j);
                            context.fillText(subStr, x, y);
                            x += context.measureText(subStr).width;

                            // start tag
                            tagStart = j + 1;
                            inTag = true;
                        }
                    }
                    
                }

                // draw last part of text
                if (!inTag) {
                    context.fillText(line.substring(start), x, y);
                }
                
            } else {

                // no formatting, draw full line at once
                context.fillText(line, x, y);

            }
            
        }
        
    }
    
}


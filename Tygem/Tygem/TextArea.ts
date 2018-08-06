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

    // Public Static:

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

    // Properties:

    /**
     * The text to display.
     */
    text: string = "";
    /**
     * Limits the number of characters displayed.  Meant for text that appears over time character by character.  
     * Set to -1 to display all characters.
     */
    visibleChars: number = -1;
    
    /**
     * Name of the font of the text.  All the text in the text area must use the same font.
     */
    fontName: string = "Verdana";
    /**
     * Size of the font used in the text, in pixels.  All the text in the text area must use the same font.
     */
    fontSize: number = 12;
    /**
     * Gets the font as is set to the context.
     */
    getFont = (): string => {
        return "" + this.fontSize + "px " + this.fontName;
    }
    /**
     * Vertical spacing between lines.  Is independent from font size.
     */
    lineSpacing: number = 16;
    
    /**
     * Width of the text area in pixels 
     */
    width: number = 100;
    /**
     * Height of the text area in pixels
     */
    height: number = 50;

    /**
     * Horizontal alignment of the text.
     */
    horizAlign: HorizAlign = HorizAlign.LEFT;
    /**
     * Vertical alignment of the text.
     */
    vertAlign: VertAlign = VertAlign.TOP;
    

    /**
     * Default color of the text area.  If useColorTags is true, then tags can be used to change the color of segments of characters.
     */
    color: string = "#FFFFFF";
    /**
     * Set to true (default) to handle color formatting tags.  If false, text will be considered as raw text.
     * Tags currently implemented:
     *   <imp></imp> - Colors the contained text the color defined by TextArea.IMPORTANT_COLOR.
     *   <transparent></transparent> - Makes the contained text transparent.
     */
    useColorTags: boolean = true;
    
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

    // Draw functions:

    draw = (context: CanvasRenderingContext2D): void => {
        this.TextArea_draw(context);
    }

    /**
     * Gets position of the top left of a character in the local space.
     * 
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    getCharacterPosition = (index: number, context: CanvasRenderingContext2D, outPos: Vec2 = null): Vec2 => {

        let x: number = 0;
        let y: number = 0;
        
        // get lines
        context.font = this.getFont();
        let lines: Array<string> = StringUtils.splitToLines(this.text, this.width, context, this.useColorTags);

        // get y0 from vert align
        switch (this.vertAlign) {
            case VertAlign.TOP:
                //context.textBaseline = "top";
                y = -this.height / 2;
                break;
            case VertAlign.MIDDLE:
                //context.textBaseline = "middle";
                y = 0 - this.lineSpacing * (lines.length - 1.0) / 2;
                y -= this.fontSize / 2;
                break;
            case VertAlign.BOTTOM:
                //context.textBaseline = "bottom";
                y = this.height / 2 - this.lineSpacing * (lines.length - 1);
                y -= this.fontSize;
                break;
        }

        // get line and index in that line
        let line: string;
        let indexInLine: number = 0;
        let indexCount: number = 0;
        for (let i: number = 0; i < lines.length; i++) {
            let l: string = this.useColorTags ? StringUtils.trimHTMLTags(lines[i]) : lines[i];
            if (index < indexCount + l.length || i === lines.length - 1) {
                // found line
                line = l;
                indexInLine = Math.max(0, Math.min(l.length, index - indexCount)); // indexInLine can be the length of the line
                y += i * this.lineSpacing;
                break;
            }
            // continue to next line
            indexCount += l.length;
        }

        // get x
        let lineWidth: number = context.measureText(line).width;
        switch (this.horizAlign) {
            case HorizAlign.LEFT:
                x = -this.width / 2;
                break;
            case HorizAlign.CENTER:
                x = -lineWidth / 2;
                break;
            case HorizAlign.RIGHT:
                x = this.width / 2 - lineWidth;
                break;
        }
        x += context.measureText(line.substring(0, indexInLine)).width;

        // return
        if (outPos == null) {
            return new Vec2(x, y);
        }
        outPos.setValues(x, y);
        return null;
    }

    /**
     * Draws text the context.
     */
    protected TextArea_draw = (context: CanvasRenderingContext2D): void => {

        // draw border
        if (this.borderWidth > 0) {
            context.beginPath();
            context.strokeStyle = this.borderStyle;
            context.lineWidth = this.borderWidth
            context.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
            context.stroke();
        }
        
        // get lines
        context.font = this.getFont();
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
        let extraFormatting: boolean = this.useColorTags || this.visibleChars >= 0;
        let charCount: number = 0;
        for (let i: number = 0; i < lines.length; i++) {

            let line: string = lines[i];
            let x: number = lineXs[i];
            let y: number = y0 + i * this.lineSpacing;

            if (extraFormatting) {

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
                        if (this.useColorTags && c === 60) { // '<'

                            // draw line up until this point
                            let subStr: string = line.substring(start, j);
                            context.fillText(subStr, x, y);
                            x += context.measureText(subStr).width;

                            // start tag
                            tagStart = j + 1;
                            inTag = true;
                        } else {
                            charCount++;
                            if (this.visibleChars >= 0 && charCount >= this.visibleChars) {
                                // reached limit of characters

                                // draw line up until this point
                                context.fillText(line.substring(start, j), x, y);

                                // don't draw anymore
                                break;
                            }
                        }
                    }
                    
                }

                // draw last part of text
                if (!inTag && // not currently in a tag (shouldn't happen)
                    !(this.visibleChars >= 0 && charCount >= this.visibleChars)) // haven't reached character limit already
                { 
                    context.fillText(line.substring(start), x, y);
                }
                
            } else { // no formatting

                // draw full line at once
                context.fillText(line, x, y);

            }

            if (this.visibleChars >= 0 && charCount >= this.visibleChars) {
                // don't draw anymore if reached limit of characters
                break;
            }

        }
        
    }

    

    
}


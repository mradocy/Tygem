/// <reference path="_ref.ts" />


class InputTextArea extends TextArea {


    inputEnabled: boolean = false;


    inputIndex: number = 0;


    constructor() {
        super();
        this.name = "InputTextArea";

        this.useColorTags = false;
    }

    onUpdate = (): void => {

        // property validation
        if (this.useColorTags) {
            console.warn("Cannot use color tags on an InputTextArea");
            this.useColorTags = false;
        }
        this.inputIndex = Math.max(0, this.inputIndex);
        this.inputIndex = Math.min(this.text.length, this.inputIndex);

        // input
        if (!this.inputEnabled)
            return;

        let shiftHeld: boolean = Keys.keyHeld(Key.Shift);
        let keyCodesPressed: Array<number> = Keys.getKeyCodesPressed();

        for (let i: number = 0; i < keyCodesPressed.length; i++) {

            let key: Key = keyCodesPressed[i];
            let tryStr: boolean = false;
            switch (key) {
                case Key.LeftArrow:
                    this.inputIndex = Math.max(0, this.inputIndex - 1);
                    break;
                case Key.RightArrow:
                    this.inputIndex = Math.min(this.text.length, this.inputIndex + 1);
                    break;
                default:
                    tryStr = true;
            }
            if (!tryStr) continue;

            let str: string = StringUtils.stringFromKeyCode(key, shiftHeld);
            if (str === "") continue;

            if (this.inputIndex >= this.text.length) {
                this.text = this.text + str;
            } else {
                this.text = this.text.substring(0, this.inputIndex) + str + this.text.substring(this.inputIndex);
            }
            this.inputIndex++;

        }
        
    }

    // Draw functions:

    draw = (context: CanvasRenderingContext2D): void => {
        this.TextArea_draw(context);

        // carot
        if (!this.inputEnabled) return;

        let carotPos: Vec2 = this.getCharacterPosition(this.inputIndex, context);
        
        context.beginPath();
        context.strokeStyle = "red";
        context.lineWidth = 2;
        context.moveTo(carotPos.x, carotPos.y);
        context.lineTo(carotPos.x, carotPos.y + this.fontSize);
        context.stroke();

    }
    
}
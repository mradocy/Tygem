/// <reference path="_ref.ts" />


class Mouse {

    /**
     * Initializes Mouse.  To be called at the start of Game.
     * @param document The webpage document, which event listeners will be added to.
     */
    static _initialize(canvas: HTMLCanvasElement): void {
        if (Mouse.initialized) {
            console.warn("Mouse already initialized");
            return;
        }

        Mouse.canvas = canvas;
        canvas.addEventListener("mousedown", Mouse.mouseDown);
        document.addEventListener("mouseup", Mouse.mouseUp);
        canvas.addEventListener("contextmenu", Mouse.preventContextMenu);
        document.addEventListener("mousemove", Mouse.mouseMove);

        Mouse.initialized = true;
    }

    /**
     * The x position of the mouse in the canvas space.
     */
    static get x(): number {
        return Mouse._mouseX;
    }
    /**
     * The y position of the mouse in the canvas space.
     */
    static get y(): number {
        return Mouse._mouseY;
    }
    
    /**
     * Gets if the given button was pressed this frame.
     */
    static buttonPressed(button: number): boolean {
        return Mouse.buttonsPressed.indexOf(button) !== -1;
    }
    /**
     * Gets if the given button was held this frame.
     */
    static buttonHeld(button: number): boolean {
        return Mouse.buttonsHeld.indexOf(button) !== -1;
    }
    /**
     * Gets if the given button was released this frame.
     */
    static buttonReleased(button: number): boolean {
        return Mouse.buttonsReleased.indexOf(button) !== -1;
    }

    static hideCursor(): void {
        Mouse.canvas.style.cursor = "none";
    }
    static showCursor(): void {
        Mouse.canvas.style.cursor = "";
    }

    /**
     * To be called late in the game loop by Game.
     */
    static _lateUpdate(): void {

        // clear button records
        Mouse.buttonsPressed.splice(0);
        Mouse.buttonsReleased.splice(0);

    }

    private static mouseDown(event: MouseEvent): void {
        Mouse.updateMousePosition(event);

        // prevents middle mouse from scrolling
        if ([1, 2].indexOf(event.button) > -1) {
            event.preventDefault();
        }

        if (Mouse.buttonsPressed.indexOf(event.button) == -1) {
            Mouse.buttonsPressed.push(event.button);
        }
        if (Mouse.buttonsHeld.indexOf(event.button) == -1) {
            Mouse.buttonsHeld.push(event.button);
        }
        
    }

    private static mouseUp(event: MouseEvent): void {
        
        let index: number = Mouse.buttonsHeld.indexOf(event.button);
        if (index == -1) {
            // button not previously held
            return;
        }
        Mouse.buttonsHeld.splice(index, 1);
        
        if (Mouse.buttonsReleased.indexOf(event.button) == -1) {
            Mouse.buttonsReleased.push(event.button);
        }
        
    }

    private static mouseMove(event: MouseEvent): void {
        Mouse.updateMousePosition(event);
        
    }

    private static preventContextMenu(event: MouseEvent): void {
        event.preventDefault();
    }


    private static updateMousePosition(event: MouseEvent): void {
        let x: number = event.pageX;
        let y: number = event.pageY;
        if (x === undefined) {
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        // should these be using client values instead of offset values?
        Mouse._mouseX = (x - Mouse.canvas.offsetLeft) * Mouse.canvas.width / Mouse.canvas.offsetWidth;
        Mouse._mouseY = (y - Mouse.canvas.offsetTop) * Mouse.canvas.height / Mouse.canvas.offsetHeight;
    }

    private static _mouseX: number = 0;
    private static _mouseY: number = 0;
    
    private static buttonsPressed: Array<number> = [];
    private static buttonsHeld: Array<number> = [];
    private static buttonsReleased: Array<number> = [];

    private static initialized: boolean = false;
    private static canvas: HTMLCanvasElement = null;

}
/// <reference path="_ref.ts" />

namespace Mouse {

    /**
     * Initializes Mouse.  To be called at the start of Game.
     * @param document The webpage document, which event listeners will be added to.
     */
    export function _initialize(_canvas: HTMLCanvasElement): void {
        if (initialized) {
            console.warn("Mouse already initialized");
            return;
        }

        canvas = _canvas;
        canvas.addEventListener("mousedown", mouseDown);
        document.addEventListener("mouseup", mouseUp);
        canvas.addEventListener("contextmenu", preventContextMenu);
        document.addEventListener("mousemove", mouseMove);

        initialized = true;
    }

    /**
     * The x position of the mouse in the canvas space.
     * Please do not modify.
     */
    export let x: number = 0;
    /**
     * The y position of the mouse in the canvas space.
     * Please do not modify.
     */
    export let y: number = 0;
    
    /**
     * Gets if the given button was pressed this frame.
     */
    export function buttonPressed(button: number): boolean {
        return buttonsPressed.indexOf(button) !== -1;
    }
    /**
     * Gets if the given button was held this frame.
     */
    export function buttonHeld(button: number): boolean {
        return buttonsHeld.indexOf(button) !== -1;
    }
    /**
     * Gets if the given button was released this frame.
     */
    export function buttonReleased(button: number): boolean {
        return buttonsReleased.indexOf(button) !== -1;
    }

    export function hideCursor(): void {
        canvas.style.cursor = "none";
    }
    export function showCursor(): void {
        canvas.style.cursor = "";
    }

    /**
     * To be called late in the game loop by Game.
     */
    export function _lateUpdate(): void {

        // clear button records
        buttonsPressed.splice(0);
        buttonsReleased.splice(0);

    }

    function mouseDown(event: MouseEvent): void {
        updateMousePosition(event);

        // prevents middle mouse from scrolling
        if ([1, 2].indexOf(event.button) > -1) {
            event.preventDefault();
        }

        if (buttonsPressed.indexOf(event.button) == -1) {
            buttonsPressed.push(event.button);
        }
        if (buttonsHeld.indexOf(event.button) == -1) {
            buttonsHeld.push(event.button);
        }
        
    }

    function mouseUp(event: MouseEvent): void {
        
        let index: number = buttonsHeld.indexOf(event.button);
        if (index == -1) {
            // button not previously held
            return;
        }
        buttonsHeld.splice(index, 1);
        
        if (buttonsReleased.indexOf(event.button) == -1) {
            buttonsReleased.push(event.button);
        }
        
    }

    function mouseMove(event: MouseEvent): void {
        updateMousePosition(event);
    }

    function preventContextMenu(event: MouseEvent): void {
        event.preventDefault();
    }


    function updateMousePosition(event: MouseEvent): void {
        let mx: number = event.pageX;
        let my: number = event.pageY;
        if (mx === undefined) {
            mx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            my = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        // should these be using client values instead of offset values?
        x = (mx - canvas.offsetLeft) * canvas.width / canvas.offsetWidth;
        y = (my - canvas.offsetTop) * canvas.height / canvas.offsetHeight;
    }
    
    let buttonsPressed: Array<number> = [];
    let buttonsHeld: Array<number> = [];
    let buttonsReleased: Array<number> = [];

    let initialized: boolean = false;
    let canvas: HTMLCanvasElement = null;

}
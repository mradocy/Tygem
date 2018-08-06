/// <reference path="_ref.ts" />

namespace Keys {

    /**
     * Initializes Keys.  To be called at the start of Game.
     * @param document The webpage document, which event listeners will be added to.
     */
    export function _initialize(document: Document): void {
        if (initialized) {
            console.warn("Keys already initialized");
            return;
        }

        document.addEventListener("keydown", keyDown);
        document.addEventListener("keyup", keyUp);
        
        initialized = true;
    }

    /**
     * Gets if the key was pressed this frame.
     */
    export function keyPressed(key: Key): boolean {
        return keyCodePressed(key);
    }
    /**
     * Gets if the key with the given key code was pressed this frame.
     */
    export function keyCodePressed(keyCode: number): boolean {
        return keysPressed.indexOf(keyCode) != -1;
    }

    /**
     * Gets if the key is being held.
     */
    export function keyHeld(key: Key): boolean {
        return keyCodeHeld(key);
    }
    /**
     * Gets if the key with the given key code is being held.
     */
    export function keyCodeHeld(keyCode: number): boolean {
        return keysHeld.indexOf(keyCode) != -1;
    }

    /**
     * Gets if the key was released this frame.
     */
    export function keyReleased(key: Key): boolean {
        return keyCodeReleased(key);
    }
    /**
     * Gets if the key with the given key code was released this frame.
     */
    export function keyCodeReleased(keyCode: number): boolean {
        return keysReleased.indexOf(keyCode) != -1;
    }

    /**
     * Gets a string representation of the given Key.
     */
    export function keyToString(key: Key): string {
        let s: string = Key[key];
        return s;
    }
    /**
     * Gets a string representation of the given keyCode.
     * @param keyCode
     */
    export function keyCodeToString(keyCode: number): string {
        return keyToString(keyCode);
    }

    /**
     * Gets the key codes of all the keys that were pressed this frame.
     */
    export function getKeyCodesPressed(): Array<number> {
        return keysPressed.concat([]);
    }


    /**
     * To be called late in the game loop by Game.
     */
    export function _lateUpdate(): void {

        // clear key records
        keysPressed.splice(0);
        keysReleased.splice(0);

    }

    function keyDown(event: KeyboardEvent): void {

        // prevent space and arrow keys from scrolling the screen around
        if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
            event.preventDefault();
        }

        if (keysHeld.indexOf(event.keyCode) != -1)
            // key was already being held down.  Return to prevent additional keypresses when holding down a key for a while
            return;

        if (keysPressed.indexOf(event.keyCode) == -1) {
            keysPressed.push(event.keyCode);
        }
        if (keysHeld.indexOf(event.keyCode) == -1) {
            keysHeld.push(event.keyCode);
        }
        
        // fullscreen.  Should be moved to a menu at some point
        if (event.keyCode === Key.F10) {

            if (Game.isFullscreen) {
                Game.exitFullscreen();
            } else {
                Game.requestFullscreen();
            }

        }
        
    }

    function keyUp(event: KeyboardEvent): void {

        if (keysReleased.indexOf(event.keyCode) == -1) {
            keysReleased.push(event.keyCode);
        }
        let index: number = keysHeld.indexOf(event.keyCode);
        if (index != -1) {
            keysHeld.splice(index, 1);
        }

    }

    let initialized: boolean = false;

    let keysPressed: Array<number> = [];
    let keysHeld: Array<number> = [];
    let keysReleased: Array<number> = [];
    
}


enum Key {
    Backspace = 8,
    Tab = 9,
    Enter = 13,
    Shift = 16,
    Ctrl = 17,
    Alt = 18,
    PauseBreak = 19,
    CapsLock = 20,
    Escape = 27,
    Space = 32,
    PageUp = 33,
    PageDown = 34,
    End = 35,
    Home = 36,

    LeftArrow = 37,
    UpArrow = 38,
    RightArrow = 39,
    DownArrow = 40,

    Insert = 45,
    Delete = 46,

    Num0 = 48,
    Num1 = 49,
    Num2 = 50,
    Num3 = 51,
    Num4 = 52,
    Num5 = 53,
    Num6 = 54,
    Num7 = 55,
    Num8 = 56,
    Num9 = 57,

    A = 65,
    B = 66,
    C = 67,
    D = 68,
    E = 69,
    F = 70,
    G = 71,
    H = 72,
    I = 73,
    J = 74,
    K = 75,
    L = 76,
    M = 77,
    N = 78,
    O = 79,
    P = 80,
    Q = 81,
    R = 82,
    S = 83,
    T = 84,
    U = 85,
    V = 86,
    W = 87,
    X = 88,
    Y = 89,
    Z = 90,

    LeftWindowKey = 91,
    RightWindowKey = 92,
    SelectKey = 93,

    Numpad0 = 96,
    Numpad1 = 97,
    Numpad2 = 98,
    Numpad3 = 99,
    Numpad4 = 100,
    Numpad5 = 101,
    Numpad6 = 102,
    Numpad7 = 103,
    Numpad8 = 104,
    Numpad9 = 105,

    Multiply = 106,
    Add = 107,
    Subtract = 109,
    DecimalPoint = 110,
    Divide = 111,

    F1 = 112,
    F2 = 113,
    F3 = 114,
    F4 = 115,
    F5 = 116,
    F6 = 117,
    F7 = 118,
    F8 = 119,
    F9 = 120,
    F10 = 121,
    F11 = 122,
    F12 = 123,

    NumLock = 144,
    ScrollLock = 145,

    SemiColon = 186,
    Equals = 187,
    Comma = 188,
    Dash = 189,
    Period = 190,
    ForwardSlash = 191,
    Tilde = 192,

    OpenBracket = 219,
    BackSlash = 220,
    ClosedBracket = 221,
    Quote = 222
}


/// <reference path="_ref.ts" />

/**
* Note that a button must be pressed on the gamepad before it will be recognized.  Pressing the button will send the "gamepadconnected" event.
*/
class Gamepads {

    /**
        * If the abs of an axis value is less than this, it is rounded down to 0.
        */
    static AXIS_DEAD_ZONE: number = .1;
    /**
        * An axis will be considered "held" if the abs of its value is more than this.
        */
    static AXIS_PRESS_THRESHOLD: number = .6;

    /**
        * Initializes Gamepad.  To be called at the start of Game.
        * @param window The webpage window, which event listeners will be added to.
        */
    static _initialize(window: Window): void {
        if (Gamepads.initialized) {
            console.warn("Gamepads already initialized");
            return;
        }

        window.addEventListener("gamepadconnected", Gamepads.gamepadConnected);
        window.addEventListener("gamepaddisconnected", Gamepads.gamepadDisconnected);

        Gamepads.initialized = true;
    }

    /**
        * Gets if a gamepad is currently connected.
        */
    static isGamepadConnected(): boolean {
        return Gamepads.getGamepad() !== null;
    }

    /**
        * Gets if the given button was pressed this frame.
        * @param index Index of the button to check.
        */
    static buttonPressed(index: number): boolean {
        return Gamepads.buttonsPressed.indexOf(index) !== -1;
    }

    /**
        * Gets if the given button is currently being held.
        * @param index Index of the button to check.
        */
    static buttonHeld(index: number): boolean {
        return Gamepads.buttonsHeld.indexOf(index) !== -1;
    }

    /**
        * Gets if the given button was released this frame.
        * @param index Index of the button to check.
        */
    static buttonReleased(index: number): boolean {
        return Gamepads.buttonsReleased.indexOf(index) !== -1;
    }

    /**
        * Gets array of the indexes of the buttons that were pressed this frame.
        */
    static getButtonsPressed(): Array<number> {
        let ret: Array<number> = [];
        Gamepads.copyValues(Gamepads.buttonsPressed, ret);
        return ret;
    }

    /**
        * Gets value [-1, 1] from a gamepad axis.  Returns 0 if the index is out of bounds.
        * @param index Index of the axis to check.
        */
    static axisValue(index: number): number {
        if (index < 0 || index >= Gamepads.axisValues.length)
            return 0;

        let val: number = Gamepads.axisValues[index];
        if (Math.abs(val) < Gamepads.AXIS_DEAD_ZONE) {
            val = 0;
        }

        return val;
    }

    /**
        * Gets if gamepad axis is currently being held in the positive direction.
        * @param index Index of the axis to check.
        */
    static axisPositiveHeld(index: number): boolean {
        let val: number = Gamepads.axisValue(index);
        return val > Gamepads.AXIS_PRESS_THRESHOLD;
    }

    /**
        * Gets if gamepad axis is currently being held in the negative direction.
        * @param index Index of the axis to check.
        */
    static axisNegativeHeld(index: number): boolean {
        let val: number = Gamepads.axisValue(index);
        return val < -Gamepads.AXIS_PRESS_THRESHOLD;
    }
    
    /**
        * Gets if gamepad axis was pressed in the positive direction.
        * @param index Index of the axis to check.
        */
    static axisPositivePressed(index: number): boolean {
        let val: number = Gamepads.axisValue(index);
        let prevVal: number = Gamepads.axisPreviousValue(index);
        return val > Gamepads.AXIS_PRESS_THRESHOLD && prevVal <= Gamepads.AXIS_PRESS_THRESHOLD;
    }

    /**
        * Gets if gamepad axis was pressed in the negative direction.
        * @param index Index of the axis to check.
        */
    static axisNegativePressed(index: number): boolean {
        let val: number = Gamepads.axisValue(index);
        let prevVal: number = Gamepads.axisPreviousValue(index);
        return val < -Gamepads.AXIS_PRESS_THRESHOLD && prevVal >= -Gamepads.AXIS_PRESS_THRESHOLD;
    }

    /**
        * Gets if gamepad axis was released from the positive direction.
        * @param index Index of the axis to check.
        */
    static axisPositiveReleased(index: number): boolean {
        let val: number = Gamepads.axisValue(index);
        let prevVal: number = Gamepads.axisPreviousValue(index);
        return val <= Gamepads.AXIS_PRESS_THRESHOLD && prevVal > Gamepads.AXIS_PRESS_THRESHOLD;
    }
    
    /**
        * Gets if gamepad axis was released from the negative direction.
        * @param index Index of the axis to check.
        */
    static axisNegativeReleased(index: number): boolean {
        let val: number = Gamepads.axisValue(index);
        let prevVal: number = Gamepads.axisPreviousValue(index);
        return val >= -Gamepads.AXIS_PRESS_THRESHOLD && prevVal < -Gamepads.AXIS_PRESS_THRESHOLD;
    }

    /**
        * Gets array of axes that were positively pressed this frame
        */
    static getAxesPositivePressed(): Array<number> {
        let ret: Array<number> = [];
        for (let index: number = 0; index < Gamepads.axisValues.length; index++) {
            if (Gamepads.axisPositivePressed(index)) {
                ret.push(index);
            }
        }
        return ret;
    }

    /**
        * Gets array of axes that were negatively pressed this frame
        */
    static getAxesNegativePressed(): Array<number> {
        let ret: Array<number> = [];
        for (let index: number = 0; index < Gamepads.axisValues.length; index++) {
            if (Gamepads.axisNegativePressed(index)) {
                ret.push(index);
            }
        }
        return ret;
    }

    /**
        * To be called by Game in the gameloop.
        */
    static _earlyUpdate(): void {
        
        // clear button and axis values
        Gamepads.buttonsPressed.splice(0);
        Gamepads.copyValues(Gamepads.buttonsHeld, Gamepads.buttonsPreviouslyHeld);
        Gamepads.buttonsHeld.splice(0);
        Gamepads.buttonsReleased.splice(0);
        Gamepads.copyValues(Gamepads.axisValues, Gamepads.axisPreviousValues);
        Gamepads.axisValues.splice(0);

        // getting gamepad
        let gamepad: Gamepad = Gamepads.getGamepad();

        // return if no gamepad connected
        if (gamepad == null) return;

        // get buttons currently held
        for (let index: number = 0; index < gamepad.buttons.length; index++) {
            if (gamepad.buttons[index].pressed) {
                Gamepads.buttonsHeld.push(index);
            }
        }

        // get buttons pressed
        for (let i: number = 0; i < Gamepads.buttonsHeld.length; i++) {
            let button: number = Gamepads.buttonsHeld[i];
            if (Gamepads.buttonsPreviouslyHeld.indexOf(button) === -1) {
                Gamepads.buttonsPressed.push(button);
            }
        }

        // get buttons released
        for (let i: number = 0; i < Gamepads.buttonsPreviouslyHeld.length; i++) {
            let button: number = Gamepads.buttonsPreviouslyHeld[i];
            if (Gamepads.buttonsHeld.indexOf(button) === -1) {
                Gamepads.buttonsReleased.push(button);
            }
        }
        
        // get axis values
        Gamepads.copyValues(gamepad.axes, Gamepads.axisValues);

    }

    private static gamepadConnected(e: GamepadEvent): void {

        console.log("gamepad connected");
    }

    private static gamepadDisconnected(e: GamepadEvent): void {

        console.log("gamepad disconnected");
    }

    private static getGamepad(): Gamepad {
        let gamepad: Gamepad = null;
        let gpds: Array<Gamepad> = null;
        if (navigator.getGamepads) {
            gpds = navigator.getGamepads();
        } else if ((navigator as any).webkitGetGamepads) {
            gpds = (navigator as any).webkitGetGamepads;
        }
        if (gpds && gpds.length > 0) {
            gamepad = gpds[0];
        }

        return gamepad;
    }

    private static axisPreviousValue(index: number): number {
        if (index < 0 || index >= Gamepads.axisPreviousValues.length)
            return 0;

        let val: number = Gamepads.axisPreviousValues[index];
        if (Math.abs(val) < Gamepads.AXIS_DEAD_ZONE) {
            val = 0;
        }

        return val;
    }

    private static copyValues(arrFrom: Array<number>, arrTo: Array<number>): void {
        arrTo.splice(0);
        for (let i: number = 0; i < arrFrom.length; i++) {
            arrTo.push(arrFrom[i]);
        }
    }

    private static initialized: boolean = false;

    private static buttonsPressed: Array<number> = [];
    private static buttonsHeld: Array<number> = [];
    private static buttonsPreviouslyHeld: Array<number> = [];
    private static buttonsReleased: Array<number> = [];

    private static axisValues: Array<number> = [];
    private static axisPreviousValues: Array<number> = [];

}

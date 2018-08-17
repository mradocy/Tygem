/// <reference path="../app.ts" />

namespace PlayerInput {

    export function isLeftHeld(): boolean {
        return Keys.keyHeld(Key.LeftArrow) || Keys.keyHeld(Key.A);
    }
    export function isRightHeld(): boolean {
        return Keys.keyHeld(Key.RightArrow) || Keys.keyHeld(Key.D);
    }
    export function isUpHeld(): boolean {
        return Keys.keyHeld(Key.UpArrow) || Keys.keyHeld(Key.W);
    }
    export function isDownHeld(): boolean {
        return Keys.keyHeld(Key.DownArrow) || Keys.keyHeld(Key.S);
    }

    export function isAttackPressed(): boolean {
        return Keys.keyPressed(Key.X) || Keys.keyPressed(Key.ForwardSlash);
    }
    
}
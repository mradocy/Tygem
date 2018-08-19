/// <reference path="../../Tygem/_ref.ts" />
/// <reference path="../Components/Character.ts" />
/// <reference path="_Info.ts" />

namespace Actions {
    
    export class Base {

        /**
         * Related to how much damage the attack deals (if this action is an attack)
         */
        power: number = 0;

        constructor(character: Comps.Character) {
            this.character = character;
        }

        /**
         * Starts the action.  Does nothing if the action is already running.
         */
        start = (): void => {
            if (this.isRunning()) return;

            this._running = true;
            this.onStart();
        }
        /**
         * Stops the action.  Can be called within Action's onUpdate(), or by the character to stop the action early.
         * Doesn nothing if the action isn't running.
         */
        stop = (): void => {
            if (!this.isRunning()) return;

            this.onEnd();
            this._running = false;
        }

        /**
         * If the action is currently running.
         */
        isRunning = (): boolean => {
            return this._running;
        }



        /**
         * Called when Action starts.  To be overridden.
         */
        onStart = (): void => { }
        /**
         * Called each frame.  To be overridden.
         */
        onUpdate = (): void => { }
        /**
         * Called just before the Action ends (or is forced to end early).  To be overridden.
         */
        onEnd = (): void => { }

        character: Comps.Character = null;

        private _running: boolean = false;

    }

}
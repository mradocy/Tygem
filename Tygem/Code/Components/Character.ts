/// <reference path="../../Tygem/_ref.ts" />

/// <reference path="TDActor.ts" />
/// <reference path="../PlayerInput.ts" />

namespace Comps {

    export enum Character_State {
        NONE,

        IDLE,
        WALK,
        
        ACTION,
    }

    export enum Character_PushMode {
        /**
         * Won't be affected when near other characters
         */
        NONE,
        /**
         * Will be pushed away when near other characters
         */
        PUSHED,
    }

    export enum Character_WalkMode {
        NONE,
        TO_POINT,
        TO_TDACTOR,
    }

    export class Character extends TDActor {

        constructor() {
            super();
            this.name = "Character";

            this.componentProperties.requireComponent(TDSpriteRenderer);
        }


        // "Unique" Properties (to be set upon creating the Character component to give the character its unique properties):

        /**
         * Prefix on animation names.
         */
        animPrefix: string = "[define animPrefix here]";
        /**
         * If true, facing left will use animations for facing right, but flipped.
         */
        symmetrical: boolean = true;
        /**
         * If walk commands can be given to this character.
         */
        canWalk: boolean = true;
        /**
         * Speed when walking
         */
        walkSpeed: number = 70;
        /**
         * Acceleration when walking
         */
        walkAccel: number = 500;
        /**
         * Friction when the applyFriction property is set to true.
         */
        friction: number = 700;

        /**
         * Sets the action at the given index to a specified Action.
         */
        setAction = (index: number, actionID: Actions.ID): void => {
            if (index < 0) return;

            // extend actions array to include actionIndex
            if (index >= this._actions.length && actionID === Actions.ID.NONE) return;
            while (index >= this._actions.length) {
                this._actions.push(null);
                this._actionInfos.push(null);
            }

            // end previous action at the index
            let prevAction: Actions.Base = this._actions[index];
            if (prevAction !== null) {
                prevAction.stop();
            }

            // replace action
            let actionInfo: Actions.Info = Actions.getActionInfo(actionID);
            this._actionInfos[index] = actionInfo;
            let actionInstance: Actions.Base = new actionInfo.ctor(this);
            this._actions[index] = actionInstance;
        }
        /**
         * Gets the Actions.Info at the given index.
         */
        getActionInfo = (index: number): Actions.Info => {
            if (index < 0 || index >= this._actionInfos.length)
                return null;

            return this._actionInfos[index];
        }



        // Toggle Properties:
        
        /**
         * Friction will be applied to velocity when true.
         * This will be set to true/false as states change.
         */
        applyFriction: boolean = true;
        /**
         * Gets the current Character_State.
         */
        getState = (): Character_State => {
            return this._state;
        }
        /**
         * Gets the index of the current action.
         */
        getCurrentActionIndex = (): number => {
            return this._currentActionIndex;
        }
        /**
         * Gets the direction the character is facing.
         */
        getDirection = (): Direction => {
            return this._direction;
        }

        isInputEnabled = (): boolean => {
            return this._inputEnabled;
        }

        pushMode: Character_PushMode = Character_PushMode.PUSHED;



        // Instructions:

        /**
         * Gives player control over this Character.
         */
        enableInput = (): void => {
            if (this._inputEnabled) return;
            this._inputEnabled = true;
        }
        /**
         * Releases player control over this Character.
         */
        disableInput = (): void => {
            if (!this._inputEnabled) return;
            this._inputEnabled = false;
            this.idle();
        }
        
        /**
         * Go to the idle state.
         */
        idle = (): void => {
            if (this.isInputEnabled()) {
                console.warn("Shouldn't call Character.idle() when input is enabled");
            }
            this._startIdleState();
        }
        /**
         * Go to the idle state and face the given direction.
         */
        idleDirection = (direction: Direction): void => {
            if (this.isInputEnabled()) {
                console.warn("Shouldn't call Character.idle() when input is enabled");
            }
            this._direction = direction;
            this._startIdleState();
        }

        /**
         * Walk to the given point.
         */
        walkToPoint = (x: number, y: number): void => {
            if (this.isInputEnabled()) {
                console.warn("Shouldn't call Character.walk() when input is enabled");
            }
            if (!this.canWalk) return;
            this._walkMode = Character_WalkMode.TO_POINT;
            this._targetRef = null;
            this._targetOffsetX = x;
            this._targetOffsetY = y;
            this._startWalkState();
        }
        /**
         * Walk to the given TDActor.
         */
        walkToTDActor = (tdActor: TDActor, offset: Direction): void => {
            if (this.isInputEnabled()) {
                console.warn("Shouldn't call Character.walk() when input is enabled");
            }
            if (!this.canWalk) return;
            this._walkMode = Character_WalkMode.TO_TDACTOR;
            this._targetRef = tdActor;
            switch (offset) {                
                case Direction.RIGHT:
                    this._targetOffsetX = tdActor.halfWidth + this.halfWidth;
                    this._targetOffsetY = 0;
                    break;
                case Direction.DOWN:
                    this._targetOffsetX = 0;
                    this._targetOffsetY = tdActor.halfHeight + this.halfHeight;
                    break;
                case Direction.LEFT:
                    this._targetOffsetX = -tdActor.halfWidth - this.halfWidth;
                    this._targetOffsetY = 0;
                    break;
                case Direction.UP:
                    this._targetOffsetX = 0;
                    this._targetOffsetY = -tdActor.halfHeight - this.halfHeight;
                    break;
                default:
                    this._targetOffsetX = 0;
                    this._targetOffsetY = 0;
                    break;
            }
            this._startWalkState();
        }

        /**
         * Starts the action at the given index.  Does nothing if the action at the index is set to null.
         * This character's state will be set to ACTION.
         * Note: to stop an action, call another instruction function like idle().
         */
        startAction = (actionIndex: number): void => {
            if (actionIndex < 0 || actionIndex >= this._actions.length) {
                console.warn("action index " + actionIndex + " is invalid.  Could not start action");
                return;
            }

            let action: Actions.Base = this._actions[actionIndex];
            if (action === null) {
                console.warn("action at action index " + actionIndex + " is null.  Could not start action");
                return;
            }

            this._endCurrentAction();

            this._state = Character_State.ACTION;
            this._currentActionIndex = actionIndex;
            action.start();
        }

        

        

        

        


        

        



        
        onAwake = (): void => {
            this.Actor_onAwake();
            Character.allCharacters.push(this);
        }
        
        // Called once for a Component.  Either called when a scene finishes loading, or just before update().
        onStart = (): void => {
            this.health = this.maxHealth;

            this.tdSpriteRenderer = this.getComponent(TDSpriteRenderer);

            this._startIdleState();

        }
        
        // called once per frame, during the update step.  Is not called if the component is disabled.
        onUpdate = (): void => {

            this.transform.getGlobalPosition(this.tempVec2);
            let x: number = this.tempVec2.x;
            let foot: number = this.getFoot();
            let vx: number = this.vx;
            let vy: number = this.vy;

            this._time += Game.deltaTime;
            
            switch (this._state) {

                case Character_State.IDLE:
                case Character_State.WALK:

                    if (this.isInputEnabled()) {
                        // movement based on player input

                        if (PlayerInput.isLeftHeld() && !PlayerInput.isRightHeld()) {
                            // left held
                            if (vx > 0) {
                                vx = Math.max(0, vx - this.friction * Game.deltaTime); // apply friction if currently going other way
                            }
                            vx -= this.walkAccel * Game.deltaTime;
                        } else if (PlayerInput.isRightHeld() && !PlayerInput.isLeftHeld()) {
                            // right held
                            if (vx < 0) {
                                vx = Math.min(0, vx + this.friction * Game.deltaTime); // apply friction if currently going other way
                            }
                            vx += this.walkAccel * Game.deltaTime;
                        } else {
                            // no horiz held, apply friction
                            if (vx > 0) {
                                vx = Math.max(0, vx - this.friction * Game.deltaTime);
                            } else {
                                vx = Math.min(0, vx + this.friction * Game.deltaTime);
                            }
                        }

                        if (PlayerInput.isUpHeld() && !PlayerInput.isDownHeld()) {
                            // up held
                            if (vy > 0) {
                                vy = Math.max(0, vy - this.friction * Game.deltaTime); // apply friction if currently going other way
                            }
                            vy -= this.walkAccel * Game.deltaTime;
                        } else if (PlayerInput.isDownHeld() && !PlayerInput.isUpHeld()) {
                            // down held
                            if (vy < 0) {
                                vy = Math.min(0, vy + this.friction * Game.deltaTime); // apply friction if currently going other way
                            }
                            vy += this.walkAccel * Game.deltaTime;
                        } else {
                            // no vert held, apply friction
                            if (vy > 0) {
                                vy = Math.max(0, vy - this.friction * Game.deltaTime);
                            } else {
                                vy = Math.min(0, vy + this.friction * Game.deltaTime);
                            }
                        }

                        // clamp speed
                        let vMag: number = M.magnitude(vx, vy);
                        if (vMag >= this.walkSpeed) {
                            vx *= this.walkSpeed / vMag;
                            vy *= this.walkSpeed / vMag;
                        }

                        // determine direction facing
                        if (PlayerInput.isLeftHeld() !== PlayerInput.isRightHeld()) {
                            if (!(PlayerInput.isUpHeld() && this._direction === Direction.UP) &&
                                !(PlayerInput.isDownHeld() && this._direction === Direction.DOWN)) {
                                this._direction = PlayerInput.isLeftHeld() ? Direction.LEFT : Direction.RIGHT;
                            }
                            this._startWalkState();
                        } else if (PlayerInput.isUpHeld() !== PlayerInput.isDownHeld()) {
                            this._direction = PlayerInput.isUpHeld() ? Direction.UP : Direction.DOWN;

                            this._startWalkState();
                        } else {
                            // go to idle if no longer holding direction keys
                            this._startIdleState();
                        }


                        if (PlayerInput.isAttackPressed()) {
                            console.log("attack pressed");
                            this.startAction(0);
                        }
                        
                        
                    } else {
                        // input is disabled.  movement based on instructions

                        if (this._state === Character_State.WALK) {

                            // get destination
                            let wx: number = 0;
                            let wy: number = 0;
                            switch (this._walkMode) {
                                case Character_WalkMode.TO_POINT:
                                    wx = this._targetOffsetX;
                                    wy = this._targetOffsetY;
                                    break;
                                case Character_WalkMode.TO_TDACTOR:
                                    (this._targetRef as TDActor).getGlobalPosition(this.tempVec2);
                                    wx = this.tempVec2.x + this._targetOffsetX;
                                    wy = (this._targetRef as TDActor).getFoot() + this._targetOffsetY;
                                    break;
                            }
                    
                            // get distance to destination
                            let dx: number = wx - x;
                            let dy: number = wy - foot;
                            let dMag: number = M.magnitude(dx, dy);

                            // determine velocity
                            if (dMag < this.walkSpeed * Game.deltaTime) {
                                // should arrive at destination next frame
                                vx = dx / Game.deltaTime;
                                vy = dy / Game.deltaTime;

                                this.idle();

                            } else {
                                // accel to target velocity
                                dx /= dMag;
                                dy /= dMag;

                                let targetVX: number = dx * this.walkSpeed;
                                let targetVY: number = dy * this.walkSpeed;
                                if (vx < targetVX) {
                                    vx = Math.min(targetVX, vx + this.walkAccel * Game.deltaTime);
                                } else {
                                    vx = Math.max(targetVX, vx - this.walkAccel * Game.deltaTime);
                                }
                                if (vy < targetVY) {
                                    vy = Math.min(targetVY, vy + this.walkAccel * Game.deltaTime);
                                } else {
                                    vy = Math.max(targetVY, vy - this.walkAccel * Game.deltaTime);
                                }
                            }

                            this._direction = Collision.getNormalDirection(vx, vy);
                        }
                    }

                    break; // ends case Character_State.IDLE and Character_State.WALK

                case Character_State.ACTION:

                    let action: Actions.Base = this._getCurrentAction();
                    action.onUpdate();
                    if (!action.isRunning()) {
                        // action finished, start another state
                        this._startIdleState();
                    }

                    break;
            }
            
            // apply friction if toggled
            if (this.applyFriction) {
                let friction: number = this.friction;
                if (vx < 0) {
                    vx = Math.min(0, vx + friction * Game.deltaTime);
                } else {
                    vx = Math.max(0, vx - friction * Game.deltaTime);
                }
                if (vy < 0) {
                    vy = Math.min(0, vy + friction * Game.deltaTime);
                } else {
                    vy = Math.max(0, vy - friction * Game.deltaTime);
                }
            }

            // being pushed
            if (this.pushMode === Character_PushMode.PUSHED) {

                // TODO: being pushed

            }

            this.vx = vx;
            this.vy = vy;

            this.updateAnimation();

        }
        
        // called just before the component is destroyed.
        onDestroy = (): void => {

            this._endCurrentAction();
            this._actions.splice(0);
            this._actions = null;
            this._actionInfos.splice(0);
            this._actions = null;

            this.tdSpriteRenderer = null;
            let index: number = Character.allCharacters.indexOf(this);
            if (index !== -1) {
                Character.allCharacters.splice(index, 1);
            }
            this.Actor_onDestroy();
        }



        // Static:

        /**
         * Gets a Character whose gameObject has the given name.  Returns null if no character with the name could be found.
         */
        static getCharacter(name: string): Character {
            if (name == null || name === "") return null;
            for (let i: number; i < Character.allCharacters.length; i++) {
                let c: Character = Character.allCharacters[i];
                if (c.gameObject.name === name)
                    return c;
            }
            return null;
        }

        /**
         * Calls forEach() on all the characters.
         * @param callbackFn Function to call on all the characters.
         */
        static forEach(callbackFn: (character: Character) => void): void {
            Character.allCharacters.forEach(callbackFn);
        }

        /**
         * Sets the given character to have input enabled, and input disabled for all other characters.
         * Giving null as a parameter will disable input for all characters.
         * @param character
         */
        static setInputCharacter(character: string | Character): void {
            if (character == null || (typeof character === "string" && character === "")) {
                Character.allCharacters.forEach(
                    function (c: Character): void {
                        c.disableInput();
                    }
                );
                return;
            }
            if (typeof character === "string") {
                let found: boolean = false;
                for (let i: number = 0; i < Character.allCharacters.length; i++) {
                    let c: Character = Character.allCharacters[i];
                    if (c.gameObject.name === character) {
                        c.enableInput();
                        found = true;
                    } else {
                        c.disableInput();
                    }
                }
                if (!found) {
                    console.warn(character + " was not set as the input character because no character with that name exists.");
                }
            } else {
                for (let i: number = 0; i < Character.allCharacters.length; i++) {
                    let c: Character = Character.allCharacters[i];
                    if (c === character) {
                        c.enableInput();
                    } else {
                        c.disableInput();
                    }
                }
            }
        }

        /**
         * Gets the Character that has input enabled.  Or null if no character currently has input enabled.
         */
        static getInputCharacter(): Character {
            for (let i: number = 0; i < Character.allCharacters.length; i++) {
                let c: Character = Character.allCharacters[i];
                if (c.isInputEnabled()) {
                    return c;
                }
            }
            return null;
        }



        // Protected:

        protected _startIdleState = (): void => {
            // end previous state?
            this._endCurrentAction();

            if (this._state != Character_State.IDLE) {
                this._state = Character_State.IDLE;
                this._time = 0;
                this.applyFriction = true;
            }

            this.updateAnimation();
        }

        protected _startWalkState = (): void => {
            // end previous state?
            this._endCurrentAction();

            if (this._state != Character_State.WALK) {
                this._state = Character_State.WALK;
                this._time = 0;
                this.applyFriction = false;
            }

            this.updateAnimation();
        }

        protected updateAnimation = (): void => {

            // flip around
            if ((this._direction === Direction.LEFT && this.symmetrical) === this.transform.scaleX > 0) {
                this.transform.scaleX *= -1;
            }

            let anim: string = this.animPrefix;
            switch (this._state) {
                case Character_State.IDLE:
                    anim += "_idle";
                    break;
                case Character_State.WALK:
                    anim += "_walk";
                    break;
                default:
                    // other state, don't set animation here.
                    return;
            }
            switch (this._direction) {
                case Direction.NONE:
                    return;
                case Direction.LEFT:
                    if (this.symmetrical) {
                        anim += "_right";
                    } else {
                        anim += "_left";
                    }
                    break;
                case Direction.RIGHT:
                    anim += "_right";
                    break;
                case Direction.UP:
                    anim += "_up";
                    break;
                case Direction.DOWN:
                    anim += "_down";
                    break;
            }
            
            if (this.tdSpriteRenderer.getAnimation() === null ||
                this.tdSpriteRenderer.getAnimation().name !== anim) {
                this.tdSpriteRenderer.playAnimation(anim);
            }

        }

        protected _getCurrentAction = (): Actions.Base => {
            if (this._currentActionIndex < 0 || this._currentActionIndex >= this._actions.length)
                return null;

            return this._actions[this._currentActionIndex];
        }
        
        protected _endCurrentAction = (): void => {

            let action: Actions.Base = this._getCurrentAction();
            if (action === null) return;

            action.stop();
            this._currentActionIndex = -1;
        }

        

        protected tdSpriteRenderer: TDSpriteRenderer = null;

        protected _state: Character_State = Character_State.NONE;
        protected _time: number = 0;
        protected _direction: Direction = Direction.DOWN;
        protected _inputEnabled: boolean = false;

        protected _walkMode: Character_WalkMode = Character_WalkMode.NONE;
        protected _targetRef: any = null;
        protected _targetOffsetX: number = 0;
        protected _targetOffsetY: number = 0;

        protected _actionInfos: Array<Actions.Info> = [];
        protected _actions: Array<Actions.Base> = [];
        protected _currentActionIndex: number = -1;

        private static allCharacters: Array<Character> = [];
    }

}

namespace Debug {

    export function listCharacters(): Array<string> {
        let names: Array<string> = [];
        Comps.Character.forEach(
            function (character: Comps.Character): void {
                names.push(character.gameObject.name);
            }
        );
        return names;
    }

    export function setInputCharacter(characterName: string): void {
        Comps.Character.setInputCharacter(characterName);
    }

}
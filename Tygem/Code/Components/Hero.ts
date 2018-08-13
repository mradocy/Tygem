/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {
    
    enum Hero_State {
        NONE,
        IDLE,
        WALK,
        SLASH
    }

    export class Hero extends Component {

        speed: number = 70;
        accel: number = 500;
        friction: number = 700;
        slashDuration: number = .3;

        
        constructor() {
            super();
            this.name = "Hero";

            //this.componentProperties.requireComponent();
        }
        
        // Called once for a Component.  Either called when a scene finishes loading, or just before update().
        onStart = (): void => {
            this.actor = this.getComponent(Actor);
            this.spriteRenderer = this.getComponent(SpriteRenderer);

            // start
            this.faceDirection = Direction.DOWN;
            this.idle();
        }
        
        // called once per frame, during the update step.  Is not called if the component is disabled.
        onUpdate = (): void => {

            // getting input
            this.leftHeld = Keys.keyHeld(Key.LeftArrow) || Keys.keyHeld(Key.A);
            this.rightHeld = Keys.keyHeld(Key.RightArrow) || Keys.keyHeld(Key.D);
            this.upHeld = Keys.keyHeld(Key.UpArrow) || Keys.keyHeld(Key.W);
            this.downHeld = Keys.keyHeld(Key.DownArrow) || Keys.keyHeld(Key.S);
            let attackPressed: boolean = Keys.keyPressed(Key.X) || Keys.keyPressed(Key.ForwardSlash);
            
            let vx: number = this.actor.vx;
            let vy: number = this.actor.vy;
            let speed: number = this.speed;
            let accel: number = this.accel;
            let friction: number = this.friction;

            this.time += Game.deltaTime;

            switch (this.state) {
                case Hero_State.IDLE:
                case Hero_State.WALK:

                    if (this.leftHeld == this.rightHeld) {
                        // apply friction
                        if (vx < 0) {
                            vx = Math.min(0, vx + friction * Game.deltaTime);
                        } else {
                            vx = Math.max(0, vx - friction * Game.deltaTime);
                        }
                    } else if (this.leftHeld) {
                        // left held
                        if (vx > 0) {
                            vx = Math.max(0, vx - friction * Game.deltaTime); // apply friction if currently going other way
                        }
                        vx -= accel * Game.deltaTime;
                    } else {
                        // right held
                        if (vx < 0) {
                            vx = Math.min(0, vx + friction * Game.deltaTime); // apply friction if currently going other way
                        }
                        vx += accel * Game.deltaTime;
                    }

                    if (this.upHeld == this.downHeld) {
                        // apply friction
                        if (vy < 0) {
                            vy = Math.min(0, vy + friction * Game.deltaTime);
                        } else {
                            vy = Math.max(0, vy - friction * Game.deltaTime);
                        }
                    } else if (this.upHeld) {
                        // up held
                        if (vy > 0) {
                            vy = Math.max(0, vy - friction * Game.deltaTime); // apply friction if currently going other way
                        }
                        vy -= accel * Game.deltaTime;
                    } else {
                        // down held
                        if (vy < 0) {
                            vy = Math.min(0, vy + friction * Game.deltaTime); // apply friction if currently going other way
                        }
                        vy += accel * Game.deltaTime;
                    }


                    if (this.leftHeld !== this.rightHeld) {
                        if (!(this.upHeld && this.faceDirection === Direction.UP) &&
                            !(this.downHeld && this.faceDirection === Direction.DOWN)) {
                            this.faceDirection = this.leftHeld ? Direction.LEFT : Direction.RIGHT;
                        }
                        this.walk();
                    } else if (this.upHeld !== this.downHeld) {
                        this.faceDirection = this.upHeld ? Direction.UP : Direction.DOWN;

                        this.walk();
                    } else {
                        this.idle();
                    }
                    
                    if (attackPressed) {
                        this.slash();
                    }

                    break;

                case Hero_State.SLASH:

                    // apply friction
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

                    if (this.time >= this.slashDuration) {
                        this.idle();
                    }

                    break;
            }

            // normalize
            let mag: number = M.magnitude(vx, vy);
            if (mag > speed) {
                vx *= speed / mag;
                vy *= speed / mag;
            }

            this.actor.vx = vx;
            this.actor.vy = vy;

            this.updateAnimation();

            
        }

        idle = (): void => {
            if (this.state === Hero_State.IDLE) return;

            this.state = Hero_State.IDLE;
            this.time = 0;
        }
        walk = (): void => {
            if (this.state === Hero_State.WALK) return;

            this.state = Hero_State.WALK;
            this.time = 0;
        }
        slash = (): void => {
            if (this.state === Hero_State.SLASH) return;

            this.state = Hero_State.SLASH;
            this.time = 0;

            let anim: string = "";
            switch (this.faceDirection) {
                case Direction.LEFT:
                case Direction.RIGHT:
                    anim = "hero_slash_right";
                    break;
                case Direction.UP:
                    anim = "hero_slash_up";
                    break;
                case Direction.DOWN:
                    anim = "hero_slash_down";
                    break;
            }
            this.spriteRenderer.playAnimation(anim);
        }

        private updateAnimation = (): void => {

            let anim: string = "hero";
            let flipped: boolean = false;
            switch (this.state) {
                case Hero_State.NONE:
                case Hero_State.SLASH:
                    // no need to set
                    return;
                case Hero_State.IDLE:
                    anim += "_idle";
                    break;
                case Hero_State.WALK:
                    anim += "_walk";
                    break;

            }
            switch (this.faceDirection) {
                case Direction.NONE:
                    return;
                case Direction.LEFT:
                    flipped = true;
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

            if (flipped === this.getTransform().scaleX > 0) {
                this.getTransform().scaleX *= -1;
            }

            if (this.spriteRenderer.getAnimation() === null ||
                this.spriteRenderer.getAnimation().name !== anim) {
                this.spriteRenderer.playAnimation(anim);
            }
            
        }
        
        // called just before the component is destroyed.
        onDestroy = (): void => { }

        // input vars
        private leftHeld: boolean = false;
        private rightHeld: boolean = false;
        private upHeld: boolean = false;
        private downHeld: boolean = false;

        private state: Hero_State = Hero_State.NONE;
        private faceDirection: Direction = Direction.NONE;
        private time: number = 0;

        // components
        private actor: Actor;
        private spriteRenderer: SpriteRenderer;

    }

}
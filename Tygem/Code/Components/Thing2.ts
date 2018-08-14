/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export class Thing2 extends Component {

        constructor() {
            super();
            this.name = "Thing2";
        }

        pir: PackedImageRenderer;
        child: GameObject;
        childPir: PackedImageRenderer;

        speed: number = 300;
        camSpeed: number = 400;

        onUpdate = (): void => {

            let v: Vec2 = new Vec2();

            if (Keys.keyHeld(Key.LeftArrow)) {
                v.x = -this.speed;
            } else if (Keys.keyHeld(Key.RightArrow)) {
                v.x = this.speed;
            } else {
                v.x = 0;
            }

            if (Keys.keyHeld(Key.UpArrow)) {
                v.y = -this.speed;
            } else if (Keys.keyHeld(Key.DownArrow)) {
                v.y = this.speed;
            } else {
                v.y = 0;
            }

            this.transform.x += v.x * Game.deltaTime;
            this.transform.y += v.y * Game.deltaTime;


            let rv: number = 0;
            if (Keys.keyHeld(Key.Q)) {
                rv = -100;
            } else if (Keys.keyHeld(Key.E)) {
                rv = 100;
            } else {
                rv = 0;
            }

            this.transform.rotation += rv * Game.deltaTime;

            if (Keys.keyPressed(Key.Num1)) {
                this.transform.scaleX *= 1.2;
            }
            if (Keys.keyPressed(Key.Num2)) {
                this.transform.scaleX *= -1;
            }
            if (Keys.keyPressed(Key.Num3)) {
                this.transform.scaleY *= .8;
            }



            v.x = 0;
            v.y = 0;

            if (Keys.keyHeld(Key.A)) {
                v.x = -this.camSpeed;
            } else if (Keys.keyHeld(Key.D)) {
                v.x = this.camSpeed;
            } else {
                v.x = 0;
            }
            if (Keys.keyHeld(Key.W)) {
                v.y = -this.camSpeed;
            } else if (Keys.keyHeld(Key.S)) {
                v.y = this.camSpeed;
            } else {
                v.y = 0;
            }

            Camera.centerX += v.x * Game.deltaTime;
            Camera.centerY += v.y * Game.deltaTime;

            if (Keys.keyPressed(Key.PageUp)) {
                Camera.scale *= 1.2;
            }
            if (Keys.keyPressed(Key.PageDown)) {
                Camera.scale /= 1.2;
            }
        
        
            // switching scenes
            if (Keys.keyPressed(Key.M)) {
                if (Scene.currentScene === "testScene") {
                    Scene.loadAdditionalScene("testScene2");
                } else {
                    Scene.loadScene("testScene");
                }
            }

            


            if (this.child != null) {

                v.x = 0;
                if (Keys.keyHeld(Key.J)) {
                    v.x = -this.speed;
                } else if (Keys.keyHeld(Key.L)) {
                    v.x = this.speed;
                }

                v.y = 0;
                if (Keys.keyHeld(Key.I)) {
                    v.y = -this.speed;
                } else if (Keys.keyHeld(Key.K)) {
                    v.y = this.speed;
                }

                this.child.transform.x += v.x * Game.deltaTime;
                this.child.transform.y += v.y * Game.deltaTime;


                // destroying things
                if (Keys.keyPressed(Key.Dash)) {
                    let thing1: GameObject = GameObject.findObject("thing 1");
                    if (thing1 !== null) {
                        thing1.markForDestroy();
                    }

                }
                // dereference child if it'll be destroyed
                if (this.child.isMarkedForDestroy()) {
                    this.child = null;
                }

            }

        }


        messageF = (num: number) => {
            console.log("received message: " + num);
        }


    }

}
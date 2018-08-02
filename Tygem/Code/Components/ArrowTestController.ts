/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export class ArrowTestController extends Component {

        constructor() {
            super();
            this.name = "ArrowTestController";
        }
        

        speed: number = 300;


        onStart = (): void => {
            this.actor = this.getComponent(Actor);
        }
        
        onUpdate = (): void => {

            let v: Vec2 = new Vec2(this.actor.vx, this.actor.vy);

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
                //v.y = 0;
            }

            this.actor.vx = v.x;
            this.actor.vy = v.y;
            


        }

        onCollisionEnter = (response: Collision.Response): void => {

            //console.log("collision enter: " + response.toString());

        }

        onCollisionStay = (response: Collision.Response): void => {

            //console.log("collision stay: " + response.toString());

        }

        onCollisionExit = (response: Collision.Response): void => {

            //console.log(Direction[response.getNormalDirection()]);

        }
        


        private actor: Actor;

    }
    
}
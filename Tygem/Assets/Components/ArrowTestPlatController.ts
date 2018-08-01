/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export class ArrowTestPlatController extends Component {

        constructor() {
            super();
            this.name = "ArrowTestPlatController";
        }

        speed: number = 300;


        onStart = (): void => {
            this.platform = this.getComponent(Platform);
        }

        onUpdate = (): void => {

            let v: Vec2 = new Vec2();

            if (Keys.keyHeld(Key.A)) {
                v.x = -this.speed;
            } else if (Keys.keyHeld(Key.D)) {
                v.x = this.speed;
            } else {
                v.x = 0;
            }

            if (Keys.keyHeld(Key.W)) {
                v.y = -this.speed;
            } else if (Keys.keyHeld(Key.S)) {
                v.y = this.speed;
            } else {
                v.y = 0;
            }

            this.platform.vx = v.x;
            this.platform.vy = v.y;



            if (Keys.keyPressed(Key.Num1)) {
                let tiledMap: TiledMapComponent = GameObject.findObjectOfType(TiledMapComponent);
                if (tiledMap !== null) {
                    console.log("tiledMap marked for destroy");
                    tiledMap.gameObject.markForDestroy();
                }
            }
            

        }

        onCollisionExit = (response: Collision.Response): void => {
            //console.log(response.toString());
        }
        


        private platform: Platform;

    }

}
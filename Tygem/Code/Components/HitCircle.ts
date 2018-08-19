/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export class HitCircle extends DrawerComponent {

        static SHOW_GIZMO: boolean = true;

        teamTargeting: Team = Team.ENEMIES;

        /**
         * radius of the circle
         */
        radius: number = 10;
        /**
         * x offset of the center of the circle
         */
        offsetX: number = 0;
        /**
         * y offset of the center of the circle
         */
        offsetY: number = 0;

        /**
         * How long to wait until the attack is active.
         */
        attackDelay: number = 0;
        /**
         * Once the attack is active, how long until the attack deactivates.
         */
        attackDuration: number = 9999;

        gizmoColor: string = "red";

        /**
         * If the attack is currently active
         */
        isAttackActive = (): boolean => {
            return this.attackDelay <= this._attackTime && this._attackTime <= this.attackDelay + this.attackDuration;
        }

        /**
         * Reference to the Action that creted the HitCircle.
         */
        actionRef: Actions.Base = null;

        constructor() {
            super();
            this.name = "HitCircle";

            this.layer = DrawLayer.GIZMO;
        }
        
        // Called once for a Component.  Either called when a scene finishes loading, or just before update().
        onStart = (): void => {

            // validation.  May not be needed later on, since attacks shouldn't technically need to come from an action
            if (this.actionRef === null) {
                console.warn("actionRef has not been specified for this HitCircle");
            }

        }
        
        // called once per frame, during the update step.  Is not called if the component is disabled.
        onUpdate = (): void => {

            this._attackTime += Game.deltaTime;

            if (!this.isAttackActive()) return;

            // calculating position, size
            let trans: Transform = this.transform;
            trans.localToGlobal(this.offsetX, this.offsetY, this.tempVec2);
            let cx: number = this.tempVec2.x;
            let cy: number = this.tempVec2.y;
            let r: number = this.radius;
            while (trans !== null) {
                r *= (Math.abs(trans.scaleX) + Math.abs(trans.scaleY)) / 2;
                trans = trans.getParent();
            }
            
            // hitting target
            let thisHitCircle: HitCircle = this;
            let tempRect: Rect = this.tempRect;
            Actor.forEach(
                function (actor: Actor): void {

                    // ignore if not targeting this team
                    if (!actor.isInTeam(thisHitCircle.teamTargeting)) return;

                    // collision detection
                    actor.getRect(tempRect);
                    if (M.circleRectangleIntersects(cx, cy, r, tempRect.x, tempRect.y, tempRect.width, tempRect.height)) { // hit actor
                        
                        let ai: AttackInfo = AttackInfo.createNew();

                        // damage calculation (should be expanded on)
                        ai.damage = thisHitCircle.actionRef.power;

                        // deal damage
                        actor.receiveDamage(ai);

                        // recycle attack info
                        AttackInfo.recycle(ai);
                    }

                }
            );

        }
        
        // called just before the component is destroyed.
        onDestroy = (): void => { }

        draw = (context: CanvasRenderingContext2D): void => {

            if (!HitCircle.SHOW_GIZMO)
                return;
            if (!this.isAttackActive())
                return;

            // draw circle gizmo representing hit area
            context.beginPath();
            context.strokeStyle = this.gizmoColor;
            context.lineWidth = 1;
            context.arc(this.offsetX, this.offsetY, this.radius, 0, Math.PI * 2);
            context.stroke();

        }

        private _attackTime: number = 0;
        private tempVec2: Vec2 = new Vec2();
        private tempRect: Rect = new Rect();
        

    }

}
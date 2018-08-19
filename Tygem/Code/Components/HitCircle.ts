/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export enum HitCircle_HeadingMode {
        /**
         * Based on the position of this circle
         */
        CIRCLE_POSITION,
        /**
         * Based on the position of the character that launched the attack.
         */
        CHARACTER_POSITION,
        /**
         * Heading is manually provided in the HitCircle.manualHeading property.
         */
        MANUAL,
    }

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

        /**
         * How the heading of the AttackInfo is determined upon dealing damage
         */
        headingMode: HitCircle_HeadingMode = HitCircle_HeadingMode.CIRCLE_POSITION;
        /**
         * The heading of the AttackInfo if headingMode is set to HitCircle_HeadingMode.MANUAL
         */
        manualHeading: number = 0;
        

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
            let tempVec2: Vec2 = this.tempVec2;
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

                        // knockback
                        switch (thisHitCircle.headingMode) {
                            case HitCircle_HeadingMode.CIRCLE_POSITION:
                                // setting heading to angle pointing from circle to actor's position
                                ai.knockbackHeading = Math.atan2(
                                    tempRect.y + tempRect.height / 2 - cy,
                                    tempRect.x + tempRect.width / 2 - cx
                                ) * M.radToDeg;
                                break;
                            case HitCircle_HeadingMode.CHARACTER_POSITION:
                                // setting heading to angle pointing from attacking character to actor's position
                                thisHitCircle.actionRef.character.transform.getGlobalPosition(tempVec2);
                                let charX: number = tempVec2.x;
                                let charY: number = thisHitCircle.actionRef.character.getFoot();
                                ai.knockbackHeading = Math.atan2(
                                    tempRect.y + tempRect.height / 2 - charY,
                                    tempRect.x + tempRect.width / 2 - charX
                                ) * M.radToDeg;
                                break;
                            case HitCircle_HeadingMode.MANUAL:
                                ai.knockbackHeading = thisHitCircle.manualHeading;
                                break;
                        }
                        // will leave speed and duration at default values

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
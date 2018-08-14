/// <reference path="../../Tygem/_ref.ts" />

namespace Comps {

    export class TDActor extends Actor {

        constructor() {
            super();
            this.name = "TDActor";
            
        }

        /**
         * foot is the global y position of the actor's "feet".  This value determines how sprites are ordered.
         */
        getFoot = (): number => {
            this.getGlobalPosition(this.tempVec2);
            return this.tempVec2.y + this.offsetY;
        }
        /**
         * foot is the global y position of the actor's "feet".  This value determines how sprites are ordered.
         * Setting foot will adjust the transform's global position, NOT offsetY.
         */
        setFoot = (foot: number): void => {
            this.getGlobalPosition(this.tempVec2);
            this.setGlobalPosition(this.tempVec2.x, foot - this.offsetY);
        }

        /**
         * Gets how high above the ground the actor appears to be.
         * Is determined by offsetY - baseOffsetY.
         */
        getAir = (): number => {
            return this.offsetY - this.baseOffsetY;
        }
        /**
         * Sets how high above the ground the actor appears to be.
         * Modifies offsetY and global position y while keeping foot the same.
         */
        setAir = (air: number): void => {
            let foot: number = this.getFoot();
            this.offsetY = air + this.baseOffsetY;
            this.setFoot(foot);
        }

        /**
         * offsetY when the air space is 0.  Ideally is the initial value of offsetY.
         */
        baseOffsetY: number = 0;

        /**
         * Quickly sets the offsetX, offsetY, baseOffsetY, halfWidth, halfHeight properties of this Actor.
         * Meant for initialization.
         */
        setBounds = (offsetX: number, offsetY: number, halfWidth: number, halfHeight: number): void => {
            this.Actor_setBounds(offsetX, offsetY, halfWidth, halfHeight);
            this.baseOffsetY = offsetY;
        }
        
        
    }

}
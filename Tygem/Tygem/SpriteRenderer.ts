/// <reference path="_ref.ts" />

/**
 * An extension of PackedImageRenderer for rendering SpriteFrames and Animations.
 */
class SpriteRenderer extends PackedImageRenderer {
    
    constructor() {
        super();
        this.name = "SpriteRenderer";
    }
    
    /**
     * Reference to the spriteFrame the renderer is displaying.
     */
    getSpriteFrame = (): SpriteFrame => {
        return this.spriteFrame;
    }

    /**
     * Sets renderer to display the given spriteFrame.
     */
    setSpriteFrame = (spriteFrame: SpriteFrame): void => {
        if (spriteFrame === null) {
            this.setImage(null, false);
        } else {
            this.setImage(spriteFrame.getImage(), false);
            this.setImageRect(spriteFrame.x, spriteFrame.y, spriteFrame.width, spriteFrame.height);
        }
        this.spriteFrame = spriteFrame;
    }

    /**
     * Sets renderer to display the the spriteFrame from a spritesheet at the given index.
     */
    setSpriteFrameByName = (imageFilename: string, frameIndex: number): void => {
        this.setSpriteFrame(Spritesheet.getSpriteFrame(imageFilename, frameIndex));
    }

    /**
     * Sets the image to draw.  Since this is isn't defined by a SpriteFrame, spriteFrame will be set to null.
     * Calling this while an animation is playing probably won't do anything because the animation will almost immediately update the image.
     * @param setRectFull Automatically set rectangular selection dimensions to be the size of the original image (default is true).
     */
    setImage = (image: TexPackManager.PackedImage, setRectFull: boolean = true): void => {
        this.setImage_PackedImageRenderer(image, setRectFull);
        this.spriteFrame = null;
    }

    /**
     * Sets the rectangular selection properties with one function.  Since this is isn't defined by a SpriteFrame, spriteFrame will be set to null.
     * Calling this while an animation is playing probably won't do anything because the animation will almost immediately update the image.
     * @param x x coordinate of top left corner of the rectangle.
     * @param y y coordinate of top left corner of the rectangle.
     * @param width width of the rectangle.
     * @param height height of the rectangle.
     */
    setImageRect = (x: number, y: number, width: number, height: number): void => {
        this.setImageRect_PackedImageRenderer(x, y, width, height);
        this.spriteFrame = null
    }

    /**
     * Plays the given animation.  
     * @param animation The animation to play.  Can be the Animation object or a string being the name of the animation.  Can be null to stop the animation.
     * @param nextAnimation (default is null) The animation to play after the other animation finishes (doesn't apply when playing backwards).  This won't happen when set to null.
     */
    playAnimation = (animation: Animation | string, nextAnimation: Animation | string = null): void => {
        if ((animation != null && (typeof animation === "string")) ||
            (nextAnimation != null && (typeof nextAnimation === "string"))) {
            if (nextAnimation == null) {
                this.playAnimationByName(animation as string);
            } else if (typeof nextAnimation === "string") {
                this.playAnimationByName(animation as string, nextAnimation as string);
            } else {
                this.playAnimationByName(animation as string, (nextAnimation as Animation).name);
            }
            return;
        }

        let anim: Animation = null;
        if (animation != null)
            anim = animation as Animation;
        let nextAnim: Animation = null;
        if (nextAnimation != null)
            nextAnim = nextAnimation as Animation;

        if (anim !== null && (anim.frames == null || anim.frames.length === 0)) {
            console.error("Cannot play animation " + anim.name + " because it has no frames");
            animation = null;
        }
        this.animation = anim;
        this.nextAnimation = nextAnim;
        if (this.animSpeed < 0 && this.animation !== null) {
            // playing backwards.  Start animation at the end
            this.animTime = this.animation.getDuration() - .0001;
        } else {
            // start from the beginning
            this.animTime = 0;
        }
        this.animPlaying = (animation !== null);

        this.updateSpriteFrameFromAnimation();
    }

    /**
     * Plays the given animation.  Animations are given by name.
     * @param animation The animation to play.  Can be "" to stop the animation.
     * @param nextAnimation (default is "") The animation to play after the other animation finishes (doesn't apply when playing backwards).  This won't happen when set to "".
     */
    private playAnimationByName = (animation: string, nextAnimation: string = ""): void => {
        let anim: Animation = null;
        if (animation != null && animation !== "") {
            anim = Animation.getAnimation(animation);
            if (anim === null) {
                console.warn("No animation found with name " + animation);
            }
        }
        let nextAnim: Animation = null;
        if (nextAnimation != null && nextAnimation !== "") {
            nextAnim = Animation.getAnimation(nextAnimation);
            if (nextAnim === null) {
                console.warn("No animation found with name " + nextAnimation);
            }
        }
        this.playAnimation(anim, nextAnim);
    }

    /**
     * Stops the animation.
     */
    stopAnimation = (): void => {
        this.animPlaying = false;
    }

    /**
     * Gets the current animation.
     */
    getAnimation = (): Animation => {
        return this.animation;
    }
    
    /**
     * Gets if an animation is playing.  Can return true even when animation speed is 0.
     */
    isAnimationPlaying = (): boolean => {
        return this.animPlaying;
    }

    /**
     * If the current animation played and stopped upon reaching the end.
     * Will never be true if the animation loops.
     * Returns false if getAnimation() would return null.
     */
    isAtEndOfAnimation = (): boolean => {
        if (this.animation === null) return false;
        if (this.animPlaying) return false;
        if (this.animSpeed >= 0) { // playing forward
            if (this.animTime >= this.animation.getDuration() - .0002) { // if is at last frame
                return true;
            }
        } else { // playing backward
            if (this.animTime <= .0001) { // if is at first frame
                return true;
            }
        }
        return false;
    }

    /**
     * Gets the current time for playing the current animation.
     */
    getAnimationTime = (): number => {
        return this.animTime;
    }

    /**
     * Gets the current frame index of the current animation.
     */
    getAnimationFrameIndex = (): number => {
        if (this.animation === null) return 0;
        return Math.floor(this.animTime * this.animation.fps);
    }

    /**
     * Sets the time for playing the current animation.  Is automatically clamped to be within the animation duration.
     */
    setAnimationTime = (time: number): void => {
        if (this.animation === null) {
            this.animTime = 0;
            return;
        }
        let duration = this.animation.getDuration();
        this.animTime = M.fmod(time, duration);
    }

    /**
     * Gets the speed multiplier for playing an animation.
     */
    getAnimationSpeed = (): number => {
        return this.animSpeed;
    }

    /**
     * Sets the speed multiplier for playing an animation (can be negative to play animation in reverse).
     */
    setAnimationSpeed = (speed: number) => {
        this.animSpeed = speed;
    }

    onUpdate = (): void => {

        this.onUpdateAnimation();

    }

    /**
     * Plays the animation
     */
    protected onUpdateAnimation = (): void => {

        if (this.animPlaying && this.animation !== null) {
            this.animTime += this.animSpeed * Game.deltaTime;
            let animDuration = this.animation.getDuration();
            if (this.animSpeed >= 0) {
                // playing forward
                if (this.animTime >= animDuration) {
                    // reached end of animation.  Stop, loop, or move on to the next animation.
                    if (this.nextAnimation === null) {
                        if (this.animation.loops) {
                            // loop around
                            this.animTime = M.fmod(this.animTime, animDuration);
                        } else {
                            // stop animation at the end
                            this.animTime = animDuration - .0001;
                            this.animPlaying = false;
                        }
                    } else {
                        // move on to next animation
                        this.animation = this.nextAnimation;
                        this.nextAnimation = null;
                        this.animTime = M.fmod(this.animTime - animDuration, this.animation.getDuration());
                    }
                }
            } else {
                // playing backward
                if (this.animTime < 0) {
                    // reached end of animation.  Stop or loop.
                    if (this.animation.loops) {
                        // loop around
                        this.animTime = M.fmod(this.animTime, animDuration);
                    } else {
                        // stop animation at the start
                        this.animTime = 0;
                        this.animPlaying = false;
                    }
                }
            }
            this.updateSpriteFrameFromAnimation();
        }

    }

    protected updateSpriteFrameFromAnimation = (): void => {

        if (this.animation === null) return;

        let sf: SpriteFrame = null;
        let t: number = M.fmod(this.animTime, this.animation.frames.length / this.animation.fps);
        sf = this.animation.frames[Math.floor(t * this.animation.fps)];        
        if (sf !== this.spriteFrame) {
            this.setSpriteFrame(sf);
        }
    }

    protected spriteFrame: SpriteFrame = null;

    protected animation: Animation = null;
    protected nextAnimation: Animation = null;
    protected animTime: number = 0;
    protected animSpeed: number = 1;
    protected animPlaying: boolean = false;

}

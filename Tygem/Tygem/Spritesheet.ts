/// <reference path="_ref.ts" />

/*

Spritesheet.add("sealime.png", 64, 64, 8, 24);

Animations.add("sealime_idle", "sealime.png", [0, 1, 2, 3, 4, 5]);

*/

class SpriteFrame {

    imageFilename: string = "";
    getImage = (): TexPackManager.PackedImage => {
        if (this._image === null)
            this._image = TexPackManager.getPackedImage(this.imageFilename);
        return this._image;
    }
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
    pivotX: number = .5;
    pivotY: number = .5;

    private _image: TexPackManager.PackedImage = null;
    
}

/**
 * Spritesheets for an image.  Is merely a collection of SpriteFrames from this image.
 * spriteFrames can be customized to have different positions, sizes, and pivots.
 * An image can only have at most 1 spritesheet.
 */
class Spritesheet {

    /**
     * Creates a spritesheet, and automatically creates frames for it based on given parameters.
     * The created spritesheet is returned, and its frames can be further customized.
     * @param imageFilename Filename of the image the spritesheet belongs to.  Only one spritesheet can be made per image.
     * @param frameWidth Width of the frames in pixels.
     * @param frameHeight Height of the frames in pixels.
     * @param numColumns Number of columns.
     * @param numFrames Total number of frames to create.
     */
    static addSpritesheet(imageFilename: string, frameWidth: number, frameHeight: number, numColumns: number, numFrames: number): Spritesheet {
        let ss: Spritesheet = Spritesheet.addSpritesheetCustom(imageFilename);
        if (ss === null) {
            return null;
        }
        for (let i: number = 0; i < numFrames; i++) {
            let frame: SpriteFrame = ss.addFrame();
            frame.x = (i % numColumns) * frameWidth;
            frame.y = Math.floor(i / numColumns + .00000001) * frameHeight;
            frame.width = frameWidth;
            frame.height = frameHeight;
        }
        return ss;
    }

    /**
     * Creates a basic spritesheet.  Its frames will need to be created manually.
     * @param imageFilename filename of the image for this spritesheet.  Only one spritesheet can be made per image.
     */
    static addSpritesheetCustom(imageFilename: string): Spritesheet {
        if (Spritesheet.spritesheetDic.hasOwnProperty(imageFilename)) {
            console.warn("Cannot create spritesheet " + imageFilename + " because a spritesheet for that file has already been created.");
            return null;
        }
        let ret: Spritesheet = new Spritesheet();
        ret.imageFilename = imageFilename;
        Spritesheet.spritesheetDic[imageFilename] = ret;
        return ret;
    }

    imageFilename: string = "";

    frames: Array<SpriteFrame> = [];

    /**
     * Creates and returns a new SpriteFrame belonging to this spritesheet, and pushes it into frames.
     */
    addFrame = (): SpriteFrame => {
        let sf: SpriteFrame = new SpriteFrame();
        sf.imageFilename = this.imageFilename;
        this.frames.push(sf);
        return sf;
    }

    /**
     * Gets the spritesheet created for the given image, or null if it hasn't been created.
     * @param imageFilename Filename of the original image.
     */
    static getSpritesheet(imageFilename: string): Spritesheet {
        if (!Spritesheet.spritesheetDic.hasOwnProperty(imageFilename)) return null;
        return Spritesheet.spritesheetDic[imageFilename];
    }

    /**
     * Gets a frame of a spritesheet for the given image, or null if it hasn't been created.
     * @param imageFilename Filename of the original image.
     * @param frameIndex frame of the spritesheet.
     */
    static getSpriteFrame(imageFilename: string, frameIndex: number): SpriteFrame {
        let ss: Spritesheet = Spritesheet.getSpritesheet(imageFilename);
        if (ss === null) return null;
        if (frameIndex < 0 || frameIndex >= ss.frames.length) return null;
        return ss.frames[frameIndex];
    }

    private static spritesheetDic: { [imageFilename: string]: Spritesheet; } = {};


}

/**
 * A list of frames taken from spriteSheets.
 */
class Animation {

    name: string = "";
    frames: Array<SpriteFrame> = [];
    fps: number = 10;
    loops: boolean = false;

    /**
     * Returns the time (unscaled, in seconds) it would take for the animation to play.
     */
    getDuration = (): number => {
        return this.frames.length / this.fps;
    }

    /**
     * Creates an Animation, automatically filling in frames based on the given properties.
     * @param name Name of the animation.
     * @param spritesheetFilename Filename of the spritesheet to take frames from (spritesheet should already be created)
     * @param frames Array of ints of the frames of the spritesheet to use.  An index of -1 means null.
     * @param fps Frame rate of the animation.
     * @param loops Whether or not the animation loops.
     */
    static addAnimation(name: string, spritesheetFilename: string, frames: Array<number>, fps: number = 10, loops: boolean = false): Animation {
        let anim: Animation = Animation.addAnimationCustom(name);
        if (anim === null) {
            return null;
        }
        if (fps <= 0) {
            console.error("Animation " + name + " must have an fps that's more than 0");
            fps = 10;
        }
        anim.fps = fps;
        anim.loops = loops;
        if (frames == null || frames.length === 0) {
            return anim;
        }

        let ss: Spritesheet = Spritesheet.getSpritesheet(spritesheetFilename);
        if (ss === null) {
            console.error("Cannot make animation " + name + " because spritesheet " + spritesheetFilename + " has not been created.");
            return null;
        }
        for (let i: number = 0; i < frames.length; i++) {
            let frame: number = frames[i];
            if (frame === -1) { // -1 means add null to the list of frames.
                anim.frames.push(null);
                continue;
            }
            if (frame < 0 || frame >= ss.frames.length) {
                console.error("Frame " + frame + " of spritesheet " + spritesheetFilename + " is invalid.Cannot create animation " + name + ".");
                return anim;
            }
            anim.frames.push(ss.frames[frame]);
        }
        return anim;
    }

    /**
     * Creates and returns a basic Animation with the given name.  frames and other properties will need to be set manually.
     * @param name Name of the animation.  No two animations can have the same name.
     */
    static addAnimationCustom(name: string): Animation {
        if (Animation.animationsDic.hasOwnProperty(name)) {
            console.warn("Animation already created with the name " + name + ".");
            return Animation.animationsDic[name];
        }
        let anim: Animation = new Animation();
        anim.name = name;
        Animation.animationsDic[name] = anim;
        return anim;
    }

    /**
     * Gets the animation with the given name, or null if it doesn't exist.
     */
    static getAnimation(name: string): Animation {
        if (!Animation.animationsDic.hasOwnProperty(name)) return null;
        return Animation.animationsDic[name];
    }

    private static animationsDic: { [name: string]: Animation; } = {};
    
}
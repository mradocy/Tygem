/// <reference path="_ref.ts" />

namespace TexPackManager {

    /**
     * An image that has been packed with the texture packer.
     */
    export class PackedImage {

        /**
         * The original filename of the image.
         */
        filename: string = "";
        /**
         * The texture atlas image to draw from.
         */
        atlasImage: HTMLImageElement = null;
        /**
         * Returns true if the atlas image has been loaded (and can be drawn from).
         */
        isLoaded = (): boolean => {
            return this._textureAtlas.isLoaded();
        }
        /**
         * x of the rectangle of the texture atlas that contains the image.
         */
        frameX: number = 0;
        /**
         * y of the rectangle of the texture atlas that contains the image.
         */
        frameY: number = 0;
        /**
         * width of the rectangle of the texture atlas that contains the image.
         */
        frameWidth: number = 0;
        /**
         * height of the rectangle of the texture atlas that contains the image.
         */
        frameHeight: number = 0;
        /**
         * Reference to the JSON defining the frame from the texture packer.
         */
        frameJSON: any = null;

        /**
         * How much was trimmed off the left side when the image was packed.
         */
        trimLeft: number = 0;
        /**
         * How much was trimmed off the top side when the image was packed.
         */
        trimTop: number = 0;
        /**
         * How much was trimmed off the right side when the image was packed.
         */
        trimRight: number = 0;
        /**
         * How much was trimmed off the bottom side when the image was packed.
         */
        trimBottom: number = 0;
        /**
         * Gets the width of the original image before it was packed and trimmed.
         */
        getOriginalWidth = (): number => {
            return this.trimLeft + this.frameWidth + this.trimRight;
        }
        /**
         * Gets the height of the original image before it was packed and trimmed.
         */
        getOriginalHeight = (): number => {
            return this.trimTop + this.frameHeight + this.trimBottom;
        }

        _textureAtlas: TextureAtlas = null;

    }

    /**
     * Loads a texture pack from the given url.
     * @param packJsonUrl url pointing to the texture pack.
     */
    export function addTexturePack(packJsonUrl: string): void {
        
        if (JSONManager.jsonExists(packJsonUrl)) {
            console.warn("texture pack " + packJsonUrl.toLowerCase() + " already added");
            return;
        }
        
        _numTexPacks++;
        JSONManager.addFromUrl(
            jsonNameFromURL(packJsonUrl),
            packJsonUrl,
            onJSONLoad);

    }

    /**
     * Gets an image that has been packed into a texture packer.
     * @param filename The path of the image before it was packed.
     */
    export function getPackedImage(filename: string): PackedImage {
        let fn: string = filename.toLowerCase();
        if (packedImageDictionary.hasOwnProperty(fn)) {
            return packedImageDictionary[fn];
        } else {
            console.warn("packed image " + fn + " has not been added");
            return null;
        }
    }
    
    /**
     * Directory containing the texpack texture images and json files.
     * Capitalization matters when getting images in the web browser.
     */
    export const texpacksDirectory: string = "Assets/Texpacks/";

    /**
     * Gets the number of texture packs added.
     */
    export function getNumTexPacks(): number {
        return _numTexPacks;
    }
    /**
     * Gets the number of texture packs loaded.
     */
    export function getNumTexPacksLoaded(): number {
        return _numTexPacksLoaded;
    }
    
    /**
     * Returns a list of all the packed images by filename.
     * @param searchPrefix If given, limits results to names that start with this string.
     */
    export function getAllPackedImages(searchPrefix: string = ""): Array<string> {
        
        let ret: Array<string> = [];
        for (let tag in packedImageDictionary) {
            if (searchPrefix == null || searchPrefix === "" ||
                tag.indexOf(searchPrefix) === 0)
                ret.push(tag);
        }
        ret.sort();
        return ret;
    }


    function jsonNameFromURL(jsonURL: string): string {

        let index: number = Math.max(jsonURL.lastIndexOf("/"), jsonURL.lastIndexOf("\\"));
        let trimmedStr: string;
        if (index == -1) {
            trimmedStr = jsonURL;
        } else {
            trimmedStr = jsonURL.slice(index + 1);
        }
        index = trimmedStr.lastIndexOf(".");
        trimmedStr = trimmedStr.slice(0, index);

        return trimmedStr;
    }
    
    function onJSONLoad(json: any): void {
        
        if (json == null) {
            console.error("Something went wrong with loading a texture packer json.");
            return;
        }
        if (json.meta == null || json.meta.image == null || json.meta.image == "") {
            console.error("image url could not be found on the texture packer json.");
            return;
        }

        // load texture atlas specified in the json.
        let imageURL: string = texpacksDirectory + json.meta.image;
        let imageURLLower: string = imageURL.toLowerCase();
        let texAtlas: TextureAtlas = null;
        if (texAtlasDictionary.hasOwnProperty(imageURLLower)) {
            console.warn("image " + imageURLLower + " already added");
            _numTexPacksLoaded++;
            texAtlas = texAtlasDictionary[imageURLLower];
        } else {
            texAtlas = new TextureAtlas(imageURL);
            texAtlasDictionary[imageURLLower] = texAtlas;
        }

        // create packed images as specified in the json
        if (json.frames == null) {
            console.error("frames not given in the texture packer json.");
            return;
        }
        for (let i: number = 0; i < json.frames.length; i++) {
            let frame: any = json.frames[i];
            if (frame.rotated != null && frame.rotated == true) {
                console.error("frames cannot be rotated, disable the feature in texture packer");
                continue;
            }
            let packedImage: PackedImage = new PackedImage();
            packedImage.frameJSON = frame;
            packedImage.filename = frame.filename;
            packedImage._textureAtlas = texAtlas;
            packedImage.atlasImage = texAtlas.getImage();
            packedImage.frameX = frame.frame.x;
            packedImage.frameY = frame.frame.y;
            packedImage.frameWidth = frame.frame.w;
            packedImage.frameHeight = frame.frame.h;
            packedImage.trimLeft = frame.spriteSourceSize.x;
            packedImage.trimTop = frame.spriteSourceSize.y;
            packedImage.trimRight = frame.sourceSize.w - frame.spriteSourceSize.x - frame.spriteSourceSize.w;
            packedImage.trimBottom = frame.sourceSize.h - frame.spriteSourceSize.y - frame.spriteSourceSize.h;
            packedImageDictionary[packedImage.filename.toLowerCase()] = packedImage;
        }
        
    }

    export class TextureAtlas {

        /**
        * Handles loading of sprites packed into a single texture atlas image.  DO NOT CALL THIS DIRECTLY, use addTexture() instead.
        * @param imageSource Source url (src) for the texture atlas being loaded.
        */
        constructor(imageSource: string) {

            this._image = new Image();
            this._image.onload = this.imageOnLoad;

            this._image.src = imageSource;
        }
        
        /**
         * Gets the image.
         */
        getImage = (): HTMLImageElement => {
            return this._image;
        }

        isLoaded = (): boolean => {
            return this._loaded;
        }

        private imageOnLoad = (): void => {
            if (this._loaded) return;
            this._loaded = true;
            _numTexPacksLoaded++;
        }

        private _image: HTMLImageElement;

        private _loaded: boolean = false;
        
    }
    
    let packedImageDictionary: { [filename: string]: PackedImage; } = {};
    let texAtlasDictionary: { [key: string]: TextureAtlas; } = { };
    let _numTexPacks: number = 0; // counter increments when a texture pack is added
    let _numTexPacksLoaded: number = 0; // counter increments when a texture pack loads
    
}
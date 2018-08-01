/// <reference path="_ref.ts" />

/**
 * Renders a rectangle of a TextureAtlas.
 */
class PackedImageRenderer extends DrawerComponent {

    constructor() {
        super();
        this.name = "PackedImageRenderer";
    }
    
    /**
     * Gets the TexPackManager.PackedImage this renderer draws from.
     */
    getImage = (): TexPackManager.PackedImage => {
        return this.image;
    }

    /**
     * Sets the image to draw.
     * @param setRectFull Automatically set rectangular selection dimensions to be the size of the original image (default is true).
     */
    setImage = (image: TexPackManager.PackedImage, setRectFull: boolean = true): void => {
        this.setImage_PackedImageRenderer(image, setRectFull);
    }
    protected setImage_PackedImageRenderer = (image: TexPackManager.PackedImage, setRectFull: boolean = true): void => {
        this.image = image;
        if (setRectFull) {
            this.setImageRectFull();
        }
    }

    /**
     * Sets image to draw based on its original filename.  image is set to null if no image with the name exists.
     * @param setRectFull Automatically set rectangular selection dimensions to be the size of the original image (default is true).
     */
    setImageByName = (filename: string, setRectFull: boolean = true): void => {
        this.setImage(TexPackManager.getPackedImage(filename), setRectFull);
    }
    

    /**
     * The X coordinate of the top left corner of the sub-rectangle of the original image to draw into the destination context.
     * Assumes the image wasn't trimmed.
     */
    imageX: number = 0;
    /**
     * The Y coordinate of the top left corner of the sub-rectangle of the original image to draw into the destination context.
     * Assumes the image wasn't trimmed.
     */
    imageY: number = 0;
    /**
     * The width of the sub-rectangle of the original image to draw into the destination context.
     * Assumes the image wasn't trimmed.
     */
    imageWidth: number = 0;
    /**
     * The height of the sub-rectangle of the original image to draw into the destination context.
     * Assumes the image wasn't trimmed.
     */
    imageHeight: number = 0;

    /**
     * Sets the rectangular selection properties with one function.
     * @param x x coordinate of top left corner of the rectangle.
     * @param y y coordinate of top left corner of the rectangle.
     * @param width width of the rectangle.
     * @param height height of the rectangle.
     */
    setImageRect = (x: number, y: number, width: number, height: number): void => {
        this.setImageRect_PackedImageRenderer(x, y, width, height);
    }
    protected setImageRect_PackedImageRenderer = (x: number, y: number, width: number, height: number): void => {
        this.imageX = x;
        this.imageY = y;
        this.imageWidth = width;
        this.imageHeight = height;
    }
    /**
     * Sets the rectangular selection properties to be the size of the original image.
     */
    setImageRectFull = (): void => {
        if (this.image === null) {
            this.setImageRect(0, 0, 0, 0);
        } else {
            this.setImageRect(0, 0, this.image.getOriginalWidth(), this.image.getOriginalHeight());
        }
    }

    /**
     * x coordinate of the origin point of the displayed image, as a multiplier of the imageWidth.  0 is the left edge, 1 is the right edge.
     */
    pivotX: number = .5;
    /**
     * y coordinate of the origin point of the displayed image, as a multiplier of the imageHeight.  0 is the top edge, 1 is the bottom edge.
     */
    pivotY: number = .5;
    
    /**
     * Disable image smoothing for a pixel-art look.
     */
    imageSmoothingEnabled: boolean = true;
    
    /**
     * CSS color string representing the color to tint the image.  Alpha is ignored.
     */
    tintColor: string = "#000000";

    /**
     * Amount to apply tintColor when tinting the image.  Ranges from [0, 1].
     */
    tintAmount: number = 0;
    
    /**
     * Draws the TextureRectRenderer on the given context.
     */
    draw = (context: CanvasRenderingContext2D): void => {

        let packedImage: TexPackManager.PackedImage = this.image;
        if (packedImage === null) {
            return;
        }
        if (!packedImage.isLoaded()) {
            console.warn("Attempting to draw with PackedImage that hasn't finished loading");
            return;
        }

        // get positions from the packed image
        let piLeft: number = packedImage.frameX + Math.max(0, this.imageX - packedImage.trimLeft);
        let piRight: number = packedImage.frameX + Math.min(packedImage.frameWidth, this.imageX + this.imageWidth - packedImage.trimLeft);
        let piPivotX: number = packedImage.frameX + this.imageX + this.imageWidth * this.pivotX - packedImage.trimLeft;
        let piTop: number = packedImage.frameY + Math.max(0, this.imageY - packedImage.trimTop);
        let piBottom: number = packedImage.frameY + Math.min(packedImage.frameHeight, this.imageY + this.imageHeight - packedImage.trimTop);
        let piPivotY: number = packedImage.frameY + this.imageY + this.imageHeight * this.pivotY - packedImage.trimTop;
        piPivotX = Math.floor(piPivotX + .001);
        piPivotY = Math.floor(piPivotY + .001);

        

        // (can have effects here, e.g. setting context.shadowBlur, context.shadowColor, context.globalAlpha, (context as any).imageSmoothingEnabled, etc.)
        // (don't need to reset effects afterward since context.restore() will be called)

        // disable image smoothing
        if (!this.imageSmoothingEnabled) {
            (context as any).mozImageSmoothingEnabled = false;
            (context as any).webkitImageSmoothingEnabled = false;
            (context as any).msImageSmoothingEnabled = false;
            (context as any).imageSmoothingEnabled = false;
        }

        let usingEffect: boolean = false;
        usingEffect = this.tintAmount > 0;
        
        if (usingEffect) {

            // ready effects context
            Game.effectsContext.clearRect(0, 0, this.imageWidth, this.imageHeight);
            Game.effectsContext.save();
            
            // draw image to effects context
            Game.effectsContext.drawImage(packedImage.atlasImage,
                piLeft, piTop, piRight - piLeft, piBottom - piTop,
                0, 0, piRight - piLeft, piBottom - piTop);

            // apply tint
            if (this.tintAmount > 0) {
                Game.effectsContext.globalCompositeOperation = "source-atop"; // new shape is drawn only where both the new shape and the destination canvas overlap.
                this.colorParser.parseCSSColor(this.tintColor);
                this.colorParser.alpha = this.tintAmount;
                Game.effectsContext.fillStyle = this.colorParser.toString();
                Game.effectsContext.fillRect(0, 0, this.imageWidth, this.imageHeight);
            }

            // restore effects context
            Game.effectsContext.restore(); // also sets globalCompositeOperation back to the default "source-over"

            // draw image from the effects context to the canvas
            context.drawImage(Game.effectsCanvas,
                0, 0, piRight - piLeft, piBottom - piTop,
                piLeft - piPivotX, piTop - piPivotY, piRight - piLeft, piBottom - piTop);

        } else {
            
            // draw image normally, without effects
            context.drawImage(packedImage.atlasImage,
                piLeft, piTop, piRight - piLeft, piBottom - piTop,
                piLeft - piPivotX, piTop - piPivotY, piRight - piLeft, piBottom - piTop);

        }

    }
    
    private image: TexPackManager.PackedImage = null;
    private colorParser: ColorParser = new ColorParser();

}


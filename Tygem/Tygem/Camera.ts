/// <reference path="_ref.ts" />


class Camera {

    /**
     * Initializes the Camera, to be called once by Game.
     */
    static _initialize(context: CanvasRenderingContext2D): void {
        if (Camera._initialized) return;

        Camera._context = context;
        Camera._initialized = true;
    }
    
    /**
     * Gets CanvasRenderingContext2D of the camera.
     */
    static get context(): CanvasRenderingContext2D {
        return Camera._context;
    }
    

    // Position properties

    /**
     * x coordinate of the point the center of the camera points at.
     */
    static centerX: number = 0;
    /**
     * y coordinate of the point the center of the camera points at.
     */
    static centerY: number = 0;
    /**
     * scale of the camera.
     */
    static scale: number = 1;

    /**
     * Gets width of the canvas of the context.
     */
    static get canvasWidth(): number {
        return Camera.context.canvas.width;
    }
    /**
     * Gets height of the canvas of the context.
     */
    static get canvasHeight(): number {
        return Camera.context.canvas.height;
    }

    /**
     * Gets the x coordinate in the world space of the left edge of the screen.
     */
    static get leftBound(): number {
        return Camera.centerX - Camera.canvasWidth / 2 / Camera.scale;
    }

    /**
     * Gets the y coordinate in the world space of the top edge of the screen.
     */
    static get topBound(): number {
        return Camera.centerY - Camera.canvasHeight / 2 / Camera.scale;
    }

    /**
     * Gets the x coordinate in the world space of the right edge of the screen.
     */
    static get rightBound(): number {
        return Camera.centerX + Camera.canvasWidth / 2 / Camera.scale;
    }

    /**
     * Gets the y coordinate in the world space of the bottom edge of the screen.
     */
    static get bottomBound(): number {
        return Camera.centerY + Camera.canvasHeight / 2 / Camera.scale;
    }

    /**
     * Takes a point in the canvas space (e.g. mouse position), and returns its equivalent position in the global space.
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    static canvasToGlobal(x: number, y: number, outPos: Vec2 = null): Vec2 {

        Camera.setMat(Camera.tempMatrix);
        Camera.tempMatrix.invert();
        if (outPos === null) {
            let v: Vec2 = new Vec2(x, y);
            Camera.tempMatrix.transformVec2(v);
            return v;
        } else {
            Camera.tempMatrix.transformVec2(outPos);
            return null;
        }
    }

    /**
     * Takes a point in the global space and returns its equivalent position in the canvas space.
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    static globalToCanvas(x: number, y: number, outPos: Vec2 = null): Vec2 {

        Camera.setMat(Camera.tempMatrix);
        if (outPos === null) {
            let v: Vec2 = new Vec2(x, y);
            Camera.tempMatrix.transformVec2(v);
            return v;
        } else {
            Camera.tempMatrix.transformVec2(outPos);
            return null;
        }
    }


    // Transformation

    /**
     * Gets clone of the transformation matrix used by this camera.
     */
    static get matrix(): Matrix2x3 {
        Camera.setMat(Camera.tempMatrix);
        return Camera.tempMatrix.clone();
    }
    
    /**
     * Sets the transform of camera.context to be the camera's transformation multiplied by the global matrix of the given transform.
     */
    static setContextTransform(transform: Transform): void {
        if (Camera.context == null) return;

        let temp: Matrix2x3 = Camera.tempMatrix;
        Camera.setMat(temp);
        transform.multiplyByGlobalMatrix(temp);


        // might make camera smoother?
        //let invScaleEstimate: number = temp.a;
        //temp.e = Math.floor(temp.e / invScaleEstimate) * invScaleEstimate;
        //temp.f = Math.floor(temp.f / invScaleEstimate) * invScaleEstimate;
        temp.e = Math.floor(temp.e);
        temp.f = Math.floor(temp.f);
        

        Camera.context.setTransform(temp.a, temp.b, temp.c, temp.d, temp.e, temp.f);
    }
    /**
     * Sets the transform of camera.context to be the camera's transformation multiplied by the given matrix.
     */
    static setContextTransformFromMatrix(matrix: Matrix2x3): void {
        if (Camera.context == null) return;

        let temp: Matrix2x3 = Camera.tempMatrix;
        Camera.setMat(temp);
        temp.multiply(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);

        Camera.context.setTransform(temp.a, temp.b, temp.c, temp.d, temp.e, temp.f);
    }


    // Private

    private static _context: CanvasRenderingContext2D = null;
    private static _initialized: boolean = false;

    /**
     * Sets the values of the given matrix to be the transform from this camera.
     */
    private static setMat(matrix: Matrix2x3): void {

        let tx: number = Camera.canvasWidth / 2 - Camera.centerX * Camera.scale;
        let ty: number = Camera.canvasHeight / 2 - Camera.centerY * Camera.scale;

        matrix.setValues(Camera.scale, 0, 0, Camera.scale, tx, ty);
    }

    private static tempMatrix: Matrix2x3 = new Matrix2x3();


}

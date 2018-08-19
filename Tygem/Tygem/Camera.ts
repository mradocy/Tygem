/// <reference path="_ref.ts" />


namespace Camera {

    /**
     * Initializes the Camera, to be called once by Game.
     */
    export function _initialize(ctx: CanvasRenderingContext2D): void {
        if (_initialized) return;

        context = ctx;
        _initialized = true;
    }

    /**
     * The CanvasRenderingContext2D of the camera.  Please do not change.
     */
    export let context: CanvasRenderingContext2D = null;
    
    

    // Position properties

    /**
     * x coordinate of the point the center of the camera points at.
     */
    export let centerX: number = 0;
    /**
     * y coordinate of the point the center of the camera points at.
     */
    export let centerY: number = 0;
    /**
     * scale of the camera.
     */
    export let scale: number = 1;

    /**
     * Sets the center to match the given Vec2.
     */
    export function setCenter(center: Vec2): void {
        centerX = center.x;
        centerY = center.y;
    }

    /**
     * Gets width of the canvas of the context.
     */
    export function getCanvasWidth(): number {
        return context.canvas.width;
    }
    /**
     * Gets height of the canvas of the context.
     */
    export function getCanvasHeight(): number {
        return context.canvas.height;
    }

    /**
     * Gets the x coordinate in the world space of the left edge of the screen.
     */
    export function getLeftBound(): number {
        return centerX - getCanvasWidth() / 2 / scale;
    }
    /**
     * Gets the y coordinate in the world space of the top edge of the screen.
     */
    export function getTopBound(): number {
        return centerY - getCanvasHeight() / 2 / scale;
    }
    /**
     * Gets the x coordinate in the world space of the right edge of the screen.
     */
    export function getRightBound(): number {
        return centerX + getCanvasWidth() / 2 / scale;
    }
    /**
     * Gets the y coordinate in the world space of the bottom edge of the screen.
     */
    export function getBottomBound(): number {
        return centerY + getCanvasHeight() / 2 / scale;
    }

    /**
     * Takes a point in the canvas space (e.g. mouse position), and returns its equivalent position in the global space.
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    export function canvasToGlobal(x: number, y: number, outPos: Vec2 = null): Vec2 {

        setMat(tempMatrix);
        tempMatrix.invert();
        if (outPos === null) {
            let v: Vec2 = new Vec2(x, y);
            tempMatrix.transformVec2(v);
            return v;
        } else {
            tempMatrix.transformVec2(outPos);
            return null;
        }
    }

    /**
     * Takes a point in the global space and returns its equivalent position in the canvas space.
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    export function globalToCanvas(x: number, y: number, outPos: Vec2 = null): Vec2 {

        setMat(tempMatrix);
        if (outPos === null) {
            let v: Vec2 = new Vec2(x, y);
            tempMatrix.transformVec2(v);
            return v;
        } else {
            tempMatrix.transformVec2(outPos);
            return null;
        }
    }


    // Transformation

    /**
     * Gets clone of the transformation matrix used by this camera.
     */
    export function getMatrix(): Matrix2x3 {
        setMat(tempMatrix);
        return tempMatrix.clone();
    }
    
    /**
     * Sets the transform of camera.context to be the camera's transformation multiplied by the global matrix of the given transform.
     */
    export function setContextTransform(transform: Transform): void {
        if (context == null) return;

        let temp: Matrix2x3 = tempMatrix;
        setMat(temp);
        transform.multiplyByGlobalMatrix(temp);


        // might make camera smoother?
        //let invScaleEstimate: number = temp.a;
        //temp.e = Math.floor(temp.e / invScaleEstimate) * invScaleEstimate;
        //temp.f = Math.floor(temp.f / invScaleEstimate) * invScaleEstimate;
        temp.e = Math.floor(temp.e);
        temp.f = Math.floor(temp.f);
        

        context.setTransform(temp.a, temp.b, temp.c, temp.d, temp.e, temp.f);
    }
    /**
     * Sets the transform of camera.context to be the camera's transformation multiplied by the given matrix.
     */
    export function setContextTransformFromMatrix(matrix: Matrix2x3): void {
        if (context == null) return;

        let temp: Matrix2x3 = tempMatrix;
        setMat(temp);
        temp.multiply(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);

        context.setTransform(temp.a, temp.b, temp.c, temp.d, temp.e, temp.f);
    }


    // Private
    
    let _initialized: boolean = false;

    /**
     * Sets the values of the given matrix to be the transform from this camera.
     */
    function setMat(matrix: Matrix2x3): void {

        let tx: number = getCanvasWidth() / 2 - centerX * scale;
        let ty: number = getCanvasHeight() / 2 - centerY * scale;

        matrix.setValues(scale, 0, 0, scale, tx, ty);
    }

    let tempMatrix: Matrix2x3 = new Matrix2x3();


}

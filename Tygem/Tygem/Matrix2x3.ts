/// <reference path="_ref.ts" />

/**
* Matrix used for 2D transformations, e.g. setting the transform of CanvasRenderingContext2D.
*/
class Matrix2x3 {

    constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, e: number = 0, f: number = 0) {
        this.setValues(a, b, c, d, e, f);
    }

    /**
     * The identity matrix.
     */
    static get identity(): Matrix2x3 { return Matrix2x3._identity; }

    /**
     * Sets this to the identity matrix.
     */
    setIdentity = (): void => {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.e = 0;
        this.f = 0;
    }

    /**
     * Sets all values of this matrix at once.
     */
    setValues = (a: number, b: number, c: number, d: number, e: number, f: number): void => {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }

    /**
     * Sets all values of this matrix at once, from the given matrix.
     */
    setValuesFromMatrix = (m: Matrix2x3): void => {
        this.a = m.a;
        this.b = m.b;
        this.c = m.c;
        this.d = m.d;
        this.e = m.e;
        this.f = m.f;
    }

    /**
     * Returns a clone of this matrix.
     */
    clone = (): Matrix2x3 => {
        let ret: Matrix2x3 = new Matrix2x3();
        ret.setValues(this.a, this.b, this.c, this.d, this.e, this.f);
        return ret;
    }
    
    /**
     * Multiplies current matrix by new matrix values.
     */
    multiply = (a2: number, b2: number, c2: number, d2: number, e2: number, f2: number): void => {

        let a1: number = this.a;
        let b1: number = this.b;
        let c1: number = this.c;
        let d1: number = this.d;
        let e1: number = this.e;
        let f1: number = this.f;
        
        this.a = a1 * a2 + c1 * b2;
        this.b = b1 * a2 + d1 * b2;
        this.c = a1 * c2 + c1 * d2;
        this.d = b1 * c2 + d1 * d2;
        this.e = a1 * e2 + c1 * f2 + e1;
        this.f = b1 * e2 + d1 * f2 + f1;
    }

    /**
     * Inverts this matrix in place (doesn't return anything).
     */
    invert = (): void => {

        let a: number = this.a;
        let b: number = this.b;
        let c: number = this.c;
        let d: number = this.d;
        let e: number = this.e;
        let f: number = this.f;

        let dt: number = (a * d - b * c);
        this.a = d / dt;
        this.b = -b / dt;
        this.c = -c / dt;
        this.d = a / dt;
        this.e = (c * f - d * e) / dt;
        this.f = -(a * f - b * e) / dt;
    }

    /**
     * Scales this matrix by the given scale x and scale y.
     */
    scale = (sx: number, sy: number): void => {
        this.multiply(sx, 0, 0, sy, 0, 0);
    }

    /**
     * Rotates this matrix by the given angle, in radians.
     */
    rotate = (angleRadians: number): void => {
        let cos = Math.cos(angleRadians);
        let sin = Math.sin(angleRadians);
        this.multiply(cos, sin, -sin, cos, 0, 0);
    }

    /**
     * Translates this matrix by the given amount.
     */
    translate = (tx: number, ty: number): void => {
        this.multiply(1, 0, 0, 1, tx, ty);
    }

    /**
     * Transforms the given point in place, modifying it.
     */
    transformVec2 = (v: Vec2): void => {
        let vx: number = v.x;
        let vy: number = v.y;
        v.x = vx * this.a + vy * this.c + this.e;
        v.y = vx * this.b + vy * this.d + this.f;
    }

    /**
     * matrix order (used by canvas):
     *   ace
     *   bdf
     *   001
     */

    a: number = 1;
    b: number = 0;
    c: number = 0;
    d: number = 1;
    e: number = 0;
    f: number = 0;

    toString = (): string => {
        return "a: " + this.a + " b: " + this.b + " c: " + this.c + " d: " + this.d + " e: " + this.e + " f: " + this.f;
    }

    private static _identity: Matrix2x3 = new Matrix2x3();

}


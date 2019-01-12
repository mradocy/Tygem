/// <reference path="_ref.ts" />

class Vec2 {

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Sets the values of this Vec2.
     */
    setValues = (x: number, y: number): void => {
        this.x = x;
        this.y = y;
    }

    /**
     * Sets the values of the Vec2 from a Vec2
     */
    setValuesVec2 = (v: Vec2): void => {
        this.x = v.x;
        this.y = v.y;
    }

    equals = (x: number, y: number): boolean => {
        return this.x === x && this.y === y;
    }

    equalsVec2 = (v: Vec2): boolean => {
        return this.x === v.x && this.y === v.y;
    }

    /**
     * Resizes the vector to have a magnitude of 1.
     */
    normalize = (): void => {
        let mag: number = Math.sqrt(this.x * this.x + this.y * this.y);
        if (mag > 0.000001) {
            this.x /= mag;
            this.y /= mag;
        }
    }

    /**
     * Creates a new Vec2 with the same values.
     */
    clone = (): Vec2 => {
        return new Vec2(this.x, this.y);
    }

    toString = (): string => {
        return "(" + this.x + ", " + this.y + ")";
    }



    x: number;

    y: number;

    /**
     * Calculates distance between the two given vectors.
     */
    static distance(v1: Vec2, v2: Vec2): number {
        return Math.sqrt((v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y));
    }

    /**
     * Calculates the dot product of two vectors.
     */
    static dot(v1: Vec2, v2: Vec2): number {
        return v1.x * v2.x + v1.y * v2.y;
    }

}

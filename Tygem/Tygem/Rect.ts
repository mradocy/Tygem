/// <reference path="_ref.ts" />


class Rect {

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    setValues = (x: number, y: number, width: number, height: number) => {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    clone = (): Rect => {
        return new Rect(this.x, this.y, this.width, this.height);
    }

    toString = (): string => {
        return "x: " + this.x + " y: " + this.y + " width: " + this.width + " height: " + this.height;
    }

    /**
     * Returns if this rectangle overlaps the given rectangle.
     */
    overlaps = (rect: Rect): boolean => {

        if (this.x + this.width < rect.x) return false;
        if (rect.x + rect.width < this.x) return false;
        if (this.y + this.height < rect.y) return false;
        if (rect.y + rect.height < this.y) return false;

        return true;
    }

    /**
     * Returns if this rectangle contains the given point.
     */
    containsPoint = (x: number, y: number): boolean => {
        return this.x <= x && x <= this.x + this.width &&
            this.y <= y && y <= this.y + this.height;
    }

    /**
     * x of the left side of the rectangle.
     */
    x: number;
    /**
     * y of the top side of the rectangle.
     */
    y: number;
    width: number;
    height: number;

}


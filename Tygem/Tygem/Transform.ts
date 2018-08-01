/// <reference path="_ref.ts" />


class Transform {

    constructor() { }


    /**
     * Gets this transform's parent, or null if has no parent.
     */
    getParent = (): Transform => {
        return this.parent;
    }
    /**
     * Sets a new parent.  Set to null to remove from previous parent.  Does not change the local transform.
     * @param parent The transform's new parent.  Cannot be undefined.  Cannot be this own transform nor a child of this transform.
     */
    setParent = (parent: Transform): void => {
        if (parent === undefined) {
            console.warn("Cannot set parent transform to undefined.");
            return;
        }
        if (parent === this) {
            console.warn("Cannot set parent transform to itself.");
            return;
        }
        if (parent !== null && parent.isChildOf(this)) {
            console.warn("Cannot set parent transform to a child of itself.");
            return;
        }
        if (this.parent === parent) return;
        // remove child from old parent
        if (this.parent !== null) {
            let index: number = this.parent.children.indexOf(this);
            this.parent.children.splice(index, 1);
        }
        // set new parent
        this.parent = parent;
        // add child to new parent
        if (this.parent !== null) {
            this.parent.children.push(this);
        }
    }

    /**
     * Returns an array of all the children of this transform (shallow copy).
     */
    getChildren = (): Array<Transform> => {
        return this.children.slice();
    }

    /**
     * Gets if this is a child of the given transform (checking upwards through the hierarchy of parents).
     */
    isChildOf = (parent: Transform): boolean => {
        if (parent == null) return false;
        if (this == parent) return false;
        let trans: Transform = this;
        while (trans !== null) {
            if (trans.getParent() === parent) {
                return true;
            }
            trans = trans.getParent();
        }
        return false;
    }

    /**
     * Reference to a GameObject.  Please don't change.
     */
    gameObject: GameObject = null;
    
    /**
     * x position of the transform in the local space.
     */
    x: number = 0;
    /**
     * y position of the transform in the local space.
     */
    y: number = 0;
    /**
     * Rotation of the transform, in degrees, in the local space.
     */
    rotation: number = 0;
    /**
     * scale x of the transform in the local space.
     */
    scaleX: number = 1;
    /**
     * scale y of the transform in the local space.
     */
    scaleY: number = 1;
    
    /**
     * Gets position of this transform in the global space.
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    getGlobalPosition = (outPos: Vec2 = null): Vec2 => {
        this.updateGlobalMatrix();
        
        if (outPos == null) {
            // return position as new Vec2
            this.tempVec2.setValues(0, 0);
            this.globalMatrix.transformVec2(this.tempVec2);
            return this.tempVec2.clone();
        } else {
            // fill outPos with the position
            outPos.setValues(0, 0);
            this.globalMatrix.transformVec2(outPos);
            return null;
        }
    }
    /**
     * Sets position of this transform in the global space.
     */
    setGlobalPosition = (x: number, y: number): void => {
        if (this.parent == null) {
            this.x = x;
            this.y = y;
            return;
        }
        this.parent.updateInverseGlobalMatrix();
        this.tempVec2.setValues(x, y);
        this.parent.inverseGlobalMatrix.transformVec2(this.tempVec2);
        this.x = this.tempVec2.x;
        this.y = this.tempVec2.y;
    }

    /**
     * Gets rotation (degrees) of this transfrom in the global space.
     * Calculated by adding up all the rotations in the parent transforms.  Is this correct?
     */
    getGlobalRotation = (): number => {
        let ret: number = 0;
        let trans: Transform = this;
        while (trans !== null) {
            ret += trans.rotation;
            trans = trans.parent;
        }
        return ret;
    }
    /**
     * Sets rotation (degrees) of this transform in the global space.
     * Calculated by subtracting all the rotations in the parent transforms.  Is this correct?
     */
    setGlobalRotation = (rotationDegrees: number): void => {
        let parentRot: number = 0;
        let trans: Transform = this.parent;
        while (trans !== null) {
            parentRot += trans.rotation;
        }
        this.rotation = rotationDegrees - parentRot;
    }

    /**
     * Takes a point in local space, and returns its equivalent position in the global space.
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    localToGlobal = (x: number, y: number, outPos: Vec2 = null): Vec2 => {
        this.updateGlobalMatrix();
        
        if (outPos === null) {
            let v: Vec2 = new Vec2(x, y);
            this.globalMatrix.transformVec2(v);
            return v;
        } else {
            outPos.setValues(x, y);
            this.globalMatrix.transformVec2(outPos);
            return null;
        }
    }
    
    /**
     * Takes a point in global space, and returns its equivalent position in the local space.
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    globalToLocal = (x: number, y: number, outPos: Vec2 = null): Vec2 => {
        this.updateInverseGlobalMatrix();

        if (outPos === null) {
            let v: Vec2 = new Vec2(x, y);
            this.inverseGlobalMatrix.transformVec2(v);
            return v;
        } else {
            outPos.setValues(x, y);
            this.inverseGlobalMatrix.transformVec2(outPos);
            return null;
        }
    }

    /**
     * Gets a clone of the local transformation matrix.
     */
    getLocalMatrix = (): Matrix2x3 => {
        this.updateLocalMatrix();
        return this.localMatrix.clone();
    }
    /**
     * Gets a clone of the combained transformation matrices to the root.
     */
    getGlobalMatrix = (): Matrix2x3 => {
        this.updateGlobalMatrix();
        return this.globalMatrix.clone();
    }
    /**
     * Gets a clone of the inverse of the combained transformation matrices to the root.
     */
    getInverseGlobalMatrix = (): Matrix2x3 => {
        this.updateInverseGlobalMatrix();
        return this.inverseGlobalMatrix.clone();
    }
    /**
     * Multiplies the given matrix by the global matrix.  The given matrix is modified; this function returns nothing.
     */
    multiplyByGlobalMatrix = (matrix: Matrix2x3): void => {
        this.updateGlobalMatrix();
        matrix.multiply(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.e, this.globalMatrix.f);
    }

    /**
     * Updates localMatrix based on translation, rotation, scale (in that order)
     */
    private updateLocalMatrix = (): void => {
        this.localMatrix.setIdentity();
        this.localMatrix.translate(this.x, this.y);
        this.localMatrix.rotate(this.rotation * 0.017453292519943295);
        this.localMatrix.scale(this.scaleX, this.scaleY);
    }

    /**
     * Updates globalMatrix by consecutively multiplying parent's local matrices (from root parent to here)
     */
    private updateGlobalMatrix = (): void => {

        this.updateLocalMatrix();

        let tm: Matrix2x3 = this.tempMatrix;
        let gm: Matrix2x3 = this.globalMatrix;

        gm.setValuesFromMatrix(this.localMatrix);

        let p: Transform = this.parent;
        while (p !== null) {

            p.updateLocalMatrix();
            let pTM: Matrix2x3 = p.localMatrix;

            tm.setValuesFromMatrix(pTM);
            tm.multiply(gm.a, gm.b, gm.c, gm.d, gm.e, gm.f);
            gm.setValuesFromMatrix(tm);

            p = p.parent;
        }

    }

    /**
     * Updates inverseGlobalMatrix to be the inverse of globalMatrix.
     */
    private updateInverseGlobalMatrix = (): void => {
        this.updateGlobalMatrix();
        let m: Matrix2x3 = this.globalMatrix;
        this.inverseGlobalMatrix.setValues(m.a, m.b, m.c, m.d, m.e, m.f);
        this.inverseGlobalMatrix.invert();
    }


    private localMatrix: Matrix2x3 = new Matrix2x3(); // must be updated with updateLocalMatrix();
    private globalMatrix: Matrix2x3 = new Matrix2x3(); // must be updated with updateGlobalMatrix();
    private inverseGlobalMatrix: Matrix2x3 = new Matrix2x3(); // must be updated with updateInverseGlobalMatrix();
    private tempMatrix: Matrix2x3 = new Matrix2x3(); // used for calculations
    private tempVec2: Vec2 = new Vec2(); // used for calculations

    private parent: Transform = null;
    private children: Array<Transform> = [];

}


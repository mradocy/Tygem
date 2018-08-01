declare class Vec2 {
    constructor(x?: number, y?: number);
    /**
     * Sets the values of this Vec2.
     */
    setValues: (x: number, y: number) => void;
    /**
     * Sets the values of the Vec2 from a Vec2
     */
    setValuesVec2: (v: Vec2) => void;
    equals: (x: number, y: number) => boolean;
    equalsVec2: (v: Vec2) => boolean;
    /**
     * Resizes the vector to have a magnitude of 1.
     */
    normalize: () => void;
    /**
     * Creates a new Vec2 with the same values.
     */
    clone: () => Vec2;
    toString: () => string;
    x: number;
    y: number;
    /**
     * Calculates distance between the two given vectors.
     */
    static distance(v1: Vec2, v2: Vec2): number;
    /**
     * Calculates the dot product of two vectors.
     */
    static dot(v1: Vec2, v2: Vec2): number;
}
declare namespace M {
    /**
     * Multiply a degree value by this to get its equivalent in radians.
     */
    const degToRad: number;
    /**
     * Multiply a radian value by this to get its equivalent in degrees.
     */
    const radToDeg: number;
    /**
     * Epsilon value used for floating point comparisons.
     */
    const EPSILON: number;
    /**
     * Calculates the distance between 2 points.
     * @param v1x x of vector 1
     * @param v1y y of vector 1
     * @param v2x x of vector 2
     * @param v2y y of vector 2
     */
    function distance(v1x: number, v1y: number, v2x: number, v2y: number): number;
    /**
     * Calculates the magnitude of a vector.
     * @param vx x of the vector
     * @param vy y of the vector
     */
    function magnitude(vx: number, vy: number): number;
    /**
     * Calculates the square of the magnitude of a vector.
     * @param vx x of the vector
     * @param vy y of the vector
     */
    function sqrMagnitude(vx: number, vy: number): number;
    /**
     * Calculates the dot product of two vectors.
     * @param ax x of vector a
     * @param ay y of vector a
     * @param bx x of vector b
     * @param by y of vector b
     */
    function dot(ax: number, ay: number, bx: number, by: number): number;
    /**
     * Returns the result of projecting vector a onto vector b.
     * @param ax x of vector a
     * @param ay y of vector a
     * @param bx x of vector b
     * @param by y of vector b
     */
    function vectorProject(ax: number, ay: number, bx: number, by: number): Vec2;
    /**
     * Calculates x mod y for floats.  Always returns a positive value.
     */
    function fmod(x: number, y: number): number;
    /**
     * Literally just the classic atan2 function, but takes a Vec2 as an argument.  Returns angle in radians.
     */
    function atan2(v: Vec2): number;
    /**
     * Wraps a value in [0, 2*PI)
     */
    function wrap2PI(angleRadians: number): number;
    /**
     * Wraps a value in [-PI, PI)
     */
    function wrapPI(angleRadians: number): number;
    /**
     * Wraps a value in [0, 360)
     */
    function wrap360(angleDegrees: number): number;
    /**
     * Wraps a value in [-180, 180)
     */
    function wrap180(angleDegrees: number): number;
    /**
     * Returns the value (in radians) to be added to angleStart to reach angleEnd.  This value is wrappen in [-PI, PI)
     */
    function angleDiffRadians(angleStartRadians: number, angleEndRadians: number): number;
    /**
     * Returns the value (in degrees) to be added to angleStart to reach angleEnd.  This value is wrappen in [-180, 180)
     */
    function angleDiffDegrees(angleStartDegrees: number, angleEndDegrees: number): number;
    /**
     * Given a sector defined by a center angle and spread, return if the given test angle is contained in the sector (all in degrees).
     * @param sectorAngle Angle defining the center of the sector.
     * @param sectorAngleSpread The angular size of the sector.
     * @param testAngle The angle to test if it's contained in the sector.
     */
    function angleInSectorDegrees(sectorAngle: number, sectorAngleSpread: number, testAngle: number): boolean;
    /**
     * Returns a Vec2 that's the rotation of a given vector around a given point.
     * @param vx x of the vector to rotate.
     * @param vy y of the vector to rotate.
     * @param pointX x of the point to rotate around.
     * @param pointY y of the point to rotate around.
     * @param rotationRadians Angle to rotate, in radians.
     */
    function rotateAroundPoint(vx: number, vy: number, pointX: number, pointY: number, rotationRadians: number): Vec2;
    /**
     * Returns the point on the line defined by lineP0 and lineP1 that is closest to the given point.
     * @param lineP0x x of the first point that defines the line.
     * @param lineP0y y of the first point that defines the line.
     * @param lineP1x x of the other point that defines the line.
     * @param lineP1y y of the other point that defines the line.
     * @param pointX x of the point to consider.
     * @param pointY y of the point to consider.
     */
    function pointOnLineClosestToPoint(lineP0x: number, lineP0y: number, lineP1x: number, lineP1y: number, pointX: number, pointY: number): Vec2;
    /**
     * Calculates the intersection points between circle 1 and circle 2.  Returns array of the 2 Vec2 intersections.  If there are no intersections, null is returned.
     * @param c1x x of circle 1
     * @param c1y y of circle 1
     * @param r1 radius of circle 1
     * @param c2x x of circle 2
     * @param c2y y of circle 2
     * @param r2 radius of circle 2
     */
    function circleCircleIntersection(c1x: number, c1y: number, r1: number, c2x: number, c2y: number, r2: number): Array<Vec2>;
    /**
     * Calculates the intersection points between a line (defined by 2 points on the line) and a circle.  Returns array of the 2 Vector2 intersections.  If there are no intersections, the array is null.
     * @param lineP0x x of the first point that defines the line.
     * @param lineP0y y of the first point that defines the line.
     * @param lineP1x x of the second point that defines the line.
     * @param lineP1y y of the second point that defines the line.
     * @param cx x of the center of the circle.
     * @param cy y of the center of the circle.
     * @param r radius of the circle.
     */
    function lineCircleIntersection(lineP0x: number, lineP0y: number, lineP1x: number, lineP1y: number, cx: number, cy: number, r: number): Array<Vec2>;
    /**
     * Given elements in a line, all spaced a specified distance from each other, with the average displacement being 0, what's the position of each element?
     * @param spacing Distance between each element.
     * @param index Index of the given element.
     * @param numElements Total number of elements
     */
    function centeredSpacing(spacing: number, index: number, numElements: number): number;
    /**
     * Returns of vector 2 is position clockwise to vector 1
     * @param v1x x of vector 1
     * @param v1y y of vector 1
     * @param v2x x of vector 2
     * @param v2y y of vector 2
     */
    function isClockwise(v1x: number, v1y: number, v2x: number, v2y: number): boolean;
    /**
     * Returns the angle (in radians) formed from the two given vectors.
     * @param v0x x of the first vector to compare.
     * @param v0y y of the first vector to compare.
     * @param v1x x of the other vector to compare.
     * @param v1y y of the other vector to compare.
     */
    function angleBetweenVectors(v0x: number, v0y: number, v1x: number, v1y: number): number;
    /**
     * Returns the normal (with magnitude of 1) of the given vector.  If looking in the direction of the given vector, the normal will face to the "left".
     * @param vx x of the vector
     * @param vy y of the vector
     */
    function normalVector(vx: number, vy: number): Vec2;
    /**
     * Returns if the two given lines are parallel.
     * @param line0P0x x of the first point that defines the first line.
     * @param line0P0y y of the first point that defines the first line.
     * @param line0P1x x of the other point that defines the first line.
     * @param line0P1y y of the other point that defines the first line.
     * @param line1P0x x of the first point that defines the other line.
     * @param line1P0y y of the first point that defines the other line.
     * @param line1P1x x of the other point that defines the other line.
     * @param line1P1y y of the other point that defines the other line.
     */
    function linesParallel(line0P0x: number, line0P0y: number, line0P1x: number, line0P1y: number, line1P0x: number, line1P0y: number, line1P1x: number, line1P1y: number): boolean;
    /**
     * Returns t, which is "when" two lines intersect.  The point of intersection is line0P0 + (line0P1 - line0P0) * t.
     * Returns Number.POSITIVE_INFINITY if the lines don't intersect (i.e. are parallel).
     * @param line0P0x x of the first point that defines the first line.
     * @param line0P0y y of the first point that defines the first line.
     * @param line0P1x x of the other point that defines the first line.
     * @param line0P1y y of the other point that defines the first line.
     * @param line1P0x x of the first point that defines the other line.
     * @param line1P0y y of the first point that defines the other line.
     * @param line1P1x x of the other point that defines the other line.
     * @param line1P1y y of the other point that defines the other line.
     */
    function lineLineIntersection(line0P0x: number, line0P0y: number, line0P1x: number, line0P1y: number, line1P0x: number, line1P0y: number, line1P1x: number, line1P1y: number): number;
    /**
     * Returns the point where two infinite lines intersect.  Returns null if they don't (i.e. are parallel).
     * @param line0P0x x of the first point that defines the first line.
     * @param line0P0y y of the first point that defines the first line.
     * @param line0P1x x of the other point that defines the first line.
     * @param line0P1y y of the other point that defines the first line.
     * @param line1P0x x of the first point that defines the other line.
     * @param line1P0y y of the first point that defines the other line.
     * @param line1P1x x of the other point that defines the other line.
     * @param line1P1y y of the other point that defines the other line.
     */
    function lineLineIntersectionPoint(line0P0x: number, line0P0y: number, line0P1x: number, line0P1y: number, line1P0x: number, line1P0y: number, line1P1x: number, line1P1y: number): Vec2;
    /**
     * Returns time t > -EPSILON when a ray will intersect a line of infinite length.  Returns -1 if ray won't intersect the line.
     * The point of the intersection is rayOrigin + rayDirection * t.
     * @param rayOriginX x of the origin point of the ray.
     * @param rayOriginY y of the origin point of the ray.
     * @param rayDirectionX x of the direction vector of the ray.  This value should be normalized, but this is not required.
     * @param rayDirectionY y of the direction vector of the ray.  This value should be normalized, but this is not required.
     * @param lineP0x x of the first point that defines the line.
     * @param lineP0y y of the first point that defines the line.
     * @param lineP1x x of the other point that defines the line.
     * @param lineP1y y of the other point that defines the line.
     * @param rayDistance How long the ray is.  The ray is considered to be of infinite length if this value is positive infinity.
     */
    function rayLineIntersection(rayOriginX: number, rayOriginY: number, rayDirectionX: number, rayDirectionY: number, lineP0x: number, lineP0y: number, lineP1x: number, lineP1y: number, rayDistance?: number): number;
    /**
     * Returns time t > -EPSILON when a ray will intersect a segment.  Returns -1 if ray won't intersect the segment.
     * The point of the intersection is rayOrigin + rayDirection * t.
     * @param rayOriginX x of the origin point of the ray.
     * @param rayOriginY y of the origin point of the ray.
     * @param rayDirectionX x of the direction vector of the ray.  This value should be normalized, but this is not required.
     * @param rayDirectionY y of the direction vector of the ray.  This value should be normalized, but this is not required.
     * @param segmentP0x x of the first point that defines the segment.
     * @param segmentP0y y of the first point that defines the segment.
     * @param segmentP1x x of the other point that defines the segment.
     * @param segmentP1y y of the other point that defines the segment.
     * @param rayDistance How long the ray is.  The ray is considered to be of infinite length if this value is positive infinity.
     */
    function raySegmentIntersection(rayOriginX: number, rayOriginY: number, rayDirectionX: number, rayDirectionY: number, segmentP0x: number, segmentP0y: number, segmentP1x: number, segmentP1y: number, rayDistance?: number): number;
    /**
     * Returns time t > -EPSILON when a ray will intersect a vertical segment.  Returns -1 if ray won't intersect the segment.
     * The point of the intersection is rayOrigin + rayDirection * t.
     * @param rayOriginX x of the origin point of the ray.
     * @param rayOriginY y of the origin point of the ray.
     * @param rayDirectionX x of the direction vector of the ray.  This value should be normalized, but this is not required.
     * @param rayDirectionY y of the direction vector of the ray.  This value should be normalized, but this is not required.
     * @param segmentX x of both points of the segment.
     * @param segmentP0y y of the first point that defines the segment.
     * @param segmentP1y y of the other point that defines the segment.
     * @param rayDistance How long the ray is.  The ray is considered to be of infinite length if this value is positive infinity.
     */
    function rayVerticalSegmentIntersection(rayOriginX: number, rayOriginY: number, rayDirectionX: number, rayDirectionY: number, segmentX: number, segmentP0y: number, segmentP1y: number, rayDistance?: number): number;
    /**
     * Returns time t > -EPSILON when a ray will intersect a horizontal segment.  Returns -1 if ray won't intersect the segment.
     * The point of the intersection is rayOrigin + rayDirection * t.
     * @param rayOriginX x of the origin point of the ray.
     * @param rayOriginY y of the origin point of the ray.
     * @param rayDirectionX x of the direction vector of the ray.  This value should be normalized, but this is not required.
     * @param rayDirectionY y of the direction vector of the ray.  This value should be normalized, but this is not required.
     * @param segmentY y of both points of the segment.
     * @param segmentP0x x of the first point that defines the segment.
     * @param segmentP1x x of the other point that defines the segment.
     * @param rayDistance How long the ray is.  The ray is considered to be of infinite length if this value is positive infinity.
     */
    function rayHorizontalSegmentIntersection(rayOriginX: number, rayOriginY: number, rayDirectionX: number, rayDirectionY: number, segmentY: number, segmentP0x: number, segmentP1x: number, rayDistance?: number): number;
    /**
     * Returns t in (-EPSILON, 1] if the two segments intersect, and -1 if they don't.  The point of intersection is segment0P0 + (segment0P1 - segment0P0) * t.
     * @param segment0P0x x of the first point that defines the first segment.
     * @param segment0P0y y of the first point that defines the first segment.
     * @param segment0P1x x of the other point that defines the first segment.
     * @param segment0P1y y of the other point that defines the first segment.
     * @param segment1P0x x of the first point that defines the other segment.
     * @param segment1P0y y of the first point that defines the other segment.
     * @param segment1P1x x of the other point that defines the other segment.
     * @param segment1P1y y of the other point that defines the other segment.
     */
    function segmentSegmentIntersection(segment0P0x: number, segment0P0y: number, segment0P1x: number, segment0P1y: number, segment1P0x: number, segment1P0y: number, segment1P1x: number, segment1P1y: number): number;
    /**
     * Given a line defined by p0 and p1, returns if the point is to the left of the line ("left" when facing p1 from p0).
     * @param lineP0x x of the first point that defines the line
     * @param lineP0y y of the first point that defines the line.
     * @param lineP1x x of the other point that defines the line.
     * @param lineP1y y of the other point that defines the line.
     * @param pointX x of the point to test.
     * @param pointY y of the point to test.
     */
    function pointToLeft(lineP0x: number, lineP0y: number, lineP1x: number, lineP1y: number, pointX: number, pointY: number): boolean;
    /**
     * Given a line and two points, returns if the points are on the same side of the line.
     * @param lineP0x x of the first point that defines the line
     * @param lineP0y y of the first point that defines the line.
     * @param lineP1x x of the other point that defines the line.
     * @param lineP1y y of the other point that defines the line.
     * @param point0x x of the first point to test.
     * @param point0y y of the first point to test.
     * @param point1x x of the other point to test.
     * @param point1y y of the other point to test.
     */
    function pointsOnSameSideOfLine(lineP0x: number, lineP0y: number, lineP1x: number, lineP1y: number, point0x: number, point0y: number, point1x: number, point1y: number): boolean;
    /**
     * Given a line, returns the point on the line with the given x coordinate.  Returns positive infinity if the line is vertical.
     * @param lineP0x x of the first point that defines the line
     * @param lineP0y y of the first point that defines the line.
     * @param lineP1x x of the other point that defines the line.
     * @param lineP1y y of the other point that defines the line.
     * @param x the x coordinate to consider
     */
    function yFromXOnLine(lineP0x: number, lineP0y: number, lineP1x: number, lineP1y: number, x: number): number;
    /**
     * Given a line, returns the point on the line with the given y coordinate.  Returns positive infinity if the line is horizontal.
     * @param lineP0x x of the first point that defines the line
     * @param lineP0y y of the first point that defines the line.
     * @param lineP1x x of the other point that defines the line.
     * @param lineP1y y of the other point that defines the line.
     * @param y the y coordinate to consider
     */
    function xFromYOnLine(lineP0x: number, lineP0y: number, lineP1x: number, lineP1y: number, y: number): number;
}
declare class Rect {
    constructor(x?: number, y?: number, width?: number, height?: number);
    setValues: (x: number, y: number, width: number, height: number) => void;
    clone: () => Rect;
    toString: () => string;
    /**
        * Returns if this rectangle overlaps the given rectangle.
        */
    overlaps: (rect: Rect) => boolean;
    /**
        * Returns if this rectangle contains the given point.
        */
    containsPoint: (x: number, y: number) => boolean;
    x: number;
    y: number;
    width: number;
    height: number;
}
/**
* Matrix used for 2D transformations, e.g. setting the transform of CanvasRenderingContext2D.
*/
declare class Matrix2x3 {
    constructor(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number);
    /**
     * The identity matrix.
     */
    static identity: Matrix2x3;
    /**
     * Sets this to the identity matrix.
     */
    setIdentity: () => void;
    /**
     * Sets all values of this matrix at once.
     */
    setValues: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    /**
     * Sets all values of this matrix at once, from the given matrix.
     */
    setValuesFromMatrix: (m: Matrix2x3) => void;
    /**
     * Returns a clone of this matrix.
     */
    clone: () => Matrix2x3;
    /**
     * Multiplies current matrix by new matrix values.
     */
    multiply: (a2: number, b2: number, c2: number, d2: number, e2: number, f2: number) => void;
    /**
     * Inverts this matrix in place (doesn't return anything).
     */
    invert: () => void;
    /**
     * Scales this matrix by the given scale x and scale y.
     */
    scale: (sx: number, sy: number) => void;
    /**
     * Rotates this matrix by the given angle, in radians.
     */
    rotate: (angleRadians: number) => void;
    /**
     * Translates this matrix by the given amount.
     */
    translate: (tx: number, ty: number) => void;
    /**
     * Transforms the given point in place, modifying it.
     */
    transformVec2: (v: Vec2) => void;
    /**
     * matrix order (used by canvas):
     *   ace
     *   bdf
     *   001
     */
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    toString: () => string;
    private static _identity;
}
declare namespace Material {
    /**
     * Adds the given material object.
     * @param name Name of the material.
     * @param object Generic object containing properties of the material.
     */
    function addMaterial(name: string, object: any): void;
    /**
     * Gets the material object with the given name.  Returns null (and displays an error) if the material doesn't exist.
     * @param name Name given to the material when added with addMaterial().
     */
    function getMaterial(name: string): any;
    /**
     * Gets property of a material.
     * @param materialName Name of the material.
     * @param propertyName Name of the property.
     * @param defaultValue The value that's returned if propertyName is not defined by the material.
     */
    function getProperty(materialName: string, propertyName: string, defaultValue?: any): any;
    /**
     * Gets property of a material as a number.  Does not check if the value is a number first.
     * @param materialName Name of the material.
     * @param propertyName Name of the property.
     * @param defaultValue The value that's returned if propertyName is not defined by the material.
     */
    function getNumber(materialName: string, propertyName: string, defaultValue?: number): number;
}
declare class ColorParser {
    /**
     * red value of color.  Integer from [0, 255].
     */
    r: number;
    /**
     * green value of color.  Integer from [0, 255].
     */
    g: number;
    /**
     * blue value of color.  Integer from [0, 255].
     */
    b: number;
    /**
     * alpha value of color.  Number from [0, 1].
     */
    alpha: number;
    /**
     * Parses a CSS color string.  If the parse is successful, rgb and alpha values are stored here in this ColorParser instance.
     * Examples: "rgb(255, 128, 12)", "rgba(255, 128, 12, 0.5)", "#fff", "#ff0011", "slateblue", "hsla(900, 15%, 90%, 0.5)", "hsl(900, 15%, 90%)"
     * Returns true if parse was successful, false if there was a problem.
     */
    parseCSSColor: (cssStr: string) => boolean;
    /**
     * Returns the color as a css string.
     * rgba() format, or rgb() if alpha is 1.
     */
    toString: () => string;
    private static kCSSColorTable;
    private static clamp_css_byte(i);
    private static clamp_css_float(f);
    private static parse_css_int(str);
    private static parse_css_float(str);
    private static css_hue_to_rgb(m1, m2, h);
}
declare class Transform {
    constructor();
    /**
     * Gets this transform's parent, or null if has no parent.
     */
    getParent: () => Transform;
    /**
     * Sets a new parent.  Set to null to remove from previous parent.  Does not change the local transform.
     * @param parent The transform's new parent.  Cannot be undefined.  Cannot be this own transform nor a child of this transform.
     */
    setParent: (parent: Transform) => void;
    /**
     * Returns an array of all the children of this transform (shallow copy).
     */
    getChildren: () => Transform[];
    /**
     * Gets if this is a child of the given transform (checking upwards through the hierarchy of parents).
     */
    isChildOf: (parent: Transform) => boolean;
    /**
     * Reference to a GameObject.  Please don't change.
     */
    gameObject: GameObject;
    /**
     * x position of the transform in the local space.
     */
    x: number;
    /**
     * y position of the transform in the local space.
     */
    y: number;
    /**
     * Rotation of the transform, in degrees, in the local space.
     */
    rotation: number;
    /**
     * scale x of the transform in the local space.
     */
    scaleX: number;
    /**
     * scale y of the transform in the local space.
     */
    scaleY: number;
    /**
     * Gets position of this transform in the global space.
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    getGlobalPosition: (outPos?: Vec2) => Vec2;
    /**
     * Sets position of this transform in the global space.
     */
    setGlobalPosition: (x: number, y: number) => void;
    /**
     * Gets rotation (degrees) of this transfrom in the global space.
     * Calculated by adding up all the rotations in the parent transforms.  Is this correct?
     */
    getGlobalRotation: () => number;
    /**
     * Sets rotation (degrees) of this transform in the global space.
     * Calculated by subtracting all the rotations in the parent transforms.  Is this correct?
     */
    setGlobalRotation: (rotationDegrees: number) => void;
    /**
     * Takes a point in local space, and returns its equivalent position in the global space.
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    localToGlobal: (x: number, y: number, outPos?: Vec2) => Vec2;
    /**
     * Takes a point in global space, and returns its equivalent position in the local space.
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    globalToLocal: (x: number, y: number, outPos?: Vec2) => Vec2;
    /**
     * Gets a clone of the local transformation matrix.
     */
    getLocalMatrix: () => Matrix2x3;
    /**
     * Gets a clone of the combained transformation matrices to the root.
     */
    getGlobalMatrix: () => Matrix2x3;
    /**
     * Gets a clone of the inverse of the combained transformation matrices to the root.
     */
    getInverseGlobalMatrix: () => Matrix2x3;
    /**
     * Multiplies the given matrix by the global matrix.  The given matrix is modified; this function returns nothing.
     */
    multiplyByGlobalMatrix: (matrix: Matrix2x3) => void;
    /**
     * Updates localMatrix based on translation, rotation, scale (in that order)
     */
    private updateLocalMatrix;
    /**
     * Updates globalMatrix by consecutively multiplying parent's local matrices (from root parent to here)
     */
    private updateGlobalMatrix;
    /**
     * Updates inverseGlobalMatrix to be the inverse of globalMatrix.
     */
    private updateInverseGlobalMatrix;
    private localMatrix;
    private globalMatrix;
    private inverseGlobalMatrix;
    private tempMatrix;
    private tempVec2;
    private parent;
    private children;
}
declare class SaveBox {
    /**
        * Gets a list of indexes of save files currently stored in localStorage.
        */
    static getSaveFileIndices(): Array<number>;
    /**
        * Creates a new SaveBox with a fileIndex that doesn't match any other save file.  The created SaveBox is NOT saved to a file.
        */
    static createNewSaveBox(): SaveBox;
    /**
        * Creates a SaveBox loaded from localStorage with the given file index.  Returns null if there was a problem (e.g. if there's no file with the given index)
        */
    static openSaveBox(fileIndex: number): SaveBox;
    /**
        * Deletes the saveBox file with the given fileIndex from local storage.
        */
    static deleteSaveBox(fileIndex: number): void;
    /**
        * Gets the key used when saving a SaveBox with the given fileIndex to localStorage.
        */
    static getLocalStorageKey(fileIndex: number): string;
    /**
        * Index used to differentiate multiple save files.
        */
    fileIndex: number;
    /**
        * Sets a boolean value.
        */
    setBool: (key: string, value: boolean) => void;
    /**
        * Gets a boolean value.
        * @param defaultValue If the given key doesn't exist, this value will be returned instead.
        */
    getBool: (key: string, defaultValue?: boolean) => boolean;
    /**
        * Sets a number value.
        */
    setNumber: (key: string, value: number) => void;
    /**
        * Gets a number value.
        * @param defaultValue If the given key doesn't exist, this value will be returned instead.
        */
    getNumber: (key: string, defaultValue?: number) => number;
    /**
        * Sets a string value.
        */
    setString: (key: string, value: string) => void;
    /**
        * Converts the given object to a JSON string, then saves it as a string.
        */
    setStringObject: (key: string, value: any) => void;
    /**
        * Gets a string value.
        * @param defaultValue If the given key doesn't exist, this value will be returned instead.
        */
    getString: (key: string, defaultValue?: string) => string;
    /**
        * Gets a string value, parses it into a JSON object and returns it.
        * @param defaultValue If the given key doesn't exist, this value will be returned instead.
        */
    getStringObject: (key: string, defaultValue?: any) => any;
    /**
        * Returns the value stored at the given index for the given bool list.  If the index is invalid, defaultValue is returned.
        */
    getBoolListElement: (key: string, index: number, defaultValue?: boolean) => boolean;
    /**
        * Returns a copy of the stored bool list.
        */
    getBoolListElements: (key: string, defaultValue?: boolean[]) => boolean[];
    /**
        * Returns count of the given bool list, or 0 if list does not exist.
        */
    getBoolListCount: (key: string) => number;
    /**
        * Sets all elements of the bool list (clearing the elements that were there originally).
        */
    setBoolListElements: (key: string, values: boolean[]) => void;
    /**
        * Pushes the given element to the end of the specified bool list.  Automatically creates the list if it's not made already.
        */
    addBoolListElement: (key: string, value: boolean) => void;
    /**
        * Returns the value stored at the given index for the given number list.  If the index is invalid, defaultValue is returned.
        */
    getNumberListElement: (key: string, index: number, defaultValue?: number) => number;
    /**
        * Returns a copy of the stored number list.
        */
    getNumberListElements: (key: string, defaultValue?: number[]) => number[];
    /**
        * Returns count of the given number list, or 0 if list does not exist.
        */
    getNumberListCount: (key: string) => number;
    /**
        *  Returns if the given value is contained in the given number list.
        */
    getNumberListContains: (key: string, value: number) => boolean;
    /**
        * Sets all elements of the number list (clearing the elements that were there originally).
        */
    setNumberListElements: (key: string, values: number[]) => void;
    /**
        * Pushes the given element to the end of the specified number list.  Automatically creates the list if it's not made already.
        * @param ignoreIfDuplicate When set to true, first checks to see if the number is already in the list.  If it is, the number is not added again.
        */
    addNumberListElement: (key: string, value: number, ignoreIfDuplicate?: boolean) => void;
    /**
        * Gets when this SaveBox was last saved (to a string or to localStorage).
        */
    getDateSaved: () => Date;
    /**
        * Clears everything.
        */
    clearAll: () => void;
    /**
        * Returns this saveBox converted to a string.
        */
    saveToString: () => string;
    /**
        * Loads data from the given string.  Returns false if there was a problem.
        */
    loadFromString: (str: string) => boolean;
    /**
        * Converts this saveBox to a string, then sets it to getLocalStorageKey() in localStorage.  Returns false if there was a problem.
        */
    saveToLocalStorage: () => boolean;
    /**
        * Loads a string of key getLocalStorageKey() from localStorage, then parses it into this saveBox.  Returns false if there was a problem.
        */
    loadFromLocalStorage: () => boolean;
    /**
        * Creates a copy of this saveBox and returns it.  This does NOT save the clone to a file.
        */
    clone: (newFileIndex: number) => SaveBox;
    private static saveboxPrefix;
    private static newLine;
    private static separator1;
    private static separator2;
    /**
        * Sums up characters of the given "string builder"
        */
    private static getChecksumFromArrStr(sb);
    private static getChecksumFromStr(str);
    /**
        * Returns the given string with all invalid characters replaced with %x, making it valid.  If the string contains no invalid characters, nothing is changed.
        */
    private static sourceToValid(str);
    /**
        * Returns the given string with all %x sequences replaced with their invalid characters.
        */
    private static validToSource(str);
    /**
        * str.replace(), but works correctly.
        */
    private static replaceAll(str, searchValue, replaceValue);
    private dateSaved;
    private bools;
    private numbers;
    private strings;
    private boolLists;
    private numberLists;
}
declare class Keys {
    /**
     * Initializes Keys.  To be called at the start of Game.
     * @param document The webpage document, which event listeners will be added to.
     */
    static _initialize(document: Document): void;
    /**
     * Gets if the key was pressed this frame.
     */
    static keyPressed(key: Key): boolean;
    /**
     * Gets if the key with the given key code was pressed this frame.
     */
    static keyCodePressed(keyCode: number): boolean;
    /**
     * Gets if the key is being held.
     */
    static keyHeld(key: Key): boolean;
    /**
     * Gets if the key with the given key code is being held.
     */
    static keyCodeHeld(keyCode: number): boolean;
    /**
     * Gets if the key was released this frame.
     */
    static keyReleased(key: Key): boolean;
    /**
     * Gets if the key with the given key code was released this frame.
     */
    static keyCodeReleased(keyCode: number): boolean;
    /**
     * Gets a string representation of the given Key.
     */
    static keyToString(key: Key): string;
    /**
     * Gets the key codes of all the keys that were pressed this frame.
     */
    static getKeyCodesPressed(): Array<number>;
    /**
     * To be called late in the game loop by Game.
     */
    static _lateUpdate(): void;
    private static keyDown(event);
    private static keyUp(event);
    private static initialized;
    private static keysPressed;
    private static keysHeld;
    private static keysReleased;
}
declare enum Key {
    Backspace = 8,
    Tab = 9,
    Enter = 13,
    Shift = 16,
    Ctrl = 17,
    Alt = 18,
    PauseBreak = 19,
    CapsLock = 20,
    Escape = 27,
    Space = 32,
    PageUp = 33,
    PageDown = 34,
    End = 35,
    Home = 36,
    LeftArrow = 37,
    UpArrow = 38,
    RightArrow = 39,
    DownArrow = 40,
    Insert = 45,
    Delete = 46,
    Num0 = 48,
    Num1 = 49,
    Num2 = 50,
    Num3 = 51,
    Num4 = 52,
    Num5 = 53,
    Num6 = 54,
    Num7 = 55,
    Num8 = 56,
    Num9 = 57,
    A = 65,
    B = 66,
    C = 67,
    D = 68,
    E = 69,
    F = 70,
    G = 71,
    H = 72,
    I = 73,
    J = 74,
    K = 75,
    L = 76,
    M = 77,
    N = 78,
    O = 79,
    P = 80,
    Q = 81,
    R = 82,
    S = 83,
    T = 84,
    U = 85,
    V = 86,
    W = 87,
    X = 88,
    Y = 89,
    Z = 90,
    LeftWindowKey = 91,
    RightWindowKey = 92,
    SelectKey = 93,
    Numpad0 = 96,
    Numpad1 = 97,
    Numpad2 = 98,
    Numpad3 = 99,
    Numpad4 = 100,
    Numpad5 = 101,
    Numpad6 = 102,
    Numpad7 = 103,
    Numpad8 = 104,
    Numpad9 = 105,
    Multiply = 106,
    Add = 107,
    Subtract = 109,
    DecimalPoint = 110,
    Divide = 111,
    F1 = 112,
    F2 = 113,
    F3 = 114,
    F4 = 115,
    F5 = 116,
    F6 = 117,
    F7 = 118,
    F8 = 119,
    F9 = 120,
    F10 = 121,
    F11 = 122,
    F12 = 123,
    NumLock = 144,
    ScrollLock = 145,
    SemiColon = 186,
    Equals = 187,
    Comma = 188,
    Dash = 189,
    Period = 190,
    ForwardSlash = 191,
    Tilde = 192,
    OpenBracket = 219,
    ClosedBracket = 221,
    Quote = 222,
}
declare class Mouse {
    /**
     * Initializes Mouse.  To be called at the start of Game.
     * @param document The webpage document, which event listeners will be added to.
     */
    static _initialize(canvas: HTMLCanvasElement): void;
    /**
     * The x position of the mouse in the canvas space.
     */
    static x: number;
    /**
     * The y position of the mouse in the canvas space.
     */
    static y: number;
    /**
     * Gets if the given button was pressed this frame.
     */
    static buttonPressed(button: number): boolean;
    /**
     * Gets if the given button was held this frame.
     */
    static buttonHeld(button: number): boolean;
    /**
     * Gets if the given button was released this frame.
     */
    static buttonReleased(button: number): boolean;
    static hideCursor(): void;
    static showCursor(): void;
    /**
     * To be called late in the game loop by Game.
     */
    static _lateUpdate(): void;
    private static mouseDown(event);
    private static mouseUp(event);
    private static mouseMove(event);
    private static preventContextMenu(event);
    private static updateMousePosition(event);
    private static _mouseX;
    private static _mouseY;
    private static buttonsPressed;
    private static buttonsHeld;
    private static buttonsReleased;
    private static initialized;
    private static canvas;
}
/**
* Note that a button must be pressed on the gamepad before it will be recognized.  Pressing the button will send the "gamepadconnected" event.
*/
declare class Gamepads {
    /**
        * If the abs of an axis value is less than this, it is rounded down to 0.
        */
    static AXIS_DEAD_ZONE: number;
    /**
        * An axis will be considered "held" if the abs of its value is more than this.
        */
    static AXIS_PRESS_THRESHOLD: number;
    /**
        * Initializes Gamepad.  To be called at the start of Game.
        * @param window The webpage window, which event listeners will be added to.
        */
    static _initialize(window: Window): void;
    /**
        * Gets if a gamepad is currently connected.
        */
    static isGamepadConnected(): boolean;
    /**
        * Gets if the given button was pressed this frame.
        * @param index Index of the button to check.
        */
    static buttonPressed(index: number): boolean;
    /**
        * Gets if the given button is currently being held.
        * @param index Index of the button to check.
        */
    static buttonHeld(index: number): boolean;
    /**
        * Gets if the given button was released this frame.
        * @param index Index of the button to check.
        */
    static buttonReleased(index: number): boolean;
    /**
        * Gets array of the indexes of the buttons that were pressed this frame.
        */
    static getButtonsPressed(): Array<number>;
    /**
        * Gets value [-1, 1] from a gamepad axis.  Returns 0 if the index is out of bounds.
        * @param index Index of the axis to check.
        */
    static axisValue(index: number): number;
    /**
        * Gets if gamepad axis is currently being held in the positive direction.
        * @param index Index of the axis to check.
        */
    static axisPositiveHeld(index: number): boolean;
    /**
        * Gets if gamepad axis is currently being held in the negative direction.
        * @param index Index of the axis to check.
        */
    static axisNegativeHeld(index: number): boolean;
    /**
        * Gets if gamepad axis was pressed in the positive direction.
        * @param index Index of the axis to check.
        */
    static axisPositivePressed(index: number): boolean;
    /**
        * Gets if gamepad axis was pressed in the negative direction.
        * @param index Index of the axis to check.
        */
    static axisNegativePressed(index: number): boolean;
    /**
        * Gets if gamepad axis was released from the positive direction.
        * @param index Index of the axis to check.
        */
    static axisPositiveReleased(index: number): boolean;
    /**
        * Gets if gamepad axis was released from the negative direction.
        * @param index Index of the axis to check.
        */
    static axisNegativeReleased(index: number): boolean;
    /**
        * Gets array of axes that were positively pressed this frame
        */
    static getAxesPositivePressed(): Array<number>;
    /**
        * Gets array of axes that were negatively pressed this frame
        */
    static getAxesNegativePressed(): Array<number>;
    /**
        * To be called by Game in the gameloop.
        */
    static _earlyUpdate(): void;
    private static gamepadConnected(e);
    private static gamepadDisconnected(e);
    private static getGamepad();
    private static axisPreviousValue(index);
    private static copyValues(arrFrom, arrTo);
    private static initialized;
    private static buttonsPressed;
    private static buttonsHeld;
    private static buttonsPreviouslyHeld;
    private static buttonsReleased;
    private static axisValues;
    private static axisPreviousValues;
}
declare class JSONLoadObject {
    constructor();
    /**
     * Loads json from the given url.
     */
    loadFromUrl: (url: string, onLoad?: (json: any) => void) => void;
    /**
        * Loads (parses) json from the given string.
        */
    loadFromString: (jsonString: string) => void;
    /**
        * Gets the JSON, or null if it hasn't loaded.
        */
    getJSON: () => any;
    /**
        * Gets if the JSON is loaded.
        */
    isLoaded: () => boolean;
    private _json;
    private _url;
    private _onLoadF;
    private _loaded;
    private request;
    private requestOnLoad;
}
declare class JSONManager {
    /**
     * Loads a JSON from the given local url.
     * @param name Key of the json to use when getting it later.
     * @param localPath local url of the JSON.
     * @param onLoad function to call once the JSON has been loaded correctly.
     */
    static addFromUrl(name: string, localPath: string, onLoad?: ((json: any) => void)): void;
    /**
     * Loads (parses) a JSON from the given string.
     */
    static addFromString(name: string, jsonString: string): void;
    /**
        * Gets if the JSON by the given name has been loaded.
        */
    static getJsonLoaded(name: string): boolean;
    /**
        * Gets the JSON with the given name.  Returns null if it doesn't exist or hasn't been loaded.
        * @param name
        */
    static getJson(name: string): any;
    /**
     * Returns if there exists in the dictionary a JSON with the given name.
     */
    static jsonExists(name: string): boolean;
    /**
        * Gets the number of JSON loaded.
        */
    static numJsonLoaded: number;
    /**
        * Gets the number of JSON.
        */
    static numJson: number;
    private static dictionary;
    static _numJsonLoaded: number;
    private static _numJson;
}
declare namespace AudioManager {
    /**
     * Loads audio sprites from the json of the given url.  This can only be called once (the json should point to all the audio sprites).
     * @param jsonUrl url pointing to the json mapping the audiosprites.
     */
    function addAudioSprites(jsonUrl: string): void;
    /**
     * Play a sound in the SFX sound channel.
     * @param soundFileName The path of the sound before it was packed into the audio sprite.  The .wav extension is optional.
     * @param volume Volume of the sound.  Default is 1.
     * @param pitch Pitch of the sound (playback rate).  Default is 1.
     * @param bypassGeneral Bypass the general SFX channel (affected by general sfx volume) and instead have the sound feed directly into the master SFX channel.  Default is false.
     */
    function playSFX(soundFileName: string, volume?: number, pitch?: number, bypassGeneral?: boolean): void;
    /**
     * Play sound in the music channel.  Does not stop music currently playing.
     * @param soundFileName The path of the sound before it was packed into the audio sprite.  The .wav extension is optional.
     * @param volume Volume of the sound.  Default is 1.
     * @param pitch Pitch of the sound (playback rate).  Default is 1.
     * @param loop If the sound should be looped.  Default is true.
     * @param loopOffset If looping, this is how long in seconds after the start of the sound it loops back to.  Default is 0.
     * @param bypassGeneral Bypass the general music channel (affected by general music volume) and instead have the sound feed directly into the master music channel.  Default is false.
     */
    function playMusic(soundFileName: string, volume?: number, pitch?: number, loop?: boolean, loopOffset?: number, bypassGeneral?: boolean): void;
    /**
     * Searches all AudioSpriteSourceNodes to see if there's a node that's playing the given sound.
     * NOTE: Annoyingly calling start() on a node doesn't leave a record of the node playing.  To get around this, never call start(), and instead call play().  The playSFX() and playMusic() functions do this automatically.
     */
    function isSoundPlaying(soundFileName: string): boolean;
    /**
     * Stops all AudioSpriteSourceNodes that are playing the given sound.
     */
    function stopSound(soundFileName: string): void;
    /**
     * Stops all created AudioSpriteSourceNodes.
     */
    function stopAllSounds(): void;
    /**
     * Gets the volume of the gain node that all sound effects pass through.  This is a setting that'd be in an options menu.
     */
    function getMasterSFXVolume(): number;
    /**
     * Sets the volume of the gain node that all sound effects pass through.  This is a setting that'd be in an options menu.
     */
    function setMasterSFXVolume(volume: number): void;
    /**
     * Gets the volume of the gain node that general sound effects pass through.  This would be set in-game as part of gameplay.
     */
    function getGeneralSFXVolume(): number;
    /**
     * Sets the volume of the gain node that general sound effects pass through.  This would be set in-game as part of gameplay.
     */
    function setGeneralSFXVolume(volume: number): void;
    /**
     * Gets the volume of the gain node that general music passes through.  This would be set in-game as part of gameplay (e.g. fading in/out).
     */
    function getGeneralMusicVolume(): number;
    /**
     * Sets the volume of the gain node that general music passes through.  This would be set in-game as part of gameplay (e.g. fading in/out).
     */
    function setGeneralMusicVolume(volume: number): void;
    /**
     * Gets the volume of the gain node that all music passes through.  This is a setting that'd be in an options menu.
     */
    function getMasterMusicVolume(): number;
    /**
     * Sets the volume of the gain node that all music passes through.  This is a setting that'd be in an options menu.
     */
    function setMasterMusicVolume(volume: number): void;
    /**
     * Gets the duration of the given sound.
     * @param fileName The path of the sound before it was packed into the audio sprite.  The .wav extension is optional.
     */
    function getSoundDuration(fileName: string): number;
    /**
     * Extension of AudioBufferSourceNode with a few extra properties.
     */
    class AudioSpriteSourceNode extends AudioBufferSourceNode {
        /**
         * The path of the sound before it was packed into the audio sprite.
         */
        fileName: string;
        /**
         * Time of the AudioSprite buffer to start playing.
         */
        startTime: number;
        /**
         * How much of the AudioSprite buffer to play, in seconds.
         */
        duration: number;
        /**
         * Simpler version of start() that automatically uses the correct variables.
         */
        play: () => void;
        /**
         * Flag if play() was called.
         */
        _playCalled: boolean;
    }
    /**
     * Creates an AudioBufferSourceNode for the given sound.  The node is not connected to anything.
     * Source nodes can only be played once and are "very inexpensive to create".
     * Automatically sets loopStart and loopEnd to the bounds of the sound within the audio sprite (but does not set loop).
     * Call sourceNode.play() to play the sound at the correct position.
     * IMPORTANT: Do not call sourceNode.start() manually.
     * Returns null if the sound doesn't exist.
     * @param soundFileName The path of the sound before it was packed into the audio sprite.  The .wav extension is optional.
     */
    function createSourceNode(soundFileName: string): AudioSpriteSourceNode;
    /**
     * Connects the given AudioNode to the general SFX node.  This lets the node be played, and volume multiplied by the general and master SFX volumes.
     */
    function connectToGeneralSFXNode(audioNode: AudioNode): void;
    /**
     * Connects the given AudioNode to the master SFX node.  This lets the node be played, and volume multiplied by the master SFX volume.
     */
    function connectToMasterSFXNode(audioNode: AudioNode): void;
    /**
     * Connects the given AudioNode to the general Mmusic node.  This lets the node be played, and volume multiplied by the general and master music volumes.
     */
    function connectToGeneralMusicNode(audioNode: AudioNode): void;
    /**
     * Connects the given AudioNode to the master music node.  This lets the node be played, and volume multiplied by the master music volume.
     */
    function connectToMusicNode(audioNode: AudioNode): void;
    /**
     * Gets number of audio sprites added.
     */
    function getNumAudioSprites(): number;
    /**
     * Gets number of audio sprites currently ready to be played.
     */
    function getNumAudioSpritesReady(): number;
    /**
     * To be called on user input to resume the AudioContext.
     * @param onAudioContextRunCallback Function to be called once the AudioContext resumes, or called immediately if it's already running.
     */
    function userInput(onAudioContextRunCallback: () => void): void;
    /**
     * Gets if the audio context is running, which is needed to play sounds.
     * The audio context can only run if userInput() is called from an event function that was triggered by user input.
     */
    function isAudioContextRunning(): boolean;
    /**
     * Directory containing the audio sprites and json file.
     * Capitalization matters when getting images in the web browser.
     */
    const audioSpritesDirectory: string;
    /**
     * Gets the AudioContext used to decode sound.
     */
    function getAudioContext(): AudioContext;
    /**
     * Gets if the browser can play .ogg files.
     */
    function canPlayOgg(): boolean;
}
declare namespace TexPackManager {
    /**
     * An image that has been packed with the texture packer.
     */
    class PackedImage {
        /**
         * The original filename of the image.
         */
        filename: string;
        /**
         * The texture atlas image to draw from.
         */
        atlasImage: HTMLImageElement;
        /**
         * Returns true if the atlas image has been loaded (and can be drawn from).
         */
        isLoaded: () => boolean;
        /**
         * x of the rectangle of the texture atlas that contains the image.
         */
        frameX: number;
        /**
         * y of the rectangle of the texture atlas that contains the image.
         */
        frameY: number;
        /**
         * width of the rectangle of the texture atlas that contains the image.
         */
        frameWidth: number;
        /**
         * height of the rectangle of the texture atlas that contains the image.
         */
        frameHeight: number;
        /**
         * Reference to the JSON defining the frame from the texture packer.
         */
        frameJSON: any;
        /**
         * How much was trimmed off the left side when the image was packed.
         */
        trimLeft: number;
        /**
         * How much was trimmed off the top side when the image was packed.
         */
        trimTop: number;
        /**
         * How much was trimmed off the right side when the image was packed.
         */
        trimRight: number;
        /**
         * How much was trimmed off the bottom side when the image was packed.
         */
        trimBottom: number;
        /**
         * Gets the width of the original image before it was packed and trimmed.
         */
        getOriginalWidth: () => number;
        /**
         * Gets the height of the original image before it was packed and trimmed.
         */
        getOriginalHeight: () => number;
        _textureAtlas: TextureAtlas;
    }
    /**
     * Loads a texture pack from the given url.
     * @param packJsonUrl url pointing to the texture pack.
     */
    function addTexturePack(packJsonUrl: string): void;
    /**
     * Gets an image that has been packed into a texture packer.
     * @param filename The path of the image before it was packed.
     */
    function getPackedImage(filename: string): PackedImage;
    /**
     * Directory containing the texpack texture images and json files.
     * Capitalization matters when getting images in the web browser.
     */
    const texpacksDirectory: string;
    /**
     * Gets the number of texture packs added.
     */
    function getNumTexPacks(): number;
    /**
     * Gets the number of texture packs loaded.
     */
    function getNumTexPacksLoaded(): number;
    /**
     * Writes all packed image filenames to the console.
     */
    function consoleLogAllPackedImages(): void;
    class TextureAtlas {
        /**
        * Handles loading of sprites packed into a single texture atlas image.  DO NOT CALL THIS DIRECTLY, use addTexture() instead.
        * @param imageSource Source url (src) for the texture atlas being loaded.
        */
        constructor(imageSource: string);
        /**
         * Gets the image.
         */
        getImage: () => HTMLImageElement;
        isLoaded: () => boolean;
        private imageOnLoad;
        private _image;
        private _loaded;
    }
}
declare class SpriteFrame {
    imageFilename: string;
    getImage: () => TexPackManager.PackedImage;
    x: number;
    y: number;
    width: number;
    height: number;
    pivotX: number;
    pivotY: number;
    private _image;
}
/**
 * Spritesheets for an image.  Is merely a collection of SpriteFrames from this image.
 * spriteFrames can be customized to have different positions, sizes, and pivots.
 * An image can only have at most 1 spritesheet.
 */
declare class Spritesheet {
    /**
     * Creates a spritesheet, and automatically creates frames for it based on given parameters.
     * The created spritesheet is returned, and its frames can be further customized.
     * @param imageFilename Filename of the image the spritesheet belongs to.  Only one spritesheet can be made per image.
     * @param frameWidth Width of the frames in pixels.
     * @param frameHeight Height of the frames in pixels.
     * @param numColumns Number of columns.
     * @param numFrames Total number of frames to create.
     */
    static addSpritesheet(imageFilename: string, frameWidth: number, frameHeight: number, numColumns: number, numFrames: number): Spritesheet;
    /**
     * Creates a basic spritesheet.  Its frames will need to be created manually.
     * @param imageFilename filename of the image for this spritesheet.  Only one spritesheet can be made per image.
     */
    static addSpritesheetCustom(imageFilename: string): Spritesheet;
    imageFilename: string;
    frames: Array<SpriteFrame>;
    /**
     * Creates and returns a new SpriteFrame belonging to this spritesheet, and pushes it into frames.
     */
    addFrame: () => SpriteFrame;
    /**
     * Gets the spritesheet created for the given image, or null if it hasn't been created.
     * @param imageFilename Filename of the original image.
     */
    static getSpritesheet(imageFilename: string): Spritesheet;
    /**
     * Gets a frame of a spritesheet for the given image, or null if it hasn't been created.
     * @param imageFilename Filename of the original image.
     * @param frameIndex frame of the spritesheet.
     */
    static getSpriteFrame(imageFilename: string, frameIndex: number): SpriteFrame;
    private static spritesheetDic;
}
/**
 * A list of frames taken from spriteSheets.
 */
declare class Animation {
    name: string;
    frames: Array<SpriteFrame>;
    fps: number;
    loops: boolean;
    /**
     * Returns the time (unscaled, in seconds) it would take for the animation to play.
     */
    getDuration: () => number;
    /**
     * Creates an Animation, automatically filling in frames based on the given properties.
     * @param name Name of the animation.
     * @param spritesheetFilename Filename of the spritesheet to take frames from (spritesheet should already be created)
     * @param frames Array of ints of the frames of the spritesheet to use.  An index of -1 means null.
     * @param fps Frame rate of the animation.
     * @param loops Whether or not the animation loops.
     */
    static addAnimation(name: string, spritesheetFilename: string, frames: Array<number>, fps?: number, loops?: boolean): Animation;
    /**
     * Creates and returns a basic Animation with the given name.  frames and other properties will need to be set manually.
     * @param name Name of the animation.  No two animations can have the same name.
     */
    static addAnimationCustom(name: string): Animation;
    /**
     * Gets the animation with the given name, or null if it doesn't exist.
     */
    static getAnimation(name: string): Animation;
    private static animationsDic;
}
declare class Camera {
    /**
     * Initializes the Camera, to be called once by Game.
     */
    static _initialize(context: CanvasRenderingContext2D): void;
    /**
     * Gets CanvasRenderingContext2D of the camera.
     */
    static context: CanvasRenderingContext2D;
    /**
     * x coordinate of the point the center of the camera points at.
     */
    static centerX: number;
    /**
     * y coordinate of the point the center of the camera points at.
     */
    static centerY: number;
    /**
     * scale of the camera.
     */
    static scale: number;
    /**
     * Gets width of the canvas of the context.
     */
    static canvasWidth: number;
    /**
     * Gets height of the canvas of the context.
     */
    static canvasHeight: number;
    /**
     * Gets the x coordinate in the world space of the left edge of the screen.
     */
    static leftBound: number;
    /**
     * Gets the y coordinate in the world space of the top edge of the screen.
     */
    static topBound: number;
    /**
     * Gets the x coordinate in the world space of the right edge of the screen.
     */
    static rightBound: number;
    /**
     * Gets the y coordinate in the world space of the bottom edge of the screen.
     */
    static bottomBound: number;
    /**
     * Takes a point in the canvas space (e.g. mouse position), and returns its equivalent position in the global space.
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    static canvasToGlobal(x: number, y: number, outPos?: Vec2): Vec2;
    /**
     * Takes a point in the global space and returns its equivalent position in the canvas space.
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    static globalToCanvas(x: number, y: number, outPos?: Vec2): Vec2;
    /**
     * Gets clone of the transformation matrix used by this camera.
     */
    static matrix: Matrix2x3;
    /**
     * Sets the transform of camera.context to be the camera's transformation multiplied by the global matrix of the given transform.
     */
    static setContextTransform(transform: Transform): void;
    /**
     * Sets the transform of camera.context to be the camera's transformation multiplied by the given matrix.
     */
    static setContextTransformFromMatrix(matrix: Matrix2x3): void;
    private static _context;
    private static _initialized;
    /**
     * Sets the values of the given matrix to be the transform from this camera.
     */
    private static setMat(matrix);
    private static tempMatrix;
}
declare class Scene {
    /**
     * Adds a scene to the list of scenes.  Intended to be done before Game is created.
     * @param sceneName Name of the Scene.
     * @param scene The just created Scene.
     */
    static addScene(sceneName: string, scene: Scene): void;
    /**
     * Gets the name of the current scene, i.e. the scene last loaded.  Is "" when no scene is currently loaded.
     */
    static currentScene: string;
    /**
     * Get a list of all the scenes currently loaded.  The last element in the list is the current scene.
     */
    static getLoadedScenes(): Array<string>;
    /**
     * Unloads all scenes currently loaded, then loads the given scene.  Scene is loaded at the beginning of next frame.
     * @param scene The scene to load.
     */
    static loadScene(sceneName: string): void;
    /**
     * Loads a scene without unloading any first.  Scene is loaded at the beginning of next frame.  If Scene is already loaded at that time, it will not be loaded again.
     * @param scene The scene to load.
     */
    static loadAdditionalScene(sceneName: string): void;
    /**
     * Unloads the given scene.  Does nothing if the given scene is not currently loaded.
     * Scene will be unloaded at the end of the frame.
     * @param scene The scene to unload.  Leave as "" to unload the current scene.
     */
    static unloadScene(sceneName?: string): void;
    /**
     * Unloads all currently loaded scenes.
     * Scenes will be unloaded at the end of the frame.
     */
    static unloadAllScenes(): void;
    /**
     * Gets the unique ID of the scene with the given scene name.
     * @param sceneName Name of the scene.
     */
    static idFromSceneName(sceneName: string): number;
    /**
     * Returns the Scene with the given name, or null if no scene with the name exists.
     */
    static sceneFromName(sceneName: string): Scene;
    /**
     * Gets the total number of scenes.
     */
    static numScenes: number;
    /**
     * Gets ID for this Scene.  Each Scene is guaranteed to have a unique ID.
     */
    getID: () => number;
    /**
     * Gets name of the scene.  This is the name that was set when the scene was added.
     */
    getName: () => string;
    /**
        * Called when a scene is loaded.  Should be overridden to create the GameObjects in this scene.
        */
    onLoad: () => void;
    /**
     * Called when a scene is unloaded.  GameObjects loaded by the scene will be automatically destroyed, so there's no need to do that here.
     */
    onUnload: () => void;
    /**
     * Scene constructor.
     */
    constructor();
    /**
     * Load scenes that have been marked to be loaded.
     * Then starts all components that haven't been started yet.
     */
    static _loadScenesToLoad(): void;
    /**
     * Destroys all GameObjects in scenes that are marked to be unloaded.
     * Except for GameObjects where isDontDestroyOnUnload() is true.
     */
    static _destroyGameObjectsInScenesToUnload(): void;
    /**
     * Unloads all scenes in scenesToUnload.  Assumes all GameObjects from those scenes have been destroyed already.
     */
    static _unloadMarkedScenes(): void;
    private _id;
    private static sceneIDCounter;
    private _name;
    private static dictionary;
    private static _numScenes;
    private static loadedScenes;
    private static scenesToUnload;
    private static scenesToLoad;
    private static sceneExists(name);
    /**
     * Gets scene from name.  Prints an error to the console if no scene with the name exists.
     */
    private static _sceneFromName(name);
}
interface IDrawer {
    /**
     * Drawers are sorted by layer before being drawn.
     */
    layer: DrawLayer;
    /**
     * Drawers are sorted by this value (after Layer sorting) before being drawn.
     */
    order: number;
    /**
     * draw() will not be called for IDrawers that aren't visible.
     */
    isVisible(): boolean;
    /**
     * When true, the position of the drawer when drawn will ignore the camera (e.g. UI elements).
     */
    anchored: boolean;
    /**
     * When defined, the transform of the context will be automatically set to this before drawing the object.
     * This can be set to reference another transform.
     */
    getTransform(): Transform;
    /**
     * Draws the IDrawer on the given context.
     * The transform of the context is set beforehand, depending on this IDrawer's transform and anchored properties.
     * context.save() is called beforehand and context.restore() is called afterwards.
     */
    draw(context: CanvasRenderingContext2D): void;
}
/**
 * Sorting layer for IDrawer components.  Influences order in which IDrawers are drawn.
 */
declare enum DrawLayer {
    BG = 10,
    PLATFORMS = 20,
    DEFAULT = 50,
    FG = 60,
    GIZMO = 100,
    UI = 1000,
}
declare namespace Drawers {
    /**
     * Adds IDrawer to list, letting it be drawn in drawAll().  Careful: DOES NOT CHECK if drawer already exists in the list.
     */
    function _add(drawer: IDrawer): void;
    /**
     * Removes IDrawer from list.
     */
    function _remove(drawer: IDrawer): void;
    /**
     * To be called by Game in the game loop.  Sorts all the IDrawers, then draws them onto the Game context.
     */
    function _drawAll(): void;
}
declare namespace TiledMap {
    /**
     * The directory of the tileset images in TexPackManager.
     * Must be set before creating maps.
     */
    let tilesetImageDirectory: string;
    /**
     * Adds a tileset.  No two tilesets may have the same name (even if they're in different folders).
     * @param name Name of the tileset.  Must match the name the tileset is referred to by tilemaps.
     * @param tilesetJSON The JSON object to be parsed to create the tileset.
     */
    function addTileset(name: string, tilesetJSON: any): void;
    /**
     * Adds a map.  No two maps may have the same name (even if they're in different folders).
     * @param name Name of the map.
     * @param mapJSON The JSON object to be parsed to create the map.
     */
    function addMap(name: string, mapJSON: any): void;
    /**
     * Creates MapData for the TiledMap with the given name.  Assumes the JSON for the tiledMap and all tilesets used are already added and loaded.
     * @param mapName Name of the tiledMap to create.
     */
    function createTiledMapData(mapName: string): MapData;
    /**
     * Maps the given type to a given function that will parse the objectProperties of all tiled objects that have the given type.
     * @param type The type, as defined by the 'Type' field for an object's properties in Tiled.
     * @param parseFunc Function that parses the objectProperties and returns the GameObject created from it.
     */
    function addObjectParser(type: string, parseFunc: (objectProperties: TiledMap.Object) => GameObject): void;
    /**
     * Uses parse functions added with addObjectParser() to parse the given mapObject.  Returns the GameObject created, or null if no parser for the given map object could be found.
     * @param mapObject The map object to parse.  Its type property determines which parse function to use.
     */
    function parseMapObject(mapObject: TiledMap.Object): GameObject;
    /**
     * Represents a layer of a TiledMap.  Overridden by TileLayer and ObjectLayer.
     */
    class Layer {
        constructor();
        /**
         * Name of the layer.
         */
        name: string;
        /**
         * Type of the layer.
         */
        type: LayerType;
        /**
         * Reference to the TiledMap the layer belongs to.
         */
        mapData: MapData;
        /**
         * Index of this layer in the TiledMap the layer belongs to.
         */
        layerIndex: number;
        /**
         * Width of the layer in tiles.  Should be the same as the map's width.
         */
        width: number;
        /**
         * Width of the layer in tiles.  Should be the same as the map's width.
         */
        height: number;
        /**
         * Opacity of the layer as set in Tiled.  Not used currently.
         */
        opacity: number;
        /**
         * Visibility of the layer as set in Tiled.  Not used currently.
         */
        visible: boolean;
        /**
         * Object of custom properties defined by the layer.  Guaranteed to be not null and not undefined.
         */
        customProperties: any;
        /**
         * Parses a JSON object exported from Tiled to construct the layer.  No error checking is done.
         */
        parse: (jsonObj: any) => void;
        protected Layer_parse: (jsonObj: any) => void;
        dispose: () => void;
        protected Layer_dispose: () => void;
    }
    class TileLayer extends Layer {
        constructor();
        /**
         * Direct access to the tile data.
         */
        tileData: Array<number>;
        /**
         * Gets the number at the given coordinates, or 0 if coordinates are invalid.
         */
        getTileData: (x: number, y: number) => number;
        /**
         * Gets the global tile id at the given coordinates, stripped of its transform flags.
         */
        getGID: (x: number, y: number) => number;
        /**
         * Gets the TileInfo of the tile at the given coordinates, or null if coordinates are invalid.
         */
        getTileInfo: (x: number, y: number) => TileInfo;
        /**
         * Sets the number at the given coordinates.
         */
        setTileData: (x: number, y: number, data: number) => void;
        /**
         * Sets the global tile id at the given coordinates.
         */
        setGID: (x: number, y: number, gid: number, flippedHoriz?: boolean, flippedVert?: boolean, flippedDiag?: boolean) => void;
        /**
         * Gets if the given coordinates are valid (i.e. are contained in the map).
         */
        coordinatesAreValid: (x: number, y: number) => boolean;
        /**
         * Parses a JSON object exported from Tiled to construct the layer.  No error checking is done.
         */
        parse: (jsonObj: any) => void;
        dispose: () => void;
    }
    const FLIPPED_HORIZONTALLY_FLAG: number;
    const FLIPPED_VERTICALLY_FLAG: number;
    const FLIPPED_DIAGONALLY_FLAG: number;
    enum LayerType {
        NONE = 0,
        TILE_LAYER = 1,
        OBJECT_GROUP = 2,
        IMAGE_LAYER = 3,
    }
    /**
     * Class containing info for a tile.  Can be obtained with MapData.getTileInfo(gid).
     */
    class TileInfo {
        /**
         * id of the tile within its tileset.
         */
        id: number;
        /**
         * Reference to the tileset this tile belongs to.
         */
        tileset: Tileset;
        /**
         * Material of this tile.  Set by setting a custom property for a tile with the name "material" in Tiled.
         * Value should match a tile added by Material.addMaterial().
         */
        material: string;
        /**
         * Collision layers for this tile.  Set by grabbing the collisionLayers property from the material defined by the "material" custom property in Tiled.
         * The bits of this integer represent the masks this PlatformObject will collide with.  Note that 0 means no collision.
         * "I am a"
         */
        collisionLayers: number;
        /**
         * Object of all custom properties defined for the tile in Tiled.
         */
        customProperties: any;
        /**
         * TileInfo representing a tile with a gid of 0.
         */
        static empty: TileInfo;
        private static _empty;
        /**
         * Creates a new TileInfo, using a recycled TileInfo if possible.
         * @param tileset Tileset the tile belongs to.
         * @param id id of the tile in the Tileset.
         */
        static createNew(tileset: Tileset, id: number): TileInfo;
        /**
         * Recycles a TileInfo to be used later.  Dereferences properties on the tileInfo as well.
         * @param tileInfo
         */
        static recycle(tileInfo: TileInfo): void;
        private recycled;
        private static recycledTileInfos;
    }
    class Tileset {
        /**
         * Key used to access the packed image for this tileset.
         */
        packedImageFilename: string;
        /**
         * Reference to the packed image for this tileset.
         */
        packedImage: TexPackManager.PackedImage;
        /**
         * Number of tiles defined in this tileset.
         */
        numTiles: number;
        /**
         * Width of the image in pixels.
         */
        imageWidth: number;
        /**
         * Height of the image in pixels.
         */
        imageHeight: number;
        /**
         * Width of each tile, in pixels
         */
        tileWidth: number;
        /**
         * Height of each tile, in pixels
         */
        tileHeight: number;
        /**
         * Object of custom properties for the tileset defined in Tiled.  Guaranteed to not be null.
         */
        customProperties: any;
        /**
         * Calculates the number of columns in this tileset (it's not provided for some reason).  Calculation currently does not take into account margin or spacing.
         */
        getNumColumns: () => number;
        /**
         * Array of info for all the tiles in this tileset.  tileInfos[id] is the TileInfo for the tile with id id.
         * Guaranteed to contain an entry for every tile id in this tileset.
         */
        tileInfos: Array<TileInfo>;
        /**
         * Parses the tileset from a given JSON object made in Tiled for the tileset.
         */
        parse: (tilesetJSON: any) => void;
        /**
         * Recycles all the TileInfos defined in this Tileset, then gets rid of the array containing them.
         * Clears references.
         */
        dispose: () => void;
        private logTileError;
    }
    /**
     * Class for parsed objects from Tiled object layers.
     */
    class Object {
        /**
         * Name of the object, as defined in Tiled.
         */
        name: string;
        /**
         * Type as defined by the used in Tiled.
         */
        type: string;
        /**
         * ID, which is automatically set in Tiled.
         */
        id: number;
        x: number;
        y: number;
        rotation: number;
        width: number;
        height: number;
        objectType: ObjectType;
        /**
         * Points for the polygon/polyline, if this object is the POLYGON or POLYLINE type.
         */
        points: Array<Vec2>;
        /**
         * Object of custom properties defined in Tiled.  Guaranteed to be not null and not undefined.
         */
        customProperties: any;
        /**
         * The ObjectGroup this object comes from.
         */
        objectGroup: ObjectGroup;
        /**
         * Parses from a JSON exported from Tiled.
         */
        parse: (jsonObject: any) => void;
    }
    enum ObjectType {
        NONE = 0,
        RECTANGLE = 1,
        ELLIPSE = 2,
        POLYGON = 3,
        POLYLINE = 4,
    }
    class ObjectGroup extends Layer {
        constructor();
        /**
         * Array of all the TiledMapObjects defined in this group.
         */
        mapObjects: Array<Object>;
        /**
         * Parses a JSON object exported from Tiled to construct the object group.  No error checking is done.
         */
        parse: (jsonObj: any) => void;
        dispose: () => void;
    }
    class MapData {
        /**
         * Parse a JSON object exported from Tiled.
         */
        parse: (jsonObj: any) => void;
        /**
         * Height of the map, in number of tiles.
         */
        height: number;
        /**
         * Width of the map, in number of tiles.
         */
        width: number;
        /**
         * Width of the tiles, in pixels.
         */
        tileWidth: number;
        /**
         * Height of the tiles, in pixels.
         */
        tileHeight: number;
        /**
         * Object of custom properties defined by the map.  Guaranteed to be not null and not undefined.
         */
        customProperties: any;
        /**
         * The layers contained in this map.
         */
        layers: Array<Layer>;
        /**
         * Returns the TiledMapLayer with the given name, or null if no layer with the name exists in this map.
         */
        getLayerByName: (name: string) => Layer;
        /**
         * Returns the TiledMapTileLayer with the given name, or null if no tile layer with the name exists in this map.
         */
        getTileLayerByName: (name: string) => TileLayer;
        /**
         * Gets info for the tile with the given global id.
         * Returns TileInfo.empty if the gid is 0.
         * Returns null if the gid is invalid.
         */
        getTileInfo: (gid: number) => TileInfo;
        /**
         * Creates a GameObject, where each child is a GameObject with a TiledMapTileLayerRenderer component corresponding to each tile layer.
         * Then every map Object is parsed with functions given by addObjectParser().
         * Returns the created GameObject.
         */
        createGameObject: () => GameObject;
        /**
         * Calls a function on all TiledMapObjects in the map.
         */
        callOnAllMapObjects: (func: (mapObject: Object) => void) => void;
        dispose: () => void;
        private _tilesets;
        private _parsed;
        private static addExternalTileset(tilesetName, tileset);
        private static getExternalTileset(tilesetSource);
        private static externalTilesetExists(tilesetName);
        private static externalTilesets;
    }
}
/**
 * Messages received:
    
    // Called when the Component is added to a GameObject.
    onAwake = (): void => { }
    
    // Called once for a Component.  Either called when a scene finishes loading, or just before update().
    onStart = (): void => { }
    
    // called once per frame, during the update step.  Is not called if the component is disabled.
    onUpdate = (): void => { }
    
    // called when the component is enabled.
    onEnable = (): void => { }
    
    // called when the component is disabled.
    onDisable = (): void => { }
    
    // called just before the component is destroyed.
    onDestroy = (): void => { }
    
*/
declare class ComponentProperties {
    /**
     * When true, there can only be 1 of this component on a GameObject.
     */
    only1: boolean;
    /**
     * Adds a Component constructor to the list of components that are required to be added before adding this one.
     */
    requireComponent: <T extends Component>(c: new () => T) => void;
    /**
     * Adds a Component constructor to the list of components that are required to NOT be added when adding this one.
     */
    excludeComponent: <T extends Component>(c: new () => T) => void;
    _requireComponents: Array<any>;
    _excludeComponents: Array<any>;
}
declare class Component {
    constructor();
    /**
     * Name of the component.  Used for debugging.
     */
    name: string;
    /**
     * The GameObject this Component belongs to.  Please don't change.
     */
    gameObject: GameObject;
    getTransform: () => Transform;
    /**
     * Gets if this component is enabled.  Only active and enabled components receive calls to update() every frame.
     */
    isEnabled: () => boolean;
    /**
     * Gets if this component's gameObject is active and this component is enabled.  Only active and enabled components receive calls to update() every frame.
     */
    isActiveAndEnabled: () => boolean;
    /**
     * Gets if onStarted() has been called yet for the component.
     */
    isStarted: () => boolean;
    getComponentProperties: () => ComponentProperties;
    /**
     * Enables this component, calling onEnable() if defined.
     */
    enable: () => void;
    /**
     * Disables this component, calling onDisable() if defined.
     */
    disable: () => void;
    /**
     * Gets a component of or derived from the given type from this component's gameObject, or returns null if it doesn't exist.
     */
    getComponent: <T extends Component>(c: new () => T) => T;
    /**
     * Gets an array of all components of or derived from the given type from this component's gameObject.
     */
    getComponents: <T extends Component>(c: new () => T) => T[];
    /**
     * Returns a string describing the component.
     */
    toString: () => string;
    protected componentProperties: ComponentProperties;
    private _enabled;
    private _started;
    /**
     * Starts the given component (if it's unstarted) and marks it as started.
     */
    static _startUnstarted(component: Component): void;
}
/**
 * DrawerComponents are automatically added to and removed from Drawers.
 */
declare class DrawerComponent extends Component implements IDrawer {
    constructor();
    /**
     * Drawers are sorted by layer before being drawn.
     */
    layer: DrawLayer;
    /**
     * Drawers are sorted by this value (after Layer sorting) before being drawn.
     */
    order: number;
    /**
     * If draw() should be called for this DrawComponent.  Is false if this component is disabled or the gameObject is marked for destroy.
     */
    isVisible: () => boolean;
    /**
     * When true, the position of the drawer when drawn will ignore the camera (e.g. UI elements).
     */
    anchored: boolean;
    /**
     * Draws to the given context.
     */
    draw: (context: CanvasRenderingContext2D) => void;
}
/**
 * Renders a rectangle of a TextureAtlas.
 */
declare class PackedImageRenderer extends DrawerComponent {
    constructor();
    /**
     * Gets the TexPackManager.PackedImage this renderer draws from.
     */
    getImage: () => TexPackManager.PackedImage;
    /**
     * Sets the image to draw.
     * @param setRectFull Automatically set rectangular selection dimensions to be the size of the original image (default is true).
     */
    setImage: (image: TexPackManager.PackedImage, setRectFull?: boolean) => void;
    protected setImage_PackedImageRenderer: (image: TexPackManager.PackedImage, setRectFull?: boolean) => void;
    /**
     * Sets image to draw based on its original filename.  image is set to null if no image with the name exists.
     * @param setRectFull Automatically set rectangular selection dimensions to be the size of the original image (default is true).
     */
    setImageByName: (filename: string, setRectFull?: boolean) => void;
    /**
     * The X coordinate of the top left corner of the sub-rectangle of the original image to draw into the destination context.
     * Assumes the image wasn't trimmed.
     */
    imageX: number;
    /**
     * The Y coordinate of the top left corner of the sub-rectangle of the original image to draw into the destination context.
     * Assumes the image wasn't trimmed.
     */
    imageY: number;
    /**
     * The width of the sub-rectangle of the original image to draw into the destination context.
     * Assumes the image wasn't trimmed.
     */
    imageWidth: number;
    /**
     * The height of the sub-rectangle of the original image to draw into the destination context.
     * Assumes the image wasn't trimmed.
     */
    imageHeight: number;
    /**
     * Sets the rectangular selection properties with one function.
     * @param x x coordinate of top left corner of the rectangle.
     * @param y y coordinate of top left corner of the rectangle.
     * @param width width of the rectangle.
     * @param height height of the rectangle.
     */
    setImageRect: (x: number, y: number, width: number, height: number) => void;
    protected setImageRect_PackedImageRenderer: (x: number, y: number, width: number, height: number) => void;
    /**
     * Sets the rectangular selection properties to be the size of the original image.
     */
    setImageRectFull: () => void;
    /**
     * x coordinate of the origin point of the displayed image, as a multiplier of the imageWidth.  0 is the left edge, 1 is the right edge.
     */
    pivotX: number;
    /**
     * y coordinate of the origin point of the displayed image, as a multiplier of the imageHeight.  0 is the top edge, 1 is the bottom edge.
     */
    pivotY: number;
    /**
     * Disable image smoothing for a pixel-art look.
     */
    imageSmoothingEnabled: boolean;
    /**
     * CSS color string representing the color to tint the image.  Alpha is ignored.
     */
    tintColor: string;
    /**
     * Amount to apply tintColor when tinting the image.  Ranges from [0, 1].
     */
    tintAmount: number;
    /**
     * Draws the TextureRectRenderer on the given context.
     */
    draw: (context: CanvasRenderingContext2D) => void;
    private image;
    private colorParser;
}
/**
 * An extension of PackedImageRenderer for rendering SpriteFrames and Animations.
 */
declare class SpriteRenderer extends PackedImageRenderer {
    constructor();
    /**
     * Reference to the spriteFrame the renderer is displaying.
     */
    getSpriteFrame: () => SpriteFrame;
    /**
     * Sets renderer to display the given spriteFrame.
     */
    setSpriteFrame: (spriteFrame: SpriteFrame) => void;
    /**
     * Sets renderer to display the the spriteFrame from a spritesheet at the given index.
     */
    setSpriteFrameByName: (imageFilename: string, frameIndex: number) => void;
    /**
     * Sets the image to draw.  Since this is isn't defined by a SpriteFrame, spriteFrame will be set to null.
     * Calling this while an animation is playing probably won't do anything because the animation will almost immediately update the image.
     * @param setRectFull Automatically set rectangular selection dimensions to be the size of the original image (default is true).
     */
    setImage: (image: TexPackManager.PackedImage, setRectFull?: boolean) => void;
    /**
     * Sets the rectangular selection properties with one function.  Since this is isn't defined by a SpriteFrame, spriteFrame will be set to null.
     * Calling this while an animation is playing probably won't do anything because the animation will almost immediately update the image.
     * @param x x coordinate of top left corner of the rectangle.
     * @param y y coordinate of top left corner of the rectangle.
     * @param width width of the rectangle.
     * @param height height of the rectangle.
     */
    setImageRect: (x: number, y: number, width: number, height: number) => void;
    /**
     * Plays the given animation.
     * @param animation The animation to play.  Can be null to stop the animation.
     * @param nextAnimation (default is null) The animation to play after the other animation finishes (doesn't apply when playing backwards).  This won't happen when set to null.
     */
    playAnimation: (animation: Animation, nextAnimation?: Animation) => void;
    /**
     * Plays the given animation.  Animations are given by name.
     * @param animation The animation to play.  Can be "" to stop the animation.
     * @param nextAnimation (default is "") The animation to play after the other animation finishes (doesn't apply when playing backwards).  This won't happen when set to "".
     */
    playAnimationByName: (animation: string, nextAnimation?: string) => void;
    /**
     * Stops the animation.
     */
    stopAnimation: () => void;
    /**
     * Gets the current animation.
     */
    getAnimation: () => Animation;
    /**
     * Gets if an animation is playing.  Can return true even when animation speed is 0.
     */
    isAnimationPlaying: () => boolean;
    /**
     * Gets the current time for playing the current animation.
     */
    getAnimationTime: () => number;
    /**
     * Gets the current frame index of the current animation.
     */
    getAnimationFrameIndex: () => number;
    /**
     * Sets the time for playing the current animation.  Is automatically clamped to be within the animation duration.
     */
    setAnimationTime: (time: number) => void;
    /**
     * Gets the speed multiplier for playing an animation.
     */
    getAnimationSpeed: () => number;
    /**
     * Sets the speed multiplier for playing an animation (can be negative to play animation in reverse).
     */
    setAnimationSpeed: (speed: number) => void;
    onUpdate: () => void;
    protected updateSpriteFrameFromAnimation: () => void;
    protected spriteFrame: SpriteFrame;
    protected animation: Animation;
    protected nextAnimation: Animation;
    protected animTime: number;
    protected animSpeed: number;
    protected animPlaying: boolean;
}
declare class TiledMapTileLayerRenderer extends DrawerComponent {
    constructor();
    /**
     * The TileLayer data this renderer is drawing.
     */
    tiledMapLayer: TiledMap.TileLayer;
    /**
     * Gets the map data this tile layer is a part of.
     */
    getMapData: () => TiledMap.MapData;
    /**
     * Gets the TiledMapComponent representing the map data this tile layer is a part of.
     * TiledMapComponent should be in the parent transform.
     */
    getTiledMapComponent: () => TiledMapComponent;
    /**
     * Won't draw tiles that aren't on the camera.  Assumes the map doesn't scale or rotate, isn't the child of another Transform.
     */
    cameraCulling: boolean;
    onAwake: () => void;
    draw: (context: CanvasRenderingContext2D) => void;
    onDestroy: () => void;
    private _transform;
}
/**
 * Component containing the map data and layers for a tiled map.
 * The root GameObject created with TiledMap.createGameObject() has this component.
 */
declare class TiledMapComponent extends Component {
    constructor();
    mapData: TiledMap.MapData;
    onDestroy: () => void;
}
/**
 * Applies a filter covering the entire screen that makes it grayscale.
 */
declare class ScreenFilter extends DrawerComponent {
    constructor();
    grayscale: boolean;
    invert: boolean;
    draw: (context: CanvasRenderingContext2D) => void;
}
/**
 * A basic component that loads Game.startScene when all the game's assets are finished loading.
 * Can be overridden.
 */
declare class BasePreloader extends DrawerComponent {
    textFont: string;
    textColor: string;
    constructor();
    /**
     * Draws percent loaded to the context.
     */
    draw: (context: CanvasRenderingContext2D) => void;
    onUpdate: () => void;
    protected onUpdate_BasePreloader: () => void;
}
/**
 * The first scene loaded by the game by default.  Only contains one GameObject with the BasePreloader component, which starts Game.startScene when all the game's assets are finished loading.
 */
declare class BasePreloadScene extends Scene {
    onLoad: () => void;
    onUnload: () => void;
}
declare class GameObject {
    /**
     * GameObject constructor.
     */
    constructor();
    /**
     * Name of this GameObject.  Used in functions that search for gameObjects by name.
     */
    name: string;
    /**
     * Gets instance ID for this GameObject.  Guaranteed to be unique for every GameObject.
     */
    getInstanceID: () => number;
    /**
     * Gets scene ID for this GameObject.  This is the ID of the scene last loaded when this GameObject was created.
     * When the scene is unloaded, this GameObject will be destroyed, unless it's marked to not be destroyed on unload.
     */
    getSceneID: () => number;
    /**
     * Transform for this GameObject.  Please don't change.
     */
    transform: Transform;
    /**
     * When true, this object will be deleted at the end of the frame.
     */
    isMarkedForDestroy: () => boolean;
    /**
     * When true, this object will not be destroyed when the scene it comes from unloads.
     */
    isDontDestroyOnUnload: () => boolean;
    /**
     * Sets the local active state of this GameObject (isActiveSelf).
     */
    setActive: (active: boolean) => void;
    /**
     * If this and every parent above it is active.
     */
    isActive: () => boolean;
    /**
     * The local active state of this GameObject.  This GameObject still isn't active if a parent is inactive however.
     */
    isActiveSelf: () => boolean;
    /**
     * Adds a Component of the given type.
     */
    addComponent: <T extends Component>(c: new () => T) => T;
    /**
     * Gets a component of or derived from the given type from this gameObject, or returns null if it doesn't exist.
     */
    getComponent: <T extends Component>(c: new () => T) => T;
    /**
     * Gets an array of all components of or derived from the given type from this gameObject.
     */
    getComponents: <T extends Component>(c: new () => T) => T[];
    /**
     * Gets an array of all components in children of or derived from the given type from this gameObject.
     */
    getComponentsInChildren: <T extends Component>(c: new () => T) => T[];
    /**
     * Marks object to be destroyed at the end of the frame.  Children will be recursively marked for destroy as well.  Won't do anything if already marked for destroy.
     */
    markForDestroy: () => void;
    /**
     * Marks object to not be destroyed when the scene it comes from unloads.  Children will recursively be marked the same way.
     * Note this mark cannot be undone, and once this function is called this GameObject will need to be destroyed manually.
     */
    dontDestroyOnUnload: () => void;
    /**
     * Calls a function (if the function exists) on every component in this GameObject.
     */
    sendMessage: (functionName: string, functionParam?: any) => void;
    /**
     * Searches all gameObjects for a component of or derived from the given type, or returns null if it doesn't exist.
     */
    static findObjectOfType<T extends Component>(c: new () => T): T;
    /**
     * Searches all gameObjects for components of or derived from the given type.
     */
    static findObjectsOfType<T extends Component>(c: new () => T): T[];
    /**
     * Searches all gameObjects for one with the given name, or returns null if it doesn't exist.
     * @param name Name of the gameObject to find.  null will be returned if name is null, undefined, or "".
     */
    static findObject(name: string): GameObject;
    /**
     * Performs a forEach() on all the gameObjects.
     */
    static _forEach(callbackFunction: (value: GameObject, index: number, array: GameObject[]) => void): void;
    /**
     * Calls update() on all the gameObjects.
     */
    static _updateAll(): void;
    /**
     * Starts every unstarted component.  Called after a scene loads in.
     */
    static _startAllUnstartedComponents(): void;
    /**
     * Destroys all GameObjects marked to be destroyed.  Should only be called by Game at the end of the frame.
     */
    static _destroyAllMarked(): void;
    private _update;
    /**
     * Destroys an object immediately, removing it from the game object list.
     */
    private destroyImmediately;
    /**
     * Helper function for getComponentsInChildren().
     */
    private getComponentsAndInChildren;
    private _instanceID;
    private _sceneID;
    private components;
    private _markedForDestroy;
    private _dontDestroyOnUnload;
    private _activeSelf;
    private static instanceIDCounter;
    private static allGameObjects;
    private static gameObjectsMarkedForDestroy;
}
/**
 * - Actors are things that move around in the world.
 * - Actors only collide with PlatformObjects.
 * - Do not override Actor.
 *
 * Messages received:

    // called when an Actor first begins colliding with a PlatformObject.  Note this can be called for different PlatformObjects belonging to the same Platform.
    onCollisionEnter = (response: Collision.Response): void => { }

    // called every frame the Actor collides with a PlatformObject.
    onCollisionStay = (response: Collision.Response): void => { }
    
    // called when an Actor stops colliding with a PlatformObject.
    onCollisionExit = (response: Collision.Response): void => { }
    
    // called when an Actor is attached from a MovingPlatformObject.
    onPlatformAttach = (movingPlatformObject: Collision.MovingPlatformObject): void => { }
    
    // called when an Actor is detached from a MovingPlatformObject.
    onPlatformDetach = (movingPlatformObject: Collision.MovingPlatformObject): void => { }
    
    // called when an Actor would be crushed between 2 PlatformObjects.  (Crush detections not working)
    onCollisionCrush = (crush: Collision.Crush): void => { }
    
 */
/**
 *
 */
declare enum Team {
    NONE = 0,
    PLAYER_1 = 1,
    PLAYER_2 = 2,
    PLAYER_3 = 4,
    PLAYER_4 = 8,
    /**
     * Represents all players.
     */
    PLAYERS = 15,
    ENEMY_1 = 256,
    ENEMY_2 = 512,
    ENEMY_3 = 1024,
    ENEMY_4 = 2048,
    /**
     * Represents all enemies.
     */
    ENEMIES = 3840,
    /**
     * Represents all players and all enemies.
     */
    ALL = 2147483647,
}
declare class Actor extends Component {
    constructor();
    /**
     * Gets position of this transform in the global space.
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    getGlobalPosition: (outPos?: Vec2) => Vec2;
    /**
     * Sets position of this transform in the global space.
     */
    setGlobalPosition: (x: number, y: number) => void;
    /**
     * velocity x
     */
    vx: number;
    /**
     * velocity y
     */
    vy: number;
    /**
     * Collision.gravity accel is multiplied by this before being added to actor's velocity.
     */
    gravityScale: number;
    /**
     * Extra x velocity from the wind.
     */
    windX: number;
    /**
     * Extra y velocity from the wind.
     */
    windY: number;
    offsetX: number;
    offsetY: number;
    halfWidth: number;
    halfHeight: number;
    getRect(outRect?: Rect): Rect;
    /**
     * The "team" this actor belongs to.  Affects which attacks this actor gets hit by.
     */
    team: Team;
    /**
     * If this actor is included in the given team.
     */
    isInTeam: (team: Team) => boolean;
    /**
     * Determines how an Actor is repositioned upon hitting a platform.
     * When false, Actors will stop immediately when hitting a platform.
     */
    projectCollision: boolean;
    /**
     * When true, automatically sets x/y velocity to 0 upon hitting a horizontal/vertical wall.
     */
    zeroVelocityOnCollision: boolean;
    /**
     * This actor's gameObject will be sent onCollisionCrush events if the angle (degrees) between collision normals is more than this amount.
     */
    crushAngleThreshold: number;
    /**
     * Angle (in degrees) of the diagonal of the dimensions
     */
    getDimensionRatioAngle: () => number;
    /**
     * A reference to the MovingPlatformObject this Actor is attached to, or null if isn't attached to a MovingPlatformObject.  Actors can only be attached to one platform at a time.
     */
    getAttachedMovingPlatformObject: () => Collision.MovingPlatformObject;
    /**
     * The bits of this integer represent the layers this Actor will collide with.
     * "I will collide with".
     */
    collisionMask: number;
    /**
     * Performs a raycast.
     * @param raycastHit put the results of the raycast here, rather than allocating a new RaycastHit.
     * @param origin origin of the ray being cast.
     * @param direction normalized direction of the ray being cast.
     * @param distance distance of the ray being cast.
     * @param teamMask collision will be detected only if this actor is included in this team.
     */
    raycast: (raycastHit: Collision.RaycastHit, origin: Vec2, direction: Vec2, distance?: number, teamMask?: Team) => void;
    /**
     * Called when a Component is added to a GameObject.  Adds Actor to the list containing all Actors.
     */
    onAwake: () => void;
    onUpdate: () => void;
    onEnable: () => void;
    onDisable: () => void;
    onPlatformAttach: (movingPlatformObject: Collision.MovingPlatformObject) => void;
    onPlatformDetach: (movingPlatformObject: Collision.MovingPlatformObject) => void;
    /**
     * Removes this actor from the list of all actors.
     */
    onDestroy: () => void;
    /**
     * Calls forEach() on all the actors.
     * @param callbackFn Function to call on all the actors.
     */
    static forEach(callbackFn: (actor: Actor) => void): void;
    private attachedMovingPlatformObject;
    private tempVec2;
    private static allActors;
}
declare namespace Collision {
    class PlatformObject {
        constructor(platform: Platform);
        /**
         * Gets the Platform this PlatformObject belongs to.
         */
        getPlatform: () => Platform;
        /**
         * Gets position of this PlatformObject, which is the global position of the transform of the gameObject of the Platform component it belongs to.
         * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
         */
        getPosition: (outPos?: Vec2) => Vec2;
        /**
         * PlatformObjects that aren't enabled won't be considered for collision.
         */
        isEnabled: () => boolean;
        enable: () => void;
        disable: () => void;
        /**
         * The bits of this integer represent the layers this PlatformObject will collide with.
         * "I am a"
         */
        collisionLayers: number;
        /**
         * Called by Handler.  Fills the given CollisionResponse, describing what happens when the given actor moves toward it.
         * This assumes platformObject's position after movement.
         */
        movingActorCollision: (response: Response, movingActor: MovingActor, projectCollision: boolean) => void;
        /**
         * Performs a raycast.
         * @param raycastHit put the results of the raycast here, rather than allocating a new RaycastHit.
         * @param origin origin of the ray being cast.
         * @param direction normalized direction of the ray being cast.
         * @param distance distance of the ray being cast.
         * @param collisionMask Bits representing the collision layers the ray will collide with.  Default is 0x7FFFFFFF.
         */
        raycast: (raycastHit: RaycastHit, origin: Vec2, direction: Vec2, distance?: number, collisionMask?: number) => void;
        /**
         * Returns if the given rectangle overlaps with this platform object.
         */
        rectOverlaps: (rect: Rect, collisionMask?: number) => boolean;
        /**
         * Removes references, self from allPlatformObjects.
         */
        destroy: () => void;
        protected PlatformObject_destroy: () => void;
        /**
         * Calls forEach() on all the platform objects.
         * @param callbackFn Function to call on all the platform objects.
         */
        static forEach(callbackFn: (platformObject: PlatformObject) => void): void;
        protected _platform: Platform;
        protected _enabled: boolean;
        protected tempVec2: Vec2;
        protected tempRect: Rect;
        static _allPlatformObjects: Array<PlatformObject>;
    }
}
declare namespace Collision {
    class MovingPlatformObject extends PlatformObject {
        constructor(platform: Platform);
        enable: () => void;
        disable: () => void;
        /**
         * Attach an actor.
         */
        attachActor: (actor: Actor) => void;
        /**
         * Detaches an actor from the platform object.  This sends the onPlatformDetach(movingPlatformObject: Collision.MovingPlatformObject) event to the actor.
         * @param actor the Actor to detach.
         */
        detachActor: (actor: Actor) => void;
        /**
         * Detaches all actors from the platform object.
         */
        detachAllActors: () => void;
        /**
         * Called by Handler.  Fills the given CollisionResponse, describing what happens when this platform moves towards the given actor.
         */
        movingPlatformCollision: (response: Response, stationaryActor: StationaryActor) => void;
        /**
         * Called by Handler.  Fills the given newPosition Vec2 with the position the given attached actor should be next frame.
         */
        moveAttachedActor: (newPosition: Vec2, stationaryActor: StationaryActor) => void;
        destroy: () => void;
        protected attachedActors: Array<Actor>;
        protected MovingPlatformObject_destroy: () => void;
        protected MovingPlatformObject_enable: () => void;
        protected MovingPlatformObject_disable: () => void;
        static _allMovingPlatformObjects: Array<MovingPlatformObject>;
    }
}
declare namespace Collision {
    class AABBPlatformObject extends MovingPlatformObject {
        constructor(platform: Platform);
        offsetX: number;
        offsetY: number;
        halfWidth: number;
        halfHeight: number;
        /**
         * Gets x coordinate of the left edge of the AABB.
         */
        getLeft: () => number;
        /**
         * Gets x coordinate of the right edge of the AABB.
         */
        getRight: () => number;
        /**
         * Gets y coordinate of the top edge of the AABB.
         */
        getTop: () => number;
        /**
         * Gets y coordinate of the bottom edge of the AABB.
         */
        getBottom: () => number;
        /**
         * Gets Rect defining the bounds of this AABBPlatformObject.
         * @param outRect If given, this Rect will be filled instead of creating a new Rect (and null will be returned instead).
         */
        getRect: (outRect: Rect) => Rect;
        /**
         * Called by Handler.  Fills the given CollisionResponse, describing what happens when the given actor moves toward it.
         * This assumes platformObject's position after movement.
         */
        movingActorCollision: (response: Response, movingActor: MovingActor, projectCollision: boolean) => void;
        /**
         * Called by Handler.  Fills the given CollisionResponse, describing what happens when this platform moves towards the given actor.
         */
        movingPlatformCollision: (response: Response, stationaryActor: StationaryActor) => void;
        /**
         * Performs a raycast.
         * @param raycastHit put the results of the raycast here, rather than allocating a new RaycastHit.
         * @param origin origin of the ray being cast.
         * @param direction normalized direction of the ray being cast.
         * @param distance distance of the ray being cast.
         * @param collisionMask Bits representing the collision layers the ray will collide with.  Default is 0x7FFFFFFF.
         */
        raycast: (raycastHit: RaycastHit, origin: Vec2, direction: Vec2, distance?: number, collisionMask?: number) => void;
        /**
         * Returns if the given rectangle overlaps with this platform object.
         */
        rectOverlaps: (rect: Rect, collisionMask?: number) => boolean;
    }
}
declare namespace Collision {
    class TiledMapTileLayerPlatformObject extends MovingPlatformObject {
        constructor(platform: Platform);
        /**
         * The TileLayer data this platform object is detecting collision for.
         */
        tiledMapLayer: TiledMap.TileLayer;
        /**
         * Performs a raycast.
         * @param raycastHit put the results of the raycast here, rather than allocating a new RaycastHit.
         * @param origin origin of the ray being cast.
         * @param direction normalized direction of the ray being cast.
         * @param distance distance of the ray being cast.
         * @param collisionMask Bits representing the collision layers the ray will collide with.  Default is 0x7FFFFFFF.
         */
        raycast: (raycastHit: RaycastHit, origin: Vec2, direction: Vec2, distance?: number, collisionMask?: number) => void;
        /**
         * Called by Handler.  Fills the given CollisionResponse, describing what happens when the given actor moves toward it.
         * This assumes platformObject's position after movement.
         */
        movingActorCollision: (response: Response, movingActor: MovingActor, projectCollision: boolean) => void;
        /**
         * Called by Handler.  Fills the given CollisionResponse, describing what happens when this platform moves towards the given actor.
         */
        movingPlatformCollision: (response: Response, stationaryActor: StationaryActor) => void;
        /**
         * Returns if the given rectangle overlaps with this platform object.
         */
        rectOverlaps: (rect: Rect, collisionMask?: number) => boolean;
        destroy: () => void;
        private tempGlobalPos;
    }
}
/**
 * Platform is a Component containing PlatformObjects
 */
/**
 * - Platform is a Component containing PlatformObjects.
 * - PlatformObjects only collide with Actor.
 *
 * Messages received:

    // called when an Actor first begins colliding with a PlatformObject.  Note this can be called for different PlatformObjects belonging to the same Platform.
    onCollisionEnter = (response: Collision.Response): void => { }

    // called every frame the Actor collides with a PlatformObject.
    onCollisionStay = (response: Collision.Response): void => { }
    
    // called when an Actor stops colliding with a PlatformObject.
    onCollisionExit = (response: Collision.Response): void => { }
    
    // called when an Actor is attached from a MovingPlatformObject belonging to this Platform.
    onPlatformAttach = (actor: Actor): void => { }
    
    // called when an Actor is detached from a MovingPlatformObject belonging to this Platform.
    onPlatformDetach = (actor: Actor): void => { }

 */
declare class Platform extends Component {
    constructor();
    onAwake: () => void;
    /**
     * Gets position of this transform in the global space.
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    getGlobalPosition: (outPos?: Vec2) => Vec2;
    /**
     * Sets position of this transform in the global space.
     */
    setGlobalPosition: (x: number, y: number) => void;
    /**
     * velocity x
     */
    vx: number;
    /**
     * velocity y
     */
    vy: number;
    /**
     * Sets velocity such that the platform will be in the given position when the frame ends.
     */
    setVelocityForNextPosition: (x: number, y: number) => void;
    /**
     * Sets the collision layers for each PlatformObject belonging to this Platform.
     */
    setCollisionLayers: (collisionLayers: number) => void;
    onDestroy: () => void;
    /**
     * Calls forEach() on all the platforms.
     * @param callbackFn Function to call on all the platforms.
     */
    static forEach(callbackFn: (Platform: Platform) => void): void;
    protected platformObjects: Array<Collision.PlatformObject>;
    private tempVec2;
    private static allPlatforms;
}
declare enum Direction {
    NONE = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3,
    UP = 4,
}
declare namespace Collision {
    /**
     * Gravity acceleration in the x direction.  Affects Actor movement.
     */
    let gravityX: number;
    /**
     * Gravity acceleration in the y direction.  Affects Actor movement.
     */
    let gravityY: number;
    class RaycastHit {
        /**
         * Whether or not the ray hit something.
         */
        hit: boolean;
        actor: Actor;
        platformObject: PlatformObject;
        /**
         * Point in global space where the ray hit the object.
         */
        point: Vec2;
        /**
         * raycast origin + raycast direction * t = point
         */
        t: number;
        /**
         * The (normalized) normal vector of the surface hit by the ray.
         */
        normal: Vec2;
        /**
         * Clones this RaycastHit.
         */
        clone: () => RaycastHit;
        /**
         * Sets these values to match the values of the given RaycastHit.
         */
        setRaycastHit: (raycastHit: RaycastHit) => void;
    }
    function raycastAllActorsNonAlloc(raycastHit: Collision.RaycastHit, originX: number, originY: number, directionX: number, directionY: number, distance?: number, teamMask?: Team): void;
    function raycastAllPlatformObjectsNonAlloc(raycastHit: Collision.RaycastHit, originX: number, originY: number, directionX: number, directionY: number, distance?: number, collisionMask?: number): void;
    /**
     * Fills the given platformObjects array with all the platformObjects the given rect overlaps.
     * Note that since actors are repositioned with a tiny bit of space between them and the platform they collided with,
     * an actor's rect should not be overlapping with the platform it collided with.
     * @param platformObjects Out parameter that will be filled with PlatformObjects.
     * @param rect The rectangle to test.
     * @param collisionMask Collision mask to filter collision.
     */
    function rectOverlapAllPlatformObjectsNonAlloc(platformObjects: Array<PlatformObject>, rect: Rect, collisionMask?: number): void;
    /**
     * Returns if an Actor with the given collisionMask will collide with a PlatformObject with the given collisionLayers.
     * @param collisionMask
     * @param collisionLayers
     */
    function maskCollidesWithLayers(collisionMask: number, collisionLayers: number): boolean;
    /**
     * Returns the Direction of the normal angle.
     * @param normalX x of the normal vector
     * @param normalY y of the normal vector
     * @param thresholdAngleDegrees Angle in (0, 90).  The returned direction will be RIGHT iff the normal angle is in between -threshold and threshold.
     */
    function getNormalDirection(normalX: number, normalY: number, thresholdAngleDegrees?: number): Direction;
    /**
     * Describes the current position of an actor.
     */
    class StationaryActor {
        /**
         * Position of the actor.
         */
        pos: Vec2;
        /**
         * Center in the actor's local space.
         */
        offset: Vec2;
        halfWidth: number;
        halfHeight: number;
        collisionMask: number;
        /**
         * reference to actor if needed.  Do not use values from the actor, instead use the values in this class instance.
         */
        actor: Actor;
    }
    /**
     * Describes movement of an actor over 1 frame.
     */
    class MovingActor {
        /**
         * Position of the actor at time 0.
         */
        pos0: Vec2;
        /**
         * Position of the actor at time 1.
         */
        pos1: Vec2;
        /**
         * Center in the actor's local space.
         */
        offset: Vec2;
        halfWidth: number;
        halfHeight: number;
        collisionMask: number;
        /**
         * reference to actor if needed.  Do not use values from the actor, instead use the values in this class instance.
         */
        actor: Actor;
    }
    enum ResponseType {
        /**
         * Actor hits PlatformObject at time t (time property).  Reposition Actor at that moment.
         */
        BULLET = 0,
        /**
         * Actor hits PlatformObject at time t (time property), but it should be positioned somewhere else (given by reposition property).
         */
        PROJECT = 1,
        /**
         * Actor started intersecting the platform, reposition it outside the platform (given by the reposition property).  Time should be 0 in this case.
         */
        INTERSECT = 2,
        /**
         * Actor (considered stationary) is pushed by a moving platform.
         */
        MOVING_PLATFORM = 3,
    }
    /**
     * Describes the calculated collision between an Actor and a PlatformObject.
     */
    class Response {
        /**
         * Whether or not a collision occurred.
         */
        hit: boolean;
        /**
         * The Actor involved in the collision.
         */
        actor: Actor;
        /**
         * The PlatformObject involved in the collision.
         */
        platformObject: PlatformObject;
        /**
         * Time in [0, 1] of when the collision occurred.
         */
        time: number;
        /**
         * What the actor's position should be set to as a result of the collision.  Usually pos0+(pos1-pos0)*time with an epsilon offset.
         */
        reposition: Vec2;
        /**
         * Reposition as the result of a projection.  Only needed if type is PROJECT.
         */
        repositionProject: Vec2;
        /**
         * Point in global space where the collision occurred.
         */
        point: Vec2;
        /**
         * Normal of the collision, from the platform towards the actor.  Has a magnitude of 1.
         */
        normal: Vec2;
        /**
         * Type of collision.
         */
        type: ResponseType;
        /**
         * Returns the Direction of the normal angle.
         * @param thresholdAngleDegrees Angle in (0, 90).  The returned direction will be RIGHT iff the normal angle is in between -threshold and threshold.  If not given, this value is set to 90 - actor.getDimensionRatioAngle().
         */
        getNormalDirection: (thresholdAngleDegrees?: number) => Direction;
        toString: () => string;
        /**
         * Creates a new collision response, or returns a recycled response.
         */
        static _create(): Response;
        static _recycle(response: Response): void;
        private static recycledResponses;
        private recycled;
    }
    /**
     * Contains 2 collisions the happened this frame that would crush an Actor.
     * Like the responses, do not keep a reference to this class instance.
     */
    class Crush {
        constructor(response0: Response, response1: Response);
        response0: Response;
        response1: Response;
        /**
         * The angle (in degrees) between the normals of the two collision responses.
         */
        getAngle: () => number;
    }
    class Handler {
        static MAX_RESOLVE_PASSES: number;
        static _update(): void;
        private static collisionsPrevFrame;
        private static collisionsThisFrame;
        /**
         * Searches for a Response from the given array between the given actor and platformObject.  Returns null if Response doesn't exist.
         */
        private static responseSearch(responses, actor, platformObject);
        /**
         * Put new responses in outResponses.
         */
        private static resolveActor(outResponses, actor, platformObjects, movingPlatformObjects);
        private static stationaryActor;
        private static movingActor;
        private static tempVec2;
    }
}
declare class AABBPlatform extends Platform {
    constructor();
    /**
     * Sets dimensions of the AABBPlatformObject.
     */
    setAABB: (offsetX: number, offsetY: number, halfWidth: number, halfHeight: number) => void;
    platformObject: Collision.AABBPlatformObject;
}
declare class TiledMapTileLayerPlatform extends Platform {
    constructor();
    platformObject: Collision.TiledMapTileLayerPlatformObject;
}
declare class Game {
    /**
     * Initializes Game and other classes.  Starts the game loop as well, and loads the scene defined by Game.preloadScene.
     * @param canvas Reference to the canvas defined in the html.
     */
    static initialize(canvas: HTMLCanvasElement): void;
    /**
     * The canvas element used to display the game.
     */
    static canvas: HTMLCanvasElement;
    /**
     * Object used for manipulating shapes and graphics on the canvas.
     */
    static context: CanvasRenderingContext2D;
    /**
     * Hidden canvas used to help make effects.
     */
    static effectsCanvas: HTMLCanvasElement;
    /**
     * Hidden context used to help make effects.
     */
    static effectsContext: CanvasRenderingContext2D;
    /**
     * If the window is currently in fullscreen mode.
     */
    static isFullscreen: boolean;
    /**
     * Requests the browser to go into fullscreen.  Must be called from user input.
     */
    static requestFullscreen(): void;
    /**
     * Exits fullscreen.
     */
    static exitFullscreen(): void;
    /**
     * max value unscaledDeltaTime can be.
     */
    static MAX_UNSCALED_DELTA_TIME: number;
    /**
     * Time, in seconds, since the last frame.
     */
    static unscaledDeltaTime: number;
    /**
     * Scaled time, in seconds, since the last frame.
     */
    static deltaTime: number;
    /**
     * Time, in seconds, since window opened.  This is not affected by delta time.
     */
    static realtimeSinceStartup: number;
    /**
     * value unscaledDeltaTime is multiplied by to get deltaTime.
     */
    static timeScale: number;
    /**
     * The first scene to run.  Should be a scene that just waits for assets to load.
     */
    static preloadScene: string;
    /**
     * The scene that should load after the game is finished preloading.  This should be defined before Game is initialized.
     */
    static startScene: string;
    /**
     * Gets percent of game assets loaded.  1 means fully loaded.
     * A fully loaded game does not necessarily mean the game is ready to play.  Use Game.gameReady() for that.
     */
    static percentLoaded: number;
    /**
     * Gets if the user input requirement has been satisfied.  Sound won't play until user input is given, so it's best to wait until this is true for the game to start.
     */
    static userInputSatisfied: boolean;
    /**
     * If game is ready to be started (i.e. advance past preloader) with no problems.
     * Essentially this means the game is fully loaded and user input was given.
     */
    static ready: boolean;
    /**
     * gameLoop that runs the game.
     */
    private static gameLoop();
    /**
     * Gets the time passed (in milliseconds) since the window opened.
     */
    private static timeStamp;
    private static userInputAddEventListeners();
    private static userInputRemoveEventListeners();
    private static userInputOnMouseDown(event);
    private static userInputOnKeyDown(event);
    private static userInputOnInput();
    private static userInputAudioContextRunningCallback();
    private static _userInputSatisfied;
    private static initialized;
    private static _canvas;
    private static _context;
    private static _effectsCanvas;
    private static _effectsContext;
    private static lastTimeStamp;
    private static _unscaledDeltaTime;
}
declare namespace Scenes {
    class Preload extends Scene {
        onLoad: () => void;
        onUnload: () => void;
    }
}
declare namespace Scenes {
    class TestScene extends Scene {
        onLoad: () => void;
        onUnload: () => void;
    }
}
declare namespace Scenes {
    class TestScene2 extends Scene {
        onLoad: () => void;
        onUnload: () => void;
    }
}
declare namespace Comps {
    class ArrowTestController extends Component {
        constructor();
        speed: number;
        onStart: () => void;
        onUpdate: () => void;
        onCollisionEnter: (response: Collision.Response) => void;
        onCollisionStay: (response: Collision.Response) => void;
        onCollisionExit: (response: Collision.Response) => void;
        private actor;
    }
}
declare namespace Comps {
    class ArrowTestPlatController extends Component {
        constructor();
        speed: number;
        onStart: () => void;
        onUpdate: () => void;
        onCollisionExit: (response: Collision.Response) => void;
        private platform;
    }
}
declare namespace Comps {
    class ControlCameraWithWASD extends Component {
        constructor();
        onStart: () => void;
        panSpeed: number;
        scaleMult: number;
        onUpdate: () => void;
    }
}
declare namespace Comps {
    class DotGraphic extends DrawerComponent {
        constructor();
        color: string;
        radius: number;
        draw: (context: CanvasRenderingContext2D) => void;
    }
}
declare namespace Comps {
    class DotFollowsMouse extends DotGraphic {
        constructor();
        onUpdate: () => void;
    }
}
declare namespace Comps {
    class FacesMouse extends Component {
        constructor();
        onUpdate: () => void;
    }
}
declare namespace Comps {
    class MovePlatformWithIJKL extends Component {
        constructor();
        speed: number;
        onStart: () => void;
        private platform;
        onUpdate: () => void;
        onDestroy: () => void;
    }
}
declare namespace Comps {
    class Preloader extends BasePreloader {
        constructor();
    }
}
declare namespace Comps {
    class Template extends Component {
        constructor();
        onStart: () => void;
        onUpdate: () => void;
        onDestroy: () => void;
    }
}
declare namespace Comps {
    class TestRectOverlap extends Component {
        constructor();
        onStart: () => void;
        private actor;
        onUpdate: () => void;
        onDestroy: () => void;
    }
}
declare namespace Comps {
    class TestSound extends Component {
        constructor();
        onStart: () => void;
        onUpdate: () => void;
        onDestroy: () => void;
    }
}
declare namespace Comps {
    class Thing2 extends Component {
        constructor();
        pir: PackedImageRenderer;
        child: GameObject;
        childPir: PackedImageRenderer;
        speed: number;
        camSpeed: number;
        onUpdate: () => void;
        messageF: (num: number) => void;
    }
}
declare namespace Prefabs {
    function Sealime(props: TiledMap.Object): GameObject;
}
declare namespace Prefabs {
    function TestPlatform(): GameObject;
}
declare namespace Prefabs {
    function TestPlatform2(): GameObject;
}
declare class ActorGizmo extends DrawerComponent {
    constructor();
    onStart: () => void;
    color: string;
    draw: (context: CanvasRenderingContext2D) => void;
    protected actor: Actor;
}
/**
 * Will automatically attach the bottom of the actor to the top of moving platform objects.
 */
declare class AttachBottom extends Component {
    constructor();
    onStart: () => void;
    onUpdate: () => void;
    onCollisionEnter: (response: Collision.Response) => void;
    onCollisionExit: (response: Collision.Response) => void;
    private actor;
}
declare class RaycastTestGizmo extends DrawerComponent {
    constructor();
    onStart: () => void;
    color: string;
    origin: Vec2;
    direction: Vec2;
    distance: number;
    setAngle: (angleDegrees: number) => void;
    getAngle: () => number;
    private globalOrigin;
    private pt1;
    private globalDirection;
    private identityMatrix;
    onUpdate: () => void;
    private raycastHit;
    draw: (context: CanvasRenderingContext2D) => void;
    protected actor: Actor;
}
declare namespace Prefabs {
    function Thing1(): GameObject;
}
declare namespace Prefabs {
    function Thing2(): GameObject;
}

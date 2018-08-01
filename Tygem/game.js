/// <reference path="_ref.ts" />
class Vec2 {
    constructor(x = 0, y = 0) {
        /**
         * Sets the values of this Vec2.
         */
        this.setValues = (x, y) => {
            this.x = x;
            this.y = y;
        };
        /**
         * Sets the values of the Vec2 from a Vec2
         */
        this.setValuesVec2 = (v) => {
            this.x = v.x;
            this.y = v.y;
        };
        this.equals = (x, y) => {
            return this.x === x && this.y === y;
        };
        this.equalsVec2 = (v) => {
            return this.x === v.x && this.y === v.y;
        };
        /**
         * Resizes the vector to have a magnitude of 1.
         */
        this.normalize = () => {
            let mag = Math.sqrt(this.x * this.x + this.y * this.y);
            if (mag > 0.000001) {
                this.x /= mag;
                this.y /= mag;
            }
        };
        /**
         * Creates a new Vec2 with the same values.
         */
        this.clone = () => {
            return new Vec2(this.x, this.y);
        };
        this.toString = () => {
            return "(" + this.x + ", " + this.y + ")";
        };
        this.x = x;
        this.y = y;
    }
    /**
     * Calculates distance between the two given vectors.
     */
    static distance(v1, v2) {
        return Math.sqrt((v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y));
    }
    /**
     * Calculates the dot product of two vectors.
     */
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
}
/// <reference path="_ref.ts" />
var M;
(function (M) {
    /**
     * Multiply a degree value by this to get its equivalent in radians.
     */
    M.degToRad = 0.017453292519943295;
    /**
     * Multiply a radian value by this to get its equivalent in degrees.
     */
    M.radToDeg = 57.295779513082323;
    /**
     * Epsilon value used for floating point comparisons.
     */
    M.EPSILON = .0001;
    /**
     * Calculates the distance between 2 points.
     * @param v1x x of vector 1
     * @param v1y y of vector 1
     * @param v2x x of vector 2
     * @param v2y y of vector 2
     */
    function distance(v1x, v1y, v2x, v2y) {
        return Math.sqrt((v2x - v1x) * (v2x - v1x) + (v2y - v1y) * (v2y - v1y));
    }
    M.distance = distance;
    /**
     * Calculates the magnitude of a vector.
     * @param vx x of the vector
     * @param vy y of the vector
     */
    function magnitude(vx, vy) {
        return Math.sqrt(vx * vx + vy * vy);
    }
    M.magnitude = magnitude;
    /**
     * Calculates the square of the magnitude of a vector.
     * @param vx x of the vector
     * @param vy y of the vector
     */
    function sqrMagnitude(vx, vy) {
        return vx * vx + vy * vy;
    }
    M.sqrMagnitude = sqrMagnitude;
    /**
     * Calculates the dot product of two vectors.
     * @param ax x of vector a
     * @param ay y of vector a
     * @param bx x of vector b
     * @param by y of vector b
     */
    function dot(ax, ay, bx, by) {
        return ax * bx + ay * by;
    }
    M.dot = dot;
    /**
     * Returns the result of projecting vector a onto vector b.
     * @param ax x of vector a
     * @param ay y of vector a
     * @param bx x of vector b
     * @param by y of vector b
     */
    function vectorProject(ax, ay, bx, by) {
        let s = dot(ax, ay, bx, by) / dot(bx, by, bx, by);
        return new Vec2(s * bx, s * by);
    }
    M.vectorProject = vectorProject;
    /**
     * Calculates x mod y for floats.  Always returns a positive value.
     */
    function fmod(x, y) {
        return x - Math.floor(x / y) * y;
    }
    M.fmod = fmod;
    /**
     * Literally just the classic atan2 function, but takes a Vec2 as an argument.  Returns angle in radians.
     */
    function atan2(v) {
        return Math.atan2(v.y, v.x);
    }
    M.atan2 = atan2;
    /**
     * Wraps a value in [0, 2*PI)
     */
    function wrap2PI(angleRadians) {
        return fmod(angleRadians, Math.PI * 2);
    }
    M.wrap2PI = wrap2PI;
    /**
     * Wraps a value in [-PI, PI)
     */
    function wrapPI(angleRadians) {
        return fmod(angleRadians + Math.PI, Math.PI * 2) - Math.PI;
    }
    M.wrapPI = wrapPI;
    /**
     * Wraps a value in [0, 360)
     */
    function wrap360(angleDegrees) {
        return fmod(angleDegrees, 360);
    }
    M.wrap360 = wrap360;
    /**
     * Wraps a value in [-180, 180)
     */
    function wrap180(angleDegrees) {
        return fmod(angleDegrees + 180, 360) - 180;
    }
    M.wrap180 = wrap180;
    /**
     * Returns the value (in radians) to be added to angleStart to reach angleEnd.  This value is wrappen in [-PI, PI)
     */
    function angleDiffRadians(angleStartRadians, angleEndRadians) {
        return wrapPI(angleEndRadians - angleStartRadians);
    }
    M.angleDiffRadians = angleDiffRadians;
    /**
     * Returns the value (in degrees) to be added to angleStart to reach angleEnd.  This value is wrappen in [-180, 180)
     */
    function angleDiffDegrees(angleStartDegrees, angleEndDegrees) {
        return wrap180(angleEndDegrees - angleStartDegrees);
    }
    M.angleDiffDegrees = angleDiffDegrees;
    /**
     * Given a sector defined by a center angle and spread, return if the given test angle is contained in the sector (all in degrees).
     * @param sectorAngle Angle defining the center of the sector.
     * @param sectorAngleSpread The angular size of the sector.
     * @param testAngle The angle to test if it's contained in the sector.
     */
    function angleInSectorDegrees(sectorAngle, sectorAngleSpread, testAngle) {
        return Math.abs(angleDiffDegrees(testAngle, sectorAngle)) <= sectorAngleSpread / 2;
    }
    M.angleInSectorDegrees = angleInSectorDegrees;
    /**
     * Returns a Vec2 that's the rotation of a given vector around a given point.
     * @param vx x of the vector to rotate.
     * @param vy y of the vector to rotate.
     * @param pointX x of the point to rotate around.
     * @param pointY y of the point to rotate around.
     * @param rotationRadians Angle to rotate, in radians.
     */
    function rotateAroundPoint(vx, vy, pointX, pointY, rotationRadians) {
        let ret = new Vec2();
        let c = Math.cos(rotationRadians);
        let s = Math.sin(rotationRadians);
        ret.x = pointX + (vx - pointX) * c - (vy - pointY) * s;
        ret.y = pointY + (vx - pointX) * s + (vy - pointY) * c;
        return ret;
    }
    M.rotateAroundPoint = rotateAroundPoint;
    /**
     * Returns the point on the line defined by lineP0 and lineP1 that is closest to the given point.
     * @param lineP0x x of the first point that defines the line.
     * @param lineP0y y of the first point that defines the line.
     * @param lineP1x x of the other point that defines the line.
     * @param lineP1y y of the other point that defines the line.
     * @param pointX x of the point to consider.
     * @param pointY y of the point to consider.
     */
    function pointOnLineClosestToPoint(lineP0x, lineP0y, lineP1x, lineP1y, pointX, pointY) {
        let ret = vectorProject(pointX - lineP0x, pointY - lineP0y, lineP1x - lineP0x, lineP1y - lineP0y);
        ret.x += lineP0x;
        ret.y += lineP0y;
        return ret;
    }
    M.pointOnLineClosestToPoint = pointOnLineClosestToPoint;
    /**
     * Calculates the intersection points between circle 1 and circle 2.  Returns array of the 2 Vec2 intersections.  If there are no intersections, null is returned.
     * @param c1x x of circle 1
     * @param c1y y of circle 1
     * @param r1 radius of circle 1
     * @param c2x x of circle 2
     * @param c2y y of circle 2
     * @param r2 radius of circle 2
     */
    function circleCircleIntersection(c1x, c1y, r1, c2x, c2y, r2) {
        let d = distance(c1x, c1y, c2x, c2y);
        if (d > r1 + r2)
            return null;
        if (d < Math.abs(r1 - r2))
            return null;
        let a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
        let h = Math.sqrt(r1 * r1 - a * a);
        let p2x = c1x + a * (c2x - c1x) / d;
        let p2y = c1y + a * (c2y - c1y) / d;
        return [
            new Vec2(p2x + h * (c2y - c1y) / d, p2y - h * (c2x - c1x) / d),
            new Vec2(p2x - h * (c2y - c1y) / d, p2y + h * (c2x - c1x) / d)
        ];
    }
    M.circleCircleIntersection = circleCircleIntersection;
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
    function lineCircleIntersection(lineP0x, lineP0y, lineP1x, lineP1y, cx, cy, r) {
        let mid = pointOnLineClosestToPoint(lineP0x, lineP0y, lineP1x, lineP1y, cx, cy);
        let dist2 = r * r - sqrMagnitude(cx - mid.x, cy - mid.y);
        if (dist2 < 0)
            return null;
        let s = Math.sqrt(dist2 / sqrMagnitude(lineP1x - lineP0x, lineP1y - lineP0y));
        let diffX = (lineP1x - lineP0x) * s;
        let diffY = (lineP1y - lineP0y) * s;
        return [
            new Vec2(mid.x - diffX, mid.y - diffY),
            new Vec2(mid.x + diffX, mid.y + diffY)
        ];
    }
    M.lineCircleIntersection = lineCircleIntersection;
    /**
     * Given elements in a line, all spaced a specified distance from each other, with the average displacement being 0, what's the position of each element?
     * @param spacing Distance between each element.
     * @param index Index of the given element.
     * @param numElements Total number of elements
     */
    function centeredSpacing(spacing, index, numElements) {
        if (numElements <= 1)
            return 0;
        return (index - (numElements - 1) / 2) * spacing;
    }
    M.centeredSpacing = centeredSpacing;
    /**
     * Returns of vector 2 is position clockwise to vector 1
     * @param v1x x of vector 1
     * @param v1y y of vector 1
     * @param v2x x of vector 2
     * @param v2y y of vector 2
     */
    function isClockwise(v1x, v1y, v2x, v2y) {
        return -v1x * v2y + v1y * v2x > 0;
    }
    M.isClockwise = isClockwise;
    /**
     * Returns the angle (in radians) formed from the two given vectors.
     * @param v0x x of the first vector to compare.
     * @param v0y y of the first vector to compare.
     * @param v1x x of the other vector to compare.
     * @param v1y y of the other vector to compare.
     */
    function angleBetweenVectors(v0x, v0y, v1x, v1y) {
        return Math.acos(dot(v0x, v0y, v1x, v1y) / (magnitude(v0x, v0y) * magnitude(v1x, v1y)));
    }
    M.angleBetweenVectors = angleBetweenVectors;
    /**
     * Returns the normal (with magnitude of 1) of the given vector.  If looking in the direction of the given vector, the normal will face to the "left".
     * @param vx x of the vector
     * @param vy y of the vector
     */
    function normalVector(vx, vy) {
        let ret = new Vec2(-vy, vx);
        ret.normalize();
        return ret;
    }
    M.normalVector = normalVector;
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
    function linesParallel(line0P0x, line0P0y, line0P1x, line0P1y, line1P0x, line1P0y, line1P1x, line1P1y) {
        return !isFinite(lineLineIntersection(line0P0x, line0P0y, line0P1x, line0P1y, line1P0x, line1P0y, line1P1x, line1P1y));
    }
    M.linesParallel = linesParallel;
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
    function lineLineIntersection(line0P0x, line0P0y, line0P1x, line0P1y, line1P0x, line1P0y, line1P1x, line1P1y) {
        let line0x = line0P1x - line0P0x;
        let line0y = line0P1y - line0P0y;
        let perpLine1x = line1P0y - line1P1y;
        let perpLine1y = line1P1x - line1P0x;
        let div = dot(perpLine1x, perpLine1y, line0x, line0y);
        if (Math.abs(div) < M.EPSILON) {
            // lines are parallel
            return Number.POSITIVE_INFINITY;
        }
        return dot(perpLine1x, perpLine1y, line1P0x - line0P0x, line1P0y - line0P0y) / div;
    }
    M.lineLineIntersection = lineLineIntersection;
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
    function lineLineIntersectionPoint(line0P0x, line0P0y, line0P1x, line0P1y, line1P0x, line1P0y, line1P1x, line1P1y) {
        let t = lineLineIntersection(line0P0x, line0P0y, line0P1x, line0P1y, line1P0x, line1P0y, line1P1x, line1P1y);
        if (!isFinite(t))
            return null;
        return new Vec2(line0P0x + (line0P1x - line0P0x) * t, line0P0y + (line0P1y - line0P0y) * t);
    }
    M.lineLineIntersectionPoint = lineLineIntersectionPoint;
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
    function rayLineIntersection(rayOriginX, rayOriginY, rayDirectionX, rayDirectionY, lineP0x, lineP0y, lineP1x, lineP1y, rayDistance = Number.POSITIVE_INFINITY) {
        let t = lineLineIntersection(rayOriginX, rayOriginY, rayOriginX + rayDirectionX, rayOriginY + rayDirectionY, lineP0x, lineP0y, lineP1x, lineP1y);
        if (!isFinite(t))
            return -1; // lines are parallel
        if (t <= -M.EPSILON)
            return -1; // ray would hit before the origin
        if (rayDistance > 0 && !isFinite(rayDistance)) {
            // ray is infinite, sure to hit line
            return t;
        }
        // ray isn't infinte, check if intersection would happen within the rayDistance
        let directionMagnitude = sqrMagnitude(rayDirectionX, rayDirectionY);
        if (Math.abs(directionMagnitude - 1) >= M.EPSILON) {
            // direction wasn't normalized
            directionMagnitude = Math.sqrt(directionMagnitude);
        }
        let intersectDistance = directionMagnitude * t;
        if (intersectDistance <= rayDistance + M.EPSILON)
            return t;
        return -1;
    }
    M.rayLineIntersection = rayLineIntersection;
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
    function raySegmentIntersection(rayOriginX, rayOriginY, rayDirectionX, rayDirectionY, segmentP0x, segmentP0y, segmentP1x, segmentP1y, rayDistance = Number.POSITIVE_INFINITY) {
        let t = rayLineIntersection(rayOriginX, rayOriginY, rayDirectionX, rayDirectionY, segmentP0x, segmentP0y, segmentP1x, segmentP1y, rayDistance);
        if (t == -1)
            return -1;
        // check that intersect point is contained in the segment
        let px = rayOriginX + rayDirectionX * t;
        let py = rayOriginY + rayDirectionY * t;
        if (Math.min(segmentP0x, segmentP1x) - M.EPSILON < px && px < Math.max(segmentP0x, segmentP1x) + M.EPSILON &&
            Math.min(segmentP0y, segmentP1y) - M.EPSILON < py && py < Math.max(segmentP0y, segmentP1y) + M.EPSILON) {
            return t;
        }
        return -1;
    }
    M.raySegmentIntersection = raySegmentIntersection;
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
    function rayVerticalSegmentIntersection(rayOriginX, rayOriginY, rayDirectionX, rayDirectionY, segmentX, segmentP0y, segmentP1y, rayDistance = Number.POSITIVE_INFINITY) {
        // vertical ray won't intersect
        if (Math.abs(rayDirectionX) < M.EPSILON)
            return -1;
        let t = (segmentX - rayOriginX) / rayDirectionX;
        if (t <= -M.EPSILON)
            return -1;
        // check that intersect point is contained in the segment
        let py = rayOriginY + rayDirectionY * t;
        if (Math.min(segmentP0y, segmentP1y) - M.EPSILON < py && py < Math.max(segmentP0y, segmentP1y) + M.EPSILON) {
            return t;
        }
        return -1;
    }
    M.rayVerticalSegmentIntersection = rayVerticalSegmentIntersection;
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
    function rayHorizontalSegmentIntersection(rayOriginX, rayOriginY, rayDirectionX, rayDirectionY, segmentY, segmentP0x, segmentP1x, rayDistance = Number.POSITIVE_INFINITY) {
        // horizontal ray won't intersect
        if (Math.abs(rayDirectionY) < M.EPSILON)
            return -1;
        let t = (segmentY - rayOriginY) / rayDirectionY;
        if (t <= -M.EPSILON)
            return -1;
        // check that intersect point is contained in the segment
        let px = rayOriginX + rayDirectionX * t;
        if (Math.min(segmentP0x, segmentP1x) - M.EPSILON < px && px < Math.max(segmentP0x, segmentP1x) + M.EPSILON) {
            return t;
        }
        return -1;
    }
    M.rayHorizontalSegmentIntersection = rayHorizontalSegmentIntersection;
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
    function segmentSegmentIntersection(segment0P0x, segment0P0y, segment0P1x, segment0P1y, segment1P0x, segment1P0y, segment1P1x, segment1P1y) {
        let t = raySegmentIntersection(segment0P0x, segment0P0y, segment0P1x - segment0P0x, segment0P1y - segment0P0y, segment1P0x, segment1P0y, segment1P1x, segment1P1y);
        if (t == -1)
            return -1;
        if (t > 1)
            return -1;
        return t;
    }
    M.segmentSegmentIntersection = segmentSegmentIntersection;
    /**
     * Given a line defined by p0 and p1, returns if the point is to the left of the line ("left" when facing p1 from p0).
     * @param lineP0x x of the first point that defines the line
     * @param lineP0y y of the first point that defines the line.
     * @param lineP1x x of the other point that defines the line.
     * @param lineP1y y of the other point that defines the line.
     * @param pointX x of the point to test.
     * @param pointY y of the point to test.
     */
    function pointToLeft(lineP0x, lineP0y, lineP1x, lineP1y, pointX, pointY) {
        return ((lineP1x - lineP0x) * (pointY - lineP0y) - (lineP1y - lineP0y) * (pointX - lineP0x)) > 0;
    }
    M.pointToLeft = pointToLeft;
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
    function pointsOnSameSideOfLine(lineP0x, lineP0y, lineP1x, lineP1y, point0x, point0y, point1x, point1y) {
        return pointToLeft(lineP0x, lineP0y, lineP1x, lineP1y, point0x, point0y) == pointToLeft(lineP0x, lineP0y, lineP1x, lineP1y, point1x, point1y);
    }
    M.pointsOnSameSideOfLine = pointsOnSameSideOfLine;
    /**
     * Given a line, returns the point on the line with the given x coordinate.  Returns positive infinity if the line is vertical.
     * @param lineP0x x of the first point that defines the line
     * @param lineP0y y of the first point that defines the line.
     * @param lineP1x x of the other point that defines the line.
     * @param lineP1y y of the other point that defines the line.
     * @param x the x coordinate to consider
     */
    function yFromXOnLine(lineP0x, lineP0y, lineP1x, lineP1y, x) {
        if (Math.abs(lineP1x - lineP0x) < M.EPSILON)
            return Number.POSITIVE_INFINITY;
        let slope = (lineP1y - lineP0y) / (lineP1x - lineP0x);
        let yInt = lineP0y - slope * lineP0x;
        return slope * x + yInt;
    }
    M.yFromXOnLine = yFromXOnLine;
    /**
     * Given a line, returns the point on the line with the given y coordinate.  Returns positive infinity if the line is horizontal.
     * @param lineP0x x of the first point that defines the line
     * @param lineP0y y of the first point that defines the line.
     * @param lineP1x x of the other point that defines the line.
     * @param lineP1y y of the other point that defines the line.
     * @param y the y coordinate to consider
     */
    function xFromYOnLine(lineP0x, lineP0y, lineP1x, lineP1y, y) {
        if (Math.abs(lineP1y - lineP0y) < M.EPSILON)
            return Number.POSITIVE_INFINITY;
        let invSlope = (lineP1x - lineP0x) / (lineP1y - lineP0y);
        let xInt = lineP0x - invSlope * lineP0y;
        return invSlope * y + xInt;
    }
    M.xFromYOnLine = xFromYOnLine;
})(M || (M = {}));
/// <reference path="_ref.ts" />
class Rect {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.setValues = (x, y, width, height) => {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        };
        this.clone = () => {
            return new Rect(this.x, this.y, this.width, this.height);
        };
        this.toString = () => {
            return "x: " + this.x + " y: " + this.y + " width: " + this.width + " height: " + this.height;
        };
        /**
            * Returns if this rectangle overlaps the given rectangle.
            */
        this.overlaps = (rect) => {
            if (this.x + this.width < rect.x)
                return false;
            if (rect.x + rect.width < this.x)
                return false;
            if (this.y + this.height < rect.y)
                return false;
            if (rect.y + rect.height < this.y)
                return false;
            return true;
        };
        /**
            * Returns if this rectangle contains the given point.
            */
        this.containsPoint = (x, y) => {
            return this.x <= x && x <= this.x + this.width &&
                this.y <= y && y <= this.y + this.height;
        };
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
/// <reference path="_ref.ts" />
/**
* Matrix used for 2D transformations, e.g. setting the transform of CanvasRenderingContext2D.
*/
class Matrix2x3 {
    constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
        /**
         * Sets this to the identity matrix.
         */
        this.setIdentity = () => {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.e = 0;
            this.f = 0;
        };
        /**
         * Sets all values of this matrix at once.
         */
        this.setValues = (a, b, c, d, e, f) => {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.e = e;
            this.f = f;
        };
        /**
         * Sets all values of this matrix at once, from the given matrix.
         */
        this.setValuesFromMatrix = (m) => {
            this.a = m.a;
            this.b = m.b;
            this.c = m.c;
            this.d = m.d;
            this.e = m.e;
            this.f = m.f;
        };
        /**
         * Returns a clone of this matrix.
         */
        this.clone = () => {
            let ret = new Matrix2x3();
            ret.setValues(this.a, this.b, this.c, this.d, this.e, this.f);
            return ret;
        };
        /**
         * Multiplies current matrix by new matrix values.
         */
        this.multiply = (a2, b2, c2, d2, e2, f2) => {
            let a1 = this.a;
            let b1 = this.b;
            let c1 = this.c;
            let d1 = this.d;
            let e1 = this.e;
            let f1 = this.f;
            this.a = a1 * a2 + c1 * b2;
            this.b = b1 * a2 + d1 * b2;
            this.c = a1 * c2 + c1 * d2;
            this.d = b1 * c2 + d1 * d2;
            this.e = a1 * e2 + c1 * f2 + e1;
            this.f = b1 * e2 + d1 * f2 + f1;
        };
        /**
         * Inverts this matrix in place (doesn't return anything).
         */
        this.invert = () => {
            let a = this.a;
            let b = this.b;
            let c = this.c;
            let d = this.d;
            let e = this.e;
            let f = this.f;
            let dt = (a * d - b * c);
            this.a = d / dt;
            this.b = -b / dt;
            this.c = -c / dt;
            this.d = a / dt;
            this.e = (c * f - d * e) / dt;
            this.f = -(a * f - b * e) / dt;
        };
        /**
         * Scales this matrix by the given scale x and scale y.
         */
        this.scale = (sx, sy) => {
            this.multiply(sx, 0, 0, sy, 0, 0);
        };
        /**
         * Rotates this matrix by the given angle, in radians.
         */
        this.rotate = (angleRadians) => {
            let cos = Math.cos(angleRadians);
            let sin = Math.sin(angleRadians);
            this.multiply(cos, sin, -sin, cos, 0, 0);
        };
        /**
         * Translates this matrix by the given amount.
         */
        this.translate = (tx, ty) => {
            this.multiply(1, 0, 0, 1, tx, ty);
        };
        /**
         * Transforms the given point in place, modifying it.
         */
        this.transformVec2 = (v) => {
            let vx = v.x;
            let vy = v.y;
            v.x = vx * this.a + vy * this.c + this.e;
            v.y = vx * this.b + vy * this.d + this.f;
        };
        /**
         * matrix order (used by canvas):
         *   ace
         *   bdf
         *   001
         */
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.e = 0;
        this.f = 0;
        this.toString = () => {
            return "a: " + this.a + " b: " + this.b + " c: " + this.c + " d: " + this.d + " e: " + this.e + " f: " + this.f;
        };
        this.setValues(a, b, c, d, e, f);
    }
    /**
     * The identity matrix.
     */
    static get identity() { return Matrix2x3._identity; }
}
Matrix2x3._identity = new Matrix2x3();
/// <reference path="_ref.ts" />
var Material;
(function (Material) {
    /**
     * Adds the given material object.
     * @param name Name of the material.
     * @param object Generic object containing properties of the material.
     */
    function addMaterial(name, object) {
        if (materialDictionary.hasOwnProperty(name)) {
            console.error("Material " + name + " not added because there already exists a material with that name.");
            return;
        }
        materialDictionary[name] = object;
    }
    Material.addMaterial = addMaterial;
    /**
     * Gets the material object with the given name.  Returns null (and displays an error) if the material doesn't exist.
     * @param name Name given to the material when added with addMaterial().
     */
    function getMaterial(name) {
        if (!materialDictionary.hasOwnProperty(name)) {
            console.error("Material " + name + " has not been added.");
            return null;
        }
        return materialDictionary[name];
    }
    Material.getMaterial = getMaterial;
    /**
     * Gets property of a material.
     * @param materialName Name of the material.
     * @param propertyName Name of the property.
     * @param defaultValue The value that's returned if propertyName is not defined by the material.
     */
    function getProperty(materialName, propertyName, defaultValue = "") {
        let mat = getMaterial(materialName);
        if (mat === null || !mat.hasOwnProperty(propertyName)) {
            return defaultValue;
        }
        return mat[propertyName];
    }
    Material.getProperty = getProperty;
    /**
     * Gets property of a material as a number.  Does not check if the value is a number first.
     * @param materialName Name of the material.
     * @param propertyName Name of the property.
     * @param defaultValue The value that's returned if propertyName is not defined by the material.
     */
    function getNumber(materialName, propertyName, defaultValue = 0) {
        let mat = getMaterial(materialName);
        if (mat === null || !mat.hasOwnProperty(propertyName)) {
            return defaultValue;
        }
        return Number.parseFloat(mat[propertyName]);
    }
    Material.getNumber = getNumber;
    let materialDictionary = {};
})(Material || (Material = {}));
/// <reference path="_ref.ts" />
// based on https://github.com/deanm/css-color-parser-js by Dean McNamee
class ColorParser {
    constructor() {
        /**
         * red value of color.  Integer from [0, 255].
         */
        this.r = 0;
        /**
         * green value of color.  Integer from [0, 255].
         */
        this.g = 0;
        /**
         * blue value of color.  Integer from [0, 255].
         */
        this.b = 0;
        /**
         * alpha value of color.  Number from [0, 1].
         */
        this.alpha = 1;
        /**
         * Parses a CSS color string.  If the parse is successful, rgb and alpha values are stored here in this ColorParser instance.
         * Examples: "rgb(255, 128, 12)", "rgba(255, 128, 12, 0.5)", "#fff", "#ff0011", "slateblue", "hsla(900, 15%, 90%, 0.5)", "hsl(900, 15%, 90%)"
         * Returns true if parse was successful, false if there was a problem.
         */
        this.parseCSSColor = (cssStr) => {
            // Remove all whitespace, not compliant, but should just be more accepting.
            let str = cssStr.replace(/ /g, '').toLowerCase();
            // Color keywords (and transparent) lookup.
            if (str in ColorParser.kCSSColorTable) {
                let colorInfo = ColorParser.kCSSColorTable[str];
                this.r = colorInfo[0];
                this.g = colorInfo[1];
                this.b = colorInfo[2];
                this.alpha = colorInfo[3];
                return true;
            }
            // #abc and #abc123 syntax.
            if (str[0] === '#') {
                if (str.length === 4) {
                    var iv = parseInt(str.substr(1), 16); // TODO(deanm): Stricter parsing.
                    if (!(iv >= 0 && iv <= 0xfff))
                        return false; // Covers NaN.
                    this.r = ((iv & 0xf00) >> 4) | ((iv & 0xf00) >> 8);
                    this.g = (iv & 0xf0) | ((iv & 0xf0) >> 4);
                    this.b = (iv & 0xf) | ((iv & 0xf) << 4);
                    this.alpha = 1;
                    return true;
                }
                else if (str.length === 7) {
                    var iv = parseInt(str.substr(1), 16); // TODO(deanm): Stricter parsing.
                    if (!(iv >= 0 && iv <= 0xffffff))
                        return false; // Covers NaN.
                    this.r = (iv & 0xff0000) >> 16;
                    this.g = (iv & 0xff00) >> 8;
                    this.b = iv & 0xff;
                    this.alpha = 1;
                    return true;
                }
                return false;
            }
            let op = str.indexOf('('), ep = str.indexOf(')');
            if (op !== -1 && ep + 1 === str.length) {
                let fname = str.substr(0, op);
                let params = str.substr(op + 1, ep - (op + 1)).split(',');
                let alpha = 1; // To allow case fallthrough.
                switch (fname) {
                    case 'rgba':
                        if (params.length !== 4)
                            return false;
                        alpha = ColorParser.parse_css_float(params.pop());
                    // Fall through.
                    case 'rgb':
                        if (params.length !== 3)
                            return false;
                        this.r = ColorParser.parse_css_int(params[0]);
                        this.g = ColorParser.parse_css_int(params[1]);
                        this.b = ColorParser.parse_css_int(params[2]);
                        this.alpha = alpha;
                        return true;
                    case 'hsla':
                        if (params.length !== 4)
                            return false;
                        alpha = ColorParser.parse_css_float(params.pop());
                    // Fall through.
                    case 'hsl':
                        if (params.length !== 3)
                            return false;
                        let h = (((parseFloat(params[0]) % 360) + 360) % 360) / 360; // 0 .. 1
                        // NOTE(deanm): According to the CSS spec s/l should only be
                        // percentages, but we don't bother and let float or percentage.
                        let s = ColorParser.parse_css_float(params[1]);
                        let l = ColorParser.parse_css_float(params[2]);
                        let m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
                        let m1 = l * 2 - m2;
                        this.r = ColorParser.clamp_css_byte(ColorParser.css_hue_to_rgb(m1, m2, h + 1 / 3) * 255);
                        this.g = ColorParser.clamp_css_byte(ColorParser.css_hue_to_rgb(m1, m2, h) * 255);
                        this.b = ColorParser.clamp_css_byte(ColorParser.css_hue_to_rgb(m1, m2, h - 1 / 3) * 255);
                        this.alpha = alpha;
                        return true;
                    default:
                        return false;
                }
            }
            return false;
        };
        /**
         * Returns the color as a css string.
         * rgba() format, or rgb() if alpha is 1.
         */
        this.toString = () => {
            if (this.alpha == 1) {
                return "rgb(" +
                    ColorParser.clamp_css_byte(this.r) + ", " +
                    ColorParser.clamp_css_byte(this.g) + ", " +
                    ColorParser.clamp_css_byte(this.b) + ")";
            }
            return "rgba(" +
                ColorParser.clamp_css_byte(this.r) + ", " +
                ColorParser.clamp_css_byte(this.g) + ", " +
                ColorParser.clamp_css_byte(this.b) + ", " +
                ColorParser.clamp_css_float(this.alpha) + ")";
        };
    }
    static clamp_css_byte(i) {
        i = Math.round(i); // Seems to be what Chrome does (vs truncation).
        return i < 0 ? 0 : i > 255 ? 255 : i;
    }
    static clamp_css_float(f) {
        return f < 0 ? 0 : f > 1 ? 1 : f;
    }
    static parse_css_int(str) {
        if (str[str.length - 1] === '%')
            return ColorParser.clamp_css_byte(parseFloat(str) / 100 * 255);
        return ColorParser.clamp_css_byte(parseInt(str));
    }
    static parse_css_float(str) {
        if (str[str.length - 1] === '%')
            return ColorParser.clamp_css_float(parseFloat(str) / 100);
        return ColorParser.clamp_css_float(parseFloat(str));
    }
    static css_hue_to_rgb(m1, m2, h) {
        if (h < 0)
            h += 1;
        else if (h > 1)
            h -= 1;
        if (h * 6 < 1)
            return m1 + (m2 - m1) * h * 6;
        if (h * 2 < 1)
            return m2;
        if (h * 3 < 2)
            return m1 + (m2 - m1) * (2 / 3 - h) * 6;
        return m1;
    }
}
ColorParser.kCSSColorTable = {
    "transparent": [0, 0, 0, 0], "aliceblue": [240, 248, 255, 1],
    "antiquewhite": [250, 235, 215, 1], "aqua": [0, 255, 255, 1],
    "aquamarine": [127, 255, 212, 1], "azure": [240, 255, 255, 1],
    "beige": [245, 245, 220, 1], "bisque": [255, 228, 196, 1],
    "black": [0, 0, 0, 1], "blanchedalmond": [255, 235, 205, 1],
    "blue": [0, 0, 255, 1], "blueviolet": [138, 43, 226, 1],
    "brown": [165, 42, 42, 1], "burlywood": [222, 184, 135, 1],
    "cadetblue": [95, 158, 160, 1], "chartreuse": [127, 255, 0, 1],
    "chocolate": [210, 105, 30, 1], "coral": [255, 127, 80, 1],
    "cornflowerblue": [100, 149, 237, 1], "cornsilk": [255, 248, 220, 1],
    "crimson": [220, 20, 60, 1], "cyan": [0, 255, 255, 1],
    "darkblue": [0, 0, 139, 1], "darkcyan": [0, 139, 139, 1],
    "darkgoldenrod": [184, 134, 11, 1], "darkgray": [169, 169, 169, 1],
    "darkgreen": [0, 100, 0, 1], "darkgrey": [169, 169, 169, 1],
    "darkkhaki": [189, 183, 107, 1], "darkmagenta": [139, 0, 139, 1],
    "darkolivegreen": [85, 107, 47, 1], "darkorange": [255, 140, 0, 1],
    "darkorchid": [153, 50, 204, 1], "darkred": [139, 0, 0, 1],
    "darksalmon": [233, 150, 122, 1], "darkseagreen": [143, 188, 143, 1],
    "darkslateblue": [72, 61, 139, 1], "darkslategray": [47, 79, 79, 1],
    "darkslategrey": [47, 79, 79, 1], "darkturquoise": [0, 206, 209, 1],
    "darkviolet": [148, 0, 211, 1], "deeppink": [255, 20, 147, 1],
    "deepskyblue": [0, 191, 255, 1], "dimgray": [105, 105, 105, 1],
    "dimgrey": [105, 105, 105, 1], "dodgerblue": [30, 144, 255, 1],
    "firebrick": [178, 34, 34, 1], "floralwhite": [255, 250, 240, 1],
    "forestgreen": [34, 139, 34, 1], "fuchsia": [255, 0, 255, 1],
    "gainsboro": [220, 220, 220, 1], "ghostwhite": [248, 248, 255, 1],
    "gold": [255, 215, 0, 1], "goldenrod": [218, 165, 32, 1],
    "gray": [128, 128, 128, 1], "green": [0, 128, 0, 1],
    "greenyellow": [173, 255, 47, 1], "grey": [128, 128, 128, 1],
    "honeydew": [240, 255, 240, 1], "hotpink": [255, 105, 180, 1],
    "indianred": [205, 92, 92, 1], "indigo": [75, 0, 130, 1],
    "ivory": [255, 255, 240, 1], "khaki": [240, 230, 140, 1],
    "lavender": [230, 230, 250, 1], "lavenderblush": [255, 240, 245, 1],
    "lawngreen": [124, 252, 0, 1], "lemonchiffon": [255, 250, 205, 1],
    "lightblue": [173, 216, 230, 1], "lightcoral": [240, 128, 128, 1],
    "lightcyan": [224, 255, 255, 1], "lightgoldenrodyellow": [250, 250, 210, 1],
    "lightgray": [211, 211, 211, 1], "lightgreen": [144, 238, 144, 1],
    "lightgrey": [211, 211, 211, 1], "lightpink": [255, 182, 193, 1],
    "lightsalmon": [255, 160, 122, 1], "lightseagreen": [32, 178, 170, 1],
    "lightskyblue": [135, 206, 250, 1], "lightslategray": [119, 136, 153, 1],
    "lightslategrey": [119, 136, 153, 1], "lightsteelblue": [176, 196, 222, 1],
    "lightyellow": [255, 255, 224, 1], "lime": [0, 255, 0, 1],
    "limegreen": [50, 205, 50, 1], "linen": [250, 240, 230, 1],
    "magenta": [255, 0, 255, 1], "maroon": [128, 0, 0, 1],
    "mediumaquamarine": [102, 205, 170, 1], "mediumblue": [0, 0, 205, 1],
    "mediumorchid": [186, 85, 211, 1], "mediumpurple": [147, 112, 219, 1],
    "mediumseagreen": [60, 179, 113, 1], "mediumslateblue": [123, 104, 238, 1],
    "mediumspringgreen": [0, 250, 154, 1], "mediumturquoise": [72, 209, 204, 1],
    "mediumvioletred": [199, 21, 133, 1], "midnightblue": [25, 25, 112, 1],
    "mintcream": [245, 255, 250, 1], "mistyrose": [255, 228, 225, 1],
    "moccasin": [255, 228, 181, 1], "navajowhite": [255, 222, 173, 1],
    "navy": [0, 0, 128, 1], "oldlace": [253, 245, 230, 1],
    "olive": [128, 128, 0, 1], "olivedrab": [107, 142, 35, 1],
    "orange": [255, 165, 0, 1], "orangered": [255, 69, 0, 1],
    "orchid": [218, 112, 214, 1], "palegoldenrod": [238, 232, 170, 1],
    "palegreen": [152, 251, 152, 1], "paleturquoise": [175, 238, 238, 1],
    "palevioletred": [219, 112, 147, 1], "papayawhip": [255, 239, 213, 1],
    "peachpuff": [255, 218, 185, 1], "peru": [205, 133, 63, 1],
    "pink": [255, 192, 203, 1], "plum": [221, 160, 221, 1],
    "powderblue": [176, 224, 230, 1], "purple": [128, 0, 128, 1],
    "rebeccapurple": [102, 51, 153, 1],
    "red": [255, 0, 0, 1], "rosybrown": [188, 143, 143, 1],
    "royalblue": [65, 105, 225, 1], "saddlebrown": [139, 69, 19, 1],
    "salmon": [250, 128, 114, 1], "sandybrown": [244, 164, 96, 1],
    "seagreen": [46, 139, 87, 1], "seashell": [255, 245, 238, 1],
    "sienna": [160, 82, 45, 1], "silver": [192, 192, 192, 1],
    "skyblue": [135, 206, 235, 1], "slateblue": [106, 90, 205, 1],
    "slategray": [112, 128, 144, 1], "slategrey": [112, 128, 144, 1],
    "snow": [255, 250, 250, 1], "springgreen": [0, 255, 127, 1],
    "steelblue": [70, 130, 180, 1], "tan": [210, 180, 140, 1],
    "teal": [0, 128, 128, 1], "thistle": [216, 191, 216, 1],
    "tomato": [255, 99, 71, 1], "turquoise": [64, 224, 208, 1],
    "violet": [238, 130, 238, 1], "wheat": [245, 222, 179, 1],
    "white": [255, 255, 255, 1], "whitesmoke": [245, 245, 245, 1],
    "yellow": [255, 255, 0, 1], "yellowgreen": [154, 205, 50, 1]
};
/// <reference path="_ref.ts" />
class Transform {
    constructor() {
        /**
         * Gets this transform's parent, or null if has no parent.
         */
        this.getParent = () => {
            return this.parent;
        };
        /**
         * Sets a new parent.  Set to null to remove from previous parent.  Does not change the local transform.
         * @param parent The transform's new parent.  Cannot be undefined.  Cannot be this own transform nor a child of this transform.
         */
        this.setParent = (parent) => {
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
            if (this.parent === parent)
                return;
            // remove child from old parent
            if (this.parent !== null) {
                let index = this.parent.children.indexOf(this);
                this.parent.children.splice(index, 1);
            }
            // set new parent
            this.parent = parent;
            // add child to new parent
            if (this.parent !== null) {
                this.parent.children.push(this);
            }
        };
        /**
         * Returns an array of all the children of this transform (shallow copy).
         */
        this.getChildren = () => {
            return this.children.slice();
        };
        /**
         * Gets if this is a child of the given transform (checking upwards through the hierarchy of parents).
         */
        this.isChildOf = (parent) => {
            if (parent == null)
                return false;
            if (this == parent)
                return false;
            let trans = this;
            while (trans !== null) {
                if (trans.getParent() === parent) {
                    return true;
                }
                trans = trans.getParent();
            }
            return false;
        };
        /**
         * Reference to a GameObject.  Please don't change.
         */
        this.gameObject = null;
        /**
         * x position of the transform in the local space.
         */
        this.x = 0;
        /**
         * y position of the transform in the local space.
         */
        this.y = 0;
        /**
         * Rotation of the transform, in degrees, in the local space.
         */
        this.rotation = 0;
        /**
         * scale x of the transform in the local space.
         */
        this.scaleX = 1;
        /**
         * scale y of the transform in the local space.
         */
        this.scaleY = 1;
        /**
         * Gets position of this transform in the global space.
         * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
         */
        this.getGlobalPosition = (outPos = null) => {
            this.updateGlobalMatrix();
            if (outPos == null) {
                // return position as new Vec2
                this.tempVec2.setValues(0, 0);
                this.globalMatrix.transformVec2(this.tempVec2);
                return this.tempVec2.clone();
            }
            else {
                // fill outPos with the position
                outPos.setValues(0, 0);
                this.globalMatrix.transformVec2(outPos);
                return null;
            }
        };
        /**
         * Sets position of this transform in the global space.
         */
        this.setGlobalPosition = (x, y) => {
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
        };
        /**
         * Gets rotation (degrees) of this transfrom in the global space.
         * Calculated by adding up all the rotations in the parent transforms.  Is this correct?
         */
        this.getGlobalRotation = () => {
            let ret = 0;
            let trans = this;
            while (trans !== null) {
                ret += trans.rotation;
                trans = trans.parent;
            }
            return ret;
        };
        /**
         * Sets rotation (degrees) of this transform in the global space.
         * Calculated by subtracting all the rotations in the parent transforms.  Is this correct?
         */
        this.setGlobalRotation = (rotationDegrees) => {
            let parentRot = 0;
            let trans = this.parent;
            while (trans !== null) {
                parentRot += trans.rotation;
            }
            this.rotation = rotationDegrees - parentRot;
        };
        /**
         * Takes a point in local space, and returns its equivalent position in the global space.
         * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
         */
        this.localToGlobal = (x, y, outPos = null) => {
            this.updateGlobalMatrix();
            if (outPos === null) {
                let v = new Vec2(x, y);
                this.globalMatrix.transformVec2(v);
                return v;
            }
            else {
                outPos.setValues(x, y);
                this.globalMatrix.transformVec2(outPos);
                return null;
            }
        };
        /**
         * Takes a point in global space, and returns its equivalent position in the local space.
         * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
         */
        this.globalToLocal = (x, y, outPos = null) => {
            this.updateInverseGlobalMatrix();
            if (outPos === null) {
                let v = new Vec2(x, y);
                this.inverseGlobalMatrix.transformVec2(v);
                return v;
            }
            else {
                outPos.setValues(x, y);
                this.inverseGlobalMatrix.transformVec2(outPos);
                return null;
            }
        };
        /**
         * Gets a clone of the local transformation matrix.
         */
        this.getLocalMatrix = () => {
            this.updateLocalMatrix();
            return this.localMatrix.clone();
        };
        /**
         * Gets a clone of the combained transformation matrices to the root.
         */
        this.getGlobalMatrix = () => {
            this.updateGlobalMatrix();
            return this.globalMatrix.clone();
        };
        /**
         * Gets a clone of the inverse of the combained transformation matrices to the root.
         */
        this.getInverseGlobalMatrix = () => {
            this.updateInverseGlobalMatrix();
            return this.inverseGlobalMatrix.clone();
        };
        /**
         * Multiplies the given matrix by the global matrix.  The given matrix is modified; this function returns nothing.
         */
        this.multiplyByGlobalMatrix = (matrix) => {
            this.updateGlobalMatrix();
            matrix.multiply(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.e, this.globalMatrix.f);
        };
        /**
         * Updates localMatrix based on translation, rotation, scale (in that order)
         */
        this.updateLocalMatrix = () => {
            this.localMatrix.setIdentity();
            this.localMatrix.translate(this.x, this.y);
            this.localMatrix.rotate(this.rotation * 0.017453292519943295);
            this.localMatrix.scale(this.scaleX, this.scaleY);
        };
        /**
         * Updates globalMatrix by consecutively multiplying parent's local matrices (from root parent to here)
         */
        this.updateGlobalMatrix = () => {
            this.updateLocalMatrix();
            let tm = this.tempMatrix;
            let gm = this.globalMatrix;
            gm.setValuesFromMatrix(this.localMatrix);
            let p = this.parent;
            while (p !== null) {
                p.updateLocalMatrix();
                let pTM = p.localMatrix;
                tm.setValuesFromMatrix(pTM);
                tm.multiply(gm.a, gm.b, gm.c, gm.d, gm.e, gm.f);
                gm.setValuesFromMatrix(tm);
                p = p.parent;
            }
        };
        /**
         * Updates inverseGlobalMatrix to be the inverse of globalMatrix.
         */
        this.updateInverseGlobalMatrix = () => {
            this.updateGlobalMatrix();
            let m = this.globalMatrix;
            this.inverseGlobalMatrix.setValues(m.a, m.b, m.c, m.d, m.e, m.f);
            this.inverseGlobalMatrix.invert();
        };
        this.localMatrix = new Matrix2x3(); // must be updated with updateLocalMatrix();
        this.globalMatrix = new Matrix2x3(); // must be updated with updateGlobalMatrix();
        this.inverseGlobalMatrix = new Matrix2x3(); // must be updated with updateInverseGlobalMatrix();
        this.tempMatrix = new Matrix2x3(); // used for calculations
        this.tempVec2 = new Vec2(); // used for calculations
        this.parent = null;
        this.children = [];
    }
}
/// <reference path="_ref.ts" />
class SaveBox {
    constructor() {
        /**
            * Index used to differentiate multiple save files.
            */
        this.fileIndex = 0;
        /**
            * Sets a boolean value.
            */
        this.setBool = (key, value) => {
            this.bools[key] = value;
        };
        /**
            * Gets a boolean value.
            * @param defaultValue If the given key doesn't exist, this value will be returned instead.
            */
        this.getBool = (key, defaultValue = false) => {
            if (!this.bools.hasOwnProperty(key))
                return defaultValue;
            return this.bools[key];
        };
        /**
            * Sets a number value.
            */
        this.setNumber = (key, value) => {
            this.numbers[key] = value;
        };
        /**
            * Gets a number value.
            * @param defaultValue If the given key doesn't exist, this value will be returned instead.
            */
        this.getNumber = (key, defaultValue = 0) => {
            if (!this.numbers.hasOwnProperty(key))
                return defaultValue;
            return this.numbers[key];
        };
        /**
            * Sets a string value.
            */
        this.setString = (key, value) => {
            this.strings[key] = value;
        };
        /**
            * Converts the given object to a JSON string, then saves it as a string.
            */
        this.setStringObject = (key, value) => {
            this.strings[key] = JSON.stringify(value);
        };
        /**
            * Gets a string value.
            * @param defaultValue If the given key doesn't exist, this value will be returned instead.
            */
        this.getString = (key, defaultValue = "") => {
            if (!this.strings.hasOwnProperty(key))
                return defaultValue;
            return this.strings[key];
        };
        /**
            * Gets a string value, parses it into a JSON object and returns it.
            * @param defaultValue If the given key doesn't exist, this value will be returned instead.
            */
        this.getStringObject = (key, defaultValue = undefined) => {
            if (!this.strings.hasOwnProperty(key))
                return defaultValue;
            return JSON.parse(this.strings[key]);
        };
        /**
            * Returns the value stored at the given index for the given bool list.  If the index is invalid, defaultValue is returned.
            */
        this.getBoolListElement = (key, index, defaultValue = false) => {
            if (!this.boolLists.hasOwnProperty(key))
                return defaultValue;
            let boolList = this.boolLists[key];
            if (index < 0 || index >= boolList.length)
                return defaultValue;
            return boolList[index];
        };
        /**
            * Returns a copy of the stored bool list.
            */
        this.getBoolListElements = (key, defaultValue = []) => {
            if (!this.boolLists.hasOwnProperty(key))
                return defaultValue;
            let boolList = this.boolLists[key];
            return boolList.concat([]);
        };
        /**
            * Returns count of the given bool list, or 0 if list does not exist.
            */
        this.getBoolListCount = (key) => {
            if (!this.boolLists.hasOwnProperty(key))
                return 0;
            return this.boolLists[key].length;
        };
        /**
            * Sets all elements of the bool list (clearing the elements that were there originally).
            */
        this.setBoolListElements = (key, values) => {
            let boolList = null;
            if (this.boolLists.hasOwnProperty(key)) {
                boolList = this.boolLists[key];
            }
            else {
                boolList = [];
                this.boolLists[key] = boolList;
            }
            boolList.splice(0, boolList.length);
            for (let i = 0; i < values.length; i++) {
                boolList.push(values[i]);
            }
        };
        /**
            * Pushes the given element to the end of the specified bool list.  Automatically creates the list if it's not made already.
            */
        this.addBoolListElement = (key, value) => {
            if (!this.boolLists.hasOwnProperty(key))
                this.boolLists[key] = [];
            this.boolLists[key].push(value);
        };
        /**
            * Returns the value stored at the given index for the given number list.  If the index is invalid, defaultValue is returned.
            */
        this.getNumberListElement = (key, index, defaultValue = 0) => {
            if (!this.numberLists.hasOwnProperty(key))
                return defaultValue;
            let numberList = this.numberLists[key];
            if (index < 0 || index >= numberList.length)
                return defaultValue;
            return numberList[index];
        };
        /**
            * Returns a copy of the stored number list.
            */
        this.getNumberListElements = (key, defaultValue = []) => {
            if (!this.numberLists.hasOwnProperty(key))
                return defaultValue;
            let numberList = this.numberLists[key];
            return numberList.concat([]);
        };
        /**
            * Returns count of the given number list, or 0 if list does not exist.
            */
        this.getNumberListCount = (key) => {
            if (!this.numberLists.hasOwnProperty(key))
                return 0;
            return this.numberLists[key].length;
        };
        /**
            *  Returns if the given value is contained in the given number list.
            */
        this.getNumberListContains = (key, value) => {
            if (!this.numberLists.hasOwnProperty(key))
                return false;
            return this.numberLists[key].indexOf(value) != -1;
        };
        /**
            * Sets all elements of the number list (clearing the elements that were there originally).
            */
        this.setNumberListElements = (key, values) => {
            let numberList = null;
            if (this.numberLists.hasOwnProperty(key)) {
                numberList = this.numberLists[key];
            }
            else {
                numberList = [];
                this.numberLists[key] = numberList;
            }
            numberList.splice(0, numberList.length);
            for (let i = 0; i < values.length; i++) {
                numberList.push(values[i]);
            }
        };
        /**
            * Pushes the given element to the end of the specified number list.  Automatically creates the list if it's not made already.
            * @param ignoreIfDuplicate When set to true, first checks to see if the number is already in the list.  If it is, the number is not added again.
            */
        this.addNumberListElement = (key, value, ignoreIfDuplicate = false) => {
            if (ignoreIfDuplicate) {
                if (this.getNumberListContains(key, value))
                    return;
            }
            if (!this.numberLists.hasOwnProperty(key))
                this.numberLists[key] = [];
            this.numberLists[key].push(value);
        };
        /**
            * Gets when this SaveBox was last saved (to a string or to localStorage).
            */
        this.getDateSaved = () => {
            return new Date(this.dateSaved.getTime());
        };
        /**
            * Clears everything.
            */
        this.clearAll = () => {
            this.bools = {};
            this.numbers = {};
            this.strings = {};
            this.boolLists = {};
            this.numberLists = {};
        };
        /**
            * Returns this saveBox converted to a string.
            */
        this.saveToString = () => {
            // getto string builder
            let sb = [];
            // datetime saved (milliseconds since epoch)
            this.dateSaved = new Date();
            sb.push("" + this.dateSaved.getTime(), SaveBox.newLine);
            // bools
            sb.push(JSON.stringify(this.bools), SaveBox.newLine);
            // numbers
            sb.push(JSON.stringify(this.numbers), SaveBox.newLine);
            // strings
            sb.push(SaveBox.sourceToValid(JSON.stringify(this.strings)), SaveBox.newLine);
            // bool lists
            sb.push(JSON.stringify(this.boolLists), SaveBox.newLine);
            // number lists
            sb.push(JSON.stringify(this.numberLists), SaveBox.newLine);
            // get checksum of "string builder"
            let checksum = SaveBox.getChecksumFromArrStr(sb);
            // append checksum in front
            sb.unshift(checksum + SaveBox.newLine);
            return sb.join("");
        };
        /**
            * Loads data from the given string.  Returns false if there was a problem.
            */
        this.loadFromString = (str) => {
            this.clearAll();
            // trim checksum
            let index = str.indexOf(SaveBox.newLine);
            if (index == -1)
                return false;
            let checksumStr = str.substring(0, index);
            let checksum = Number(checksumStr);
            if (isNaN(checksum))
                return false;
            // get content
            let content = str.substring(index + 1);
            // check checksum of content
            if (checksum != SaveBox.getChecksumFromStr(content))
                return false;
            // parse content
            let lines = content.split(SaveBox.newLine);
            this.dateSaved = new Date(Number(lines[0]));
            this.bools = JSON.parse(lines[1]);
            this.numbers = JSON.parse(lines[2]);
            this.strings = JSON.parse(SaveBox.validToSource(lines[3]));
            this.boolLists = JSON.parse(lines[4]);
            this.numberLists = JSON.parse(lines[5]);
            return true;
        };
        /**
            * Converts this saveBox to a string, then sets it to getLocalStorageKey() in localStorage.  Returns false if there was a problem.
            */
        this.saveToLocalStorage = () => {
            if (localStorage === undefined)
                return false;
            localStorage.setItem(SaveBox.getLocalStorageKey(this.fileIndex), this.saveToString());
            return true;
        };
        /**
            * Loads a string of key getLocalStorageKey() from localStorage, then parses it into this saveBox.  Returns false if there was a problem.
            */
        this.loadFromLocalStorage = () => {
            if (localStorage === undefined)
                return false;
            let str = localStorage.getItem(SaveBox.getLocalStorageKey(this.fileIndex));
            if (str == null)
                return false;
            return this.loadFromString(str);
        };
        /**
            * Creates a copy of this saveBox and returns it.  This does NOT save the clone to a file.
            */
        this.clone = (newFileIndex) => {
            let ret = new SaveBox();
            if (newFileIndex == this.fileIndex) {
                console.warn("fileIndex of clone is the same as the current file index");
            }
            ret.fileIndex = newFileIndex;
            ret.loadFromString(this.saveToString());
            return ret;
        };
        this.dateSaved = new Date(0);
        this.bools = {};
        this.numbers = {};
        this.strings = {};
        this.boolLists = {};
        this.numberLists = {};
    }
    /**
        * Gets a list of indexes of save files currently stored in localStorage.
        */
    static getSaveFileIndices() {
        let ret = [];
        if (localStorage == undefined)
            return ret;
        let key = "";
        let index = -1;
        for (let i = 0; i < localStorage.length; i++) {
            key = localStorage.key(i);
            index = key.indexOf(SaveBox.saveboxPrefix);
            if (index == -1)
                continue;
            index = Number(key.substring(index + SaveBox.saveboxPrefix.length));
            if (isNaN(index))
                continue;
            ret.push(index);
        }
        return ret;
    }
    /**
        * Creates a new SaveBox with a fileIndex that doesn't match any other save file.  The created SaveBox is NOT saved to a file.
        */
    static createNewSaveBox() {
        let existingSaveFiles = SaveBox.getSaveFileIndices();
        // find index that doesn't collide
        let fileIndex = existingSaveFiles.length;
        let collision = true;
        while (collision) {
            // check collisions
            collision = false;
            for (let i = 0; i < existingSaveFiles.length; i++) {
                if (existingSaveFiles[i] == fileIndex) {
                    collision = true;
                    break;
                }
            }
            if (collision) {
                fileIndex++;
            }
        }
        // create new SaveBox
        let saveBox = new SaveBox();
        saveBox.fileIndex = fileIndex;
        return saveBox;
    }
    /**
        * Creates a SaveBox loaded from localStorage with the given file index.  Returns null if there was a problem (e.g. if there's no file with the given index)
        */
    static openSaveBox(fileIndex) {
        let saveBox = new SaveBox();
        saveBox.fileIndex = fileIndex;
        let status = saveBox.loadFromLocalStorage();
        if (!status)
            return null;
        return saveBox;
    }
    /**
        * Deletes the saveBox file with the given fileIndex from local storage.
        */
    static deleteSaveBox(fileIndex) {
        if (localStorage == undefined)
            return;
        localStorage.removeItem(SaveBox.getLocalStorageKey(fileIndex));
    }
    /**
        * Gets the key used when saving a SaveBox with the given fileIndex to localStorage.
        */
    static getLocalStorageKey(fileIndex) {
        return SaveBox.saveboxPrefix + fileIndex;
    }
    /**
        * Sums up characters of the given "string builder"
        */
    static getChecksumFromArrStr(sb) {
        let ret = 0;
        for (let i = 0; i < sb.length; i++) {
            for (let j = 0; j < sb[i].length; j++) {
                ret += sb[i].charCodeAt(j);
            }
        }
        return ret;
    }
    static getChecksumFromStr(str) {
        let ret = 0;
        for (let i = 0; i < str.length; i++) {
            ret += str.charCodeAt(i);
        }
        return ret;
    }
    /**
        * Returns the given string with all invalid characters replaced with %x, making it valid.  If the string contains no invalid characters, nothing is changed.
        */
    static sourceToValid(str) {
        let s = SaveBox.replaceAll(str, "%", "%0");
        s = SaveBox.replaceAll(s, SaveBox.newLine, "%1");
        s = SaveBox.replaceAll(s, SaveBox.separator1, "%2");
        s = SaveBox.replaceAll(s, SaveBox.separator2, "%3");
        return s;
    }
    /**
        * Returns the given string with all %x sequences replaced with their invalid characters.
        */
    static validToSource(str) {
        let s = SaveBox.replaceAll(str, "%3", SaveBox.separator2);
        s = SaveBox.replaceAll(s, "%2", SaveBox.separator1);
        s = SaveBox.replaceAll(s, "%1", SaveBox.newLine);
        s = SaveBox.replaceAll(s, "%0", "%");
        return s;
    }
    /**
        * str.replace(), but works correctly.
        */
    static replaceAll(str, searchValue, replaceValue) {
        let sv = searchValue.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var re = new RegExp(sv, 'g');
        return str.replace(re, replaceValue);
    }
}
SaveBox.saveboxPrefix = "savebox";
SaveBox.newLine = "|";
SaveBox.separator1 = "<";
SaveBox.separator2 = ">";
/// <reference path="_ref.ts" />
class Keys {
    /**
     * Initializes Keys.  To be called at the start of Game.
     * @param document The webpage document, which event listeners will be added to.
     */
    static _initialize(document) {
        if (Keys.initialized) {
            console.warn("Keys already initialized");
            return;
        }
        document.addEventListener("keydown", Keys.keyDown);
        document.addEventListener("keyup", Keys.keyUp);
        Keys.initialized = true;
    }
    /**
     * Gets if the key was pressed this frame.
     */
    static keyPressed(key) {
        return Keys.keyCodePressed(key);
    }
    /**
     * Gets if the key with the given key code was pressed this frame.
     */
    static keyCodePressed(keyCode) {
        return Keys.keysPressed.indexOf(keyCode) != -1;
    }
    /**
     * Gets if the key is being held.
     */
    static keyHeld(key) {
        return Keys.keyCodeHeld(key);
    }
    /**
     * Gets if the key with the given key code is being held.
     */
    static keyCodeHeld(keyCode) {
        return Keys.keysHeld.indexOf(keyCode) != -1;
    }
    /**
     * Gets if the key was released this frame.
     */
    static keyReleased(key) {
        return Keys.keyCodeReleased(key);
    }
    /**
     * Gets if the key with the given key code was released this frame.
     */
    static keyCodeReleased(keyCode) {
        return Keys.keysReleased.indexOf(keyCode) != -1;
    }
    /**
     * Gets a string representation of the given Key.
     */
    static keyToString(key) {
        let s = Key[key];
        return s;
    }
    /**
     * Gets the key codes of all the keys that were pressed this frame.
     */
    static getKeyCodesPressed() {
        return Keys.keysPressed.concat([]);
    }
    /**
     * To be called late in the game loop by Game.
     */
    static _lateUpdate() {
        // clear key records
        Keys.keysPressed.splice(0);
        Keys.keysReleased.splice(0);
    }
    static keyDown(event) {
        // prevent space and arrow keys from scrolling the screen around
        if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
            event.preventDefault();
        }
        if (Keys.keysHeld.indexOf(event.keyCode) != -1)
            // key was already being held down.  Return to prevent additional keypresses when holding down a key for a while
            return;
        if (Keys.keysPressed.indexOf(event.keyCode) == -1) {
            Keys.keysPressed.push(event.keyCode);
        }
        if (Keys.keysHeld.indexOf(event.keyCode) == -1) {
            Keys.keysHeld.push(event.keyCode);
        }
        // fullscreen.  Should be moved to a menu at some point
        if (event.keyCode == Key.F10) {
            if (Game.isFullscreen) {
                Game.exitFullscreen();
            }
            else {
                Game.requestFullscreen();
            }
        }
    }
    static keyUp(event) {
        if (Keys.keysReleased.indexOf(event.keyCode) == -1) {
            Keys.keysReleased.push(event.keyCode);
        }
        let index = Keys.keysHeld.indexOf(event.keyCode);
        if (index != -1) {
            Keys.keysHeld.splice(index, 1);
        }
    }
}
Keys.initialized = false;
Keys.keysPressed = [];
Keys.keysHeld = [];
Keys.keysReleased = [];
var Key;
(function (Key) {
    Key[Key["Backspace"] = 8] = "Backspace";
    Key[Key["Tab"] = 9] = "Tab";
    Key[Key["Enter"] = 13] = "Enter";
    Key[Key["Shift"] = 16] = "Shift";
    Key[Key["Ctrl"] = 17] = "Ctrl";
    Key[Key["Alt"] = 18] = "Alt";
    Key[Key["PauseBreak"] = 19] = "PauseBreak";
    Key[Key["CapsLock"] = 20] = "CapsLock";
    Key[Key["Escape"] = 27] = "Escape";
    Key[Key["Space"] = 32] = "Space";
    Key[Key["PageUp"] = 33] = "PageUp";
    Key[Key["PageDown"] = 34] = "PageDown";
    Key[Key["End"] = 35] = "End";
    Key[Key["Home"] = 36] = "Home";
    Key[Key["LeftArrow"] = 37] = "LeftArrow";
    Key[Key["UpArrow"] = 38] = "UpArrow";
    Key[Key["RightArrow"] = 39] = "RightArrow";
    Key[Key["DownArrow"] = 40] = "DownArrow";
    Key[Key["Insert"] = 45] = "Insert";
    Key[Key["Delete"] = 46] = "Delete";
    Key[Key["Num0"] = 48] = "Num0";
    Key[Key["Num1"] = 49] = "Num1";
    Key[Key["Num2"] = 50] = "Num2";
    Key[Key["Num3"] = 51] = "Num3";
    Key[Key["Num4"] = 52] = "Num4";
    Key[Key["Num5"] = 53] = "Num5";
    Key[Key["Num6"] = 54] = "Num6";
    Key[Key["Num7"] = 55] = "Num7";
    Key[Key["Num8"] = 56] = "Num8";
    Key[Key["Num9"] = 57] = "Num9";
    Key[Key["A"] = 65] = "A";
    Key[Key["B"] = 66] = "B";
    Key[Key["C"] = 67] = "C";
    Key[Key["D"] = 68] = "D";
    Key[Key["E"] = 69] = "E";
    Key[Key["F"] = 70] = "F";
    Key[Key["G"] = 71] = "G";
    Key[Key["H"] = 72] = "H";
    Key[Key["I"] = 73] = "I";
    Key[Key["J"] = 74] = "J";
    Key[Key["K"] = 75] = "K";
    Key[Key["L"] = 76] = "L";
    Key[Key["M"] = 77] = "M";
    Key[Key["N"] = 78] = "N";
    Key[Key["O"] = 79] = "O";
    Key[Key["P"] = 80] = "P";
    Key[Key["Q"] = 81] = "Q";
    Key[Key["R"] = 82] = "R";
    Key[Key["S"] = 83] = "S";
    Key[Key["T"] = 84] = "T";
    Key[Key["U"] = 85] = "U";
    Key[Key["V"] = 86] = "V";
    Key[Key["W"] = 87] = "W";
    Key[Key["X"] = 88] = "X";
    Key[Key["Y"] = 89] = "Y";
    Key[Key["Z"] = 90] = "Z";
    Key[Key["LeftWindowKey"] = 91] = "LeftWindowKey";
    Key[Key["RightWindowKey"] = 92] = "RightWindowKey";
    Key[Key["SelectKey"] = 93] = "SelectKey";
    Key[Key["Numpad0"] = 96] = "Numpad0";
    Key[Key["Numpad1"] = 97] = "Numpad1";
    Key[Key["Numpad2"] = 98] = "Numpad2";
    Key[Key["Numpad3"] = 99] = "Numpad3";
    Key[Key["Numpad4"] = 100] = "Numpad4";
    Key[Key["Numpad5"] = 101] = "Numpad5";
    Key[Key["Numpad6"] = 102] = "Numpad6";
    Key[Key["Numpad7"] = 103] = "Numpad7";
    Key[Key["Numpad8"] = 104] = "Numpad8";
    Key[Key["Numpad9"] = 105] = "Numpad9";
    Key[Key["Multiply"] = 106] = "Multiply";
    Key[Key["Add"] = 107] = "Add";
    Key[Key["Subtract"] = 109] = "Subtract";
    Key[Key["DecimalPoint"] = 110] = "DecimalPoint";
    Key[Key["Divide"] = 111] = "Divide";
    Key[Key["F1"] = 112] = "F1";
    Key[Key["F2"] = 113] = "F2";
    Key[Key["F3"] = 114] = "F3";
    Key[Key["F4"] = 115] = "F4";
    Key[Key["F5"] = 116] = "F5";
    Key[Key["F6"] = 117] = "F6";
    Key[Key["F7"] = 118] = "F7";
    Key[Key["F8"] = 119] = "F8";
    Key[Key["F9"] = 120] = "F9";
    Key[Key["F10"] = 121] = "F10";
    Key[Key["F11"] = 122] = "F11";
    Key[Key["F12"] = 123] = "F12";
    Key[Key["NumLock"] = 144] = "NumLock";
    Key[Key["ScrollLock"] = 145] = "ScrollLock";
    Key[Key["SemiColon"] = 186] = "SemiColon";
    Key[Key["Equals"] = 187] = "Equals";
    Key[Key["Comma"] = 188] = "Comma";
    Key[Key["Dash"] = 189] = "Dash";
    Key[Key["Period"] = 190] = "Period";
    Key[Key["ForwardSlash"] = 191] = "ForwardSlash";
    Key[Key["Tilde"] = 192] = "Tilde";
    Key[Key["OpenBracket"] = 219] = "OpenBracket";
    Key[Key["ClosedBracket"] = 221] = "ClosedBracket";
    Key[Key["Quote"] = 222] = "Quote";
})(Key || (Key = {}));
/// <reference path="_ref.ts" />
class Mouse {
    /**
     * Initializes Mouse.  To be called at the start of Game.
     * @param document The webpage document, which event listeners will be added to.
     */
    static _initialize(canvas) {
        if (Mouse.initialized) {
            console.warn("Mouse already initialized");
            return;
        }
        Mouse.canvas = canvas;
        canvas.addEventListener("mousedown", Mouse.mouseDown);
        document.addEventListener("mouseup", Mouse.mouseUp);
        canvas.addEventListener("contextmenu", Mouse.preventContextMenu);
        document.addEventListener("mousemove", Mouse.mouseMove);
        Mouse.initialized = true;
    }
    /**
     * The x position of the mouse in the canvas space.
     */
    static get x() {
        return Mouse._mouseX;
    }
    /**
     * The y position of the mouse in the canvas space.
     */
    static get y() {
        return Mouse._mouseY;
    }
    /**
     * Gets if the given button was pressed this frame.
     */
    static buttonPressed(button) {
        return Mouse.buttonsPressed.indexOf(button) !== -1;
    }
    /**
     * Gets if the given button was held this frame.
     */
    static buttonHeld(button) {
        return Mouse.buttonsHeld.indexOf(button) !== -1;
    }
    /**
     * Gets if the given button was released this frame.
     */
    static buttonReleased(button) {
        return Mouse.buttonsReleased.indexOf(button) !== -1;
    }
    static hideCursor() {
        Mouse.canvas.style.cursor = "none";
    }
    static showCursor() {
        Mouse.canvas.style.cursor = "";
    }
    /**
     * To be called late in the game loop by Game.
     */
    static _lateUpdate() {
        // clear button records
        Mouse.buttonsPressed.splice(0);
        Mouse.buttonsReleased.splice(0);
    }
    static mouseDown(event) {
        Mouse.updateMousePosition(event);
        // prevents middle mouse from scrolling
        if ([1, 2].indexOf(event.button) > -1) {
            event.preventDefault();
        }
        if (Mouse.buttonsPressed.indexOf(event.button) == -1) {
            Mouse.buttonsPressed.push(event.button);
        }
        if (Mouse.buttonsHeld.indexOf(event.button) == -1) {
            Mouse.buttonsHeld.push(event.button);
        }
    }
    static mouseUp(event) {
        let index = Mouse.buttonsHeld.indexOf(event.button);
        if (index == -1) {
            // button not previously held
            return;
        }
        Mouse.buttonsHeld.splice(index, 1);
        if (Mouse.buttonsReleased.indexOf(event.button) == -1) {
            Mouse.buttonsReleased.push(event.button);
        }
    }
    static mouseMove(event) {
        Mouse.updateMousePosition(event);
    }
    static preventContextMenu(event) {
        event.preventDefault();
    }
    static updateMousePosition(event) {
        let x = event.pageX;
        let y = event.pageY;
        if (x === undefined) {
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        // should these be using client values instead of offset values?
        Mouse._mouseX = (x - Mouse.canvas.offsetLeft) * Mouse.canvas.width / Mouse.canvas.offsetWidth;
        Mouse._mouseY = (y - Mouse.canvas.offsetTop) * Mouse.canvas.height / Mouse.canvas.offsetHeight;
    }
}
Mouse._mouseX = 0;
Mouse._mouseY = 0;
Mouse.buttonsPressed = [];
Mouse.buttonsHeld = [];
Mouse.buttonsReleased = [];
Mouse.initialized = false;
Mouse.canvas = null;
/// <reference path="_ref.ts" />
/**
* Note that a button must be pressed on the gamepad before it will be recognized.  Pressing the button will send the "gamepadconnected" event.
*/
class Gamepads {
    /**
        * Initializes Gamepad.  To be called at the start of Game.
        * @param window The webpage window, which event listeners will be added to.
        */
    static _initialize(window) {
        if (Gamepads.initialized) {
            console.warn("Gamepads already initialized");
            return;
        }
        window.addEventListener("gamepadconnected", Gamepads.gamepadConnected);
        window.addEventListener("gamepaddisconnected", Gamepads.gamepadDisconnected);
        Gamepads.initialized = true;
    }
    /**
        * Gets if a gamepad is currently connected.
        */
    static isGamepadConnected() {
        return Gamepads.getGamepad() !== null;
    }
    /**
        * Gets if the given button was pressed this frame.
        * @param index Index of the button to check.
        */
    static buttonPressed(index) {
        return Gamepads.buttonsPressed.indexOf(index) !== -1;
    }
    /**
        * Gets if the given button is currently being held.
        * @param index Index of the button to check.
        */
    static buttonHeld(index) {
        return Gamepads.buttonsHeld.indexOf(index) !== -1;
    }
    /**
        * Gets if the given button was released this frame.
        * @param index Index of the button to check.
        */
    static buttonReleased(index) {
        return Gamepads.buttonsReleased.indexOf(index) !== -1;
    }
    /**
        * Gets array of the indexes of the buttons that were pressed this frame.
        */
    static getButtonsPressed() {
        let ret = [];
        Gamepads.copyValues(Gamepads.buttonsPressed, ret);
        return ret;
    }
    /**
        * Gets value [-1, 1] from a gamepad axis.  Returns 0 if the index is out of bounds.
        * @param index Index of the axis to check.
        */
    static axisValue(index) {
        if (index < 0 || index >= Gamepads.axisValues.length)
            return 0;
        let val = Gamepads.axisValues[index];
        if (Math.abs(val) < Gamepads.AXIS_DEAD_ZONE) {
            val = 0;
        }
        return val;
    }
    /**
        * Gets if gamepad axis is currently being held in the positive direction.
        * @param index Index of the axis to check.
        */
    static axisPositiveHeld(index) {
        let val = Gamepads.axisValue(index);
        return val > Gamepads.AXIS_PRESS_THRESHOLD;
    }
    /**
        * Gets if gamepad axis is currently being held in the negative direction.
        * @param index Index of the axis to check.
        */
    static axisNegativeHeld(index) {
        let val = Gamepads.axisValue(index);
        return val < -Gamepads.AXIS_PRESS_THRESHOLD;
    }
    /**
        * Gets if gamepad axis was pressed in the positive direction.
        * @param index Index of the axis to check.
        */
    static axisPositivePressed(index) {
        let val = Gamepads.axisValue(index);
        let prevVal = Gamepads.axisPreviousValue(index);
        return val > Gamepads.AXIS_PRESS_THRESHOLD && prevVal <= Gamepads.AXIS_PRESS_THRESHOLD;
    }
    /**
        * Gets if gamepad axis was pressed in the negative direction.
        * @param index Index of the axis to check.
        */
    static axisNegativePressed(index) {
        let val = Gamepads.axisValue(index);
        let prevVal = Gamepads.axisPreviousValue(index);
        return val < -Gamepads.AXIS_PRESS_THRESHOLD && prevVal >= -Gamepads.AXIS_PRESS_THRESHOLD;
    }
    /**
        * Gets if gamepad axis was released from the positive direction.
        * @param index Index of the axis to check.
        */
    static axisPositiveReleased(index) {
        let val = Gamepads.axisValue(index);
        let prevVal = Gamepads.axisPreviousValue(index);
        return val <= Gamepads.AXIS_PRESS_THRESHOLD && prevVal > Gamepads.AXIS_PRESS_THRESHOLD;
    }
    /**
        * Gets if gamepad axis was released from the negative direction.
        * @param index Index of the axis to check.
        */
    static axisNegativeReleased(index) {
        let val = Gamepads.axisValue(index);
        let prevVal = Gamepads.axisPreviousValue(index);
        return val >= -Gamepads.AXIS_PRESS_THRESHOLD && prevVal < -Gamepads.AXIS_PRESS_THRESHOLD;
    }
    /**
        * Gets array of axes that were positively pressed this frame
        */
    static getAxesPositivePressed() {
        let ret = [];
        for (let index = 0; index < Gamepads.axisValues.length; index++) {
            if (Gamepads.axisPositivePressed(index)) {
                ret.push(index);
            }
        }
        return ret;
    }
    /**
        * Gets array of axes that were negatively pressed this frame
        */
    static getAxesNegativePressed() {
        let ret = [];
        for (let index = 0; index < Gamepads.axisValues.length; index++) {
            if (Gamepads.axisNegativePressed(index)) {
                ret.push(index);
            }
        }
        return ret;
    }
    /**
        * To be called by Game in the gameloop.
        */
    static _earlyUpdate() {
        // clear button and axis values
        Gamepads.buttonsPressed.splice(0);
        Gamepads.copyValues(Gamepads.buttonsHeld, Gamepads.buttonsPreviouslyHeld);
        Gamepads.buttonsHeld.splice(0);
        Gamepads.buttonsReleased.splice(0);
        Gamepads.copyValues(Gamepads.axisValues, Gamepads.axisPreviousValues);
        Gamepads.axisValues.splice(0);
        // getting gamepad
        let gamepad = Gamepads.getGamepad();
        // return if no gamepad connected
        if (gamepad == null)
            return;
        // get buttons currently held
        for (let index = 0; index < gamepad.buttons.length; index++) {
            if (gamepad.buttons[index].pressed) {
                Gamepads.buttonsHeld.push(index);
            }
        }
        // get buttons pressed
        for (let i = 0; i < Gamepads.buttonsHeld.length; i++) {
            let button = Gamepads.buttonsHeld[i];
            if (Gamepads.buttonsPreviouslyHeld.indexOf(button) === -1) {
                Gamepads.buttonsPressed.push(button);
            }
        }
        // get buttons released
        for (let i = 0; i < Gamepads.buttonsPreviouslyHeld.length; i++) {
            let button = Gamepads.buttonsPreviouslyHeld[i];
            if (Gamepads.buttonsHeld.indexOf(button) === -1) {
                Gamepads.buttonsReleased.push(button);
            }
        }
        // get axis values
        Gamepads.copyValues(gamepad.axes, Gamepads.axisValues);
    }
    static gamepadConnected(e) {
        console.log("gamepad connected");
    }
    static gamepadDisconnected(e) {
        console.log("gamepad disconnected");
    }
    static getGamepad() {
        let gamepad = null;
        let gpds = null;
        if (navigator.getGamepads) {
            gpds = navigator.getGamepads();
        }
        else if (navigator.webkitGetGamepads) {
            gpds = navigator.webkitGetGamepads;
        }
        if (gpds && gpds.length > 0) {
            gamepad = gpds[0];
        }
        return gamepad;
    }
    static axisPreviousValue(index) {
        if (index < 0 || index >= Gamepads.axisPreviousValues.length)
            return 0;
        let val = Gamepads.axisPreviousValues[index];
        if (Math.abs(val) < Gamepads.AXIS_DEAD_ZONE) {
            val = 0;
        }
        return val;
    }
    static copyValues(arrFrom, arrTo) {
        arrTo.splice(0);
        for (let i = 0; i < arrFrom.length; i++) {
            arrTo.push(arrFrom[i]);
        }
    }
}
/**
    * If the abs of an axis value is less than this, it is rounded down to 0.
    */
Gamepads.AXIS_DEAD_ZONE = .1;
/**
    * An axis will be considered "held" if the abs of its value is more than this.
    */
Gamepads.AXIS_PRESS_THRESHOLD = .6;
Gamepads.initialized = false;
Gamepads.buttonsPressed = [];
Gamepads.buttonsHeld = [];
Gamepads.buttonsPreviouslyHeld = [];
Gamepads.buttonsReleased = [];
Gamepads.axisValues = [];
Gamepads.axisPreviousValues = [];
/// <reference path="_ref.ts" />
class JSONLoadObject {
    constructor() {
        /**
         * Loads json from the given url.
         */
        this.loadFromUrl = (url, onLoad = null) => {
            if (this.isLoaded()) {
                console.warn("JSON already loaded");
                return;
            }
            this._url = url;
            this._onLoadF = onLoad;
            this.request = new XMLHttpRequest();
            this.request.open("GET", url, true);
            this.request.onload = this.requestOnLoad;
            this.request.send();
        };
        /**
            * Loads (parses) json from the given string.
            */
        this.loadFromString = (jsonString) => {
            if (this.isLoaded()) {
                console.warn("JSON already loaded");
                return;
            }
            this._json = JSON.parse(jsonString);
            this._loaded = true;
        };
        /**
            * Gets the JSON, or null if it hasn't loaded.
            */
        this.getJSON = () => {
            return this._json;
        };
        /**
            * Gets if the JSON is loaded.
            */
        this.isLoaded = () => {
            return this._loaded;
        };
        this._json = null;
        this._url = "";
        this._onLoadF = null;
        this._loaded = false;
        this.request = null;
        this.requestOnLoad = () => {
            if (this.request.status == 200) {
                this._loaded = true;
                this._json = JSON.parse(this.request.responseText);
                JSONManager._numJsonLoaded++;
                if (this._onLoadF !== null) {
                    this._onLoadF(this._json);
                }
            }
            else {
                console.error("JSON \"" + this._url + "\" didn\'t load successfully; error code: " + this.request.status);
            }
        };
    }
}
class JSONManager {
    /**
     * Loads a JSON from the given local url.
     * @param name Key of the json to use when getting it later.
     * @param localPath local url of the JSON.
     * @param onLoad function to call once the JSON has been loaded correctly.
     */
    static addFromUrl(name, localPath, onLoad = null) {
        let n = name.toLowerCase();
        if (JSONManager.jsonExists(n)) {
            console.warn("JSON with name \"" + n + "\" already exists");
            return;
        }
        let jlo = new JSONLoadObject();
        JSONManager.dictionary[n] = jlo;
        JSONManager._numJson++;
        jlo.loadFromUrl(localPath, onLoad);
    }
    /**
     * Loads (parses) a JSON from the given string.
     */
    static addFromString(name, jsonString) {
        let n = name.toLowerCase();
        if (JSONManager.jsonExists(n)) {
            console.warn("JSON with name \"" + n + "\" already exists");
            return;
        }
        let jlo = new JSONLoadObject();
        JSONManager.dictionary[n] = jlo;
        JSONManager._numJson++;
        jlo.loadFromString(jsonString);
    }
    /**
        * Gets if the JSON by the given name has been loaded.
        */
    static getJsonLoaded(name) {
        let n = name.toLowerCase();
        if (!JSONManager.jsonExists(n)) {
            console.warn("There doesn't exist json with the name \"" + n + "\"");
            return false;
        }
        return JSONManager.dictionary[n].isLoaded();
    }
    /**
        * Gets the JSON with the given name.  Returns null if it doesn't exist or hasn't been loaded.
        * @param name
        */
    static getJson(name) {
        let n = name.toLowerCase();
        if (!JSONManager.jsonExists(n)) {
            console.warn("There doesn't exist json with the name \"" + n + "\"");
            return null;
        }
        let jlo = JSONManager.dictionary[n];
        if (!jlo.isLoaded()) {
            console.warn("JSON with the name \"" + n + "\" hasn't been loaded yet.");
            return null;
        }
        return jlo.getJSON();
    }
    /**
     * Returns if there exists in the dictionary a JSON with the given name.
     */
    static jsonExists(name) {
        return JSONManager.dictionary.hasOwnProperty(name.toLowerCase());
    }
    /**
        * Gets the number of JSON loaded.
        */
    static get numJsonLoaded() {
        return JSONManager._numJsonLoaded;
    }
    /**
        * Gets the number of JSON.
        */
    static get numJson() {
        return JSONManager._numJson;
    }
}
JSONManager.dictionary = {};
JSONManager._numJsonLoaded = 0;
JSONManager._numJson = 0;
/// <reference path="_ref.ts" />
var AudioManager;
(function (AudioManager) {
    // Adding Sounds
    /**
     * Loads audio sprites from the json of the given url.  This can only be called once (the json should point to all the audio sprites).
     * @param jsonUrl url pointing to the json mapping the audiosprites.
     */
    function addAudioSprites(jsonUrl) {
        if (JSONManager.jsonExists(jsonUrl)) {
            console.warn("audio sprites " + jsonUrl.toLowerCase() + " already added");
            return;
        }
        if (_addAudioSpritesCalled) {
            console.warn("AudioManager.addAudioSprites() should only be called once.");
            return;
        }
        _addAudioSpritesCalled = true;
        _waitForJsonLoad = true;
        JSONManager.addFromUrl(jsonNameFromURL(jsonUrl), jsonUrl, onJSONLoad);
    }
    AudioManager.addAudioSprites = addAudioSprites;
    // Playing sounds
    /**
     * Play a sound in the SFX sound channel.
     * @param soundFileName The path of the sound before it was packed into the audio sprite.  The .wav extension is optional.
     * @param volume Volume of the sound.  Default is 1.
     * @param pitch Pitch of the sound (playback rate).  Default is 1.
     * @param bypassGeneral Bypass the general SFX channel (affected by general sfx volume) and instead have the sound feed directly into the master SFX channel.  Default is false.
     */
    function playSFX(soundFileName, volume = 1, pitch = 1, bypassGeneral = false) {
        let sourceNode = createSourceNode(soundFileName);
        if (sourceNode === null)
            return;
        // setting pitch
        sourceNode.playbackRate.value = pitch;
        // adding a gain node if volume is specified
        let node = sourceNode;
        if (volume !== 1) {
            let gainNode = _audioContext.createGain();
            gainNode.gain.value = volume;
            node.connect(gainNode);
            node = gainNode;
        }
        // connecting to the main node
        if (bypassGeneral) {
            connectToMasterSFXNode(node);
        }
        else {
            connectToGeneralSFXNode(node);
        }
        // playing sound
        sourceNode.play();
    }
    AudioManager.playSFX = playSFX;
    /**
     * Play sound in the music channel.  Does not stop music currently playing.
     * @param soundFileName The path of the sound before it was packed into the audio sprite.  The .wav extension is optional.
     * @param volume Volume of the sound.  Default is 1.
     * @param pitch Pitch of the sound (playback rate).  Default is 1.
     * @param loop If the sound should be looped.  Default is true.
     * @param loopOffset If looping, this is how long in seconds after the start of the sound it loops back to.  Default is 0.
     * @param bypassGeneral Bypass the general music channel (affected by general music volume) and instead have the sound feed directly into the master music channel.  Default is false.
     */
    function playMusic(soundFileName, volume = 1, pitch = 1, loop = true, loopOffset = 0, bypassGeneral = false) {
        let sourceNode = createSourceNode(soundFileName);
        if (sourceNode === null)
            return;
        // setting pitch
        sourceNode.playbackRate.value = pitch;
        // adding a gain node if volume is specified
        let node = sourceNode;
        if (volume !== 1) {
            let gainNode = _audioContext.createGain();
            gainNode.gain.value = volume;
            node.connect(gainNode);
            node = gainNode;
        }
        // looping
        if (loop) {
            sourceNode.loop = true;
            sourceNode.loopStart = sourceNode.startTime + loopOffset;
        }
        else {
            sourceNode.loop = false;
        }
        // connecting to the main node
        if (bypassGeneral) {
            connectToMusicNode(node);
        }
        else {
            connectToGeneralMusicNode(node);
        }
        // playing sound
        sourceNode.play();
    }
    AudioManager.playMusic = playMusic;
    /**
     * Searches all AudioSpriteSourceNodes to see if there's a node that's playing the given sound.
     * NOTE: Annoyingly calling start() on a node doesn't leave a record of the node playing.  To get around this, never call start(), and instead call play().  The playSFX() and playMusic() functions do this automatically.
     */
    function isSoundPlaying(soundFileName) {
        let sound = getSound(soundFileName);
        if (sound === null) {
            console.error("Sound \"" + soundFileName.toLowerCase() + "\" does not exist.");
            return null;
        }
        for (let i = 0; i < sourceNodes.length; i++) {
            if (sourceNodes[i].fileName === sound.fileName && sourceNodes[i]._playCalled) {
                return true;
            }
        }
        return false;
    }
    AudioManager.isSoundPlaying = isSoundPlaying;
    /**
     * Stops all AudioSpriteSourceNodes that are playing the given sound.
     */
    function stopSound(soundFileName) {
        let sound = getSound(soundFileName);
        if (sound === null) {
            console.error("Sound \"" + soundFileName.toLowerCase() + "\" does not exist.");
            return null;
        }
        for (let i = 0; i < sourceNodes.length; i++) {
            if (sourceNodes[i].fileName === sound.fileName) {
                sourceNodes[i].stop(0);
            }
        }
    }
    AudioManager.stopSound = stopSound;
    /**
     * Stops all created AudioSpriteSourceNodes.
     */
    function stopAllSounds() {
        let tempNodes = sourceNodes.concat([]);
        tempNodes.forEach((node) => {
            node.stop();
        });
    }
    AudioManager.stopAllSounds = stopAllSounds;
    /**
     * Gets the volume of the gain node that all sound effects pass through.  This is a setting that'd be in an options menu.
     */
    function getMasterSFXVolume() {
        return masterSFXGain.gain.value;
    }
    AudioManager.getMasterSFXVolume = getMasterSFXVolume;
    /**
     * Sets the volume of the gain node that all sound effects pass through.  This is a setting that'd be in an options menu.
     */
    function setMasterSFXVolume(volume) {
        masterSFXGain.gain.value = volume;
    }
    AudioManager.setMasterSFXVolume = setMasterSFXVolume;
    /**
     * Gets the volume of the gain node that general sound effects pass through.  This would be set in-game as part of gameplay.
     */
    function getGeneralSFXVolume() {
        return generalSFXGain.gain.value;
    }
    AudioManager.getGeneralSFXVolume = getGeneralSFXVolume;
    /**
     * Sets the volume of the gain node that general sound effects pass through.  This would be set in-game as part of gameplay.
     */
    function setGeneralSFXVolume(volume) {
        generalSFXGain.gain.value = volume;
    }
    AudioManager.setGeneralSFXVolume = setGeneralSFXVolume;
    /**
     * Gets the volume of the gain node that general music passes through.  This would be set in-game as part of gameplay (e.g. fading in/out).
     */
    function getGeneralMusicVolume() {
        return generalMusicGain.gain.value;
    }
    AudioManager.getGeneralMusicVolume = getGeneralMusicVolume;
    /**
     * Sets the volume of the gain node that general music passes through.  This would be set in-game as part of gameplay (e.g. fading in/out).
     */
    function setGeneralMusicVolume(volume) {
        generalMusicGain.gain.value = volume;
    }
    AudioManager.setGeneralMusicVolume = setGeneralMusicVolume;
    /**
     * Gets the volume of the gain node that all music passes through.  This is a setting that'd be in an options menu.
     */
    function getMasterMusicVolume() {
        return masterMusicGain.gain.value;
    }
    AudioManager.getMasterMusicVolume = getMasterMusicVolume;
    /**
     * Sets the volume of the gain node that all music passes through.  This is a setting that'd be in an options menu.
     */
    function setMasterMusicVolume(volume) {
        masterMusicGain.gain.value = volume;
    }
    AudioManager.setMasterMusicVolume = setMasterMusicVolume;
    /**
     * Gets the duration of the given sound.
     * @param fileName The path of the sound before it was packed into the audio sprite.  The .wav extension is optional.
     */
    function getSoundDuration(fileName) {
        let sound = getSound(fileName);
        if (sound === null) {
            console.error("Sound \"" + fileName + "\" does not exist.");
            return 0;
        }
        return soundDictionary[fileName].duration;
    }
    AudioManager.getSoundDuration = getSoundDuration;
    // Playing sounds (advanced)
    /**
     * Extension of AudioBufferSourceNode with a few extra properties.
     */
    class AudioSpriteSourceNode extends AudioBufferSourceNode {
        constructor(...args) {
            super(...args);
            /**
             * Simpler version of start() that automatically uses the correct variables.
             */
            this.play = () => {
                this._playCalled = true;
                if (this.loop)
                    this.start(0, this.startTime);
                else
                    this.start(0, this.startTime, this.duration);
            };
            /**
             * Flag if play() was called.
             */
            this._playCalled = false;
        }
    }
    AudioManager.AudioSpriteSourceNode = AudioSpriteSourceNode;
    /**
     * Creates an AudioBufferSourceNode for the given sound.  The node is not connected to anything.
     * Source nodes can only be played once and are "very inexpensive to create".
     * Automatically sets loopStart and loopEnd to the bounds of the sound within the audio sprite (but does not set loop).
     * Call sourceNode.play() to play the sound at the correct position.
     * IMPORTANT: Do not call sourceNode.start() manually.
     * Returns null if the sound doesn't exist.
     * @param soundFileName The path of the sound before it was packed into the audio sprite.  The .wav extension is optional.
     */
    function createSourceNode(soundFileName) {
        let fn = soundFileName.toLowerCase();
        let sound = getSound(fn);
        if (sound === null) {
            console.error("Sound \"" + fn + "\" does not exist.");
            return null;
        }
        // this compiles, but sourceNode doesn't have properties that AudioSpriteSourceNode defines.
        let sourceNode = _audioContext.createBufferSource();
        sourceNode.fileName = sound.fileName;
        sourceNode.startTime = sound.startTime;
        sourceNode.duration = sound.duration;
        sourceNode._playCalled = false;
        sourceNode.play = () => {
            sourceNode._playCalled = true;
            if (sourceNode.loop)
                sourceNode.start(0, sourceNode.startTime);
            else
                sourceNode.start(0, sourceNode.startTime, sourceNode.duration);
        }; // this is so whack
        sourceNode.buffer = audioSprites[sound.audioSpriteIndex].getAudioBuffer();
        if (sourceNode.buffer === null) {
            console.error("Audio sprite " + sound.audioSpriteIndex + " isn't ready to be played yet.");
            return null;
        }
        sourceNode.loopStart = sound.startTime;
        sourceNode.loopEnd = sound.startTime + sound.duration;
        // add record of source node
        sourceNodes.push(sourceNode);
        sourceNode.addEventListener("ended", audioSourceNodeOnEnd);
        return sourceNode;
    }
    AudioManager.createSourceNode = createSourceNode;
    /**
     * Connects the given AudioNode to the general SFX node.  This lets the node be played, and volume multiplied by the general and master SFX volumes.
     */
    function connectToGeneralSFXNode(audioNode) {
        audioNode.connect(generalSFXGain);
    }
    AudioManager.connectToGeneralSFXNode = connectToGeneralSFXNode;
    /**
     * Connects the given AudioNode to the master SFX node.  This lets the node be played, and volume multiplied by the master SFX volume.
     */
    function connectToMasterSFXNode(audioNode) {
        audioNode.connect(masterSFXGain);
    }
    AudioManager.connectToMasterSFXNode = connectToMasterSFXNode;
    /**
     * Connects the given AudioNode to the general Mmusic node.  This lets the node be played, and volume multiplied by the general and master music volumes.
     */
    function connectToGeneralMusicNode(audioNode) {
        audioNode.connect(generalMusicGain);
    }
    AudioManager.connectToGeneralMusicNode = connectToGeneralMusicNode;
    /**
     * Connects the given AudioNode to the master music node.  This lets the node be played, and volume multiplied by the master music volume.
     */
    function connectToMusicNode(audioNode) {
        audioNode.connect(masterMusicGain);
    }
    AudioManager.connectToMusicNode = connectToMusicNode;
    // Instantiation
    /**
     * Gets number of audio sprites added.
     */
    function getNumAudioSprites() {
        if (_waitForJsonLoad) {
            return audioSprites.length + 1;
        }
        return audioSprites.length;
    }
    AudioManager.getNumAudioSprites = getNumAudioSprites;
    /**
     * Gets number of audio sprites currently ready to be played.
     */
    function getNumAudioSpritesReady() {
        return _numAudioSpritesReady;
    }
    AudioManager.getNumAudioSpritesReady = getNumAudioSpritesReady;
    /**
     * To be called on user input to resume the AudioContext.
     * @param onAudioContextRunCallback Function to be called once the AudioContext resumes, or called immediately if it's already running.
     */
    function userInput(onAudioContextRunCallback) {
        // needs user input to get AudioContext running
        let acAny = _audioContext;
        if (acAny.resume != undefined &&
            acAny.state === "suspended") {
            acAny.resume().then(onAudioContextRunCallback);
        }
        else if (acAny.state == undefined || acAny.state === "running") {
            onAudioContextRunCallback();
        }
    }
    AudioManager.userInput = userInput;
    /**
     * Gets if the audio context is running, which is needed to play sounds.
     * The audio context can only run if userInput() is called from an event function that was triggered by user input.
     */
    function isAudioContextRunning() {
        let acAny = _audioContext;
        if (acAny.state != undefined) {
            return acAny.state === "running";
        }
        return true;
    }
    AudioManager.isAudioContextRunning = isAudioContextRunning;
    /**
     * Directory containing the audio sprites and json file.
     */
    AudioManager.audioSpritesDirectory = "assets/audiosprites/";
    /**
     * Gets the AudioContext used to decode sound.
     */
    function getAudioContext() {
        return _audioContext;
    }
    AudioManager.getAudioContext = getAudioContext;
    /**
     * Gets if the browser can play .ogg files.
     */
    function canPlayOgg() {
        return dummyAudio.canPlayType("audio/ogg; codecs=\"vorbis\"") === "probably";
    }
    AudioManager.canPlayOgg = canPlayOgg;
    // Private
    function jsonNameFromURL(jsonURL) {
        let index = Math.max(jsonURL.lastIndexOf("/"), jsonURL.lastIndexOf("\\"));
        let trimmedStr;
        if (index == -1) {
            trimmedStr = jsonURL;
        }
        else {
            trimmedStr = jsonURL.slice(index + 1);
        }
        index = trimmedStr.lastIndexOf(".");
        trimmedStr = trimmedStr.slice(0, index);
        return trimmedStr;
    }
    function onJSONLoad(json) {
        _waitForJsonLoad = false;
        if (json == null) {
            console.error("Something went wrong with loading the audio sprite json.");
            return;
        }
        if (json.audioSprites == null) {
            console.error("The audioSprites field is null in the audio sprite json.");
            return;
        }
        // create audio sprites
        for (let i = 0; i < json.audioSprites.length; i++) {
            let sourceURL;
            if (canPlayOgg()) {
                sourceURL = json.audioSprites[i].ogg;
            }
            else {
                sourceURL = json.audioSprites[i].mp3;
            }
            if (sourceURL == undefined || sourceURL == "") {
                console.error("Something is wrong with the audioSprites of the audio sprite json.");
                continue;
            }
            sourceURL = AudioManager.audioSpritesDirectory + sourceURL;
            let audioSprite = new AudioSprite(i, sourceURL);
            audioSprites.push(audioSprite);
        }
        // create sounds
        for (let i = 0; i < json.sounds.length; i++) {
            let soundJson = json.sounds[i];
            soundDictionary[soundJson.filename.toLowerCase()] = new Sound(soundJson.filename, soundJson.asIndex, soundJson.startTime, soundJson.duration);
        }
    }
    class AudioSprite {
        constructor(index, url) {
            /**
             * Gets index of this audio sprite.
             */
            this.getIndex = () => {
                return this._index;
            };
            /**
             * Gets source url of this audio sprite.
             */
            this.getUrl = () => {
                return this._url;
            };
            /**
             * If the audio has been loaded.
             */
            this.isLoaded = () => {
                return this._loaded;
            };
            /**
             * If the audio has been decoded.
             */
            this.isDecoded = () => {
                return this._decoded;
            };
            /**
             * If the audio is ready to be played.
             */
            this.isReady = () => {
                return this.isLoaded() && this.isDecoded();
            };
            /**
             * Gets the AudioBuffer for this audio sprite.  Returns null if the sound isn't ready.
             */
            this.getAudioBuffer = () => {
                return this.buffer;
            };
            this._index = 0;
            this._url = "";
            this.buffer = null;
            this.request = new XMLHttpRequest();
            this._loaded = false;
            this._decoded = false;
            this.requestOnLoad = () => {
                if (this.request.status == 200) {
                    this._loaded = true;
                    _audioContext.decodeAudioData(this.request.response, this.decodeSuccess, this.decodeFailure);
                }
                else {
                    console.error("Audio \"" + this._url + "\" didn\'t load successfully; error code:" + this.request.statusText);
                }
            };
            this.decodeSuccess = (buffer) => {
                if (this._decoded)
                    return;
                this.buffer = buffer;
                this._decoded = true;
                _numAudioSpritesReady++;
            };
            this.decodeFailure = () => {
                console.error("Error decoding audio data from \"" + this._url + "\"");
            };
            this._index = index;
            this._url = url;
            // load audio
            this.request.open('GET', url, true);
            this.request.responseType = 'arraybuffer';
            this.request.onload = this.requestOnLoad;
            this.request.send();
        }
    }
    class Sound {
        constructor(fileName, audioSpriteIndex, startTime, duration) {
            this.fileName = "";
            this.audioSpriteIndex = 0;
            this.startTime = 0;
            this.duration = 0;
            this.fileName = fileName;
            this.audioSpriteIndex = audioSpriteIndex;
            this.startTime = startTime;
            this.duration = duration;
        }
    }
    function getSound(soundFileName) {
        let fn;
        let extIndex = soundFileName.lastIndexOf(".");
        if (extIndex === -1) {
            // add wav extension
            fn = (soundFileName + ".wav").toLowerCase();
        }
        else {
            fn = soundFileName.toLowerCase();
        }
        if (!soundDictionary.hasOwnProperty(fn)) {
            return null;
        }
        return soundDictionary[fn];
    }
    let _addAudioSpritesCalled = false;
    let _waitForJsonLoad = false; // used to fudge number of audio sprites so the game doesn't load without them being ready
    let _numAudioSpritesReady = 0;
    let _audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let masterSFXGain = null;
    let masterMusicGain = null;
    let generalSFXGain = null;
    let generalMusicGain = null;
    if (_audioContext == null) {
        console.error("AudioContext could not be created.  This browser does not support this game's audio.");
    }
    else {
        // setting up nodes to link sound through
        masterSFXGain = _audioContext.createGain();
        masterSFXGain.connect(_audioContext.destination);
        generalSFXGain = _audioContext.createGain();
        generalSFXGain.connect(masterSFXGain);
        masterMusicGain = _audioContext.createGain();
        masterMusicGain.connect(_audioContext.destination);
        generalMusicGain = _audioContext.createGain();
        generalMusicGain.connect(masterMusicGain);
    }
    let dummyAudio = new Audio(); // only used to check if the browser can play .ogg files or not.
    let audioSprites = [];
    let soundDictionary = {};
    let sourceNodes = []; // record of source nodes formed.  Are removed when the source nodes stop playing.
    function audioSourceNodeOnEnd(e) {
        let sourceNode = e.target;
        let index = sourceNodes.indexOf(sourceNode);
        if (index !== -1) {
            sourceNodes.splice(index, 1);
        }
        sourceNode.removeEventListener("ended", audioSourceNodeOnEnd);
    }
})(AudioManager || (AudioManager = {}));
/// <reference path="_ref.ts" />
var TexPackManager;
(function (TexPackManager) {
    /**
     * An image that has been packed with the texture packer.
     */
    class PackedImage {
        constructor() {
            /**
             * The original filename of the image.
             */
            this.filename = "";
            /**
             * The texture atlas image to draw from.
             */
            this.atlasImage = null;
            /**
             * Returns true if the atlas image has been loaded (and can be drawn from).
             */
            this.isLoaded = () => {
                return this._textureAtlas.isLoaded();
            };
            /**
             * x of the rectangle of the texture atlas that contains the image.
             */
            this.frameX = 0;
            /**
             * y of the rectangle of the texture atlas that contains the image.
             */
            this.frameY = 0;
            /**
             * width of the rectangle of the texture atlas that contains the image.
             */
            this.frameWidth = 0;
            /**
             * height of the rectangle of the texture atlas that contains the image.
             */
            this.frameHeight = 0;
            /**
             * Reference to the JSON defining the frame from the texture packer.
             */
            this.frameJSON = null;
            /**
             * How much was trimmed off the left side when the image was packed.
             */
            this.trimLeft = 0;
            /**
             * How much was trimmed off the top side when the image was packed.
             */
            this.trimTop = 0;
            /**
             * How much was trimmed off the right side when the image was packed.
             */
            this.trimRight = 0;
            /**
             * How much was trimmed off the bottom side when the image was packed.
             */
            this.trimBottom = 0;
            /**
             * Gets the width of the original image before it was packed and trimmed.
             */
            this.getOriginalWidth = () => {
                return this.trimLeft + this.frameWidth + this.trimRight;
            };
            /**
             * Gets the height of the original image before it was packed and trimmed.
             */
            this.getOriginalHeight = () => {
                return this.trimTop + this.frameHeight + this.trimBottom;
            };
            this._textureAtlas = null;
        }
    }
    TexPackManager.PackedImage = PackedImage;
    /**
     * Loads a texture pack from the given url.
     * @param packJsonUrl url pointing to the texture pack.
     */
    function addTexturePack(packJsonUrl) {
        if (JSONManager.jsonExists(packJsonUrl)) {
            console.warn("texture pack " + packJsonUrl.toLowerCase() + " already added");
            return;
        }
        _numTexPacks++;
        JSONManager.addFromUrl(jsonNameFromURL(packJsonUrl), packJsonUrl, onJSONLoad);
    }
    TexPackManager.addTexturePack = addTexturePack;
    /**
     * Gets an image that has been packed into a texture packer.
     * @param filename The path of the image before it was packed.
     */
    function getPackedImage(filename) {
        let fn = filename.toLowerCase();
        if (packedImageDictionary.hasOwnProperty(fn)) {
            return packedImageDictionary[fn];
        }
        else {
            console.warn("packed image " + fn + " has not been added");
            return null;
        }
    }
    TexPackManager.getPackedImage = getPackedImage;
    /**
     * Directory containing the texpack texture images and json files.
     * Capitalization matters when getting images in the web browser.
     */
    TexPackManager.texpacksDirectory = "Assets/Texpacks/";
    /**
     * Gets the number of texture packs added.
     */
    function getNumTexPacks() {
        return _numTexPacks;
    }
    TexPackManager.getNumTexPacks = getNumTexPacks;
    /**
     * Gets the number of texture packs loaded.
     */
    function getNumTexPacksLoaded() {
        return _numTexPacksLoaded;
    }
    TexPackManager.getNumTexPacksLoaded = getNumTexPacksLoaded;
    /**
     * Writes all packed image filenames to the console.
     */
    function consoleLogAllPackedImages() {
        console.log(packedImageDictionary);
    }
    TexPackManager.consoleLogAllPackedImages = consoleLogAllPackedImages;
    function jsonNameFromURL(jsonURL) {
        let index = Math.max(jsonURL.lastIndexOf("/"), jsonURL.lastIndexOf("\\"));
        let trimmedStr;
        if (index == -1) {
            trimmedStr = jsonURL;
        }
        else {
            trimmedStr = jsonURL.slice(index + 1);
        }
        index = trimmedStr.lastIndexOf(".");
        trimmedStr = trimmedStr.slice(0, index);
        return trimmedStr;
    }
    function onJSONLoad(json) {
        if (json == null) {
            console.error("Something went wrong with loading a texture packer json.");
            return;
        }
        if (json.meta == null || json.meta.image == null || json.meta.image == "") {
            console.error("image url could not be found on the texture packer json.");
            return;
        }
        // load texture atlas specified in the json.
        let imageURL = TexPackManager.texpacksDirectory + json.meta.image;
        let imageURLLower = imageURL.toLowerCase();
        let texAtlas = null;
        if (texAtlasDictionary.hasOwnProperty(imageURLLower)) {
            console.warn("image " + imageURLLower + " already added");
            _numTexPacksLoaded++;
            texAtlas = texAtlasDictionary[imageURLLower];
        }
        else {
            texAtlas = new TextureAtlas(imageURL);
            texAtlasDictionary[imageURLLower] = texAtlas;
        }
        // create packed images as specified in the json
        if (json.frames == null) {
            console.error("frames not given in the texture packer json.");
            return;
        }
        for (let i = 0; i < json.frames.length; i++) {
            let frame = json.frames[i];
            if (frame.rotated != null && frame.rotated == true) {
                console.error("frames cannot be rotated, disable the feature in texture packer");
                continue;
            }
            let packedImage = new PackedImage();
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
    class TextureAtlas {
        /**
        * Handles loading of sprites packed into a single texture atlas image.  DO NOT CALL THIS DIRECTLY, use addTexture() instead.
        * @param imageSource Source url (src) for the texture atlas being loaded.
        */
        constructor(imageSource) {
            /**
             * Gets the image.
             */
            this.getImage = () => {
                return this._image;
            };
            this.isLoaded = () => {
                return this._loaded;
            };
            this.imageOnLoad = () => {
                if (this._loaded)
                    return;
                this._loaded = true;
                _numTexPacksLoaded++;
            };
            this._loaded = false;
            this._image = new Image();
            this._image.onload = this.imageOnLoad;
            this._image.src = imageSource;
        }
    }
    TexPackManager.TextureAtlas = TextureAtlas;
    let packedImageDictionary = {};
    let texAtlasDictionary = {};
    let _numTexPacks = 0; // counter increments when a texture pack is added
    let _numTexPacksLoaded = 0; // counter increments when a texture pack loads
})(TexPackManager || (TexPackManager = {}));
/// <reference path="_ref.ts" />
/*

Spritesheet.add("sealime.png", 64, 64, 8, 24);

Animations.add("sealime_idle", "sealime.png", [0, 1, 2, 3, 4, 5]);

*/
class SpriteFrame {
    constructor() {
        this.imageFilename = "";
        this.getImage = () => {
            if (this._image === null)
                this._image = TexPackManager.getPackedImage(this.imageFilename);
            return this._image;
        };
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.pivotX = .5;
        this.pivotY = .5;
        this._image = null;
    }
}
/**
 * Spritesheets for an image.  Is merely a collection of SpriteFrames from this image.
 * spriteFrames can be customized to have different positions, sizes, and pivots.
 * An image can only have at most 1 spritesheet.
 */
class Spritesheet {
    constructor() {
        this.imageFilename = "";
        this.frames = [];
        /**
         * Creates and returns a new SpriteFrame belonging to this spritesheet, and pushes it into frames.
         */
        this.addFrame = () => {
            let sf = new SpriteFrame();
            sf.imageFilename = this.imageFilename;
            this.frames.push(sf);
            return sf;
        };
    }
    /**
     * Creates a spritesheet, and automatically creates frames for it based on given parameters.
     * The created spritesheet is returned, and its frames can be further customized.
     * @param imageFilename Filename of the image the spritesheet belongs to.  Only one spritesheet can be made per image.
     * @param frameWidth Width of the frames in pixels.
     * @param frameHeight Height of the frames in pixels.
     * @param numColumns Number of columns.
     * @param numFrames Total number of frames to create.
     */
    static addSpritesheet(imageFilename, frameWidth, frameHeight, numColumns, numFrames) {
        let ss = Spritesheet.addSpritesheetCustom(imageFilename);
        if (ss === null) {
            return null;
        }
        for (let i = 0; i < numFrames; i++) {
            let frame = ss.addFrame();
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
    static addSpritesheetCustom(imageFilename) {
        if (Spritesheet.spritesheetDic.hasOwnProperty(imageFilename)) {
            console.warn("Cannot create spritesheet " + imageFilename + " because a spritesheet for that file has already been created.");
            return null;
        }
        let ret = new Spritesheet();
        ret.imageFilename = imageFilename;
        Spritesheet.spritesheetDic[imageFilename] = ret;
        return ret;
    }
    /**
     * Gets the spritesheet created for the given image, or null if it hasn't been created.
     * @param imageFilename Filename of the original image.
     */
    static getSpritesheet(imageFilename) {
        if (!Spritesheet.spritesheetDic.hasOwnProperty(imageFilename))
            return null;
        return Spritesheet.spritesheetDic[imageFilename];
    }
    /**
     * Gets a frame of a spritesheet for the given image, or null if it hasn't been created.
     * @param imageFilename Filename of the original image.
     * @param frameIndex frame of the spritesheet.
     */
    static getSpriteFrame(imageFilename, frameIndex) {
        let ss = Spritesheet.getSpritesheet(imageFilename);
        if (ss === null)
            return null;
        if (frameIndex < 0 || frameIndex >= ss.frames.length)
            return null;
        return ss.frames[frameIndex];
    }
}
Spritesheet.spritesheetDic = {};
/**
 * A list of frames taken from spriteSheets.
 */
class Animation {
    constructor() {
        this.name = "";
        this.frames = [];
        this.fps = 10;
        this.loops = false;
        /**
         * Returns the time (unscaled, in seconds) it would take for the animation to play.
         */
        this.getDuration = () => {
            return this.frames.length / this.fps;
        };
    }
    /**
     * Creates an Animation, automatically filling in frames based on the given properties.
     * @param name Name of the animation.
     * @param spritesheetFilename Filename of the spritesheet to take frames from (spritesheet should already be created)
     * @param frames Array of ints of the frames of the spritesheet to use.  An index of -1 means null.
     * @param fps Frame rate of the animation.
     * @param loops Whether or not the animation loops.
     */
    static addAnimation(name, spritesheetFilename, frames, fps = 10, loops = false) {
        let anim = Animation.addAnimationCustom(name);
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
        let ss = Spritesheet.getSpritesheet(spritesheetFilename);
        if (ss === null) {
            console.error("Cannot make animation " + name + " because spritesheet " + spritesheetFilename + " has not been created.");
            return null;
        }
        for (let i = 0; i < frames.length; i++) {
            let frame = frames[i];
            if (frame === -1) {
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
    static addAnimationCustom(name) {
        if (Animation.animationsDic.hasOwnProperty(name)) {
            console.warn("Animation already created with the name " + name + ".");
            return Animation.animationsDic[name];
        }
        let anim = new Animation();
        anim.name = name;
        Animation.animationsDic[name] = anim;
        return anim;
    }
    /**
     * Gets the animation with the given name, or null if it doesn't exist.
     */
    static getAnimation(name) {
        if (!Animation.animationsDic.hasOwnProperty(name))
            return null;
        return Animation.animationsDic[name];
    }
}
Animation.animationsDic = {};
/// <reference path="_ref.ts" />
class Camera {
    /**
     * Initializes the Camera, to be called once by Game.
     */
    static _initialize(context) {
        if (Camera._initialized)
            return;
        Camera._context = context;
        Camera._initialized = true;
    }
    /**
     * Gets CanvasRenderingContext2D of the camera.
     */
    static get context() {
        return Camera._context;
    }
    /**
     * Gets width of the canvas of the context.
     */
    static get canvasWidth() {
        return Camera.context.canvas.width;
    }
    /**
     * Gets height of the canvas of the context.
     */
    static get canvasHeight() {
        return Camera.context.canvas.height;
    }
    /**
     * Gets the x coordinate in the world space of the left edge of the screen.
     */
    static get leftBound() {
        return Camera.centerX - Camera.canvasWidth / 2 / Camera.scale;
    }
    /**
     * Gets the y coordinate in the world space of the top edge of the screen.
     */
    static get topBound() {
        return Camera.centerY - Camera.canvasHeight / 2 / Camera.scale;
    }
    /**
     * Gets the x coordinate in the world space of the right edge of the screen.
     */
    static get rightBound() {
        return Camera.centerX + Camera.canvasWidth / 2 / Camera.scale;
    }
    /**
     * Gets the y coordinate in the world space of the bottom edge of the screen.
     */
    static get bottomBound() {
        return Camera.centerY + Camera.canvasHeight / 2 / Camera.scale;
    }
    /**
     * Takes a point in the canvas space (e.g. mouse position), and returns its equivalent position in the global space.
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    static canvasToGlobal(x, y, outPos = null) {
        Camera.setMat(Camera.tempMatrix);
        Camera.tempMatrix.invert();
        if (outPos === null) {
            let v = new Vec2(x, y);
            Camera.tempMatrix.transformVec2(v);
            return v;
        }
        else {
            Camera.tempMatrix.transformVec2(outPos);
            return null;
        }
    }
    /**
     * Takes a point in the global space and returns its equivalent position in the canvas space.
     * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
     */
    static globalToCanvas(x, y, outPos = null) {
        Camera.setMat(Camera.tempMatrix);
        if (outPos === null) {
            let v = new Vec2(x, y);
            Camera.tempMatrix.transformVec2(v);
            return v;
        }
        else {
            Camera.tempMatrix.transformVec2(outPos);
            return null;
        }
    }
    // Transformation
    /**
     * Gets clone of the transformation matrix used by this camera.
     */
    static get matrix() {
        Camera.setMat(Camera.tempMatrix);
        return Camera.tempMatrix.clone();
    }
    /**
     * Sets the transform of camera.context to be the camera's transformation multiplied by the global matrix of the given transform.
     */
    static setContextTransform(transform) {
        if (Camera.context == null)
            return;
        let temp = Camera.tempMatrix;
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
    static setContextTransformFromMatrix(matrix) {
        if (Camera.context == null)
            return;
        let temp = Camera.tempMatrix;
        Camera.setMat(temp);
        temp.multiply(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
        Camera.context.setTransform(temp.a, temp.b, temp.c, temp.d, temp.e, temp.f);
    }
    /**
     * Sets the values of the given matrix to be the transform from this camera.
     */
    static setMat(matrix) {
        let tx = Camera.canvasWidth / 2 - Camera.centerX * Camera.scale;
        let ty = Camera.canvasHeight / 2 - Camera.centerY * Camera.scale;
        matrix.setValues(Camera.scale, 0, 0, Camera.scale, tx, ty);
    }
}
// Position properties
/**
 * x coordinate of the point the center of the camera points at.
 */
Camera.centerX = 0;
/**
 * y coordinate of the point the center of the camera points at.
 */
Camera.centerY = 0;
/**
 * scale of the camera.
 */
Camera.scale = 1;
// Private
Camera._context = null;
Camera._initialized = false;
Camera.tempMatrix = new Matrix2x3();
/// <reference path="_ref.ts" />
class Scene {
    /**
     * Scene constructor.
     */
    constructor() {
        // Scene Properties
        /**
         * Gets ID for this Scene.  Each Scene is guaranteed to have a unique ID.
         */
        this.getID = () => {
            return this._id;
        };
        /**
         * Gets name of the scene.  This is the name that was set when the scene was added.
         */
        this.getName = () => {
            return this._name;
        };
        /**
            * Called when a scene is loaded.  Should be overridden to create the GameObjects in this scene.
            */
        this.onLoad = () => { };
        /**
         * Called when a scene is unloaded.  GameObjects loaded by the scene will be automatically destroyed, so there's no need to do that here.
         */
        this.onUnload = () => { };
        // Private
        this._id = 0;
        this._name = "";
        // give unique ID
        this._id = Scene.sceneIDCounter;
        Scene.sceneIDCounter++;
    }
    // Static - Adding Scenes
    /**
     * Adds a scene to the list of scenes.  Intended to be done before Game is created.
     * @param sceneName Name of the Scene.
     * @param scene The just created Scene.
     */
    static addScene(sceneName, scene) {
        if (sceneName == null || sceneName === "") {
            console.error("Scene must have a defined name.");
        }
        if (Scene.sceneExists(sceneName)) {
            console.warn("Scene \"" + sceneName + "\" has already been added.");
            return;
        }
        if (scene == null) {
            console.error("Scene \"" + sceneName + "\" must be defined.");
            return;
        }
        scene._name = sceneName;
        Scene.dictionary[sceneName] = scene;
        Scene._numScenes++;
    }
    // Static - Scene Management
    /**
     * Gets the name of the current scene, i.e. the scene last loaded.  Is "" when no scene is currently loaded.
     */
    static get currentScene() {
        if (Scene.loadedScenes.length === 0)
            return null;
        return Scene.loadedScenes[Scene.loadedScenes.length - 1].getName();
    }
    /**
     * Get a list of all the scenes currently loaded.  The last element in the list is the current scene.
     */
    static getLoadedScenes() {
        let ret = [];
        for (let i = 0; i < Scene.loadedScenes.length; i++) {
            ret.push(Scene.loadedScenes[i].getName());
        }
        return ret;
    }
    /**
     * Unloads all scenes currently loaded, then loads the given scene.  Scene is loaded at the beginning of next frame.
     * @param scene The scene to load.
     */
    static loadScene(sceneName) {
        Scene.unloadAllScenes();
        // prevent other scenes from loading
        if (Scene.scenesToLoad.length !== 0) {
            Scene.scenesToLoad.splice(0);
        }
        Scene.loadAdditionalScene(sceneName);
    }
    /**
     * Loads a scene without unloading any first.  Scene is loaded at the beginning of next frame.  If Scene is already loaded at that time, it will not be loaded again.
     * @param scene The scene to load.
     */
    static loadAdditionalScene(sceneName) {
        let scene = Scene._sceneFromName(sceneName);
        if (scene == null)
            return;
        if (Scene.scenesToLoad.indexOf(scene) !== -1) {
            console.warn("Scene \"" + sceneName + "\" will not be loaded because it is already being loaded.");
            return;
        }
        Scene.scenesToLoad.push(scene);
    }
    /**
     * Unloads the given scene.  Does nothing if the given scene is not currently loaded.
     * Scene will be unloaded at the end of the frame.
     * @param scene The scene to unload.  Leave as "" to unload the current scene.
     */
    static unloadScene(sceneName = "") {
        let name = sceneName;
        if (sceneName == null || sceneName == "") {
            name = Scene.currentScene;
            if (name == "")
                return;
        }
        let scene = Scene._sceneFromName(name);
        if (scene == null)
            return;
        let index = Scene.loadedScenes.indexOf(scene);
        if (index === -1)
            return;
        if (Scene.scenesToUnload.indexOf(scene) != -1)
            return;
        Scene.scenesToUnload.push(scene);
    }
    /**
     * Unloads all currently loaded scenes.
     * Scenes will be unloaded at the end of the frame.
     */
    static unloadAllScenes() {
        let scene;
        for (let i = 0; i < Scene.loadedScenes.length; i++) {
            scene = Scene.loadedScenes[i];
            if (Scene.scenesToUnload.indexOf(scene) != -1)
                continue;
            Scene.scenesToUnload.push(scene);
        }
    }
    /**
     * Gets the unique ID of the scene with the given scene name.
     * @param sceneName Name of the scene.
     */
    static idFromSceneName(sceneName) {
        let scene = Scene._sceneFromName(sceneName);
        if (scene === null)
            return -1;
        return scene.getID();
    }
    /**
     * Returns the Scene with the given name, or null if no scene with the name exists.
     */
    static sceneFromName(sceneName) {
        if (sceneName == null || sceneName == "")
            return null;
        if (!Scene.sceneExists(name))
            return null;
        return Scene.dictionary[name];
    }
    /**
     * Gets the total number of scenes.
     */
    static get numScenes() {
        return Scene._numScenes;
    }
    // Static - Called from Game
    /**
     * Load scenes that have been marked to be loaded.
     * Then starts all components that haven't been started yet.
     */
    static _loadScenesToLoad() {
        let scene;
        for (let i = 0; i < Scene.scenesToLoad.length; i++) {
            scene = Scene.scenesToLoad[i];
            if (Scene.loadedScenes.indexOf(scene) !== -1) {
                console.warn("Scene \"" + scene.getName() + "\" not loaded because it is already loaded.");
                continue;
            }
            // add scene to loaded scenes
            Scene.loadedScenes.push(scene);
            // call scene's onLoad() (which should load its GameObjects)
            scene.onLoad();
        }
        // clear list of scenes to load
        Scene.scenesToLoad.splice(0);
        // start components that haven't been started
        GameObject._startAllUnstartedComponents();
    }
    /**
     * Destroys all GameObjects in scenes that are marked to be unloaded.
     * Except for GameObjects where isDontDestroyOnUnload() is true.
     */
    static _destroyGameObjectsInScenesToUnload() {
        let scene;
        for (let i = 0; i < Scene.scenesToUnload.length; i++) {
            scene = Scene.scenesToUnload[i];
            GameObject._forEach(function (gameObject) {
                if (!gameObject.isDontDestroyOnUnload() &&
                    gameObject.getSceneID() === scene.getID()) {
                    gameObject.markForDestroy();
                }
            });
        }
    }
    /**
     * Unloads all scenes in scenesToUnload.  Assumes all GameObjects from those scenes have been destroyed already.
     */
    static _unloadMarkedScenes() {
        let scene;
        for (let i = 0; i < Scene.scenesToUnload.length; i++) {
            scene = Scene.scenesToUnload[i];
            let loadedScenesIndex = Scene.loadedScenes.indexOf(scene);
            if (loadedScenesIndex === -1) {
                console.error("Trying to unload scene that hasn't been loaded.");
                continue;
            }
            // call scene's onUnload
            scene.onUnload();
            // remove scene from loaded scenes
            Scene.loadedScenes.splice(loadedScenesIndex, 1);
        }
        // clear list of scenes to unload
        Scene.scenesToUnload.splice(0);
    }
    static sceneExists(name) {
        if (name == null || name == "")
            return false;
        return Scene.dictionary.hasOwnProperty(name);
    }
    /**
     * Gets scene from name.  Prints an error to the console if no scene with the name exists.
     */
    static _sceneFromName(name) {
        if (!Scene.sceneExists(name)) {
            console.error("Scene \"" + name + "\" does not exist.");
            return null;
        }
        return Scene.dictionary[name];
    }
}
Scene.sceneIDCounter = 0;
Scene.dictionary = {};
Scene._numScenes = 0; // counter goes up whenever a scene is added
Scene.loadedScenes = [];
Scene.scenesToUnload = [];
Scene.scenesToLoad = [];
/// <reference path="_ref.ts" />
/// <reference path="_ref.ts" />
/**
 * Sorting layer for IDrawer components.  Influences order in which IDrawers are drawn.
 */
var DrawLayer;
(function (DrawLayer) {
    DrawLayer[DrawLayer["BG"] = 10] = "BG";
    DrawLayer[DrawLayer["PLATFORMS"] = 20] = "PLATFORMS";
    DrawLayer[DrawLayer["DEFAULT"] = 50] = "DEFAULT";
    DrawLayer[DrawLayer["FG"] = 60] = "FG";
    DrawLayer[DrawLayer["GIZMO"] = 100] = "GIZMO";
    DrawLayer[DrawLayer["UI"] = 1000] = "UI";
})(DrawLayer || (DrawLayer = {}));
var Drawers;
(function (Drawers) {
    /**
     * Adds IDrawer to list, letting it be drawn in drawAll().  Careful: DOES NOT CHECK if drawer already exists in the list.
     */
    function _add(drawer) {
        allDrawers.push(drawer);
    }
    Drawers._add = _add;
    /**
     * Removes IDrawer from list.
     */
    function _remove(drawer) {
        let index = allDrawers.indexOf(drawer);
        if (index === -1)
            return;
        allDrawers.splice(index, 1);
    }
    Drawers._remove = _remove;
    /**
     * To be called by Game in the game loop.  Sorts all the IDrawers, then draws them onto the Game context.
     */
    function _drawAll() {
        let context = Game.context;
        let m = tempMatrix;
        sortDrawers();
        for (let i = 0; i < allDrawers.length; i++) {
            let dispObj = allDrawers[i];
            if (!dispObj.isVisible())
                continue;
            m.setIdentity();
            context.save();
            if (dispObj.anchored) {
                if (dispObj.getTransform() == null) {
                    // identity transform
                    context.setTransform(1, 0, 0, 1, 0, 0);
                }
                else {
                    // transform of drawer without the camera
                    dispObj.getTransform().multiplyByGlobalMatrix(m);
                    context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
                }
            }
            else {
                if (dispObj.getTransform() == null) {
                    // transform of just the camera
                    Camera.setContextTransformFromMatrix(m);
                }
                else {
                    // transform of the camera and the drawer
                    Camera.setContextTransform(dispObj.getTransform());
                }
            }
            // draw object
            dispObj.draw(context);
            context.restore();
        }
    }
    Drawers._drawAll = _drawAll;
    let tempMatrix = new Matrix2x3();
    /**
     * Sorts all the IDrawers based on their order.
     */
    function sortDrawers() {
        allDrawers.sort((d1, d2) => {
            let lComp = d1.layer - d2.layer;
            if (lComp === 0)
                return d1.order - d2.order;
            else
                return lComp;
        });
    }
    let allDrawers = [];
})(Drawers || (Drawers = {}));
/// <reference path="_ref.ts" />
/*/////////////////////////////////////////////////////////////////////////////////////

Rules:
- Maps and tilesets must both be exported in .json format.
- No tilemap may have the same name (even in different folders).
- No tileset may have the same name (even in different folders).
- TiledMap.tilesetImageDirectory must be set to the directory containing the tileset images before creating maps.

Recognized custom properties for tiles:
- material: name of a material as added with Material.addMaterial().
- col: set to "true" to enable collision for this tile.  Specifically sets its tileInfo.collisionLayers = 0x1.
    - Not needed if material is set because setting material will grab its material's collisionLayers property.
    - Set to "false" to disable collision for this tile.
    - Set to a number (e.g. 2, 0xFF) to manually set tileInfo.collisionLayers to a specific value.


*/ /////////////////////////////////////////////////////////////////////////////////////
var TiledMap;
(function (TiledMap) {
    // Adding maps and tilesets:
    /**
     * The directory of the tileset images in TexPackManager.
     * Must be set before creating maps.
     */
    TiledMap.tilesetImageDirectory = "";
    /**
     * Adds a tileset.  No two tilesets may have the same name (even if they're in different folders).
     * @param name Name of the tileset.  Must match the name the tileset is referred to by tilemaps.
     * @param tilesetJSON The JSON object to be parsed to create the tileset.
     */
    function addTileset(name, tilesetJSON) {
        if (tilesetJSONDictionary.hasOwnProperty(name) && tilesetJSONDictionary[name] !== "") {
            console.error("Cannot add tileset with name \"" + name + "\" because a tileset with that name has already been added.");
            return;
        }
        tilesetJSONDictionary[name] = tilesetJSON;
    }
    TiledMap.addTileset = addTileset;
    /**
     * Adds a map.  No two maps may have the same name (even if they're in different folders).
     * @param name Name of the map.
     * @param mapJSON The JSON object to be parsed to create the map.
     */
    function addMap(name, mapJSON) {
        if (mapJSONDictionary.hasOwnProperty(name)) {
            console.error("Cannot add map \"" + name + "\" because a map with that name already exists.");
            return;
        }
        mapJSONDictionary[name] = mapJSON;
    }
    TiledMap.addMap = addMap;
    // Creating maps:
    /**
     * Creates MapData for the TiledMap with the given name.  Assumes the JSON for the tiledMap and all tilesets used are already added and loaded.
     * @param mapName Name of the tiledMap to create.
     */
    function createTiledMapData(mapName) {
        if (!mapJSONDictionary.hasOwnProperty(mapName)) {
            console.error("TiledMap " + mapName + " doesn't exist.");
            return null;
        }
        let mapJSON = mapJSONDictionary[mapName];
        let map = new MapData();
        map.parse(mapJSON);
        return map;
    }
    TiledMap.createTiledMapData = createTiledMapData;
    /**
     * Maps the given type to a given function that will parse the objectProperties of all tiled objects that have the given type.
     * @param type The type, as defined by the 'Type' field for an object's properties in Tiled.
     * @param parseFunc Function that parses the objectProperties and returns the GameObject created from it.
     */
    function addObjectParser(type, parseFunc) {
        if (type == null || type === "") {
            console.error("Cannot map an empty type to an object parse function");
            return;
        }
        if (objectParserDictionary.hasOwnProperty(type)) {
            console.error("Tiled object parser type " + type + " already exists.");
            return;
        }
        objectParserDictionary[type] = parseFunc;
    }
    TiledMap.addObjectParser = addObjectParser;
    /**
     * Uses parse functions added with addObjectParser() to parse the given mapObject.  Returns the GameObject created, or null if no parser for the given map object could be found.
     * @param mapObject The map object to parse.  Its type property determines which parse function to use.
     */
    function parseMapObject(mapObject) {
        if (mapObject == null)
            return null;
        if (mapObject.type === "") {
            console.warn("Map objects with type \"\" cannot be parsed.");
            return;
        }
        if (objectParserDictionary.hasOwnProperty(mapObject.type)) {
            return objectParserDictionary[mapObject.type](mapObject);
        }
        console.warn("No object parser found mapped to the type \"" + mapObject.type + "\".  Add a parse function in addObjectParser().");
        return null;
    }
    TiledMap.parseMapObject = parseMapObject;
    /**
     * Represents a layer of a TiledMap.  Overridden by TileLayer and ObjectLayer.
     */
    class Layer {
        constructor() {
            /**
             * Name of the layer.
             */
            this.name = "";
            /**
             * Reference to the TiledMap the layer belongs to.
             */
            this.mapData = null;
            /**
             * Index of this layer in the TiledMap the layer belongs to.
             */
            this.layerIndex = 0;
            /**
             * Width of the layer in tiles.  Should be the same as the map's width.
             */
            this.width = 0;
            /**
             * Width of the layer in tiles.  Should be the same as the map's width.
             */
            this.height = 0;
            /**
             * Opacity of the layer as set in Tiled.  Not used currently.
             */
            this.opacity = 1;
            /**
             * Visibility of the layer as set in Tiled.  Not used currently.
             */
            this.visible = true;
            /**
             * Parses a JSON object exported from Tiled to construct the layer.  No error checking is done.
             */
            this.parse = (jsonObj) => {
                this.Layer_parse(jsonObj);
            };
            this.Layer_parse = (jsonObj) => {
                this.name = jsonObj.name;
                this.opacity = jsonObj.opacity;
                this.width = jsonObj.width;
                this.height = jsonObj.height;
                this.visible = jsonObj.visible;
                this.customProperties = jsonObj.properties;
                if (this.customProperties == undefined)
                    this.customProperties = {};
            };
            this.dispose = () => {
                this.Layer_dispose();
            };
            this.Layer_dispose = () => {
                this.mapData = null;
                this.customProperties = null;
                console.log("layer disposed");
            };
            this.type = LayerType.NONE;
        }
    }
    TiledMap.Layer = Layer;
    class TileLayer extends Layer {
        constructor() {
            super();
            /**
             * Gets the number at the given coordinates, or 0 if coordinates are invalid.
             */
            this.getTileData = (x, y) => {
                if (!this.coordinatesAreValid(x, y)) {
                    return 0;
                }
                return this.tileData[x + y * this.width];
            };
            /**
             * Gets the global tile id at the given coordinates, stripped of its transform flags.
             */
            this.getGID = (x, y) => {
                let data = this.getTileData(x, y);
                // clear transform flags
                let gid = data & ~(TiledMap.FLIPPED_HORIZONTALLY_FLAG |
                    TiledMap.FLIPPED_VERTICALLY_FLAG |
                    TiledMap.FLIPPED_DIAGONALLY_FLAG);
                return gid;
            };
            /**
             * Gets the TileInfo of the tile at the given coordinates, or null if coordinates are invalid.
             */
            this.getTileInfo = (x, y) => {
                return this.mapData.getTileInfo(this.getGID(x, y));
            };
            /**
             * Sets the number at the given coordinates.
             */
            this.setTileData = (x, y, data) => {
                if (!this.coordinatesAreValid(x, y)) {
                    console.warn("Cannot set GID at x: " + x + " y: " + y + ", coordinates are invalid");
                    return;
                }
                this.tileData[x + y * this.width] = data;
            };
            /**
             * Sets the global tile id at the given coordinates.
             */
            this.setGID = (x, y, gid, flippedHoriz = false, flippedVert = false, flippedDiag = false) => {
                let val = gid;
                if (flippedHoriz)
                    val |= TiledMap.FLIPPED_HORIZONTALLY_FLAG;
                if (flippedVert)
                    val |= TiledMap.FLIPPED_VERTICALLY_FLAG;
                if (flippedDiag)
                    val |= TiledMap.FLIPPED_DIAGONALLY_FLAG;
                this.setTileData(x, y, val);
            };
            /**
             * Gets if the given coordinates are valid (i.e. are contained in the map).
             */
            this.coordinatesAreValid = (x, y) => {
                if (isNaN(x))
                    return false;
                if (isNaN(y))
                    return false;
                if (x < 0 || x >= this.width)
                    return false;
                if (y < 0 || y >= this.height)
                    return false;
                return true;
            };
            /**
             * Parses a JSON object exported from Tiled to construct the layer.  No error checking is done.
             */
            this.parse = (jsonObj) => {
                this.Layer_parse(jsonObj);
                this.tileData = jsonObj.data;
            };
            /*
            bool flipped_horizontally = (global_tile_id & FLIPPED_HORIZONTALLY_FLAG);
            bool flipped_vertically = (global_tile_id & FLIPPED_VERTICALLY_FLAG);
            bool flipped_diagonally = (global_tile_id & FLIPPED_DIAGONALLY_FLAG);
            */
            this.dispose = () => {
                this.tileData.splice(0);
                this.tileData = null;
                this.Layer_dispose();
            };
            this.type = LayerType.TILE_LAYER;
        }
    }
    TiledMap.TileLayer = TileLayer;
    // Flags used for tile rotation.  Currently these flags are removed from tile gids, but no tile rotation is supported.
    TiledMap.FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
    TiledMap.FLIPPED_VERTICALLY_FLAG = 0x40000000;
    TiledMap.FLIPPED_DIAGONALLY_FLAG = 0x20000000;
    (function (LayerType) {
        LayerType[LayerType["NONE"] = 0] = "NONE";
        LayerType[LayerType["TILE_LAYER"] = 1] = "TILE_LAYER";
        LayerType[LayerType["OBJECT_GROUP"] = 2] = "OBJECT_GROUP";
        LayerType[LayerType["IMAGE_LAYER"] = 3] = "IMAGE_LAYER";
    })(TiledMap.LayerType || (TiledMap.LayerType = {}));
    var LayerType = TiledMap.LayerType;
    /**
     * Class containing info for a tile.  Can be obtained with MapData.getTileInfo(gid).
     */
    class TileInfo {
        constructor() {
            /**
             * id of the tile within its tileset.
             */
            this.id = 0;
            /**
             * Reference to the tileset this tile belongs to.
             */
            this.tileset = null;
            /**
             * Material of this tile.  Set by setting a custom property for a tile with the name "material" in Tiled.
             * Value should match a tile added by Material.addMaterial().
             */
            this.material = "";
            /**
             * Collision layers for this tile.  Set by grabbing the collisionLayers property from the material defined by the "material" custom property in Tiled.
             * The bits of this integer represent the masks this PlatformObject will collide with.  Note that 0 means no collision.
             * "I am a"
             */
            this.collisionLayers = 0;
            this.recycled = false;
        }
        /**
         * TileInfo representing a tile with a gid of 0.
         */
        static get empty() { return TileInfo._empty; }
        /**
         * Creates a new TileInfo, using a recycled TileInfo if possible.
         * @param tileset Tileset the tile belongs to.
         * @param id id of the tile in the Tileset.
         */
        static createNew(tileset, id) {
            let ret = null;
            if (TileInfo.recycledTileInfos.length > 0) {
                ret = TileInfo.recycledTileInfos.pop();
                ret.recycled = false;
            }
            else {
                ret = new TileInfo();
            }
            ret.tileset = tileset;
            ret.id = id;
            ret.material = "";
            ret.collisionLayers = 0;
            ret.customProperties = null;
            return ret;
        }
        /**
         * Recycles a TileInfo to be used later.  Dereferences properties on the tileInfo as well.
         * @param tileInfo
         */
        static recycle(tileInfo) {
            if (tileInfo == null)
                return;
            if (tileInfo.recycled)
                return;
            // dispose
            tileInfo.tileset = null;
            tileInfo.customProperties = null;
            TileInfo.recycledTileInfos.push(tileInfo);
            tileInfo.recycled = true;
        }
    }
    TileInfo._empty = new TileInfo();
    TileInfo.recycledTileInfos = [];
    TiledMap.TileInfo = TileInfo;
    class Tileset {
        constructor() {
            /**
             * Key used to access the packed image for this tileset.
             */
            this.packedImageFilename = "";
            /**
             * Reference to the packed image for this tileset.
             */
            this.packedImage = null;
            /**
             * Number of tiles defined in this tileset.
             */
            this.numTiles = 0;
            /**
             * Width of the image in pixels.
             */
            this.imageWidth = 0;
            /**
             * Height of the image in pixels.
             */
            this.imageHeight = 0;
            /**
             * Width of each tile, in pixels
             */
            this.tileWidth = 0;
            /**
             * Height of each tile, in pixels
             */
            this.tileHeight = 0;
            /**
             * Calculates the number of columns in this tileset (it's not provided for some reason).  Calculation currently does not take into account margin or spacing.
             */
            this.getNumColumns = () => {
                return Math.floor(this.imageWidth / this.tileWidth);
            };
            /**
             * Parses the tileset from a given JSON object made in Tiled for the tileset.
             */
            this.parse = (tilesetJSON) => {
                if (TiledMap.tilesetImageDirectory == null || TiledMap.tilesetImageDirectory == "") {
                    console.error("TiledMap.tilesetImageDirectory must be defined before creating tilesets.");
                }
                this.packedImageFilename = TiledMap.tilesetImageDirectory + nameFromUrl(tilesetJSON.image) + ".png";
                this.packedImage = TexPackManager.getPackedImage(this.packedImageFilename);
                if (this.packedImage === null) {
                    console.error("tileset image \"" + this.packedImageFilename + "\" does not exist.");
                    return;
                }
                this.imageWidth = tilesetJSON.imagewidth;
                this.imageHeight = tilesetJSON.imageHeight;
                if (tilesetJSON.margin != 0) {
                    console.warn("the \"margin\" property for tilesets is currently not implemented.");
                }
                if (tilesetJSON.spacing != 0) {
                    console.warn("the \"spacing\" property for tilesets is currently not implemented.");
                }
                this.tileWidth = tilesetJSON.tilewidth;
                this.tileHeight = tilesetJSON.tileheight;
                this.numTiles = tilesetJSON.tilecount;
                this.customProperties = tilesetJSON.properties;
                if (this.customProperties == null)
                    this.customProperties = {};
                // create tile infos
                this.dispose();
                this.tileInfos = [];
                for (let i = 0; i < this.numTiles; i++) {
                    let ti = TileInfo.createNew(this, i);
                    this.tileInfos.push(ti);
                }
                if (tilesetJSON.tileproperties != undefined) {
                    for (var id in tilesetJSON.tileproperties) {
                        let tileInfo = this.tileInfos[id];
                        let props = tilesetJSON.tileproperties[id];
                        // parsing tile custom properties
                        tileInfo.customProperties = props;
                        if (props.hasOwnProperty("material")) {
                            tileInfo.material = props.material;
                            let material = Material.getMaterial(tileInfo.material);
                            if (material === null) {
                                this.logTileError(id, "Material " + tileInfo.material + " does not exist.  Was it mispelled in Tiled or not added? ");
                            }
                            else {
                                tileInfo.collisionLayers = Material.getNumber(tileInfo.material, "collisionLayers", 0);
                            }
                        }
                        if (props.hasOwnProperty("col")) {
                            if (props.col === "true" || props.col === "TRUE") {
                                tileInfo.collisionLayers = 0x1;
                            }
                            else if (props.col === "false" || props.col === "FALSE") {
                                tileInfo.collisionLayers = 0;
                            }
                            else {
                                tileInfo.collisionLayers = Number.parseInt(props.col);
                                if (isNaN(tileInfo.collisionLayers)) {
                                    this.logTileError(id, "collisionLayers must be set to an integer.");
                                    tileInfo.collisionLayers = 0;
                                }
                            }
                        }
                    }
                }
            };
            /**
             * Recycles all the TileInfos defined in this Tileset, then gets rid of the array containing them.
             * Clears references.
             */
            this.dispose = () => {
                if (this.tileInfos == null)
                    return;
                for (let i = 0; i < this.tileInfos.length; i++) {
                    TileInfo.recycle(this.tileInfos[i]);
                }
                this.tileInfos.splice(0);
                this.tileInfos = null;
                this.packedImage = null;
                this.customProperties = null;
            };
            this.logTileError = (id, message) => {
                console.error("(Tileset using image " + this.packedImageFilename + ", tile id " + id + "): " + message);
            };
        }
    }
    TiledMap.Tileset = Tileset;
    /**
     * Class for parsed objects from Tiled object layers.
     */
    class Object {
        constructor() {
            /**
             * Name of the object, as defined in Tiled.
             */
            this.name = "";
            /**
             * Type as defined by the used in Tiled.
             */
            this.type = "";
            /**
             * ID, which is automatically set in Tiled.
             */
            this.id = 0;
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.width = 0;
            this.height = 0;
            /**
             * Points for the polygon/polyline, if this object is the POLYGON or POLYLINE type.
             */
            this.points = [];
            /**
             * The ObjectGroup this object comes from.
             */
            this.objectGroup = null;
            /**
             * Parses from a JSON exported from Tiled.
             */
            this.parse = (jsonObject) => {
                let objPoints = null;
                this.name = jsonObject.name;
                this.type = jsonObject.type;
                this.id = jsonObject.id;
                this.x = jsonObject.x;
                this.y = jsonObject.y;
                this.rotation = jsonObject.rotation;
                this.width = jsonObject.width;
                this.height = jsonObject.height;
                if (jsonObject.ellipse != undefined && jsonObject.ellipse == true) {
                    this.objectType = ObjectType.ELLIPSE;
                }
                else if (jsonObject.polygon != undefined) {
                    this.objectType = ObjectType.POLYGON;
                    objPoints = jsonObject.polygon;
                }
                else if (jsonObject.polyline != undefined) {
                    this.objectType = ObjectType.POLYLINE;
                    objPoints = jsonObject.polyline;
                }
                else {
                    this.objectType = ObjectType.RECTANGLE;
                }
                if (objPoints != null) {
                    // parse points
                    for (let i = 0; i < objPoints.length; i++) {
                        this.points.push(new Vec2(objPoints[i].x, objPoints[i].y));
                    }
                }
                this.customProperties = jsonObject.properties;
                if (this.customProperties == null)
                    this.customProperties = {};
            };
        }
    }
    TiledMap.Object = Object;
    (function (ObjectType) {
        ObjectType[ObjectType["NONE"] = 0] = "NONE";
        ObjectType[ObjectType["RECTANGLE"] = 1] = "RECTANGLE";
        ObjectType[ObjectType["ELLIPSE"] = 2] = "ELLIPSE";
        ObjectType[ObjectType["POLYGON"] = 3] = "POLYGON";
        ObjectType[ObjectType["POLYLINE"] = 4] = "POLYLINE";
    })(TiledMap.ObjectType || (TiledMap.ObjectType = {}));
    var ObjectType = TiledMap.ObjectType;
    class ObjectGroup extends Layer {
        constructor() {
            super();
            /**
             * Array of all the TiledMapObjects defined in this group.
             */
            this.mapObjects = [];
            /**
             * Parses a JSON object exported from Tiled to construct the object group.  No error checking is done.
             */
            this.parse = (jsonObj) => {
                this.Layer_parse(jsonObj);
                for (let i = 0; i < jsonObj.objects.length; i++) {
                    let mapObj = new Object();
                    mapObj.parse(jsonObj.objects[i]);
                    mapObj.objectGroup = this;
                    this.mapObjects.push(mapObj);
                }
            };
            this.dispose = () => {
                this.mapObjects.splice(0);
                this.mapObjects = null;
                this.Layer_dispose();
            };
            this.type = LayerType.OBJECT_GROUP;
        }
    }
    TiledMap.ObjectGroup = ObjectGroup;
    class MapData {
        constructor() {
            /**
             * Parse a JSON object exported from Tiled.
             */
            this.parse = (jsonObj) => {
                if (this._parsed) {
                    console.error("TileMap already parsed, cannot be parsed again.");
                    return;
                }
                this.height = jsonObj.height;
                this.width = jsonObj.width;
                this.tileWidth = jsonObj.tilewidth;
                this.tileHeight = jsonObj.tileheight;
                this.customProperties = jsonObj.properties;
                if (this.customProperties == undefined)
                    this.customProperties = {};
                for (let i = 0; i < jsonObj.layers.length; i++) {
                    let layer = null;
                    // get type of layer
                    let type;
                    let typeStr = jsonObj.layers[i].type;
                    if (typeStr === "tilelayer") {
                        type = LayerType.TILE_LAYER;
                    }
                    else if (typeStr === "objectgroup") {
                        type = LayerType.OBJECT_GROUP;
                    }
                    else if (typeStr === "imagelayer") {
                        type = LayerType.IMAGE_LAYER;
                    }
                    switch (type) {
                        case LayerType.TILE_LAYER:
                            layer = new TileLayer();
                            break;
                        case LayerType.OBJECT_GROUP:
                            layer = new ObjectGroup();
                            break;
                        case LayerType.IMAGE_LAYER:
                            layer = null;
                            break;
                    }
                    // parse layer
                    if (layer == null) {
                        console.error("Layer type " + LayerType[type] + " not supported yet.");
                    }
                    else {
                        layer.mapData = this;
                        layer.layerIndex = i;
                        layer.parse(jsonObj.layers[i]);
                        this.layers.push(layer);
                    }
                }
                // parsing tilesets
                this._tilesets.splice(0);
                for (let i = 0; i < jsonObj.tilesets.length; i++) {
                    let firstGID = jsonObj.tilesets[i].firstgid;
                    let tileset = null;
                    if (jsonObj.tilesets[i].source == undefined) {
                        // defines tileset
                        tileset = new Tileset();
                        tileset.parse(jsonObj.tilesets[i]);
                    }
                    else {
                        // references external tileset
                        let tilesetName = nameFromUrl(jsonObj.tilesets[i].source);
                        if (MapData.externalTilesetExists(tilesetName)) {
                            tileset = MapData.getExternalTileset(tilesetName);
                        }
                        else {
                            // need to create tileset first
                            tileset = new Tileset();
                            let tilesetJSON = null;
                            if (tilesetJSONDictionary.hasOwnProperty(tilesetName)) {
                                tilesetJSON = tilesetJSONDictionary[tilesetName];
                            }
                            if (tilesetJSON == null || tilesetJSON == "") {
                                console.error("JSON for external tileset \"" + tilesetName + "\" does not exist.");
                                continue;
                            }
                            tileset.parse(tilesetJSON);
                            // adds external tileset for later use
                            MapData.addExternalTileset(tilesetName, tileset);
                        }
                    }
                    // add to list of tilesets for this map
                    this._tilesets.push(new TilesetElement(firstGID, tileset));
                }
                // sort tilesets for this map by firstGID
                this._tilesets.sort(function (t1, t2) {
                    return t1.firstGID - t2.firstGID;
                });
                this._parsed = true;
            };
            /**
             * Height of the map, in number of tiles.
             */
            this.height = 0;
            /**
             * Width of the map, in number of tiles.
             */
            this.width = 0;
            /**
             * Width of the tiles, in pixels.
             */
            this.tileWidth = 0;
            /**
             * Height of the tiles, in pixels.
             */
            this.tileHeight = 0;
            /**
             * The layers contained in this map.
             */
            this.layers = [];
            /**
             * Returns the TiledMapLayer with the given name, or null if no layer with the name exists in this map.
             */
            this.getLayerByName = (name) => {
                for (let i = 0; i < this.layers.length; i++) {
                    if (this.layers[i].name === name)
                        return this.layers[i];
                }
                return null;
            };
            /**
             * Returns the TiledMapTileLayer with the given name, or null if no tile layer with the name exists in this map.
             */
            this.getTileLayerByName = (name) => {
                for (let i = 0; i < this.layers.length; i++) {
                    if (this.layers[i].name === name &&
                        (this.layers[i] instanceof TileLayer))
                        return this.layers[i];
                }
                return null;
            };
            /**
             * Gets info for the tile with the given global id.
             * Returns TileInfo.empty if the gid is 0.
             * Returns null if the gid is invalid.
             */
            this.getTileInfo = (gid) => {
                if (gid < 0)
                    return null;
                if (gid === 0)
                    return TileInfo.empty;
                // get tileset
                let tilesetElement = null;
                for (let i = 1; i < this._tilesets.length; i++) {
                    if (gid < this._tilesets[i].firstGID) {
                        tilesetElement = this._tilesets[i - 1];
                        break;
                    }
                }
                if (tilesetElement === null)
                    tilesetElement = this._tilesets[this._tilesets.length - 1];
                // get info
                let id = gid - tilesetElement.firstGID;
                if (id < 0 || id >= tilesetElement.tileset.tileInfos.length)
                    return null;
                return tilesetElement.tileset.tileInfos[id];
            };
            /**
             * Creates a GameObject, where each child is a GameObject with a TiledMapTileLayerRenderer component corresponding to each tile layer.
             * Then every map Object is parsed with functions given by addObjectParser().
             * Returns the created GameObject.
             */
            this.createGameObject = () => {
                if (!this._parsed) {
                    console.error("Cannot create GameObject, TiledMap hasn't been parsed");
                    return null;
                }
                let rootGO = new GameObject();
                let tiledMapComponent = rootGO.addComponent(TiledMapComponent);
                tiledMapComponent.mapData = this;
                for (let i = 0; i < this.layers.length; i++) {
                    if (this.layers[i].type !== LayerType.TILE_LAYER)
                        continue;
                    let tileLayer = this.layers[i];
                    let tileLayerGO = new GameObject();
                    let renderer = tileLayerGO.addComponent(TiledMapTileLayerRenderer);
                    renderer.tiledMapLayer = tileLayer;
                    let platform = tileLayerGO.addComponent(TiledMapTileLayerPlatform);
                    platform.platformObject.tiledMapLayer = tileLayer;
                    tileLayerGO.transform.setParent(rootGO.transform);
                }
                this.callOnAllMapObjects(parseMapObject);
                return rootGO;
            };
            /**
             * Calls a function on all TiledMapObjects in the map.
             */
            this.callOnAllMapObjects = (func) => {
                for (let i = 0; i < this.layers.length; i++) {
                    if (this.layers[i].type !== LayerType.OBJECT_GROUP)
                        continue;
                    let objectGroup = this.layers[i];
                    objectGroup.mapObjects.forEach(func);
                }
            };
            this.dispose = () => {
                this.layers.forEach(function (layer) {
                    layer.dispose();
                });
                this.layers = null;
                this._tilesets.forEach(function (tilesetElement) {
                    tilesetElement.tileset.dispose();
                });
                this._tilesets = null;
                this.customProperties = null;
                console.log("map data disposed");
            };
            this._tilesets = [];
            this._parsed = false;
        }
        static addExternalTileset(tilesetName, tileset) {
            if (MapData.externalTilesetExists(tilesetName)) {
                console.warn("Tileset with name \"" + tilesetName + "\" already exists.");
                return;
            }
            MapData.externalTilesets[tilesetName] = tileset;
        }
        static getExternalTileset(tilesetSource) {
            if (MapData.externalTilesetExists(tilesetSource)) {
                console.error("Tileset \"" + tilesetSource + "\" does not exist.");
                return null;
            }
            return MapData.externalTilesets[tilesetSource];
        }
        static externalTilesetExists(tilesetName) {
            return MapData.externalTilesets.hasOwnProperty(tilesetName);
        }
    }
    MapData.externalTilesets = {};
    TiledMap.MapData = MapData;
    /**
     * Object containing a reference to a tileset and the first global id represented by that tileset in the current map.
     */
    class TilesetElement {
        constructor(firstGID, tileset) {
            this.firstGID = firstGID;
            this.tileset = tileset;
        }
    }
    /**
     * Strips the directory and path from the given url, leaving only the name.
     */
    function nameFromUrl(url) {
        let index = Math.max(url.lastIndexOf("/"), url.lastIndexOf("\\"));
        let trimmedStr;
        if (index == -1) {
            trimmedStr = url;
        }
        else {
            trimmedStr = url.slice(index + 1);
        }
        index = trimmedStr.lastIndexOf(".");
        if (index != -1) {
            trimmedStr = trimmedStr.slice(0, index);
        }
        return trimmedStr;
    }
    let mapJSONDictionary = {};
    let tilesetJSONDictionary = {};
    let objectParserDictionary = {};
})(TiledMap || (TiledMap = {}));
/// <reference path="_ref.ts" />
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
class ComponentProperties {
    constructor() {
        /**
         * When true, there can only be 1 of this component on a GameObject.
         */
        this.only1 = false;
        /**
         * Adds a Component constructor to the list of components that are required to be added before adding this one.
         */
        this.requireComponent = (c) => {
            this._requireComponents.push(c);
        };
        /**
         * Adds a Component constructor to the list of components that are required to NOT be added when adding this one.
         */
        this.excludeComponent = (c) => {
            this._excludeComponents.push(c);
        };
        this._requireComponents = [];
        this._excludeComponents = [];
    }
}
class Component {
    constructor() {
        /**
         * Name of the component.  Used for debugging.
         */
        this.name = "";
        /**
         * The GameObject this Component belongs to.  Please don't change.
         */
        this.gameObject = null;
        this.getTransform = () => {
            return this.gameObject.transform;
        };
        /**
         * Gets if this component is enabled.  Only active and enabled components receive calls to update() every frame.
         */
        this.isEnabled = () => {
            return this._enabled;
        };
        /**
         * Gets if this component's gameObject is active and this component is enabled.  Only active and enabled components receive calls to update() every frame.
         */
        this.isActiveAndEnabled = () => {
            return this._enabled && this.gameObject.isActive();
        };
        /**
         * Gets if onStarted() has been called yet for the component.
         */
        this.isStarted = () => {
            return this._started;
        };
        this.getComponentProperties = () => {
            return this.componentProperties;
        };
        /**
         * Enables this component, calling onEnable() if defined.
         */
        this.enable = () => {
            if (this._enabled)
                return;
            this._enabled = true;
            if (this.onEnable != undefined) {
                this.onEnable();
            }
        };
        /**
         * Disables this component, calling onDisable() if defined.
         */
        this.disable = () => {
            if (!this._enabled)
                return;
            this._enabled = false;
            if (this.onDisable != undefined) {
                this.onDisable();
            }
        };
        /**
         * Gets a component of or derived from the given type from this component's gameObject, or returns null if it doesn't exist.
         */
        this.getComponent = (c) => {
            return this.gameObject.getComponent(c);
        };
        /**
         * Gets an array of all components of or derived from the given type from this component's gameObject.
         */
        this.getComponents = (c) => {
            return this.gameObject.getComponents(c);
        };
        /**
         * Returns a string describing the component.
         */
        this.toString = () => {
            return "Component " + this.name + " started: " + this.isStarted() + " enabled: " + this.isEnabled();
        };
        this.componentProperties = new ComponentProperties();
        this._enabled = true;
        this._started = false;
    }
    /**
     * Starts the given component (if it's unstarted) and marks it as started.
     */
    static _startUnstarted(component) {
        if (component._started)
            return;
        component._started = true;
        if (component.onStart != undefined) {
            component.onStart();
        }
    }
}
/// <reference path="_ref.ts" />
/**
 * DrawerComponents are automatically added to and removed from Drawers.
 */
class DrawerComponent extends Component {
    constructor() {
        super();
        /**
         * Drawers are sorted by layer before being drawn.
         */
        this.layer = DrawLayer.DEFAULT;
        /**
         * Drawers are sorted by this value (after Layer sorting) before being drawn.
         */
        this.order = 0;
        /**
         * If draw() should be called for this DrawComponent.  Is false if this component is disabled or the gameObject is marked for destroy.
         */
        this.isVisible = () => {
            return this.isActiveAndEnabled() && !this.gameObject.isMarkedForDestroy();
        };
        /**
         * When true, the position of the drawer when drawn will ignore the camera (e.g. UI elements).
         */
        this.anchored = false;
        /**
         * Draws to the given context.
         */
        this.draw = (context) => {
            // to be overridden
        };
    }
}
/// <reference path="_ref.ts" />
/**
 * Renders a rectangle of a TextureAtlas.
 */
class PackedImageRenderer extends DrawerComponent {
    constructor() {
        super();
        /**
         * Gets the TexPackManager.PackedImage this renderer draws from.
         */
        this.getImage = () => {
            return this.image;
        };
        /**
         * Sets the image to draw.
         * @param setRectFull Automatically set rectangular selection dimensions to be the size of the original image (default is true).
         */
        this.setImage = (image, setRectFull = true) => {
            this.setImage_PackedImageRenderer(image, setRectFull);
        };
        this.setImage_PackedImageRenderer = (image, setRectFull = true) => {
            this.image = image;
            if (setRectFull) {
                this.setImageRectFull();
            }
        };
        /**
         * Sets image to draw based on its original filename.  image is set to null if no image with the name exists.
         * @param setRectFull Automatically set rectangular selection dimensions to be the size of the original image (default is true).
         */
        this.setImageByName = (filename, setRectFull = true) => {
            this.setImage(TexPackManager.getPackedImage(filename), setRectFull);
        };
        /**
         * The X coordinate of the top left corner of the sub-rectangle of the original image to draw into the destination context.
         * Assumes the image wasn't trimmed.
         */
        this.imageX = 0;
        /**
         * The Y coordinate of the top left corner of the sub-rectangle of the original image to draw into the destination context.
         * Assumes the image wasn't trimmed.
         */
        this.imageY = 0;
        /**
         * The width of the sub-rectangle of the original image to draw into the destination context.
         * Assumes the image wasn't trimmed.
         */
        this.imageWidth = 0;
        /**
         * The height of the sub-rectangle of the original image to draw into the destination context.
         * Assumes the image wasn't trimmed.
         */
        this.imageHeight = 0;
        /**
         * Sets the rectangular selection properties with one function.
         * @param x x coordinate of top left corner of the rectangle.
         * @param y y coordinate of top left corner of the rectangle.
         * @param width width of the rectangle.
         * @param height height of the rectangle.
         */
        this.setImageRect = (x, y, width, height) => {
            this.setImageRect_PackedImageRenderer(x, y, width, height);
        };
        this.setImageRect_PackedImageRenderer = (x, y, width, height) => {
            this.imageX = x;
            this.imageY = y;
            this.imageWidth = width;
            this.imageHeight = height;
        };
        /**
         * Sets the rectangular selection properties to be the size of the original image.
         */
        this.setImageRectFull = () => {
            if (this.image === null) {
                this.setImageRect(0, 0, 0, 0);
            }
            else {
                this.setImageRect(0, 0, this.image.getOriginalWidth(), this.image.getOriginalHeight());
            }
        };
        /**
         * x coordinate of the origin point of the displayed image, as a multiplier of the imageWidth.  0 is the left edge, 1 is the right edge.
         */
        this.pivotX = .5;
        /**
         * y coordinate of the origin point of the displayed image, as a multiplier of the imageHeight.  0 is the top edge, 1 is the bottom edge.
         */
        this.pivotY = .5;
        /**
         * Disable image smoothing for a pixel-art look.
         */
        this.imageSmoothingEnabled = true;
        /**
         * CSS color string representing the color to tint the image.  Alpha is ignored.
         */
        this.tintColor = "#000000";
        /**
         * Amount to apply tintColor when tinting the image.  Ranges from [0, 1].
         */
        this.tintAmount = 0;
        /**
         * Draws the TextureRectRenderer on the given context.
         */
        this.draw = (context) => {
            let packedImage = this.image;
            if (packedImage === null) {
                return;
            }
            if (!packedImage.isLoaded()) {
                console.warn("Attempting to draw with PackedImage that hasn't finished loading");
                return;
            }
            // get positions from the packed image
            let piLeft = packedImage.frameX + Math.max(0, this.imageX - packedImage.trimLeft);
            let piRight = packedImage.frameX + Math.min(packedImage.frameWidth, this.imageX + this.imageWidth - packedImage.trimLeft);
            let piPivotX = packedImage.frameX + this.imageX + this.imageWidth * this.pivotX - packedImage.trimLeft;
            let piTop = packedImage.frameY + Math.max(0, this.imageY - packedImage.trimTop);
            let piBottom = packedImage.frameY + Math.min(packedImage.frameHeight, this.imageY + this.imageHeight - packedImage.trimTop);
            let piPivotY = packedImage.frameY + this.imageY + this.imageHeight * this.pivotY - packedImage.trimTop;
            piPivotX = Math.floor(piPivotX + .001);
            piPivotY = Math.floor(piPivotY + .001);
            // (can have effects here, e.g. setting context.shadowBlur, context.shadowColor, context.globalAlpha, (context as any).imageSmoothingEnabled, etc.)
            // (don't need to reset effects afterward since context.restore() will be called)
            // disable image smoothing
            if (!this.imageSmoothingEnabled) {
                context.mozImageSmoothingEnabled = false;
                context.webkitImageSmoothingEnabled = false;
                context.msImageSmoothingEnabled = false;
                context.imageSmoothingEnabled = false;
            }
            let usingEffect = false;
            usingEffect = this.tintAmount > 0;
            if (usingEffect) {
                // ready effects context
                Game.effectsContext.clearRect(0, 0, this.imageWidth, this.imageHeight);
                Game.effectsContext.save();
                // draw image to effects context
                Game.effectsContext.drawImage(packedImage.atlasImage, piLeft, piTop, piRight - piLeft, piBottom - piTop, 0, 0, piRight - piLeft, piBottom - piTop);
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
                context.drawImage(Game.effectsCanvas, 0, 0, piRight - piLeft, piBottom - piTop, piLeft - piPivotX, piTop - piPivotY, piRight - piLeft, piBottom - piTop);
            }
            else {
                // draw image normally, without effects
                context.drawImage(packedImage.atlasImage, piLeft, piTop, piRight - piLeft, piBottom - piTop, piLeft - piPivotX, piTop - piPivotY, piRight - piLeft, piBottom - piTop);
            }
        };
        this.image = null;
        this.colorParser = new ColorParser();
        this.name = "PackedImageRenderer";
    }
}
/// <reference path="_ref.ts" />
/**
 * An extension of PackedImageRenderer for rendering SpriteFrames and Animations.
 */
class SpriteRenderer extends PackedImageRenderer {
    constructor() {
        super();
        /**
         * Reference to the spriteFrame the renderer is displaying.
         */
        this.getSpriteFrame = () => {
            return this.spriteFrame;
        };
        /**
         * Sets renderer to display the given spriteFrame.
         */
        this.setSpriteFrame = (spriteFrame) => {
            if (spriteFrame === null) {
                this.setImage(null, false);
            }
            else {
                this.setImage(spriteFrame.getImage(), false);
                this.setImageRect(spriteFrame.x, spriteFrame.y, spriteFrame.width, spriteFrame.height);
            }
            this.spriteFrame = spriteFrame;
        };
        /**
         * Sets renderer to display the the spriteFrame from a spritesheet at the given index.
         */
        this.setSpriteFrameByName = (imageFilename, frameIndex) => {
            this.setSpriteFrame(Spritesheet.getSpriteFrame(imageFilename, frameIndex));
        };
        /**
         * Sets the image to draw.  Since this is isn't defined by a SpriteFrame, spriteFrame will be set to null.
         * Calling this while an animation is playing probably won't do anything because the animation will almost immediately update the image.
         * @param setRectFull Automatically set rectangular selection dimensions to be the size of the original image (default is true).
         */
        this.setImage = (image, setRectFull = true) => {
            this.setImage_PackedImageRenderer(image, setRectFull);
            this.spriteFrame = null;
        };
        /**
         * Sets the rectangular selection properties with one function.  Since this is isn't defined by a SpriteFrame, spriteFrame will be set to null.
         * Calling this while an animation is playing probably won't do anything because the animation will almost immediately update the image.
         * @param x x coordinate of top left corner of the rectangle.
         * @param y y coordinate of top left corner of the rectangle.
         * @param width width of the rectangle.
         * @param height height of the rectangle.
         */
        this.setImageRect = (x, y, width, height) => {
            this.setImageRect_PackedImageRenderer(x, y, width, height);
            this.spriteFrame = null;
        };
        /**
         * Plays the given animation.
         * @param animation The animation to play.  Can be null to stop the animation.
         * @param nextAnimation (default is null) The animation to play after the other animation finishes (doesn't apply when playing backwards).  This won't happen when set to null.
         */
        this.playAnimation = (animation, nextAnimation = null) => {
            if (animation !== null && (animation.frames == null || animation.frames.length === 0)) {
                console.error("Cannot play animation " + animation.name + " because it has no frames");
                animation = null;
            }
            this.animation = animation;
            this.nextAnimation = nextAnimation;
            if (this.animSpeed < 0 && this.animation !== null) {
                // playing backwards.  Start animation at the end
                this.animTime = this.animation.getDuration() - .0001;
            }
            this.animPlaying = (animation !== null);
        };
        /**
         * Plays the given animation.  Animations are given by name.
         * @param animation The animation to play.  Can be "" to stop the animation.
         * @param nextAnimation (default is "") The animation to play after the other animation finishes (doesn't apply when playing backwards).  This won't happen when set to "".
         */
        this.playAnimationByName = (animation, nextAnimation = "") => {
            let anim = null;
            if (animation != null && animation !== "") {
                anim = Animation.getAnimation(animation);
                if (anim === null) {
                    console.warn("No animation found with name " + animation);
                }
            }
            let nextAnim = null;
            if (nextAnimation != null && nextAnimation !== "") {
                nextAnim = Animation.getAnimation(nextAnimation);
                if (nextAnim === null) {
                    console.warn("No animation found with name " + nextAnimation);
                }
            }
            this.playAnimation(anim, nextAnim);
        };
        /**
         * Stops the animation.
         */
        this.stopAnimation = () => {
            this.animPlaying = false;
        };
        /**
         * Gets the current animation.
         */
        this.getAnimation = () => {
            return this.animation;
        };
        /**
         * Gets if an animation is playing.  Can return true even when animation speed is 0.
         */
        this.isAnimationPlaying = () => {
            return this.animPlaying;
        };
        /**
         * Gets the current time for playing the current animation.
         */
        this.getAnimationTime = () => {
            return this.animTime;
        };
        /**
         * Gets the current frame index of the current animation.
         */
        this.getAnimationFrameIndex = () => {
            if (this.animation === null)
                return 0;
            return Math.floor(this.animTime * this.animation.fps);
        };
        /**
         * Sets the time for playing the current animation.  Is automatically clamped to be within the animation duration.
         */
        this.setAnimationTime = (time) => {
            if (this.animation === null) {
                this.animTime = 0;
                return;
            }
            let duration = this.animation.getDuration();
            this.animTime = M.fmod(time, duration);
        };
        /**
         * Gets the speed multiplier for playing an animation.
         */
        this.getAnimationSpeed = () => {
            return this.animSpeed;
        };
        /**
         * Sets the speed multiplier for playing an animation (can be negative to play animation in reverse).
         */
        this.setAnimationSpeed = (speed) => {
            this.animSpeed = speed;
        };
        this.onUpdate = () => {
            // play animation
            if (this.animPlaying && this.animation !== null) {
                this.animTime += this.animSpeed * Game.deltaTime;
                let animDuration = this.animation.getDuration();
                if (this.animSpeed >= 0) {
                    // playing forward
                    if (this.animTime >= animDuration) {
                        // reached end of animation.  Stop, loop, or move on to the next animation.
                        if (this.nextAnimation === null) {
                            if (this.animation.loops) {
                                // loop around
                                this.animTime = M.fmod(this.animTime, animDuration);
                            }
                            else {
                                // stop animation at the end
                                this.animTime = animDuration - .0001;
                                this.animPlaying = false;
                            }
                        }
                        else {
                            // move on to next animation
                            this.animation = this.nextAnimation;
                            this.nextAnimation = null;
                            this.animTime = M.fmod(this.animTime - animDuration, this.animation.getDuration());
                        }
                    }
                }
                else {
                    // playing backward
                    if (this.animTime < 0) {
                        // reached end of animation.  Stop or loop.
                        if (this.animation.loops) {
                            // loop around
                            this.animTime = M.fmod(this.animTime, animDuration);
                        }
                        else {
                            // stop animation at the start
                            this.animTime = 0;
                            this.animPlaying = false;
                        }
                    }
                }
                this.updateSpriteFrameFromAnimation();
            }
        };
        this.updateSpriteFrameFromAnimation = () => {
            let sf = null;
            if (this.animation !== null) {
                let t = M.fmod(this.animTime, this.animation.frames.length / this.animation.fps);
                sf = this.animation.frames[Math.floor(t * this.animation.fps)];
            }
            if (sf !== this.spriteFrame) {
                this.setSpriteFrame(sf);
            }
        };
        this.spriteFrame = null;
        this.animation = null;
        this.nextAnimation = null;
        this.animTime = 0;
        this.animSpeed = 1;
        this.animPlaying = false;
        this.name = "SpriteRenderer";
    }
}
/// <reference path="_ref.ts" />
class TiledMapTileLayerRenderer extends DrawerComponent {
    constructor() {
        super();
        /**
         * The TileLayer data this renderer is drawing.
         */
        this.tiledMapLayer = null;
        /**
         * Gets the map data this tile layer is a part of.
         */
        this.getMapData = () => {
            return this.tiledMapLayer.mapData;
        };
        /**
         * Gets the TiledMapComponent representing the map data this tile layer is a part of.
         * TiledMapComponent should be in the parent transform.
         */
        this.getTiledMapComponent = () => {
            return this.getTransform().getParent().gameObject.getComponent(TiledMapComponent);
        };
        /**
         * Won't draw tiles that aren't on the camera.  Assumes the map doesn't scale or rotate, isn't the child of another Transform.
         */
        this.cameraCulling = true;
        this.onAwake = () => {
            this._transform = this.getTransform();
        };
        this.draw = (context) => {
            if (this.tiledMapLayer == null) {
                console.error("Must set TiledMapTileLayerRenderer.tiledMapLayer");
                return;
            }
            // disable image smoothing for a pixelated look.  Also helps with texture bleeding
            context.imageSmoothingEnabled = false;
            let tileXMin = 0;
            let tileXMax = this.tiledMapLayer.width;
            let tileYMin = 0;
            let tileYMax = this.tiledMapLayer.height;
            let tileWidth = this.tiledMapLayer.mapData.tileWidth;
            let tileHeight = this.tiledMapLayer.mapData.tileHeight;
            // restricting tiles drawn to only those visible on screen
            if (this.cameraCulling) {
                let boundXMin = Camera.leftBound;
                let boundYMin = Camera.topBound;
                let boundXMax = Camera.rightBound;
                let boundYMax = Camera.bottomBound;
                let minPoint = this._transform.globalToLocal(boundXMin, boundYMin);
                let maxPoint = this._transform.globalToLocal(boundXMax, boundYMax);
                tileXMin = Math.max(0, Math.min(this.tiledMapLayer.width - 1, Math.floor(minPoint.x / tileWidth - 2)));
                tileYMin = Math.max(0, Math.min(this.tiledMapLayer.height - 1, Math.floor(minPoint.y / tileHeight - 2)));
                tileXMax = Math.max(1, Math.min(this.tiledMapLayer.width, Math.floor(maxPoint.x / tileWidth + 2) + 1));
                tileYMax = Math.max(1, Math.min(this.tiledMapLayer.height, Math.floor(maxPoint.y / tileHeight + 2) + 1));
            }
            let data = 0;
            let gid = 0;
            let id = 0;
            let tileData = this.tiledMapLayer.tileData;
            let layerWidth = this.tiledMapLayer.width;
            let flagCombo = TiledMap.FLIPPED_HORIZONTALLY_FLAG | TiledMap.FLIPPED_VERTICALLY_FLAG | TiledMap.FLIPPED_DIAGONALLY_FLAG;
            let tileInfo = null;
            let tileset = null;
            let packedImage = null;
            let numColumns = 0;
            let tilesetX = 0;
            let tilesetY = 0;
            let rectX = 0;
            let rectY = 0;
            let rectWidth = 0;
            let rectHeight = 0;
            let canvasOffsetX = 0;
            let canvasOffsetY = 0;
            let piLeft = 0;
            let piRight = 0;
            let piPivotX = 0;
            let piTop = 0;
            let piBottom = 0;
            let piPivotY = 0;
            for (let x = tileXMin; x < tileXMax; x++) {
                for (let y = tileYMin; y < tileYMax; y++) {
                    data = tileData[x + y * layerWidth];
                    if (data === 0)
                        continue;
                    gid = data & ~flagCombo;
                    tileInfo = this.tiledMapLayer.mapData.getTileInfo(gid);
                    tileset = tileInfo.tileset;
                    id = tileInfo.id;
                    numColumns = tileset.getNumColumns();
                    tilesetX = id % numColumns;
                    tilesetY = Math.floor(id / numColumns);
                    rectX = tilesetX * tileset.tileWidth;
                    rectY = tilesetY * tileset.tileHeight;
                    rectWidth = tileset.tileWidth;
                    rectHeight = tileset.tileHeight;
                    canvasOffsetX = x * this.tiledMapLayer.mapData.tileWidth;
                    canvasOffsetY = y * this.tiledMapLayer.mapData.tileHeight;
                    // get positions from the packed image
                    packedImage = tileset.packedImage;
                    piLeft = packedImage.frameX + Math.max(0, rectX - packedImage.trimLeft);
                    piRight = packedImage.frameX + Math.min(packedImage.frameWidth, rectX + rectWidth - packedImage.trimLeft);
                    piPivotX = packedImage.frameX + rectX + -packedImage.trimLeft;
                    piTop = packedImage.frameY + Math.max(0, rectY - packedImage.trimTop);
                    piBottom = packedImage.frameY + Math.min(packedImage.frameHeight, rectY + rectHeight - packedImage.trimTop);
                    piPivotY = packedImage.frameY + rectY + -packedImage.trimTop;
                    piPivotX = Math.floor(piPivotX + .001);
                    piPivotY = Math.floor(piPivotY + .001);
                    // rotations not implemented
                    // draw image normally, without effects
                    context.drawImage(packedImage.atlasImage, piLeft, piTop, piRight - piLeft, piBottom - piTop, canvasOffsetX + piLeft - piPivotX, canvasOffsetY + piTop - piPivotY, piRight - piLeft, piBottom - piTop);
                }
            }
        };
        this.onDestroy = () => {
            this.tiledMapLayer = null;
        };
        this.name = "TiledMapTileLayerRenderer";
    }
}
/// <reference path="_ref.ts" />
/**
 * Component containing the map data and layers for a tiled map.
 * The root GameObject created with TiledMap.createGameObject() has this component.
 */
class TiledMapComponent extends Component {
    constructor() {
        super();
        this.mapData = null;
        this.onDestroy = () => {
            this.mapData.dispose();
            this.mapData = null;
        };
        this.name = "TiledMapComponent";
    }
}
/// <reference path="_ref.ts" />
/**
 * Applies a filter covering the entire screen that makes it grayscale.
 */
class ScreenFilter extends DrawerComponent {
    constructor() {
        super();
        this.grayscale = false;
        this.invert = false;
        this.draw = (context) => {
            if (this.grayscale) {
                context.globalCompositeOperation = "saturation";
                context.fillStyle = "hsl(0,0%,50%)";
                context.fillRect(0, 0, Camera.canvasWidth, Camera.canvasHeight);
            }
            if (this.invert) {
                context.globalCompositeOperation = "difference";
                context.fillStyle = "#FFFFFF";
                context.fillRect(0, 0, Camera.canvasWidth, Camera.canvasHeight);
            }
        };
        this.anchored = true;
        this.order = 999;
    }
}
/// <reference path="_ref.ts" />
/**
 * A basic component that loads Game.startScene when all the game's assets are finished loading.
 * Can be overridden.
 */
class BasePreloader extends DrawerComponent {
    constructor() {
        super();
        this.textFont = "24px Verdana";
        this.textColor = "#FFFFFF";
        /**
         * Draws percent loaded to the context.
         */
        this.draw = (context) => {
            context.font = this.textFont;
            context.textAlign = "center";
            context.fillStyle = this.textColor;
            let text = "";
            if (Game.percentLoaded >= 1 && !Game.userInputSatisfied) {
                text = "Press any key to begin";
            }
            else {
                text = Math.floor(Game.percentLoaded * 100) + "%";
            }
            context.fillText(text, Camera.canvasWidth / 2, Camera.canvasHeight / 2);
        };
        this.onUpdate = () => {
            this.onUpdate_BasePreloader();
        };
        this.onUpdate_BasePreloader = () => {
            // wait for the game to finish loading
            if (Game.ready) {
                if (Game.startScene == "") {
                    console.error("Game.startScene must be defined.  This is the scene that will start once the game finishes loading.");
                }
                else {
                    Scene.loadScene(Game.startScene);
                }
            }
        };
        this.name = "BasePreloader";
        this.anchored = true;
    }
}
/// <reference path="_ref.ts" />
/**
 * The first scene loaded by the game by default.  Only contains one GameObject with the BasePreloader component, which starts Game.startScene when all the game's assets are finished loading.
 */
class BasePreloadScene extends Scene {
    constructor(...args) {
        super(...args);
        this.onLoad = () => {
            // wait for game to finish loading
            let go = new GameObject();
            go.addComponent(BasePreloader);
        };
        this.onUnload = () => { };
    }
}
/// <reference path="_ref.ts" />
class GameObject {
    /**
     * GameObject constructor.
     */
    constructor() {
        // Properties
        /**
         * Name of this GameObject.  Used in functions that search for gameObjects by name.
         */
        this.name = "";
        /**
         * Gets instance ID for this GameObject.  Guaranteed to be unique for every GameObject.
         */
        this.getInstanceID = () => {
            return this._instanceID;
        };
        /**
         * Gets scene ID for this GameObject.  This is the ID of the scene last loaded when this GameObject was created.
         * When the scene is unloaded, this GameObject will be destroyed, unless it's marked to not be destroyed on unload.
         */
        this.getSceneID = () => {
            return this._sceneID;
        };
        /**
         * Transform for this GameObject.  Please don't change.
         */
        this.transform = new Transform();
        /**
         * When true, this object will be deleted at the end of the frame.
         */
        this.isMarkedForDestroy = () => {
            return this._markedForDestroy;
        };
        /**
         * When true, this object will not be destroyed when the scene it comes from unloads.
         */
        this.isDontDestroyOnUnload = () => {
            return this._dontDestroyOnUnload;
        };
        /**
         * Sets the local active state of this GameObject (isActiveSelf).
         */
        this.setActive = (active) => {
            this._activeSelf = active;
        };
        /**
         * If this and every parent above it is active.
         */
        this.isActive = () => {
            let trans = this.transform;
            while (trans !== null) {
                if (!trans.gameObject.isActiveSelf())
                    return false;
                trans = trans.getParent();
            }
            return true;
        };
        /**
         * The local active state of this GameObject.  This GameObject still isn't active if a parent is inactive however.
         */
        this.isActiveSelf = () => {
            return this._activeSelf;
        };
        // Functions
        /**
         * Adds a Component of the given type.
         */
        this.addComponent = (c) => {
            let component = new c();
            if (component == null)
                return null;
            let compProps = component.getComponentProperties();
            // check name
            if (component.name == null || component.name === "") {
                console.warn("Component added without a name");
            }
            // check only1
            if (compProps.only1) {
                if (this.getComponent(c) !== null) {
                    console.error("Only 1 instance of component " + component.name + " can be added to a GameObject");
                    return;
                }
            }
            // check requireComponents        
            for (let i = 0; i < compProps._requireComponents.length; i++) {
                if (this.getComponent(compProps._requireComponents[i]) === null) {
                    console.error("Component " + component.name + " requires component " +
                        (new compProps._requireComponents[i]()).name +
                        " to be added already.");
                    return;
                }
            }
            // check excludeComponents        
            for (let i = 0; i < compProps._excludeComponents.length; i++) {
                if (this.getComponent(compProps._excludeComponents[i]) !== null) {
                    console.error("Component " + component.name + " requires component " +
                        (new compProps._excludeComponents[i]()).name +
                        " to not already be added.");
                    return;
                }
            }
            // make component part of this gameObject
            component.gameObject = this;
            this.components.push(component);
            // add DrawerComponent to Drawers
            if (component instanceof DrawerComponent) {
                Drawers._add(component);
            }
            // call onAwake()
            if (component.onAwake != undefined) {
                component.onAwake();
            }
            return component;
        };
        /**
         * Gets a component of or derived from the given type from this gameObject, or returns null if it doesn't exist.
         */
        this.getComponent = (c) => {
            let component;
            for (let i = 0; i < this.components.length; i++) {
                component = this.components[i];
                if (component instanceof c) {
                    return component;
                }
            }
            return null;
        };
        /**
         * Gets an array of all components of or derived from the given type from this gameObject.
         */
        this.getComponents = (c) => {
            let ret = [];
            let component;
            for (let i = 0; i < this.components.length; i++) {
                component = this.components[i];
                if (component instanceof c) {
                    ret.push(component);
                }
            }
            return ret;
        };
        /**
         * Gets an array of all components in children of or derived from the given type from this gameObject.
         */
        this.getComponentsInChildren = (c) => {
            let ret = [];
            let children = this.transform.getChildren();
            children.forEach(function (child) {
                let childComps = child.gameObject.getComponentsAndInChildren(c); // using helper function
                for (let i = 0; i < childComps.length; i++) {
                    ret.push(childComps[i]);
                }
            });
            return ret;
        };
        // (note: Components are automatically destroyed when the GameObject is destroyed.  There is currently no way to destroy a Component manually)
        /**
         * Marks object to be destroyed at the end of the frame.  Children will be recursively marked for destroy as well.  Won't do anything if already marked for destroy.
         */
        this.markForDestroy = () => {
            if (this._markedForDestroy)
                return;
            this._markedForDestroy = true;
            GameObject.gameObjectsMarkedForDestroy.push(this);
            // mark children for destroy too
            this.transform.getChildren().forEach(function (transform) {
                if (transform.gameObject != null) {
                    transform.gameObject.markForDestroy();
                }
            });
        };
        /**
         * Marks object to not be destroyed when the scene it comes from unloads.  Children will recursively be marked the same way.
         * Note this mark cannot be undone, and once this function is called this GameObject will need to be destroyed manually.
         */
        this.dontDestroyOnUnload = () => {
            if (this._dontDestroyOnUnload)
                return;
            this._dontDestroyOnUnload = true;
            // mark children to not be destroyed on unload too
            this.transform.getChildren().forEach(function (transform) {
                if (transform.gameObject != null) {
                    transform.gameObject.dontDestroyOnUnload();
                }
            });
        };
        /**
         * Calls a function (if the function exists) on every component in this GameObject.
         */
        this.sendMessage = (functionName, functionParam = undefined) => {
            this.components.forEach(function (component) {
                if (component[functionName] != undefined) {
                    if (functionParam === undefined) {
                        component[functionName]();
                    }
                    else {
                        component[functionName](functionParam);
                    }
                }
            });
        };
        this._update = () => {
            // start all components that haven't been started yet
            for (let i = 0; i < this.components.length; i++) {
                if (!this.components[i].isStarted()) {
                    Component._startUnstarted(this.components[i]);
                }
            }
            // call onUpdate() for all components
            if (this.isActive()) {
                for (let i = 0; i < this.components.length; i++) {
                    let component = this.components[i];
                    if (!component.isEnabled())
                        return;
                    if (component.onUpdate != undefined) {
                        component.onUpdate();
                    }
                }
            }
        };
        /**
         * Destroys an object immediately, removing it from the game object list.
         */
        this.destroyImmediately = () => {
            if (this.transform != null) {
                // disconnect transform children
                let children = this.transform.getChildren();
                children.forEach(function (transform) {
                    if (transform.gameObject != null) {
                        transform.gameObject.markForDestroy();
                    }
                    transform.setParent(null);
                });
                // disconnect transform from parent
                this.transform.setParent(null);
            }
            // destroy components
            for (let i = 0; i < this.components.length; i++) {
                let component = this.components[i];
                // remove DrawerComponent from Drawers
                if (component instanceof DrawerComponent) {
                    Drawers._remove(component);
                }
                // call onDestroy()
                if (component.onDestroy != undefined) {
                    component.onDestroy();
                }
            }
            this.components.splice(0);
            // remove from allGameObjects
            let index = GameObject.allGameObjects.indexOf(this);
            GameObject.allGameObjects.splice(index, 1);
            // null stuff
            this.transform = null;
            this.components = null;
        };
        /**
         * Helper function for getComponentsInChildren().
         */
        this.getComponentsAndInChildren = (c) => {
            let ret = this.getComponents(c);
            let children = this.transform.getChildren();
            children.forEach(function (child) {
                let childComps = child.gameObject.getComponentsInChildren(c);
                for (let i = 0; i < childComps.length; i++) {
                    ret.push(childComps[i]);
                }
            });
            return ret;
        };
        // Private properties
        this._instanceID = 0;
        this._sceneID = 0;
        this.components = [];
        this._markedForDestroy = false;
        this._dontDestroyOnUnload = false;
        this._activeSelf = true;
        this.transform.gameObject = this;
        // set instance ID
        this._instanceID = GameObject.instanceIDCounter;
        GameObject.instanceIDCounter++;
        // set scene ID to the ID of the current scene
        if (Scene.currentScene === null) {
            this._sceneID = -1;
        }
        else {
            this._sceneID = Scene.idFromSceneName(Scene.currentScene);
        }
        // adds GameObject to list
        GameObject.allGameObjects.push(this);
    }
    // Static functions for getting objects
    /**
     * Searches all gameObjects for a component of or derived from the given type, or returns null if it doesn't exist.
     */
    static findObjectOfType(c) {
        let go;
        let component;
        for (let i = 0; i < GameObject.allGameObjects.length; i++) {
            go = GameObject.allGameObjects[i];
            for (let j = 0; j < go.components.length; j++) {
                component = go.components[j];
                if (component instanceof c) {
                    return component;
                }
            }
        }
        return null;
    }
    /**
     * Searches all gameObjects for components of or derived from the given type.
     */
    static findObjectsOfType(c) {
        let ret = [];
        let go;
        let component;
        for (let i = 0; i < GameObject.allGameObjects.length; i++) {
            go = GameObject.allGameObjects[i];
            for (let j = 0; j < go.components.length; j++) {
                component = go.components[j];
                if (component instanceof c) {
                    ret.push(component);
                }
            }
        }
        return ret;
    }
    /**
     * Searches all gameObjects for one with the given name, or returns null if it doesn't exist.
     * @param name Name of the gameObject to find.  null will be returned if name is null, undefined, or "".
     */
    static findObject(name) {
        if (name == null)
            return null;
        if (name === "")
            return null;
        let go;
        for (let i = 0; i < GameObject.allGameObjects.length; i++) {
            go = GameObject.allGameObjects[i];
            if (go.name === name) {
                return go;
            }
        }
        return null;
    }
    // Functions called by Game
    /**
     * Performs a forEach() on all the gameObjects.
     */
    static _forEach(callbackFunction) {
        GameObject.allGameObjects.forEach(callbackFunction);
    }
    /**
     * Calls update() on all the gameObjects.
     */
    static _updateAll() {
        GameObject._forEach(function (gameObject, index, array) {
            gameObject._update();
        });
    }
    /**
     * Starts every unstarted component.  Called after a scene loads in.
     */
    static _startAllUnstartedComponents() {
        for (let i = 0; i < GameObject.allGameObjects.length; i++) {
            let go = GameObject.allGameObjects[i];
            go.components.forEach(function (component) {
                if (!component.isStarted()) {
                    Component._startUnstarted(component);
                }
            });
        }
    }
    /**
     * Destroys all GameObjects marked to be destroyed.  Should only be called by Game at the end of the frame.
     */
    static _destroyAllMarked() {
        for (let i = 0; i < GameObject.gameObjectsMarkedForDestroy.length; i++) {
            let GO = GameObject.gameObjectsMarkedForDestroy[i];
            GO.destroyImmediately();
        }
        GameObject.gameObjectsMarkedForDestroy.splice(0);
    }
}
GameObject.instanceIDCounter = 0;
GameObject.allGameObjects = [];
GameObject.gameObjectsMarkedForDestroy = [];
/// <reference path="_ref.ts" />
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
var Team;
(function (Team) {
    Team[Team["NONE"] = 0] = "NONE";
    Team[Team["PLAYER_1"] = 1] = "PLAYER_1";
    Team[Team["PLAYER_2"] = 2] = "PLAYER_2";
    Team[Team["PLAYER_3"] = 4] = "PLAYER_3";
    Team[Team["PLAYER_4"] = 8] = "PLAYER_4";
    /**
     * Represents all players.
     */
    Team[Team["PLAYERS"] = 15] = "PLAYERS";
    Team[Team["ENEMY_1"] = 256] = "ENEMY_1";
    Team[Team["ENEMY_2"] = 512] = "ENEMY_2";
    Team[Team["ENEMY_3"] = 1024] = "ENEMY_3";
    Team[Team["ENEMY_4"] = 2048] = "ENEMY_4";
    /**
     * Represents all enemies.
     */
    Team[Team["ENEMIES"] = 3840] = "ENEMIES";
    /**
     * Represents all players and all enemies.
     */
    Team[Team["ALL"] = 2147483647] = "ALL";
})(Team || (Team = {}));
class Actor extends Component {
    constructor() {
        super();
        /**
         * Gets position of this transform in the global space.
         * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
         */
        this.getGlobalPosition = (outPos = null) => {
            return this.getTransform().getGlobalPosition(outPos);
        };
        /**
         * Sets position of this transform in the global space.
         */
        this.setGlobalPosition = (x, y) => {
            this.getTransform().setGlobalPosition(x, y);
        };
        /**
         * velocity x
         */
        this.vx = 0;
        /**
         * velocity y
         */
        this.vy = 0;
        /**
         * Collision.gravity accel is multiplied by this before being added to actor's velocity.
         */
        this.gravityScale = 1;
        /**
         * Extra x velocity from the wind.
         */
        this.windX = 0;
        /**
         * Extra y velocity from the wind.
         */
        this.windY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.halfWidth = 0;
        this.halfHeight = 0;
        /**
         * The "team" this actor belongs to.  Affects which attacks this actor gets hit by.
         */
        this.team = Team.PLAYER_1;
        /**
         * If this actor is included in the given team.
         */
        this.isInTeam = (team) => {
            return (team & this.team) != 0;
        };
        /**
         * Determines how an Actor is repositioned upon hitting a platform.
         * When false, Actors will stop immediately when hitting a platform.
         */
        this.projectCollision = true;
        /**
         * When true, automatically sets x/y velocity to 0 upon hitting a horizontal/vertical wall.
         */
        this.zeroVelocityOnCollision = true;
        /**
         * This actor's gameObject will be sent onCollisionCrush events if the angle (degrees) between collision normals is more than this amount.
         */
        this.crushAngleThreshold = 91;
        /**
         * Angle (in degrees) of the diagonal of the dimensions
         */
        this.getDimensionRatioAngle = () => {
            return Math.atan2(this.halfHeight, this.halfWidth) * M.radToDeg;
        };
        /**
         * A reference to the MovingPlatformObject this Actor is attached to, or null if isn't attached to a MovingPlatformObject.  Actors can only be attached to one platform at a time.
         */
        this.getAttachedMovingPlatformObject = () => {
            return this.attachedMovingPlatformObject;
        };
        /**
         * The bits of this integer represent the layers this Actor will collide with.
         * "I will collide with".
         */
        this.collisionMask = 0x7FFFFFFF;
        /**
         * Performs a raycast.
         * @param raycastHit put the results of the raycast here, rather than allocating a new RaycastHit.
         * @param origin origin of the ray being cast.
         * @param direction normalized direction of the ray being cast.
         * @param distance distance of the ray being cast.
         * @param teamMask collision will be detected only if this actor is included in this team.
         */
        this.raycast = (raycastHit, origin, direction, distance = Number.POSITIVE_INFINITY, teamMask = Team.ALL) => {
            if (!this.isInTeam(teamMask)) {
                raycastHit.hit = false;
                return;
            }
            let pos = this.tempVec2;
            this.getGlobalPosition(pos);
            let left = pos.x + this.offsetX - this.halfWidth;
            let top = pos.y + this.offsetY - this.halfHeight;
            let right = pos.x + this.offsetX + this.halfWidth;
            let bottom = pos.y + this.offsetY + this.halfHeight;
            // do not consider a hit if ray starts inside the actor
            if (left < origin.x && origin.x < right &&
                top < origin.y && origin.y < bottom) {
                raycastHit.hit = false;
                return;
            }
            let vertTime = -1;
            let horizTime = -1;
            if (direction.y < 0) {
                // going up, hitting bottom side
                vertTime = M.rayHorizontalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, bottom, left, right, distance);
            }
            else if (direction.y > 0) {
                // going down, hitting top side
                vertTime = M.rayHorizontalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, top, left, right, distance);
            }
            if (direction.x < 0) {
                // going left, hitting right side
                horizTime = M.rayVerticalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, right, top, bottom, distance);
            }
            else if (direction.x > 0) {
                // going right, hitting left side
                horizTime = M.rayVerticalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, left, top, bottom, distance);
            }
            let time = -1;
            if (horizTime != -1 && (vertTime == -1 || horizTime <= vertTime)) {
                // hit horizontal wall
                time = horizTime;
                if (direction.x > 0) {
                    raycastHit.normal.setValues(-1, 0);
                }
                else {
                    raycastHit.normal.setValues(1, 0);
                }
            }
            else if (vertTime != -1 && (horizTime == -1 || vertTime <= horizTime)) {
                // hit vertical wall
                time = vertTime;
                if (direction.y > 0) {
                    raycastHit.normal.setValues(0, -1);
                }
                else {
                    raycastHit.normal.setValues(0, 1);
                }
            }
            else {
                // didn't hit anything
                raycastHit.hit = false;
                return;
            }
            // fill rest of raycastHit
            raycastHit.hit = true;
            raycastHit.actor = this;
            raycastHit.t = time;
            raycastHit.point.setValues(origin.x + direction.x * time, origin.y + direction.y * time);
        };
        /**
         * Called when a Component is added to a GameObject.  Adds Actor to the list containing all Actors.
         */
        this.onAwake = () => {
            Actor.allActors.push(this);
        };
        this.onUpdate = () => { };
        this.onEnable = () => { };
        this.onDisable = () => {
            // detach from platform
            if (this.attachedMovingPlatformObject != null) {
                this.attachedMovingPlatformObject.detachActor(this);
            }
        };
        this.onPlatformAttach = (movingPlatformObject) => {
            this.attachedMovingPlatformObject = movingPlatformObject;
        };
        this.onPlatformDetach = (movingPlatformObject) => {
            this.attachedMovingPlatformObject = null;
        };
        /**
         * Removes this actor from the list of all actors.
         */
        this.onDestroy = () => {
            // detach from platform
            if (this.attachedMovingPlatformObject != null) {
                this.attachedMovingPlatformObject.detachActor(this);
            }
            let index = Actor.allActors.indexOf(this);
            if (index === -1)
                return;
            Actor.allActors.splice(index, 1);
        };
        this.attachedMovingPlatformObject = null;
        this.tempVec2 = new Vec2();
        this.name = "Actor";
        this.componentProperties.only1 = true;
        this.componentProperties.excludeComponent(Platform);
    }
    getRect(outRect = null) {
        this.getGlobalPosition(this.tempVec2);
        let x = this.tempVec2.x;
        let y = this.tempVec2.y;
        if (outRect === null) {
            let ret = new Rect(x + this.offsetX - this.halfWidth, y + this.offsetY - this.halfHeight, this.halfWidth * 2, this.halfHeight * 2);
            return ret;
        }
        outRect.x = x + this.offsetX - this.halfWidth;
        outRect.y = y + this.offsetY - this.halfHeight;
        outRect.width = this.halfWidth * 2;
        outRect.height = this.halfHeight * 2;
        return null;
    }
    /**
     * Calls forEach() on all the actors.
     * @param callbackFn Function to call on all the actors.
     */
    static forEach(callbackFn) {
        Actor.allActors.forEach(callbackFn);
    }
}
Actor.allActors = [];
/// <reference path="_ref.ts" />
var Collision;
(function (Collision) {
    class PlatformObject {
        constructor(platform) {
            /**
             * Gets the Platform this PlatformObject belongs to.
             */
            this.getPlatform = () => {
                return this._platform;
            };
            /**
             * Gets position of this PlatformObject, which is the global position of the transform of the gameObject of the Platform component it belongs to.
             * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
             */
            this.getPosition = (outPos = null) => {
                return this._platform.getTransform().getGlobalPosition(outPos);
            };
            /**
             * PlatformObjects that aren't enabled won't be considered for collision.
             */
            this.isEnabled = () => {
                return this._enabled;
            };
            this.enable = () => {
                this._enabled = true;
            };
            this.disable = () => {
                this._enabled = false;
            };
            /**
             * The bits of this integer represent the layers this PlatformObject will collide with.
             * "I am a"
             */
            this.collisionLayers = 0x1;
            /**
             * Called by Handler.  Fills the given CollisionResponse, describing what happens when the given actor moves toward it.
             * This assumes platformObject's position after movement.
             */
            this.movingActorCollision = (response, movingActor, projectCollision) => {
                // to be overridden
                response.hit = false;
            };
            /**
             * Performs a raycast.
             * @param raycastHit put the results of the raycast here, rather than allocating a new RaycastHit.
             * @param origin origin of the ray being cast.
             * @param direction normalized direction of the ray being cast.
             * @param distance distance of the ray being cast.
             * @param collisionMask Bits representing the collision layers the ray will collide with.  Default is 0x7FFFFFFF.
             */
            this.raycast = (raycastHit, origin, direction, distance = Number.POSITIVE_INFINITY, collisionMask = 0x7FFFFFFF) => {
                // to be overridden
                raycastHit.hit = false;
            };
            /**
             * Returns if the given rectangle overlaps with this platform object.
             */
            this.rectOverlaps = (rect, collisionMask = 0x7FFFFFFF) => {
                // to be overridden
                return false;
            };
            /**
             * Removes references, self from allPlatformObjects.
             */
            this.destroy = () => {
                this.PlatformObject_destroy();
            };
            this.PlatformObject_destroy = () => {
                let index = PlatformObject._allPlatformObjects.indexOf(this);
                if (index != -1) {
                    PlatformObject._allPlatformObjects.splice(index, 1);
                }
                this._platform = null;
            };
            this._platform = null;
            this._enabled = true;
            this.tempVec2 = new Vec2();
            this.tempRect = new Rect();
            this._platform = platform;
            PlatformObject._allPlatformObjects.push(this);
        }
        /**
         * Calls forEach() on all the platform objects.
         * @param callbackFn Function to call on all the platform objects.
         */
        static forEach(callbackFn) {
            PlatformObject._allPlatformObjects.forEach(callbackFn);
        }
    }
    PlatformObject._allPlatformObjects = [];
    Collision.PlatformObject = PlatformObject;
})(Collision || (Collision = {}));
/// <reference path="_ref.ts" />
var Collision;
(function (Collision) {
    class MovingPlatformObject extends Collision.PlatformObject {
        constructor(platform) {
            super(platform);
            this.enable = () => {
                this.MovingPlatformObject_enable();
            };
            this.disable = () => {
                this.MovingPlatformObject_disable();
            };
            /**
             * Attach an actor.
             */
            this.attachActor = (actor) => {
                if (this.attachedActors.indexOf(actor) !== -1)
                    return;
                // actors can only be attached to one PlatformObject at a time.  First detach actor from previous PlatformObject if needed.
                if (actor.getAttachedMovingPlatformObject() !== null) {
                    actor.getAttachedMovingPlatformObject().detachActor(actor);
                }
                this.attachedActors.push(actor);
                // send attach message
                actor.gameObject.sendMessage("onPlatformAttach", this);
                this._platform.gameObject.sendMessage("onPlatformAttach", actor);
            };
            /**
             * Detaches an actor from the platform object.  This sends the onPlatformDetach(movingPlatformObject: Collision.MovingPlatformObject) event to the actor.
             * @param actor the Actor to detach.
             */
            this.detachActor = (actor) => {
                let index = this.attachedActors.indexOf(actor);
                if (index !== -1) {
                    this.attachedActors.splice(index, 1);
                    actor.gameObject.sendMessage("onPlatformDetach", this);
                    this._platform.gameObject.sendMessage("onPlatformDetach", actor);
                    return;
                }
            };
            /**
             * Detaches all actors from the platform object.
             */
            this.detachAllActors = () => {
                while (this.attachedActors.length > 0) {
                    this.detachActor(this.attachedActors[this.attachedActors.length - 1]);
                }
            };
            /**
             * Called by Handler.  Fills the given CollisionResponse, describing what happens when this platform moves towards the given actor.
             */
            this.movingPlatformCollision = (response, stationaryActor) => {
                // to be overridden
                response.hit = false;
            };
            /**
             * Called by Handler.  Fills the given newPosition Vec2 with the position the given attached actor should be next frame.
             */
            this.moveAttachedActor = (newPosition, stationaryActor) => {
                // can be overridden.  default code moves attached actor the same way the platform moved this frame.
                let diffX = this._platform.vx * Game.deltaTime;
                let diffY = this._platform.vy * Game.deltaTime;
                newPosition.setValues(stationaryActor.pos.x + diffX, stationaryActor.pos.y + diffY);
            };
            this.destroy = () => {
                this.MovingPlatformObject_destroy();
            };
            this.attachedActors = [];
            this.MovingPlatformObject_destroy = () => {
                this.detachAllActors();
                let index = MovingPlatformObject._allMovingPlatformObjects.indexOf(this);
                if (index != -1) {
                    MovingPlatformObject._allMovingPlatformObjects.splice(index, 1);
                }
                this.PlatformObject_destroy();
            };
            this.MovingPlatformObject_enable = () => {
                if (this._enabled)
                    return;
                this._enabled = true;
            };
            this.MovingPlatformObject_disable = () => {
                if (!this._enabled)
                    return;
                this._enabled = false;
                this.detachAllActors();
            };
            MovingPlatformObject._allMovingPlatformObjects.push(this);
        }
    }
    MovingPlatformObject._allMovingPlatformObjects = [];
    Collision.MovingPlatformObject = MovingPlatformObject;
})(Collision || (Collision = {}));
/// <reference path="_ref.ts" />
var Collision;
(function (Collision) {
    class AABBPlatformObject extends Collision.MovingPlatformObject {
        constructor(platform) {
            super(platform);
            this.offsetX = 0;
            this.offsetY = 0;
            this.halfWidth = 0;
            this.halfHeight = 0;
            /**
             * Gets x coordinate of the left edge of the AABB.
             */
            this.getLeft = () => {
                this.getPosition(this.tempVec2);
                return this.tempVec2.x + this.offsetX - this.halfWidth;
            };
            /**
             * Gets x coordinate of the right edge of the AABB.
             */
            this.getRight = () => {
                this.getPosition(this.tempVec2);
                return this.tempVec2.x + this.offsetX + this.halfWidth;
            };
            /**
             * Gets y coordinate of the top edge of the AABB.
             */
            this.getTop = () => {
                this.getPosition(this.tempVec2);
                return this.tempVec2.y + this.offsetY - this.halfHeight;
            };
            /**
             * Gets y coordinate of the bottom edge of the AABB.
             */
            this.getBottom = () => {
                this.getPosition(this.tempVec2);
                return this.tempVec2.y + this.offsetY + this.halfHeight;
            };
            /**
             * Gets Rect defining the bounds of this AABBPlatformObject.
             * @param outRect If given, this Rect will be filled instead of creating a new Rect (and null will be returned instead).
             */
            this.getRect = (outRect) => {
                this.getPosition(this.tempVec2);
                if (outRect == null) {
                    return new Rect(this.tempVec2.x + this.offsetX - this.halfWidth, this.tempVec2.y + this.offsetY - this.halfHeight, this.halfWidth * 2, this.halfHeight * 2);
                }
                else {
                    outRect.setValues(this.tempVec2.x + this.offsetX - this.halfWidth, this.tempVec2.y + this.offsetY - this.halfHeight, this.halfWidth * 2, this.halfHeight * 2);
                }
            };
            /**
             * Called by Handler.  Fills the given CollisionResponse, describing what happens when the given actor moves toward it.
             * This assumes platformObject's position after movement.
             */
            this.movingActorCollision = (response, movingActor, projectCollision) => {
                response.hit = false;
                response.actor = movingActor.actor;
                response.platformObject = this;
                this.getRect(this.tempRect);
                let left = this.tempRect.x + this._platform.vx * Game.deltaTime;
                let top = this.tempRect.y + this._platform.vy * Game.deltaTime;
                let right = this.tempRect.x + this.tempRect.width + this._platform.vx * Game.deltaTime;
                let bottom = this.tempRect.y + this.tempRect.height + this._platform.vy * Game.deltaTime;
                let aDiffX = movingActor.pos1.x - movingActor.pos0.x;
                let aDiffY = movingActor.pos1.y - movingActor.pos0.y;
                let aLeft = movingActor.pos0.x + movingActor.offset.x - movingActor.halfWidth;
                let aRight = movingActor.pos0.x + movingActor.offset.x + movingActor.halfWidth;
                let aTop = movingActor.pos0.y + movingActor.offset.y - movingActor.halfHeight;
                let aBottom = movingActor.pos0.y + movingActor.offset.y + movingActor.halfHeight;
                let EPSILON = .0001;
                if (aDiffX > 0) {
                    // test actor moving right to hit left side
                    let t = (left - aRight) / aDiffX - EPSILON;
                    if (-EPSILON < t && t <= 1) {
                        if (aTop + aDiffY * t <= bottom + EPSILON &&
                            aBottom + aDiffY * t >= top - EPSILON) {
                            // confirmed hit
                            response.hit = true;
                            response.time = t;
                            response.normal.setValues(-1, 0);
                            response.point.setValues(left, (Math.max(aTop + aDiffY * t, top) + Math.min(aBottom + aDiffY * t, bottom)) / 2);
                            // bullet reposition
                            response.reposition.setValues(movingActor.pos0.x + aDiffX * t - EPSILON * 2, movingActor.pos0.y + aDiffY * t);
                            // project reposition
                            if (projectCollision) {
                                response.repositionProject.setValues(left - movingActor.offset.x - movingActor.halfWidth - EPSILON * 2, movingActor.pos1.y);
                                response.type = Collision.ResponseType.PROJECT;
                            }
                            else {
                                response.type = Collision.ResponseType.BULLET;
                            }
                            return;
                        }
                    }
                }
                else if (aDiffX < 0) {
                    // test actor moving left to hit right side
                    let t = (right - aLeft) / aDiffX - EPSILON;
                    if (-EPSILON < t && t <= 1) {
                        if (aTop + aDiffY * t <= bottom + EPSILON &&
                            aBottom + aDiffY * t >= top - EPSILON) {
                            // confirmed hit
                            response.hit = true;
                            response.time = t;
                            response.normal.setValues(1, 0);
                            response.point.setValues(right, (Math.max(aTop + aDiffY * t, top) + Math.min(aBottom + aDiffY * t, bottom)) / 2);
                            // bullet reposition
                            response.reposition.setValues(movingActor.pos0.x + aDiffX * t + EPSILON * 2, movingActor.pos0.y + aDiffY * t);
                            // project reposition
                            if (projectCollision) {
                                response.repositionProject.setValues(right - movingActor.offset.x + movingActor.halfWidth + EPSILON * 2, movingActor.pos1.y);
                                response.type = Collision.ResponseType.PROJECT;
                            }
                            else {
                                response.type = Collision.ResponseType.BULLET;
                            }
                            return;
                        }
                    }
                }
                if (aDiffY > 0) {
                    // test actor moving down to hit top side
                    let t = (top - aBottom) / aDiffY - EPSILON;
                    if (-EPSILON < t && t <= 1) {
                        if (aLeft + aDiffX * t <= right + EPSILON &&
                            aRight + aDiffX * t >= left - EPSILON) {
                            // confirmed hit
                            response.hit = true;
                            response.time = t;
                            response.normal.setValues(0, -1);
                            response.point.setValues((Math.max(aLeft + aDiffX * t, left) + Math.min(aRight + aDiffX * t, right)) / 2, top);
                            // bullet reposition
                            response.reposition.setValues(movingActor.pos0.x + aDiffX * t, movingActor.pos0.y + aDiffY * t - EPSILON * 2);
                            // project reposition
                            if (projectCollision) {
                                response.repositionProject.setValues(movingActor.pos1.x, top - movingActor.offset.y - movingActor.halfHeight - EPSILON * 2);
                                response.type = Collision.ResponseType.PROJECT;
                            }
                            else {
                                response.type = Collision.ResponseType.BULLET;
                            }
                            return;
                        }
                    }
                }
                else if (aDiffY < 0) {
                    // test actor moving up to hit bottom side
                    let t = (bottom - aTop) / aDiffY - EPSILON;
                    if (-EPSILON < t && t <= 1) {
                        if (aLeft + aDiffX * t <= right + EPSILON &&
                            aRight + aDiffX * t >= left - EPSILON) {
                            // confirmed hit
                            response.hit = true;
                            response.time = t;
                            response.normal.setValues(0, 1);
                            response.point.setValues((Math.max(aLeft + aDiffX * t, left) + Math.min(aRight + aDiffX * t, right)) / 2, bottom);
                            // bullet reposition
                            response.reposition.setValues(movingActor.pos0.x + aDiffX * t, movingActor.pos0.y + aDiffY * t + EPSILON * 2);
                            // project reposition
                            if (projectCollision) {
                                response.repositionProject.setValues(movingActor.pos1.x, bottom - movingActor.offset.y + movingActor.halfHeight + EPSILON * 2);
                                response.type = Collision.ResponseType.PROJECT;
                            }
                            else {
                                response.type = Collision.ResponseType.BULLET;
                            }
                            return;
                        }
                    }
                }
                //// test for actor intersecting ("discrete" collision)
                //bool intersectCollision = false; // should be true
                //if (intersectCollision) {
                //    Shape.AABB actorBox = Handler.movingActorPos1BoundingBox(movingActor);
                //    if (Shape.intersects(actorBox, currentBoundingBox)) {
                //        // pos1 of actor intersects this platform, reposition it somewhere
                //        colResp.type = Handler.CollisionResponse.Type.INTERSECT;
                //        float ax = movingActor.pos1.x + movingActor.offset.x;
                //        float ay = movingActor.pos1.y + movingActor.offset.y;
                //        bool preferRight = ax > center.x; // prefer repositioning right if actor is more to the right
                //        bool preferUp = ay > center.y; // prefer repositioning up if actor is more above
                //        bool preferHoriz = (halfWidth - Mathf.Abs(ax - center.x)) < (halfHeight - Mathf.Abs(ay - center.y)); // prefer horizontal reposition or vertical reposition
                //        if (preferHoriz) {
                //            if (preferRight) {
                //                // reposition to right
                //                colResp.time = 0;
                //                colResp.normal = new Vector2(1, 0);
                //                colResp.point = new Vector2(right,
                //                    (Mathf.Max(aBottom + aDiff.y, bottom) + Mathf.Min(aTop + aDiff.y, top)) / 2);
                //                colResp.reposition = new Vector2(right - movingActor.offset.x + movingActor.halfWidth, movingActor.pos1.y);
                //                colResp.reposition.x += EPSILON * 2;
                //                return colResp;
                //            } else {
                //                // reposition to left
                //                colResp.time = 0;
                //                colResp.normal = new Vector2(-1, 0);
                //                colResp.point = new Vector2(left,
                //                    (Mathf.Max(aBottom + aDiff.y, bottom) + Mathf.Min(aTop + aDiff.y, top)) / 2);
                //                colResp.reposition = new Vector2(left - movingActor.offset.x - movingActor.halfWidth, movingActor.pos1.y);
                //                colResp.reposition.x -= EPSILON * 2;
                //                return colResp;
                //            }
                //        } else {
                //            if (preferUp) {
                //                // reposition above
                //                colResp.time = 0;
                //                colResp.normal = new Vector2(0, 1);
                //                colResp.point = new Vector2(
                //                    (Mathf.Max(aLeft + aDiff.x, left) + Mathf.Min(aRight + aDiff.x, right)) / 2,
                //                    top);
                //                colResp.reposition = new Vector2(movingActor.pos1.x, top - movingActor.offset.y + movingActor.halfHeight);
                //                colResp.reposition.y += EPSILON * 2;
                //                return colResp;
                //            } else {
                //                // reposition below
                //                colResp.time = 0;
                //                colResp.normal = new Vector2(0, -1);
                //                colResp.point = new Vector2(
                //                    (Mathf.Max(aLeft + aDiff.x, left) + Mathf.Min(aRight + aDiff.x, right)) / 2,
                //                    top);
                //                colResp.reposition = new Vector2(movingActor.pos1.x, bottom - movingActor.offset.y - movingActor.halfHeight);
                //                colResp.reposition.y -= EPSILON * 2;
                //                return colResp;
                //            }
                //        }
                //    }
                //}
            };
            /**
             * Called by Handler.  Fills the given CollisionResponse, describing what happens when this platform moves towards the given actor.
             */
            this.movingPlatformCollision = (response, stationaryActor) => {
                if (this._platform.vx === 0 && this._platform.vy === 0)
                    return;
                response.hit = false;
                response.actor = stationaryActor.actor;
                response.platformObject = this;
                response.type = Collision.ResponseType.MOVING_PLATFORM;
                this.getRect(this.tempRect);
                let left = this.tempRect.x;
                let top = this.tempRect.y;
                let right = this.tempRect.x + this.tempRect.width;
                let bottom = this.tempRect.y + this.tempRect.height;
                let diffX = this._platform.vx * Game.deltaTime;
                let diffY = this._platform.vy * Game.deltaTime;
                let aLeft = stationaryActor.pos.x + stationaryActor.offset.x - stationaryActor.halfWidth;
                let aRight = stationaryActor.pos.x + stationaryActor.offset.x + stationaryActor.halfWidth;
                let aTop = stationaryActor.pos.y + stationaryActor.offset.y - stationaryActor.halfHeight;
                let aBottom = stationaryActor.pos.y + stationaryActor.offset.y + stationaryActor.halfHeight;
                let EPSILON = .0001;
                let t = 0;
                if (diffX > 0) {
                    // platform moving right to hit left of actor
                    t = (aLeft - right) / diffX;
                    if (-EPSILON < t && t <= 1) {
                        if (top + diffY * t <= aBottom + EPSILON &&
                            bottom + diffY * t >= aTop - EPSILON) {
                            // confirmed hit
                            response.hit = true;
                            response.time = t;
                            response.normal.setValues(1, 0);
                            response.point.setValues(right + diffX, (Math.max(top + diffY * t, aTop) + Math.min(bottom + diffY * t, aBottom)) / 2);
                            response.reposition.setValues(right + diffX - stationaryActor.offset.x + stationaryActor.halfWidth + EPSILON * 2, stationaryActor.pos.y);
                            return;
                        }
                    }
                }
                else if (diffX < 0) {
                    // platform moving left to hit right of actor
                    t = (aRight - left) / diffX;
                    if (-EPSILON < t && t <= 1) {
                        if (top + diffY * t <= aBottom + EPSILON &&
                            bottom + diffY * t >= aTop - EPSILON) {
                            // confirmed hit
                            response.hit = true;
                            response.time = t;
                            response.normal.setValues(-1, 0);
                            response.point.setValues(left + diffX, (Math.max(top + diffY * t, aTop) + Math.min(bottom + diffY * t, aBottom)) / 2);
                            response.reposition.setValues(left + diffX - stationaryActor.offset.x - stationaryActor.halfWidth - EPSILON * 2, stationaryActor.pos.y);
                            return;
                        }
                    }
                }
                if (diffY > 0) {
                    // platform moving down to hit top of actor
                    t = (aTop - bottom) / diffY;
                    if (-EPSILON < t && t <= 1) {
                        if (left + diffX * t <= aRight + EPSILON &&
                            right + diffX * t >= aLeft - EPSILON) {
                            // confirmed hit
                            response.hit = true;
                            response.time = t;
                            response.normal.setValues(0, 1);
                            response.point.setValues((Math.max(left + diffX * t, aLeft) + Math.min(right + diffX * t, aRight)) / 2, bottom + diffY);
                            response.reposition.setValues(stationaryActor.pos.x, bottom + diffY - stationaryActor.offset.y + stationaryActor.halfHeight + EPSILON * 2);
                            return;
                        }
                    }
                }
                else if (diffY < 0) {
                    // platform moving up to hit bottom of actor
                    t = (aBottom - top) / diffY;
                    if (-EPSILON < t && t <= 1) {
                        if (left + diffX * t <= aRight + EPSILON &&
                            right + diffX * t >= aLeft - EPSILON) {
                            // confirmed hit
                            response.hit = true;
                            response.time = t;
                            response.normal.setValues(0, -1);
                            response.point.setValues((Math.max(left + diffX * t, aLeft) + Math.min(right + diffX * t, aRight)) / 2, top + diffY);
                            response.reposition.setValues(stationaryActor.pos.x, top + diffY - stationaryActor.offset.y - stationaryActor.halfHeight - EPSILON * 2);
                            return;
                        }
                    }
                }
            };
            /**
             * Performs a raycast.
             * @param raycastHit put the results of the raycast here, rather than allocating a new RaycastHit.
             * @param origin origin of the ray being cast.
             * @param direction normalized direction of the ray being cast.
             * @param distance distance of the ray being cast.
             * @param collisionMask Bits representing the collision layers the ray will collide with.  Default is 0x7FFFFFFF.
             */
            this.raycast = (raycastHit, origin, direction, distance = Number.POSITIVE_INFINITY, collisionMask = 0x7FFFFFFF) => {
                // return immediately if collision mask won't collide with this' collision layers.
                if (!Collision.maskCollidesWithLayers(collisionMask, this.collisionLayers)) {
                    raycastHit.hit = false;
                    return;
                }
                let pos = this.tempVec2;
                let left = this.getLeft();
                let top = this.getTop();
                let right = this.getRight();
                let bottom = this.getBottom();
                // do not consider a hit if ray starts inside the actor
                if (left < origin.x && origin.x < right &&
                    top < origin.y && origin.y < bottom) {
                    raycastHit.hit = false;
                    return;
                }
                let vertTime = -1;
                let horizTime = -1;
                if (direction.y < 0) {
                    // going up, hitting bottom side
                    vertTime = M.rayHorizontalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, bottom, left, right, distance);
                }
                else if (direction.y > 0) {
                    // going down, hitting top side
                    vertTime = M.rayHorizontalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, top, left, right, distance);
                }
                if (direction.x < 0) {
                    // going left, hitting right side
                    horizTime = M.rayVerticalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, right, top, bottom, distance);
                }
                else if (direction.x > 0) {
                    // going right, hitting left side
                    horizTime = M.rayVerticalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, left, top, bottom, distance);
                }
                let time = -1;
                if (horizTime != -1 && (vertTime == -1 || horizTime <= vertTime)) {
                    // hit horizontal wall
                    time = horizTime;
                    if (direction.x > 0) {
                        raycastHit.normal.setValues(-1, 0);
                    }
                    else {
                        raycastHit.normal.setValues(1, 0);
                    }
                }
                else if (vertTime != -1 && (horizTime == -1 || vertTime <= horizTime)) {
                    // hit vertical wall
                    time = vertTime;
                    if (direction.y > 0) {
                        raycastHit.normal.setValues(0, -1);
                    }
                    else {
                        raycastHit.normal.setValues(0, 1);
                    }
                }
                else {
                    // didn't hit anything
                    raycastHit.hit = false;
                    return;
                }
                // fill rest of raycastHit
                raycastHit.hit = true;
                raycastHit.platformObject = this;
                raycastHit.t = time;
                raycastHit.point.setValues(origin.x + direction.x * time, origin.y + direction.y * time);
            };
            /**
             * Returns if the given rectangle overlaps with this platform object.
             */
            this.rectOverlaps = (rect, collisionMask = 0x7FFFFFFF) => {
                if (!Collision.maskCollidesWithLayers(collisionMask, this.collisionLayers))
                    return false;
                this.getRect(this.tempRect);
                return rect.overlaps(this.tempRect);
            };
        }
    }
    Collision.AABBPlatformObject = AABBPlatformObject;
})(Collision || (Collision = {}));
/// <reference path="_ref.ts" />
var Collision;
(function (Collision) {
    class TiledMapTileLayerPlatformObject extends Collision.MovingPlatformObject {
        constructor(platform) {
            super(platform);
            /**
             * The TileLayer data this platform object is detecting collision for.
             */
            this.tiledMapLayer = null;
            /**
             * Performs a raycast.
             * @param raycastHit put the results of the raycast here, rather than allocating a new RaycastHit.
             * @param origin origin of the ray being cast.
             * @param direction normalized direction of the ray being cast.
             * @param distance distance of the ray being cast.
             * @param collisionMask Bits representing the collision layers the ray will collide with.  Default is 0x7FFFFFFF.
             */
            this.raycast = (raycastHit, origin, direction, distance = Number.POSITIVE_INFINITY, collisionMask = 0x7FFFFFFF) => {
                let originX = origin.x;
                let originY = origin.y;
                // offset by Platform's global position
                this.getPosition(this.tempGlobalPos);
                originX -= this.tempGlobalPos.x;
                originY -= this.tempGlobalPos.y;
                // getting information about the tile layer
                let numCols = this.tiledMapLayer.width;
                let numRows = this.tiledMapLayer.height;
                let tileWidth = this.tiledMapLayer.mapData.tileWidth;
                let tileHeight = this.tiledMapLayer.mapData.tileHeight;
                let t = 0;
                let col = 0;
                let row = 0;
                let x = 0;
                let y = 0;
                let tileInfo = null;
                let horizT = -1;
                let horizX = 0;
                let horizY = 0;
                if (direction.x > 0) {
                    // test hitting vertical wall going right
                    col = Math.ceil(originX / tileWidth);
                    for (; col < numCols; col++) {
                        // getting next tile and point of collision
                        x = col * tileWidth;
                        t = (x - originX) / direction.x;
                        y = originY + t * direction.y;
                        row = Math.floor(y / tileHeight);
                        // break if y is going off the map
                        if (row < 0 || row >= numRows)
                            break;
                        // break if going too far
                        if (t > distance)
                            break;
                        // check collision mask and layers
                        tileInfo = this.tiledMapLayer.getTileInfo(col, row);
                        if (!Collision.maskCollidesWithLayers(collisionMask, tileInfo.collisionLayers))
                            continue;
                        // collides with this tile
                        horizT = t;
                        horizX = x;
                        horizY = y;
                        break;
                    }
                }
                else if (direction.x < 0) {
                    // test hitting vertical wall going left
                    col = Math.floor(originX / tileWidth) - 1;
                    for (; col >= 0; col--) {
                        // getting next tile and point of collision
                        x = (col + 1) * tileWidth;
                        t = (x - originX) / direction.x;
                        y = originY + t * direction.y;
                        row = Math.floor(y / tileHeight);
                        // break if y is going off the map
                        if (row < 0 || row >= numRows)
                            break;
                        // break if going too far
                        if (t > distance)
                            break;
                        // check collision mask and layers
                        tileInfo = this.tiledMapLayer.getTileInfo(col, row);
                        if (!Collision.maskCollidesWithLayers(collisionMask, tileInfo.collisionLayers))
                            continue;
                        // collides with this tile
                        horizT = t;
                        horizX = x;
                        horizY = y;
                        break;
                    }
                }
                let vertT = -1;
                let vertX = 0;
                let vertY = 0;
                if (direction.y > 0) {
                    // test hitting horizontal wall going down
                    row = Math.ceil(originY / tileHeight);
                    for (; row < numRows; row++) {
                        // getting next tile and point of collision
                        y = row * tileHeight;
                        t = (y - originY) / direction.y;
                        x = originX + t * direction.x;
                        col = Math.floor(x / tileWidth);
                        // break if x is going off the map
                        if (col < 0 || col >= numCols)
                            break;
                        // break if going too far
                        if (t > distance)
                            break;
                        // check collision mask and layers
                        tileInfo = this.tiledMapLayer.getTileInfo(col, row);
                        if (!Collision.maskCollidesWithLayers(collisionMask, tileInfo.collisionLayers))
                            continue;
                        // collides with this tile
                        vertT = t;
                        vertX = x;
                        vertY = y;
                        break;
                    }
                }
                else if (direction.y < 0) {
                    // test hitting horizontal wall going up
                    row = Math.floor(originY / tileHeight) - 1;
                    for (; row >= 0; row--) {
                        // getting next tile and point of collision
                        y = (row + 1) * tileHeight;
                        t = (y - originY) / direction.y;
                        x = originX + t * direction.x;
                        col = Math.floor(x / tileWidth);
                        // break if x is going off the map
                        if (col < 0 || col >= numCols)
                            break;
                        // break if going too far
                        if (t > distance)
                            break;
                        // check collision mask and layers
                        tileInfo = this.tiledMapLayer.getTileInfo(col, row);
                        if (!Collision.maskCollidesWithLayers(collisionMask, tileInfo.collisionLayers))
                            continue;
                        // collides with this tile
                        vertT = t;
                        vertX = x;
                        vertY = y;
                        break;
                    }
                }
                // resolve
                if (horizT == -1 && vertT == -1) {
                    // didn't hit anything
                    raycastHit.hit = false;
                }
                else if (horizT !== -1 && (vertT === -1 || horizT < vertT)) {
                    // hit horizontal
                    raycastHit.hit = true;
                    raycastHit.t = horizT;
                    raycastHit.point.setValues(horizX, horizY);
                    if (direction.x > 0) {
                        raycastHit.normal.setValues(-1, 0);
                    }
                    else {
                        raycastHit.normal.setValues(1, 0);
                    }
                }
                else {
                    // hit vertical
                    raycastHit.hit = true;
                    raycastHit.t = vertT;
                    raycastHit.point.setValues(vertX, vertY);
                    if (direction.y > 0) {
                        raycastHit.normal.setValues(0, -1);
                    }
                    else {
                        raycastHit.normal.setValues(0, 1);
                    }
                }
                if (raycastHit.hit) {
                    raycastHit.platformObject = this;
                    // offset by Platform's global position
                    raycastHit.point.x += this.tempGlobalPos.x;
                    raycastHit.point.y += this.tempGlobalPos.y;
                }
            };
            /**
             * Called by Handler.  Fills the given CollisionResponse, describing what happens when the given actor moves toward it.
             * This assumes platformObject's position after movement.
             */
            this.movingActorCollision = (response, movingActor, projectCollision) => {
                // getting information about the actor
                let aDiffX = movingActor.pos1.x - movingActor.pos0.x;
                let aDiffY = movingActor.pos1.y - movingActor.pos0.y;
                let aCollisionMask = movingActor.collisionMask;
                let aX = movingActor.pos0.x;
                let aY = movingActor.pos0.y;
                // offset by Platform's global position
                this.getPosition(this.tempGlobalPos);
                this.tempGlobalPos.x += this._platform.vx * Game.deltaTime;
                this.tempGlobalPos.y += this._platform.vy * Game.deltaTime;
                aX -= this.tempGlobalPos.x;
                aY -= this.tempGlobalPos.y;
                let aLeft = aX + movingActor.offset.x - movingActor.halfWidth;
                let aTop = aY + movingActor.offset.y - movingActor.halfHeight;
                let aRight = aLeft + movingActor.halfWidth * 2;
                let aBottom = aTop + movingActor.halfHeight * 2;
                // getting information about the tile layer
                let numCols = this.tiledMapLayer.width;
                let numRows = this.tiledMapLayer.height;
                let tileWidth = this.tiledMapLayer.mapData.tileWidth;
                let tileHeight = this.tiledMapLayer.mapData.tileHeight;
                let t = 0;
                let col = 0;
                let x = 0;
                let yTop = 0;
                let yBottom = 0;
                let rowTop = 0;
                let rowBottom = 0;
                let row = 0;
                let y = 0;
                let xLeft = 0;
                let xRight = 0;
                let colLeft = 0;
                let colRight = 0;
                let tileInfo = null;
                let EPSILON = .0001;
                let horizT = -1;
                let horizX = 0;
                let horizY = 0;
                let vertT = -1;
                let vertX = 0;
                let vertY = 0;
                if (aDiffX > 0) {
                    // test hitting vertical wall going right
                    col = Math.ceil((aRight - EPSILON) / tileWidth);
                    for (; col < numCols; col++) {
                        // getting next tile and point of collision
                        x = col * tileWidth;
                        t = (x - aRight) / aDiffX;
                        yTop = aTop + t * aDiffY;
                        yBottom = aBottom + t * aDiffY;
                        rowTop = Math.max(0, Math.floor(yTop / tileHeight));
                        rowBottom = Math.min(numRows - 1, Math.floor(yBottom / tileHeight));
                        // break if y is going off the map
                        if (rowBottom < 0 || rowTop >= numRows)
                            break;
                        // break if going past aDiffX
                        if (t > 1)
                            break;
                        for (let r = rowTop; r <= rowBottom; r++) {
                            // check collision mask and layers
                            tileInfo = this.tiledMapLayer.getTileInfo(col, r);
                            if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                                continue;
                            // collides with this tile
                            horizT = t;
                            horizX = x; // set to col * tileWidth
                            horizY = (yTop + yBottom) / 2;
                            break;
                        }
                        // break if got hit
                        if (horizT !== -1)
                            break;
                    }
                }
                else if (aDiffX < 0) {
                    // test hitting vertical wall going left
                    col = Math.floor((aLeft + EPSILON) / tileWidth) - 1;
                    for (; col >= 0; col--) {
                        // getting next tile and point of collision
                        x = (col + 1) * tileWidth;
                        t = (x - aLeft) / aDiffX;
                        yTop = aTop + t * aDiffY;
                        yBottom = aBottom + t * aDiffY;
                        rowTop = Math.max(0, Math.floor(yTop / tileHeight));
                        rowBottom = Math.min(numRows - 1, Math.floor(yBottom / tileHeight));
                        // break if y is going off the map
                        if (rowBottom < 0 || rowTop >= numRows)
                            break;
                        // break if going past aDiffX
                        if (t > 1)
                            break;
                        for (let r = rowTop; r <= rowBottom; r++) {
                            // check collision mask and layers
                            tileInfo = this.tiledMapLayer.getTileInfo(col, r);
                            if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                                continue;
                            // collides with this tile
                            horizT = t;
                            horizX = x; // set to (col + 1) * tileWidth
                            horizY = (yTop + yBottom) / 2;
                            break;
                        }
                        // break if got hit
                        if (horizT !== -1)
                            break;
                    }
                }
                // work here on vertical
                if (aDiffY > 0) {
                    // test hitting horizontal wall going down
                    row = Math.ceil((aBottom - EPSILON) / tileHeight);
                    for (; row < numRows; row++) {
                        // getting next tile and point of collision
                        y = row * tileHeight;
                        t = (y - aBottom) / aDiffY;
                        xLeft = aLeft + t * aDiffX;
                        xRight = aRight + t * aDiffX;
                        colLeft = Math.max(0, Math.floor(xLeft / tileWidth));
                        colRight = Math.min(numCols - 1, Math.floor(xRight / tileWidth));
                        // break if x is going off the map
                        if (colLeft < 0 || colRight >= numCols)
                            break;
                        // break if going past aDiffY
                        if (t > 1)
                            break;
                        for (let c = colLeft; c <= colRight; c++) {
                            // check collision mask and layers
                            tileInfo = this.tiledMapLayer.getTileInfo(c, row);
                            if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                                continue;
                            // collides with this tile
                            vertT = t;
                            vertY = y; // set to row * tileHeight
                            vertX = (xLeft + xRight) / 2;
                            break;
                        }
                        // break if got hit
                        if (vertT !== -1)
                            break;
                    }
                }
                else if (aDiffY < 0) {
                    // test hitting horizontal wall going up
                    row = Math.floor((aTop + EPSILON) / tileHeight) - 1;
                    for (; row >= 0; row--) {
                        // getting next tile and point of collision
                        y = (row + 1) * tileHeight;
                        t = (y - aTop) / aDiffY;
                        xLeft = aLeft + t * aDiffX;
                        xRight = aRight + t * aDiffX;
                        colLeft = Math.max(0, Math.floor(xLeft / tileWidth));
                        colRight = Math.min(numCols - 1, Math.floor(xRight / tileWidth));
                        // break if x is going off the map
                        if (colLeft < 0 || colRight >= numCols)
                            break;
                        // break if going past aDiffY
                        if (t > 1)
                            break;
                        for (let c = colLeft; c <= colRight; c++) {
                            // check collision mask and layers
                            tileInfo = this.tiledMapLayer.getTileInfo(c, row);
                            if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                                continue;
                            // collides with this tile
                            vertT = t;
                            vertY = y; // set to (row + 1) * tileHeight
                            vertX = (xLeft + xRight) / 2;
                            break;
                        }
                        // break if got hit
                        if (vertT !== -1)
                            break;
                    }
                }
                // resolve
                if (horizT == -1 && vertT == -1) {
                    // didn't hit anything
                    response.hit = false;
                }
                else if (horizT !== -1 && (vertT === -1 || horizT < vertT)) {
                    // hit horizontal
                    response.hit = true;
                    response.time = horizT;
                    if (aDiffX > 0) {
                        // going right, reposition to left
                        response.normal.setValues(-1, 0);
                        response.point.setValues(horizX, horizY);
                        // bullet reposition
                        response.reposition.setValues(aX + aDiffX * horizT - EPSILON * 2, aY + aDiffY * horizT);
                        // project reposition
                        if (projectCollision) {
                            response.repositionProject.setValues(horizX - movingActor.offset.x - movingActor.halfWidth - EPSILON * 2, aY + aDiffY);
                            response.type = Collision.ResponseType.PROJECT;
                        }
                        else {
                            response.type = Collision.ResponseType.BULLET;
                        }
                    }
                    else {
                        // going left, reposition to right
                        response.normal.setValues(1, 0);
                        response.point.setValues(horizX, horizY);
                        // bullet reposition
                        response.reposition.setValues(aX + aDiffX * horizT + EPSILON * 2, aY + aDiffY * horizT);
                        // project reposition
                        if (projectCollision) {
                            response.repositionProject.setValues(horizX - movingActor.offset.x + movingActor.halfWidth + EPSILON * 2, aY + aDiffY);
                            response.type = Collision.ResponseType.PROJECT;
                        }
                        else {
                            response.type = Collision.ResponseType.BULLET;
                        }
                    }
                }
                else {
                    // hit vertical
                    response.hit = true;
                    response.time = vertT;
                    if (aDiffY > 0) {
                        // going down, reposition to top
                        response.normal.setValues(0, -1);
                        response.point.setValues(vertX, vertY);
                        // bullet reposition
                        response.reposition.setValues(aX + aDiffX * vertT, aY + aDiffY * vertT - EPSILON * 2);
                        // project reposition
                        if (projectCollision) {
                            response.repositionProject.setValues(aX + aDiffX, vertY - movingActor.offset.y - movingActor.halfHeight - EPSILON * 2);
                            response.type = Collision.ResponseType.PROJECT;
                        }
                        else {
                            response.type = Collision.ResponseType.BULLET;
                        }
                    }
                    else {
                        // going up, reposition to bottom
                        response.normal.setValues(0, 1);
                        response.point.setValues(vertX, vertY);
                        // bullet reposition
                        response.reposition.setValues(aX + aDiffX * vertT, aY + aDiffY * vertT + EPSILON * 2);
                        // project reposition
                        if (projectCollision) {
                            response.repositionProject.setValues(aX + aDiffX, vertY - movingActor.offset.y + movingActor.halfHeight + EPSILON * 2);
                            response.type = Collision.ResponseType.PROJECT;
                        }
                        else {
                            response.type = Collision.ResponseType.BULLET;
                        }
                    }
                }
                if (response.hit) {
                    response.platformObject = this;
                    response.actor = movingActor.actor;
                    // offset by Platform's global position
                    response.point.x += this.tempGlobalPos.x;
                    response.reposition.x += this.tempGlobalPos.x;
                    response.repositionProject.x += this.tempGlobalPos.x;
                    response.point.y += this.tempGlobalPos.y;
                    response.reposition.y += this.tempGlobalPos.y;
                    response.repositionProject.y += this.tempGlobalPos.y;
                }
            };
            /**
             * Called by Handler.  Fills the given CollisionResponse, describing what happens when this platform moves towards the given actor.
             */
            this.movingPlatformCollision = (response, stationaryActor) => {
                // getting information about platform's movement
                if (this._platform.vx === 0 && this._platform.vy === 0)
                    return;
                let diffX = this._platform.vx * Game.deltaTime;
                let diffY = this._platform.vy * Game.deltaTime;
                // getting information about the actor
                let aCollisionMask = stationaryActor.collisionMask;
                let aX = stationaryActor.pos.x;
                let aY = stationaryActor.pos.y;
                // offset by Platform's global position
                this.getPosition(this.tempGlobalPos);
                aX -= this.tempGlobalPos.x;
                aY -= this.tempGlobalPos.y;
                let aLeft = aX + stationaryActor.offset.x - stationaryActor.halfWidth;
                let aTop = aY + stationaryActor.offset.y - stationaryActor.halfHeight;
                let aRight = aLeft + stationaryActor.halfWidth * 2;
                let aBottom = aTop + stationaryActor.halfHeight * 2;
                // getting information about the tile layer
                let numCols = this.tiledMapLayer.width;
                let numRows = this.tiledMapLayer.height;
                let tileWidth = this.tiledMapLayer.mapData.tileWidth;
                let tileHeight = this.tiledMapLayer.mapData.tileHeight;
                let t = 0;
                let col = 0;
                let x = 0;
                let yTop = 0;
                let yBottom = 0;
                let rowTop = 0;
                let rowBottom = 0;
                let row = 0;
                let y = 0;
                let xLeft = 0;
                let xRight = 0;
                let colLeft = 0;
                let colRight = 0;
                let tileInfo = null;
                let EPSILON = .0001;
                let horizT = -1;
                let horizX = 0;
                let horizY = 0;
                let vertT = -1;
                let vertX = 0;
                let vertY = 0;
                if (diffX < 0) {
                    // test going left, hitting actor's right side
                    col = Math.ceil((aRight - EPSILON) / tileWidth);
                    for (; col < numCols; col++) {
                        // getting next tile and point of collision
                        x = col * tileWidth;
                        t = (x - aRight) / -diffX;
                        yTop = aTop + t * -diffY;
                        yBottom = aBottom + t * -diffY;
                        rowTop = Math.max(0, Math.floor(yTop / tileHeight));
                        rowBottom = Math.min(numRows - 1, Math.floor(yBottom / tileHeight));
                        // break if y is going off the map
                        if (rowBottom < 0 || rowTop >= numRows)
                            break;
                        // break if going past diffX
                        if (t > 1)
                            break;
                        for (let r = rowTop; r <= rowBottom; r++) {
                            // check collision mask and layers
                            tileInfo = this.tiledMapLayer.getTileInfo(col, r);
                            if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                                continue;
                            // collides with this tile
                            horizT = t;
                            horizX = x; // set to col * tileWidth
                            horizY = (yTop + yBottom) / 2;
                            break;
                        }
                        // break if got hit
                        if (horizT !== -1)
                            break;
                    }
                }
                else if (diffX > 0) {
                    // test going right, hitting actor's left side
                    col = Math.floor((aLeft + EPSILON) / tileWidth) - 1;
                    for (; col >= 0; col--) {
                        // getting next tile and point of collision
                        x = (col + 1) * tileWidth;
                        t = (x - aLeft) / -diffX;
                        yTop = aTop + t * -diffY;
                        yBottom = aBottom + t * -diffY;
                        rowTop = Math.max(0, Math.floor(yTop / tileHeight));
                        rowBottom = Math.min(numRows - 1, Math.floor(yBottom / tileHeight));
                        // break if y is going off the map
                        if (rowBottom < 0 || rowTop >= numRows)
                            break;
                        // break if going past diffX
                        if (t > 1)
                            break;
                        for (let r = rowTop; r <= rowBottom; r++) {
                            // check collision mask and layers
                            tileInfo = this.tiledMapLayer.getTileInfo(col, r);
                            if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                                continue;
                            // collides with this tile
                            horizT = t;
                            horizX = x; // set to (col + 1) * tileWidth
                            horizY = (yTop + yBottom) / 2;
                            break;
                        }
                        // break if got hit
                        if (horizT !== -1)
                            break;
                    }
                }
                if (diffY < 0) {
                    // test going up, hitting actor's bottom side
                    row = Math.ceil((aBottom - EPSILON) / tileHeight);
                    for (; row < numRows; row++) {
                        // getting next tile and point of collision
                        y = row * tileHeight;
                        t = (y - aBottom) / -diffY;
                        xLeft = aLeft + t * -diffX;
                        xRight = aRight + t * -diffX;
                        colLeft = Math.max(0, Math.floor(xLeft / tileWidth));
                        colRight = Math.min(numCols - 1, Math.floor(xRight / tileWidth));
                        // break if x is going off the map
                        if (colRight < 0 || colLeft >= numCols)
                            break;
                        // break if going past diffY
                        if (t > 1)
                            break;
                        for (let c = colLeft; c <= colRight; c++) {
                            // check collision mask and layers
                            tileInfo = this.tiledMapLayer.getTileInfo(c, row);
                            if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                                continue;
                            // collides with this tile
                            vertT = t;
                            vertX = (xLeft + xRight) / 2;
                            vertY = y; // set to row * tileHeight
                            break;
                        }
                        // break if got hit
                        if (vertT !== -1)
                            break;
                    }
                }
                else if (diffY > 0) {
                    // test going down, hitting actor's top side
                    row = Math.floor((aTop + EPSILON) / tileHeight) - 1;
                    for (; row >= 0; row--) {
                        // getting next tile and point of collision
                        y = (row + 1) * tileHeight;
                        t = (y - aTop) / -diffY;
                        xLeft = aLeft + t * -diffX;
                        xRight = aRight + t * -diffX;
                        colLeft = Math.max(0, Math.floor(xLeft / tileWidth));
                        colRight = Math.min(numCols - 1, Math.floor(xRight / tileWidth));
                        // break if x is going off the map
                        if (colRight < 0 || colLeft >= numCols)
                            break;
                        // break if going past diffY
                        if (t > 1)
                            break;
                        for (let c = colLeft; c <= colRight; c++) {
                            // check collision mask and layers
                            tileInfo = this.tiledMapLayer.getTileInfo(c, row);
                            if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                                continue;
                            // collides with this tile
                            vertT = t;
                            vertX = (xLeft + xRight) / 2;
                            vertY = y; // set to (row + 1) * tileHeight
                            break;
                        }
                        // break if got hit
                        if (vertT !== -1)
                            break;
                    }
                }
                // resolve
                if (horizT == -1 && vertT == -1) {
                    // didn't hit anything
                    response.hit = false;
                }
                else if (horizT !== -1 && (vertT === -1 || horizT < vertT)) {
                    // hit horizontal
                    response.hit = true;
                    response.time = horizT;
                    if (diffX < 0) {
                        // going left, reposition actor to left
                        response.normal.setValues(-1, 0);
                        response.point.setValues(horizX + diffX, horizY + diffY);
                        // reposition
                        //response.reposition.setValues(
                        //    horizX + diffX - stationaryActor.offset.x - stationaryActor.halfWidth - EPSILON * 2,
                        //    aY
                        //);
                        response.reposition.setValues(horizX + diffX - stationaryActor.offset.x - stationaryActor.halfWidth - EPSILON * 2, aY + diffY * (1 - horizT));
                    }
                    else {
                        // going right, reposition actor to right
                        response.normal.setValues(1, 0);
                        response.point.setValues(horizX + diffX, horizY + diffY);
                        // reposition
                        //response.reposition.setValues(
                        //    horizX + diffX - stationaryActor.offset.x + stationaryActor.halfWidth + EPSILON * 2,
                        //    aY
                        //);
                        response.reposition.setValues(horizX + diffX - stationaryActor.offset.x + stationaryActor.halfWidth + EPSILON * 2, aY + diffY * (1 - horizT));
                    }
                }
                else {
                    // hit vertical
                    response.hit = true;
                    response.time = vertT;
                    if (diffY < 0) {
                        // going up, reposition actor to top
                        response.normal.setValues(0, -1);
                        response.point.setValues(vertX + diffX, vertY + diffY);
                        // reposition
                        //response.reposition.setValues(
                        //    aX,
                        //    vertY + diffY - stationaryActor.offset.y - stationaryActor.halfHeight - EPSILON * 2
                        //);
                        response.reposition.setValues(aX + diffX * (1 - vertT), vertY + diffY - stationaryActor.offset.y - stationaryActor.halfHeight - EPSILON * 2);
                    }
                    else {
                        // going down, reposition actor to bottom
                        response.normal.setValues(0, 1);
                        response.point.setValues(vertX + diffX, vertY + diffY);
                        // reposition
                        //response.reposition.setValues(
                        //    aX,
                        //    vertY + diffY - stationaryActor.offset.y + stationaryActor.halfHeight + EPSILON * 2
                        //);
                        response.reposition.setValues(aX + diffX * (1 - vertT), vertY + diffY - stationaryActor.offset.y + stationaryActor.halfHeight + EPSILON * 2);
                    }
                }
                if (response.hit) {
                    response.platformObject = this;
                    response.actor = stationaryActor.actor;
                    response.type = Collision.ResponseType.MOVING_PLATFORM;
                    // offset by Platform's global position
                    response.point.x += this.tempGlobalPos.x;
                    response.reposition.x += this.tempGlobalPos.x;
                    response.point.y += this.tempGlobalPos.y;
                    response.reposition.y += this.tempGlobalPos.y;
                }
            };
            /**
             * Returns if the given rectangle overlaps with this platform object.
             */
            this.rectOverlaps = (rect, collisionMask = 0x7FFFFFFF) => {
                let left = rect.x;
                let top = rect.y;
                // offset by Platform's global position
                this.getPosition(this.tempGlobalPos);
                left -= this.tempGlobalPos.x;
                top -= this.tempGlobalPos.y;
                let right = left + rect.width;
                let bottom = top + rect.height;
                let numCols = this.tiledMapLayer.width;
                let numRows = this.tiledMapLayer.height;
                let tileWidth = this.tiledMapLayer.mapData.tileWidth;
                let tileHeight = this.tiledMapLayer.mapData.tileHeight;
                let tileInfo = null;
                let colMin = Math.max(0, Math.floor(left / tileWidth));
                let colMax = Math.min(numCols - 1, Math.floor(right / tileWidth));
                let rowMin = Math.max(0, Math.floor(top / tileHeight));
                let rowMax = Math.min(numRows - 1, Math.floor(bottom / tileHeight));
                for (let col = colMin; col <= colMax; col++) {
                    for (let row = rowMin; row <= rowMax; row++) {
                        tileInfo = this.tiledMapLayer.getTileInfo(col, row);
                        if (Collision.maskCollidesWithLayers(collisionMask, tileInfo.collisionLayers))
                            return true;
                    }
                }
                return false;
            };
            this.destroy = () => {
                this.tiledMapLayer = null;
                this.MovingPlatformObject_destroy();
            };
            this.tempGlobalPos = new Vec2();
            // represents all collision layers of tiles
            this.collisionLayers = 0x7FFFFFFF;
        }
    }
    Collision.TiledMapTileLayerPlatformObject = TiledMapTileLayerPlatformObject;
})(Collision || (Collision = {}));
/// <reference path="_ref.ts" />
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
class Platform extends Component {
    constructor() {
        super();
        this.onAwake = () => {
            Platform.allPlatforms.push(this);
        };
        /**
         * Gets position of this transform in the global space.
         * @param outPos If given, this Vec2 will be filled instead of creating a new Vec2 (and null will be returned instead).
         */
        this.getGlobalPosition = (outPos = null) => {
            return this.getTransform().getGlobalPosition(outPos);
        };
        /**
         * Sets position of this transform in the global space.
         */
        this.setGlobalPosition = (x, y) => {
            this.getTransform().setGlobalPosition(x, y);
        };
        /**
         * velocity x
         */
        this.vx = 0;
        /**
         * velocity y
         */
        this.vy = 0;
        /**
         * Sets velocity such that the platform will be in the given position when the frame ends.
         */
        this.setVelocityForNextPosition = (x, y) => {
            if (Game.deltaTime < .0001) {
                this.setGlobalPosition(x, y);
                return;
            }
            this.getGlobalPosition(this.tempVec2);
            this.vx = (x - this.tempVec2.x) / Game.deltaTime;
            this.vy = (y - this.tempVec2.y) / Game.deltaTime;
        };
        /**
         * Sets the collision layers for each PlatformObject belonging to this Platform.
         */
        this.setCollisionLayers = (collisionLayers) => {
            this.platformObjects.forEach(function (platformObject) {
                platformObject.collisionLayers = collisionLayers;
            });
        };
        this.onDestroy = () => {
            // clear platformObjects
            this.platformObjects.forEach(function (platformObject) {
                platformObject.destroy();
            });
            this.platformObjects.splice(0);
            // remove from allPlatforms
            let index = Platform.allPlatforms.indexOf(this);
            if (index !== -1) {
                Platform.allPlatforms.splice(index, 1);
            }
        };
        this.platformObjects = [];
        this.tempVec2 = new Vec2();
        this.name = "Platform";
        this.componentProperties.only1 = true;
        this.componentProperties.excludeComponent(Actor);
    }
    /**
     * Calls forEach() on all the platforms.
     * @param callbackFn Function to call on all the platforms.
     */
    static forEach(callbackFn) {
        Platform.allPlatforms.forEach(callbackFn);
    }
}
Platform.allPlatforms = [];
/// <reference path="_ref.ts" />
var Direction;
(function (Direction) {
    Direction[Direction["NONE"] = 0] = "NONE";
    Direction[Direction["RIGHT"] = 1] = "RIGHT";
    Direction[Direction["DOWN"] = 2] = "DOWN";
    Direction[Direction["LEFT"] = 3] = "LEFT";
    Direction[Direction["UP"] = 4] = "UP";
})(Direction || (Direction = {}));
var Collision;
(function (Collision) {
    /**
     * Gravity acceleration in the x direction.  Affects Actor movement.
     */
    Collision.gravityX = 0;
    /**
     * Gravity acceleration in the y direction.  Affects Actor movement.
     */
    Collision.gravityY = 600;
    class RaycastHit {
        constructor() {
            /**
             * Whether or not the ray hit something.
             */
            this.hit = false;
            this.actor = null;
            this.platformObject = null;
            /**
             * Point in global space where the ray hit the object.
             */
            this.point = new Vec2();
            /**
             * raycast origin + raycast direction * t = point
             */
            this.t = 0;
            /**
             * The (normalized) normal vector of the surface hit by the ray.
             */
            this.normal = new Vec2();
            /**
             * Clones this RaycastHit.
             */
            this.clone = () => {
                let ret = new RaycastHit();
                ret.setRaycastHit(this);
                return ret;
            };
            /**
             * Sets these values to match the values of the given RaycastHit.
             */
            this.setRaycastHit = (raycastHit) => {
                this.hit = raycastHit.hit;
                this.actor = raycastHit.actor;
                this.platformObject = raycastHit.platformObject;
                this.point.setValues(raycastHit.point.x, raycastHit.point.y);
                this.t = raycastHit.t;
                this.normal.setValues(raycastHit.normal.x, raycastHit.normal.y);
            };
        }
    }
    Collision.RaycastHit = RaycastHit;
    function raycastAllActorsNonAlloc(raycastHit, originX, originY, directionX, directionY, distance = Number.POSITIVE_INFINITY, teamMask = Team.ALL) {
        raycastHit.hit = false;
        raycastHit.t = Number.MAX_VALUE;
        tempOrigin.setValues(originX, originY);
        tempDirection.setValues(directionX, directionY);
        Actor.forEach(function (actor) {
            tempRaycastHit.hit = false;
            actor.raycast(tempRaycastHit, tempOrigin, tempDirection, distance, teamMask);
            if (tempRaycastHit.hit && tempRaycastHit.t < raycastHit.t) {
                // hit actor and before last hit actor
                raycastHit.setRaycastHit(tempRaycastHit);
            }
        });
    }
    Collision.raycastAllActorsNonAlloc = raycastAllActorsNonAlloc;
    function raycastAllPlatformObjectsNonAlloc(raycastHit, originX, originY, directionX, directionY, distance = Number.POSITIVE_INFINITY, collisionMask = 0x7FFFFFFF) {
        raycastHit.hit = false;
        raycastHit.t = Number.MAX_VALUE;
        tempOrigin.setValues(originX, originY);
        tempDirection.setValues(directionX, directionY);
        Collision.PlatformObject.forEach(function (platformObject) {
            tempRaycastHit.hit = false;
            if (Collision.maskCollidesWithLayers(collisionMask, platformObject.collisionLayers)) {
                platformObject.raycast(tempRaycastHit, tempOrigin, tempDirection, distance, collisionMask);
                if (tempRaycastHit.hit && tempRaycastHit.t < raycastHit.t) {
                    // hit platform object and before last hit platform object
                    raycastHit.setRaycastHit(tempRaycastHit);
                }
            }
        });
    }
    Collision.raycastAllPlatformObjectsNonAlloc = raycastAllPlatformObjectsNonAlloc;
    /**
     * Fills the given platformObjects array with all the platformObjects the given rect overlaps.
     * Note that since actors are repositioned with a tiny bit of space between them and the platform they collided with,
     * an actor's rect should not be overlapping with the platform it collided with.
     * @param platformObjects Out parameter that will be filled with PlatformObjects.
     * @param rect The rectangle to test.
     * @param collisionMask Collision mask to filter collision.
     */
    function rectOverlapAllPlatformObjectsNonAlloc(platformObjects, rect, collisionMask = 0x7FFFFFFF) {
        platformObjects.splice(0);
        Collision.PlatformObject.forEach(function (platformObject) {
            if (Collision.maskCollidesWithLayers(collisionMask, platformObject.collisionLayers)) {
                if (platformObject.rectOverlaps(rect, collisionMask)) {
                    platformObjects.push(platformObject);
                }
            }
        });
    }
    Collision.rectOverlapAllPlatformObjectsNonAlloc = rectOverlapAllPlatformObjectsNonAlloc;
    /**
     * Returns if an Actor with the given collisionMask will collide with a PlatformObject with the given collisionLayers.
     * @param collisionMask
     * @param collisionLayers
     */
    function maskCollidesWithLayers(collisionMask, collisionLayers) {
        return (collisionMask & collisionLayers) !== 0;
    }
    Collision.maskCollidesWithLayers = maskCollidesWithLayers;
    /**
     * Returns the Direction of the normal angle.
     * @param normalX x of the normal vector
     * @param normalY y of the normal vector
     * @param thresholdAngleDegrees Angle in (0, 90).  The returned direction will be RIGHT iff the normal angle is in between -threshold and threshold.
     */
    function getNormalDirection(normalX, normalY, thresholdAngleDegrees = 45) {
        let thresholdAngle = thresholdAngleDegrees * M.degToRad;
        let normalAngle = Math.atan2(normalY, normalX);
        if (normalAngle < 0)
            normalAngle += Math.PI * 2; // keep angle in [0, 2pi)
        if (normalAngle < thresholdAngle) {
            return Direction.RIGHT;
        }
        else if (normalAngle < Math.PI - thresholdAngle) {
            return Direction.DOWN;
        }
        else if (normalAngle < Math.PI + thresholdAngle) {
            return Direction.LEFT;
        }
        else if (normalAngle < Math.PI * 2 - thresholdAngle) {
            return Direction.UP;
        }
        return Direction.RIGHT;
    }
    Collision.getNormalDirection = getNormalDirection;
    /**
     * Describes the current position of an actor.
     */
    class StationaryActor {
        constructor() {
            /**
             * Position of the actor.
             */
            this.pos = new Vec2();
            /**
             * Center in the actor's local space.
             */
            this.offset = new Vec2();
        }
    }
    Collision.StationaryActor = StationaryActor;
    /**
     * Describes movement of an actor over 1 frame.
     */
    class MovingActor {
        constructor() {
            /**
             * Position of the actor at time 0.
             */
            this.pos0 = new Vec2();
            /**
             * Position of the actor at time 1.
             */
            this.pos1 = new Vec2();
            /**
             * Center in the actor's local space.
             */
            this.offset = new Vec2();
        }
    }
    Collision.MovingActor = MovingActor;
    (function (ResponseType) {
        /**
         * Actor hits PlatformObject at time t (time property).  Reposition Actor at that moment.
         */
        ResponseType[ResponseType["BULLET"] = 0] = "BULLET";
        /**
         * Actor hits PlatformObject at time t (time property), but it should be positioned somewhere else (given by reposition property).
         */
        ResponseType[ResponseType["PROJECT"] = 1] = "PROJECT";
        /**
         * Actor started intersecting the platform, reposition it outside the platform (given by the reposition property).  Time should be 0 in this case.
         */
        ResponseType[ResponseType["INTERSECT"] = 2] = "INTERSECT";
        /**
         * Actor (considered stationary) is pushed by a moving platform.
         */
        ResponseType[ResponseType["MOVING_PLATFORM"] = 3] = "MOVING_PLATFORM";
    })(Collision.ResponseType || (Collision.ResponseType = {}));
    var ResponseType = Collision.ResponseType;
    /**
     * Describes the calculated collision between an Actor and a PlatformObject.
     */
    class Response {
        constructor() {
            /**
             * Whether or not a collision occurred.
             */
            this.hit = false;
            /**
             * What the actor's position should be set to as a result of the collision.  Usually pos0+(pos1-pos0)*time with an epsilon offset.
             */
            this.reposition = new Vec2();
            /**
             * Reposition as the result of a projection.  Only needed if type is PROJECT.
             */
            this.repositionProject = new Vec2();
            /**
             * Point in global space where the collision occurred.
             */
            this.point = new Vec2();
            /**
             * Normal of the collision, from the platform towards the actor.  Has a magnitude of 1.
             */
            this.normal = new Vec2();
            /**
             * Returns the Direction of the normal angle.
             * @param thresholdAngleDegrees Angle in (0, 90).  The returned direction will be RIGHT iff the normal angle is in between -threshold and threshold.  If not given, this value is set to 90 - actor.getDimensionRatioAngle().
             */
            this.getNormalDirection = (thresholdAngleDegrees = undefined) => {
                if (thresholdAngleDegrees == undefined)
                    thresholdAngleDegrees = 90 - this.actor.getDimensionRatioAngle();
                return Collision.getNormalDirection(this.normal.x, this.normal.y, thresholdAngleDegrees);
            };
            this.toString = () => {
                return "hit: " + this.hit + " type: " + ResponseType[this.type] + " actor: " + this.actor + " platformObject: " + this.platformObject + " time: " + this.time + " point: " + this.point + " normal: " + this.normal + " reposition: " + this.reposition + " reposition project: " + this.repositionProject;
            };
            this.recycled = false;
        }
        /**
         * Creates a new collision response, or returns a recycled response.
         */
        static _create() {
            if (Response.recycledResponses.length > 0) {
                let ret = Response.recycledResponses.pop();
                ret.recycled = false;
                return ret;
            }
            return new Response();
        }
        static _recycle(response) {
            if (response.recycled)
                return;
            response.recycled = true;
            Response.recycledResponses.push(response);
        }
    }
    Response.recycledResponses = [];
    Collision.Response = Response;
    /**
     * Contains 2 collisions the happened this frame that would crush an Actor.
     * Like the responses, do not keep a reference to this class instance.
     */
    class Crush {
        constructor(response0, response1) {
            /**
             * The angle (in degrees) between the normals of the two collision responses.
             */
            this.getAngle = () => {
                return M.angleBetweenVectors(this.response0.normal.x, this.response0.normal.y, this.response1.normal.x, this.response1.normal.y) * M.radToDeg;
            };
            this.response0 = response0;
            this.response1 = response1;
        }
    }
    Collision.Crush = Crush;
    class Handler {
        static _update() {
            // set collisions that happened previous frame
            Handler.collisionsPrevFrame.splice(0);
            for (let i = 0; i < Handler.collisionsThisFrame.length; i++) {
                Handler.collisionsPrevFrame.push(Handler.collisionsThisFrame[i]);
            }
            Handler.collisionsThisFrame.splice(0);
            // move and resolve actors
            let actorCols = [];
            Actor.forEach(function (actor) {
                Handler.resolveActor(actorCols, actor, Collision.PlatformObject._allPlatformObjects, Collision.MovingPlatformObject._allMovingPlatformObjects);
                // record collision responses
                for (let i = 0; i < actorCols.length; i++) {
                    Handler.collisionsThisFrame.push(actorCols[i]);
                }
                actorCols.splice(0);
            });
            // move Platform components
            Platform.forEach(function (platform) {
                platform.getGlobalPosition(Handler.tempVec2);
                Handler.tempVec2.x += platform.vx * Game.deltaTime;
                Handler.tempVec2.y += platform.vy * Game.deltaTime;
                platform.setGlobalPosition(Handler.tempVec2.x, Handler.tempVec2.y);
            });
            // enter and stay collision messages
            Handler.collisionsThisFrame.forEach(function (response) {
                // if collision did not happen previous frame, send enter message
                if (Handler.responseSearch(Handler.collisionsPrevFrame, response.actor, response.platformObject) === null) {
                    response.actor.gameObject.sendMessage("onCollisionEnter", response);
                    response.platformObject.getPlatform().gameObject.sendMessage("onCollisionEnter", response);
                }
                response.actor.gameObject.sendMessage("onCollisionStay", response);
                response.platformObject.getPlatform().gameObject.sendMessage("onCollisionStay", response);
                if (response.actor.zeroVelocityOnCollision) {
                    // zero velocity
                    let normalDirection = response.getNormalDirection();
                    if (normalDirection === Direction.LEFT || normalDirection === Direction.RIGHT) {
                        response.actor.vx = 0;
                    }
                    else if (normalDirection === Direction.UP || normalDirection === Direction.DOWN) {
                        response.actor.vy = 0;
                    }
                }
            });
            // exit collision messages
            Handler.collisionsPrevFrame.forEach(function (response) {
                // if collision did not happen this frame, send enter message
                if (Handler.responseSearch(Handler.collisionsThisFrame, response.actor, response.platformObject) === null) {
                    response.actor.gameObject.sendMessage("onCollisionExit", response);
                    response.platformObject.getPlatform().gameObject.sendMessage("onCollisionExit", response);
                }
            });
            // recycle collision responses
            Handler.collisionsPrevFrame.forEach(function (response) {
                Response._recycle(response);
            });
            Handler.collisionsPrevFrame.splice(0);
        }
        /**
         * Searches for a Response from the given array between the given actor and platformObject.  Returns null if Response doesn't exist.
         */
        static responseSearch(responses, actor, platformObject) {
            for (let i = 0; i < responses.length; i++) {
                if (responses[i].actor === actor && responses[i].platformObject === platformObject)
                    return responses[i];
            }
            return null;
        }
        /**
         * Put new responses in outResponses.
         */
        static resolveActor(outResponses, actor, platformObjects, movingPlatformObjects) {
            outResponses.splice(0);
            let actorIsActiveAndEnabled = actor.isActiveAndEnabled();
            // how much stationary actor was pushed by moving platforms
            let pushDistanceX = 0;
            let pushDistanceY = 0;
            // get initial position of actor
            actor.getGlobalPosition(Handler.tempVec2);
            let actorX0 = Handler.tempVec2.x;
            let actorY0 = Handler.tempVec2.y;
            let stationaryActor = Handler.stationaryActor;
            stationaryActor.actor = actor;
            stationaryActor.offset.setValues(actor.offsetX, actor.offsetY);
            stationaryActor.halfWidth = actor.halfWidth;
            stationaryActor.halfHeight = actor.halfHeight;
            stationaryActor.collisionMask = actor.collisionMask;
            stationaryActor.pos.setValues(actorX0, actorY0); // note this is the pre-physics position
            // moving platforms collision
            for (let i = 0; i < movingPlatformObjects.length; i++) {
                let mpo = movingPlatformObjects[i];
                if (!mpo.isEnabled() || !mpo.getPlatform().isActiveAndEnabled() || !actorIsActiveAndEnabled)
                    continue;
                if (!maskCollidesWithLayers(actor.collisionMask, mpo.collisionLayers))
                    continue;
                let resp = Response._create();
                resp.hit = false;
                resp.actor = actor;
                resp.platformObject = mpo;
                mpo.movingPlatformCollision(resp, stationaryActor);
                if (resp.hit) {
                    if (resp.type === ResponseType.MOVING_PLATFORM) {
                        // hit, record response.  Note can be hit by multiple moving platforms.
                        outResponses.push(resp);
                    }
                    else {
                        console.error("Response type for moving platform collision must be MOVING_PLATFORM");
                    }
                }
                else {
                    // not hit, recycle response
                    Response._recycle(resp);
                }
            }
            if (outResponses.length > 0) {
                // actor hit by moving platform, reposition
                stationaryActor.pos.setValuesVec2(outResponses[0].reposition);
            }
            pushDistanceX = stationaryActor.pos.x - actorX0;
            pushDistanceY = stationaryActor.pos.y - actorY0;
            // attached actor moving the platform.  This affects pushDistance, which only affects movingActor.pos1
            if (actor.getAttachedMovingPlatformObject() !== null) {
                // temporarily give stationaryActor its original values
                let sapx = stationaryActor.pos.x;
                let sapy = stationaryActor.pos.y;
                stationaryActor.pos.setValues(actorX0, actorY0);
                // get push distance as a result of the platform object moving
                actor.getAttachedMovingPlatformObject().moveAttachedActor(this.tempVec2, stationaryActor);
                pushDistanceX = this.tempVec2.x - actorX0;
                pushDistanceY = this.tempVec2.y - actorY0;
                // give newset pos values back to stationaryActor
                stationaryActor.pos.setValues(sapx, sapy);
            }
            let movingActor = Handler.movingActor;
            movingActor.actor = actor;
            movingActor.offset.setValues(actor.offsetX, actor.offsetY);
            movingActor.halfWidth = actor.halfWidth;
            movingActor.halfHeight = actor.halfHeight;
            movingActor.collisionMask = actor.collisionMask;
            movingActor.pos0.setValues(stationaryActor.pos.x, stationaryActor.pos.y); // is actor's pre-physics position, unless a moving platform moved the actor
            // pos1 is what actor's position will be after the resolution
            let dt = Game.deltaTime;
            actor.vx += actor.gravityScale * Collision.gravityX * dt;
            actor.vy += actor.gravityScale * Collision.gravityY * dt;
            movingActor.pos1.x = actorX0 + actor.vx * dt + actor.windX * dt + pushDistanceX;
            movingActor.pos1.y = actorY0 + actor.vy * dt + actor.windY * dt + pushDistanceY;
            let skipPlatformObject = null; // don't consider this platform in collision checks
            let projectCollision = actor.projectCollision; // use projection when repositioning after collision
            for (let i = 0; i < this.MAX_RESOLVE_PASSES; i++) {
                // can only collide with 1 platformObject per resolve pass
                let response = null;
                for (let j = 0; j < platformObjects.length; j++) {
                    let platformObject = platformObjects[j];
                    if (platformObject == null)
                        continue;
                    if (platformObject === skipPlatformObject)
                        continue;
                    if (!platformObject.isEnabled() || !platformObject.getPlatform().isActiveAndEnabled() || !actorIsActiveAndEnabled)
                        continue;
                    if (!maskCollidesWithLayers(actor.collisionMask, platformObject.collisionLayers))
                        continue;
                    // get response for moving actor colliding with the platformObject.
                    let resp = Response._create();
                    resp.hit = false;
                    resp.actor = actor;
                    resp.platformObject = platformObject;
                    platformObject.movingActorCollision(resp, movingActor, projectCollision);
                    if (resp.hit && (response === null || resp.time < response.time)) {
                        // moving actor hit platform earliest, use for response
                        if (response !== null)
                            Response._recycle(response);
                        response = resp;
                    }
                    else {
                        // don't use for response
                        Response._recycle(resp);
                    }
                }
                // done if there's no collision
                if (response === null)
                    break;
                // collision happened
                // alter movingActor position from collision
                switch (response.type) {
                    case ResponseType.BULLET:
                        // bullet collision.  Reposition to where collision happened, do not project.
                        movingActor.pos0.setValuesVec2(response.reposition);
                        movingActor.pos1.setValuesVec2(response.reposition);
                        break;
                    case ResponseType.PROJECT:
                        // project collision.  Reposition to the given project position.
                        // updating pos0 was causing problems earlier, I don't remember why.  It seems to work fine now.
                        movingActor.pos0.setValuesVec2(response.reposition); // reposition with no projection
                        movingActor.pos1.setValuesVec2(response.repositionProject); // reposition with projection
                        //// check to make sure projection doesn't go behind a wall it already collided with
                        //foreach(CollisionResponse prevCollisionResponse in movingActorCollisionResponses) {
                        //    if (PrimitiveTest.angleBetweenVectors(prevCollisionResponse.normal, movingActor.diff) > Mathf.PI / 2) {
                        //        // projection would move actor behind a wall it already collided with.  Cancel projection, and reposition in a way that considers both walls.
                        //        Vector2 crossReposition = PrimitiveTest.lineLineIntersectionPoint(
                        //            prevCollisionResponse.reposition,
                        //            prevCollisionResponse.reposition + new Vector2(-prevCollisionResponse.normal.y, prevCollisionResponse.normal.x),
                        //            collisionResponse.reposition,
                        //            collisionResponse.reposition + new Vector2(-collisionResponse.normal.y, collisionResponse.normal.x));
                        //        if (!float.IsInfinity(crossReposition.x) && !float.IsInfinity(crossReposition.y)) {
                        //            movingActor.pos0 = crossReposition;
                        //        }
                        //        movingActor.diff = Vector2.zero;
                        //        break;
                        //    }
                        //}
                        break;
                    case ResponseType.INTERSECT:
                        // intersect collision.  diff between pos0 and pos1 is unchanged
                        let diffX = movingActor.pos1.x - movingActor.pos0.x;
                        let diffY = movingActor.pos1.y - movingActor.pos0.y;
                        movingActor.pos0.setValuesVec2(response.reposition);
                        movingActor.pos1.setValues(movingActor.pos0.x + diffX, movingActor.pos0.y + diffY);
                        break;
                    default:
                        console.error("Don't use collision response type " + response.type + " for moving actor collision.");
                        break;
                }
                // add collision response to record
                outResponses.push(response);
                if (movingActor.pos0.equalsVec2(movingActor.pos1)) {
                    // no projection.  No more collisions can happen
                    break;
                }
                else {
                    // actor is still moving, so need to check again
                    // new: maybe we shouldn't do this
                    //skipPlatformObject = response.platformObject; // don't check this platform again
                    if (i + 2 >= this.MAX_RESOLVE_PASSES) {
                        // next pass will be the last.  So the next collision should be final (i.e. no projections)
                        projectCollision = false;
                    }
                }
            } // ends resolve passes for loop
            // apply collision reposition to actor
            actor.setGlobalPosition(movingActor.pos1.x, movingActor.pos1.y);
            // crush collision messages
            for (let i = 0; i < outResponses.length; i++) {
                let resp1 = outResponses[i];
                for (let j = i + 1; j < outResponses.length; j++) {
                    let resp2 = outResponses[j];
                    if (resp1.type != ResponseType.MOVING_PLATFORM && resp2.type != ResponseType.MOVING_PLATFORM)
                        continue; // need at least one moving platform to have a crush
                    if (M.angleBetweenVectors(resp1.normal.x, resp1.normal.y, resp2.normal.x, resp2.normal.y) * M.radToDeg > actor.crushAngleThreshold) {
                        // crush detected, send message
                        let crush = new Crush(resp1, resp2);
                        actor.gameObject.sendMessage("onCollisionCrush", crush);
                    }
                }
            }
        }
    }
    Handler.MAX_RESOLVE_PASSES = 3;
    Handler.collisionsPrevFrame = [];
    Handler.collisionsThisFrame = [];
    Handler.stationaryActor = new StationaryActor();
    Handler.movingActor = new MovingActor();
    Handler.tempVec2 = new Vec2();
    Collision.Handler = Handler;
    let tempRaycastHit = new RaycastHit();
    let tempOrigin = new Vec2();
    let tempDirection = new Vec2();
})(Collision || (Collision = {}));
/// <reference path="_ref.ts" />
class AABBPlatform extends Platform {
    constructor() {
        super();
        /**
         * Sets dimensions of the AABBPlatformObject.
         */
        this.setAABB = (offsetX, offsetY, halfWidth, halfHeight) => {
            this.platformObject.offsetX = offsetX;
            this.platformObject.offsetY = offsetY;
            this.platformObject.halfWidth = halfWidth;
            this.platformObject.halfHeight = halfHeight;
        };
        this.platformObject = null;
        this.name = "AABBPlatform";
        this.platformObject = new Collision.AABBPlatformObject(this);
        this.platformObjects.push(this.platformObject);
    }
}
/// <reference path="_ref.ts" />
class TiledMapTileLayerPlatform extends Platform {
    constructor() {
        super();
        this.platformObject = null;
        this.name = "TiledMapTileLayerPlatform";
        this.platformObject = new Collision.TiledMapTileLayerPlatformObject(this);
        this.platformObjects.push(this.platformObject);
    }
}
/// <reference path="_ref.ts" />
class Game {
    /**
     * Initializes Game and other classes.  Starts the game loop as well, and loads the scene defined by Game.preloadScene.
     * @param canvas Reference to the canvas defined in the html.
     */
    static initialize(canvas) {
        if (Game.initialized) {
            console.warn("Game already initialized");
            return;
        }
        Game.initialized = true;
        Game._canvas = canvas;
        Game._context = canvas.getContext("2d");
        // separate canvas for effects
        Game._effectsCanvas = document.createElement("canvas");
        Game._effectsCanvas.width = canvas.width;
        Game._effectsCanvas.height = canvas.height;
        Game._effectsContext = Game._effectsCanvas.getContext("2d");
        // create camera
        Camera._initialize(Game.context);
        // initialize Keys (input)
        Keys._initialize(document);
        // initialize Mouse (input)
        Mouse._initialize(canvas);
        // initialize Gamepad (input)
        Gamepads._initialize(window);
        // start gameloop
        Game.gameLoop();
        // user input requirements must be satisfied before the game is ready to be played
        if (!Game.userInputSatisfied) {
            Game.userInputAddEventListeners();
        }
        // start preload scene
        if (Game.preloadScene === "BasePreloadScene") {
            Scene.addScene("BasePreloadScene", new BasePreloadScene());
        }
        else if (Game.preloadScene == "") {
            console.error("Game.preloadScene must be defined.");
        }
        Scene.loadScene(Game.preloadScene);
    }
    // Canvas related
    /**
     * The canvas element used to display the game.
     */
    static get canvas() {
        return Game._canvas;
    }
    /**
     * Object used for manipulating shapes and graphics on the canvas.
     */
    static get context() {
        return Game._context;
    }
    /**
     * Hidden canvas used to help make effects.
     */
    static get effectsCanvas() {
        return Game._effectsCanvas;
    }
    /**
     * Hidden context used to help make effects.
     */
    static get effectsContext() {
        return Game._effectsContext;
    }
    // Fullscreen
    /**
     * If the window is currently in fullscreen mode.
     */
    static get isFullscreen() {
        let doc = document;
        if (doc.fullscreenElement ||
            doc.webkitFullscreenElement ||
            doc.mozFullScreenElement ||
            doc.msFullscreenElement)
            return true;
        return false;
    }
    /**
     * Requests the browser to go into fullscreen.  Must be called from user input.
     */
    static requestFullscreen() {
        let canvas = Game.canvas;
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        }
        else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        }
        else if (canvas.mozRequestFullScreen) {
            canvas.mozRequestFullScreen();
        }
        else if (canvas.msRequestFullscreen) {
            canvas.msRequestFullscreen();
        }
    }
    /**
     * Exits fullscreen.
     */
    static exitFullscreen() {
        let doc = document;
        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        }
        else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
        }
        else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
        }
        else if (doc.msExitFullscreen) {
            doc.msExitFullscreen();
        }
    }
    /**
     * Time, in seconds, since the last frame.
     */
    static get unscaledDeltaTime() {
        return Game._unscaledDeltaTime;
    }
    /**
     * Scaled time, in seconds, since the last frame.
     */
    static get deltaTime() {
        return Game.unscaledDeltaTime * Game.timeScale;
    }
    /**
     * Time, in seconds, since window opened.  This is not affected by delta time.
     */
    static get realtimeSinceStartup() {
        return Game.timeStamp / 1000;
    }
    /**
     * Gets percent of game assets loaded.  1 means fully loaded.
     * A fully loaded game does not necessarily mean the game is ready to play.  Use Game.gameReady() for that.
     */
    static get percentLoaded() {
        let thingsLoaded = TexPackManager.getNumTexPacksLoaded() + JSONManager.numJsonLoaded + AudioManager.getNumAudioSpritesReady();
        let things = TexPackManager.getNumTexPacks() + JSONManager.numJson + AudioManager.getNumAudioSprites();
        if (thingsLoaded >= things)
            return 1;
        return thingsLoaded / things;
    }
    /**
     * Gets if the user input requirement has been satisfied.  Sound won't play until user input is given, so it's best to wait until this is true for the game to start.
     */
    static get userInputSatisfied() {
        return AudioManager.isAudioContextRunning();
    }
    /**
     * If game is ready to be started (i.e. advance past preloader) with no problems.
     * Essentially this means the game is fully loaded and user input was given.
     */
    static get ready() {
        return Game.percentLoaded >= 1 && Game.userInputSatisfied;
    }
    // Private
    /**
     * gameLoop that runs the game.
     */
    static gameLoop() {
        // makes sure that gameLoop is called every time the game draws a new frame to the canvas
        requestAnimationFrame(Game.gameLoop);
        // clear canvas
        Game.context.fillStyle = "black";
        Game.context.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
        // update deltaTime
        let timeStamp = Game.timeStamp;
        Game._unscaledDeltaTime = Math.min((timeStamp - Game.lastTimeStamp) / 1000, Game.MAX_UNSCALED_DELTA_TIME);
        Game.lastTimeStamp = timeStamp;
        // poll gamepads
        Gamepads._earlyUpdate();
        // load scenes that are marked to be loaded
        Scene._loadScenesToLoad();
        // call update() on all GameObjects
        GameObject._updateAll();
        // moving Actors and collision resolution
        Collision.Handler._update();
        // (move camera here)
        // draw all Drawers
        Drawers._drawAll();
        // mark all GameObjects in scenes that are going to be unloaded to be destroyed
        Scene._destroyGameObjectsInScenesToUnload();
        // destroying all GameObjects marked for destroy
        GameObject._destroyAllMarked();
        // unload all scenes to be unloaded
        Scene._unloadMarkedScenes();
        // clearing records of buttons pressed
        Keys._lateUpdate();
        Mouse._lateUpdate();
    }
    /**
     * Gets the time passed (in milliseconds) since the window opened.
     */
    static get timeStamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }
    // Private user input related
    static userInputAddEventListeners() {
        window.addEventListener("mousedown", Game.userInputOnMouseDown);
        document.addEventListener("keydown", Game.userInputOnKeyDown);
    }
    static userInputRemoveEventListeners() {
        window.removeEventListener("mousedown", Game.userInputOnMouseDown);
        document.removeEventListener("keydown", Game.userInputOnKeyDown);
    }
    static userInputOnMouseDown(event) {
        Game.userInputOnInput();
    }
    static userInputOnKeyDown(event) {
        Game.userInputOnInput();
    }
    static userInputOnInput() {
        AudioManager.userInput(Game.userInputAudioContextRunningCallback);
        // wait for callback before confirming that user input was given
    }
    static userInputAudioContextRunningCallback() {
        Game.userInputRemoveEventListeners();
    }
}
// Time related
/**
 * max value unscaledDeltaTime can be.
 */
Game.MAX_UNSCALED_DELTA_TIME = .1;
/**
 * value unscaledDeltaTime is multiplied by to get deltaTime.
 */
Game.timeScale = 1;
// Loading related
/**
 * The first scene to run.  Should be a scene that just waits for assets to load.
 */
Game.preloadScene = "BasePreloadScene";
/**
 * The scene that should load after the game is finished preloading.  This should be defined before Game is initialized.
 */
Game.startScene = "";
Game._userInputSatisfied = false;
Game.initialized = false;
Game.lastTimeStamp = 0;
Game._unscaledDeltaTime = 0;
// references to all files in tygem.  Used to influence build order
/// <reference path="Vec2.ts" />
/// <reference path="M.ts" />
/// <reference path="Rect.ts" />
/// <reference path="Matrix2x3.ts" />
/// <reference path="Material.ts" />
/// <reference path="ColorParser.ts" />
/// <reference path="Transform.ts" />
/// <reference path="SaveBox.ts" />
/// <reference path="Keys.ts" />
/// <reference path="Mouse.ts" />
/// <reference path="Gamepads.ts" />
/// <reference path="JSONManager.ts" />
/// <reference path="AudioManager.ts" />
/// <reference path="TexPackManager.ts" />
/// <reference path="Spritesheet.ts" />
/// <reference path="Camera.ts" />
/// <reference path="Scene.ts" />
/// <reference path="IDrawer.ts" />
/// <reference path="Drawers.ts" />
/// <reference path="TiledMap.ts" />
/// <reference path="Component.ts" />
/// <reference path="DrawerComponent.ts" />
/// <reference path="PackedImageRenderer.ts" />
/// <reference path="SpriteRenderer.ts" />
/// <reference path="TiledMapTileLayerRenderer.ts" />
/// <reference path="TiledMapComponent.ts" />
/// <reference path="ScreenFilter.ts" />
/// <reference path="BasePreloader.ts" />
/// <reference path="BasePreloadScene.ts" />
/// <reference path="GameObject.ts" />
/// <reference path="Actor.ts" />
/// <reference path="PlatformObject.ts" />
/// <reference path="MovingPlatformObject.ts" />
/// <reference path="AABBPlatformObject.ts" />
/// <reference path="TiledMapTileLayerPlatformObject.ts" />
/// <reference path="Platform.ts" />
/// <reference path="CollisionHandler.ts" />
/// <reference path="AABBPlatform.ts" />
/// <reference path="TiledMapTileLayerPlatform.ts" />
/// <reference path="Game.ts" /> 
/// <reference path="../app.ts" />
// adding texture packs to the game
TexPackManager.addTexturePack("Assets/Texpacks/texpack-0.json");
TexPackManager.addTexturePack("Assets/Texpacks/texpack-1.json");
/*

Plan:

Spritesheet:
- name: "sealime"
- filename: "sealime.png"
    - filename as specified in the texpack json
- frameWidth: 64
- frameHeight: 64
- numFrames: 10


*/
Spritesheet.addSpritesheet("sealime.png", 64, 64, 8, 41);
Animation.addAnimation("sealime_idle", "sealime.png", [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
Animation.addAnimation("sealime_leap", "sealime.png", [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 10, false);
/// <reference path="../app.ts" />
AudioManager.addAudioSprites("Assets/Audiosprites/audioSprites.json");
/// <reference path="../../Tygem/_ref.ts" />
var Scenes;
(function (Scenes) {
    class Preload extends Scene {
        constructor(...args) {
            super(...args);
            this.onLoad = () => {
                // wait for game to finish loading
                let go = new GameObject();
                go.addComponent(Comps.Preloader);
            };
            this.onUnload = () => { };
        }
    }
    Scenes.Preload = Preload;
})(Scenes || (Scenes = {}));
/// <reference path="../../Tygem/_ref.ts" />
var Scenes;
(function (Scenes) {
    class TestScene extends Scene {
        constructor(...args) {
            super(...args);
            this.onLoad = () => {
                // make GameObjects
                let gridGO = new GameObject();
                let gridPir = gridGO.addComponent(PackedImageRenderer);
                gridPir.setImageByName("grid.png");
                gridPir.setImageRect(0, 0, 200, 200);
                gridPir.order = -1;
                let thing1 = Prefabs.Thing1();
                thing1.name = "thing 1";
                thing1.transform.y = 100;
                let thing2 = Prefabs.Thing2();
                thing2.sendMessage("messageF", 4);
                // creating tiled map
                let tm = TiledMap.createTiledMapData("test2");
                tm.createGameObject();
                // testing SaveBox
                //localStorage.clear();
                let sb;
                if (SaveBox.getSaveFileIndices().indexOf(0) == -1) {
                    sb = SaveBox.createNewSaveBox();
                    sb.fileIndex = 0;
                }
                else {
                    sb = SaveBox.openSaveBox(0);
                }
                sb.setNumber("n1", 23);
                sb.setNumber("n2", -5);
                sb.setBool("b1", true);
                sb.setString("s1", "ok");
                sb.setString("s2", "\"quote\"s");
                sb.setString("s3", "\nnewlines\ns");
                sb.setString("s4", "|bar|s");
                sb.setString("s5 - js< on[{]}: th % i\"'ng|s$%0%", "js<on[{]}: th%i\"'ng|s$%0%");
                sb.setStringObject("s6", { what: "are", you: "doing" });
                sb.addNumberListElement("nl2", 1);
                sb.setNumberListElements("nl", [0, 1, 2, 3, 4, 5]);
                sb.setNumberListElements("nl2", [6, 7, 8]);
                sb.addNumberListElement("nl2", 8, true);
                sb.saveToLocalStorage();
                let lssb = new SaveBox();
                lssb.fileIndex = sb.fileIndex;
                lssb.loadFromLocalStorage();
                lssb = lssb.clone(1);
                // console logs testing SaveBox
                //console.log(sb.saveToString());
                //console.log(lssb.saveToString());
                //console.log(sb.saveToString() == lssb.saveToString());
            };
            this.onUnload = () => { };
        }
    }
    Scenes.TestScene = TestScene;
})(Scenes || (Scenes = {}));
/// <reference path="../../Tygem/_ref.ts" />
var Scenes;
(function (Scenes) {
    class TestScene2 extends Scene {
        constructor(...args) {
            super(...args);
            this.onLoad = () => {
                // zoom in camera
                Camera.scale = 2;
                // make GameObjects
                //let thing2: GameObject = Prefabs.Thing2();
                //thing2.name = "thing 2";
                //thing2.transform.x = -50;
                //thing2.transform.y = -100;
                //let sealime: GameObject = Prefabs.Sealime();
                //sealime.name = "sealime";
                //sealime.transform.x = 10;
                //sealime.transform.y = 10;
                let platformGO = Prefabs.TestPlatform();
                platformGO.name = "PlatformGO";
                platformGO.transform.x = -10;
                platformGO.transform.y = 100;
                platformGO = Prefabs.TestPlatform();
                platformGO.transform.x = 50;
                platformGO.transform.y = 80;
                let platformGO2 = Prefabs.TestPlatform2();
                platformGO2.transform.x = -60;
                platformGO2.transform.y = -100;
                // creating tiled map
                let tm = TiledMap.createTiledMapData("test4");
                // create tile layers and parse objects
                let tmGO = tm.createGameObject();
                //let tmGO: GameObject = tm.createGameObject(
                //    function (mapObject: TiledMap.Object): void {
                //        console.log(mapObject);
                //        console.log("idea: map mapObject.type to a (objectProperties: TiledMap.Object) => GameObject, which are the prefab functions.");
                //    }
                //);
                //tmGO.transform.setGlobalPosition(-300, -200);
                // moving tiled map
                let tilePlatforms = tmGO.getComponentsInChildren(TiledMapTileLayerPlatform);
                tilePlatforms.forEach(function (tilePlatform) {
                    tilePlatform.gameObject.addComponent(Comps.MovePlatformWithIJKL);
                });
                let go = new GameObject();
                let fm = go.addComponent(Comps.FacesMouse);
                let rtg = go.addComponent(RaycastTestGizmo);
                rtg.distance = 300;
                go = new GameObject();
                go.addComponent(Comps.ControlCameraWithWASD);
                go = new GameObject();
                go.addComponent(Comps.DotFollowsMouse);
                go = new GameObject();
                go.addComponent(Comps.TestSound);
            };
            this.onUnload = () => { };
        }
    }
    Scenes.TestScene2 = TestScene2;
})(Scenes || (Scenes = {}));
/// <reference path="../app.ts" />
// master list of scenes being added to the game
/// <reference path="Scenes/Preload.ts" />
/// <reference path="Scenes/TestScene.ts" />
/// <reference path="Scenes/TestScene2.ts" />
Scene.addScene("Preload", new Scenes.Preload());
Scene.addScene("TestScene", new Scenes.TestScene());
Scene.addScene("TestScene2", new Scenes.TestScene2());
/// <reference path="../app.ts" />
// setting directory to get tileset images:
TiledMap.tilesetImageDirectory = "Tilesets/";
// adding tilesets:
TiledMap.addTileset("beach", { "image": "beach_1.png",
    "imageheight": 304,
    "imagewidth": 224,
    "margin": 0,
    "name": "beach",
    "properties": {},
    "spacing": 0,
    "tilecount": 266,
    "tileheight": 16,
    "tileproperties": {
        "30": {
            "material": "SAND"
        }
    },
    "tiles": {
        "30": {
            "animation": [
                {
                    "duration": 100,
                    "tileid": 30
                },
                {
                    "duration": 100,
                    "tileid": 31
                },
                {
                    "duration": 100,
                    "tileid": 44
                }],
            "objectgroup": {
                "draworder": "index",
                "height": 0,
                "name": "",
                "objects": [
                    {
                        "height": 16,
                        "id": 0,
                        "name": "",
                        "properties": {},
                        "rotation": 0,
                        "type": "",
                        "visible": true,
                        "width": 16,
                        "x": 0,
                        "y": 0
                    }],
                "opacity": 1,
                "type": "objectgroup",
                "visible": true,
                "width": 0,
                "x": 0,
                "y": 0
            }
        }
    },
    "tilewidth": 16
});
TiledMap.addTileset("beach_bg", { "image": "beach_1_bg.png",
    "imageheight": 192,
    "imagewidth": 224,
    "margin": 0,
    "name": "beach_bg",
    "properties": {},
    "spacing": 0,
    "tilecount": 168,
    "tileheight": 16,
    "tilewidth": 16
});
// adding maps:
TiledMap.addMap("test4", { "height": 40,
    "layers": [
        {
            "data": [0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 46, 31, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 0, 0, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 297, 298, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 311, 312, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 0, 46, 0, 0, 46, 0, 0, 0, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46],
            "height": 40,
            "name": "Tile Layer 1",
            "opacity": 1,
            "type": "tilelayer",
            "visible": true,
            "width": 60,
            "x": 0,
            "y": 0
        },
        {
            "draworder": "topdown",
            "height": 0,
            "name": "Object Layer 1",
            "objects": [
                {
                    "height": 0,
                    "id": 2,
                    "name": "seebee",
                    "properties": {},
                    "rotation": 0,
                    "type": "Sealime",
                    "visible": true,
                    "width": 0,
                    "x": 44.5,
                    "y": 55
                }],
            "opacity": 1,
            "type": "objectgroup",
            "visible": true,
            "width": 0,
            "x": 0,
            "y": 0
        }],
    "nextobjectid": 3,
    "orientation": "orthogonal",
    "properties": {},
    "renderorder": "right-down",
    "tileheight": 16,
    "tilesets": [
        {
            "firstgid": 1,
            "image": "tilesets\/beach_1.png",
            "imageheight": 304,
            "imagewidth": 224,
            "margin": 0,
            "name": "beach",
            "properties": {},
            "spacing": 0,
            "tilecount": 266,
            "tileheight": 16,
            "tileproperties": {
                "30": {
                    "material": "SAND"
                },
                "31": {
                    "material": "SAND"
                },
                "45": {
                    "col": "true"
                }
            },
            "tiles": {
                "30": {
                    "objectgroup": {
                        "draworder": "index",
                        "height": 0,
                        "name": "",
                        "objects": [
                            {
                                "height": 16,
                                "id": 0,
                                "name": "",
                                "properties": {},
                                "rotation": 0,
                                "type": "",
                                "visible": true,
                                "width": 16,
                                "x": 0,
                                "y": 0
                            }],
                        "opacity": 1,
                        "type": "objectgroup",
                        "visible": true,
                        "width": 0,
                        "x": 0,
                        "y": 0
                    }
                }
            },
            "tilewidth": 16
        },
        {
            "firstgid": 267,
            "source": "tilesets\/beach_bg.json"
        },
        {
            "firstgid": 435,
            "image": "tilesets\/stone_1.png",
            "imageheight": 304,
            "imagewidth": 224,
            "margin": 0,
            "name": "stone_1",
            "properties": {},
            "spacing": 0,
            "tilecount": 266,
            "tileheight": 16,
            "tilewidth": 16
        }],
    "tilewidth": 16,
    "version": 1,
    "width": 60
});
/// <reference path="tygem/_ref.ts" />
// typescript handbook: http://www.typescriptlang.org/docs/handbook/basic-types.html
// typescript game tutorial: http://www.typescriptgames.com/
// adding assets:
/// <reference path="assets/add_Materials.ts" />
/// <reference path="assets/add_Textures.ts" />
/// <reference path="assets/add_Sounds.ts" />
/// <reference path="assets/add_Scenes.ts" />
/// <reference path="assets/add_Tilemaps.ts" />
Game.preloadScene = "Preload"; // this is optional, default is "BasePreloadScene" which will automatically start Game.startScene once the game is done loading.
Game.startScene = "TestScene2"; // this must be set.
window.onload = () => {
    // get canvas and context (must be defined in html already)
    let canvas = document.getElementById("canvas");
    // initialize and start game
    Game.initialize(canvas);
};
/// <reference path="../app.ts" />
Material.addMaterial("SAND", {
    collisionLayers: 0x1
});
/// <reference path="../../Tygem/_ref.ts" />
var Comps;
(function (Comps) {
    class ArrowTestController extends Component {
        constructor() {
            super();
            this.speed = 300;
            this.onStart = () => {
                this.actor = this.getComponent(Actor);
            };
            this.onUpdate = () => {
                let v = new Vec2(this.actor.vx, this.actor.vy);
                if (Keys.keyHeld(Key.LeftArrow)) {
                    v.x = -this.speed;
                }
                else if (Keys.keyHeld(Key.RightArrow)) {
                    v.x = this.speed;
                }
                else {
                    v.x = 0;
                }
                if (Keys.keyHeld(Key.UpArrow)) {
                    v.y = -this.speed;
                }
                else if (Keys.keyHeld(Key.DownArrow)) {
                    v.y = this.speed;
                }
                else {
                }
                this.actor.vx = v.x;
                this.actor.vy = v.y;
            };
            this.onCollisionEnter = (response) => {
                //console.log("collision enter: " + response.toString());
            };
            this.onCollisionStay = (response) => {
                //console.log("collision stay: " + response.toString());
            };
            this.onCollisionExit = (response) => {
                //console.log(Direction[response.getNormalDirection()]);
            };
            this.name = "ArrowTestController";
        }
    }
    Comps.ArrowTestController = ArrowTestController;
})(Comps || (Comps = {}));
/// <reference path="../../Tygem/_ref.ts" />
var Comps;
(function (Comps) {
    class ArrowTestPlatController extends Component {
        constructor() {
            super();
            this.speed = 300;
            this.onStart = () => {
                this.platform = this.getComponent(Platform);
            };
            this.onUpdate = () => {
                let v = new Vec2();
                if (Keys.keyHeld(Key.A)) {
                    v.x = -this.speed;
                }
                else if (Keys.keyHeld(Key.D)) {
                    v.x = this.speed;
                }
                else {
                    v.x = 0;
                }
                if (Keys.keyHeld(Key.W)) {
                    v.y = -this.speed;
                }
                else if (Keys.keyHeld(Key.S)) {
                    v.y = this.speed;
                }
                else {
                    v.y = 0;
                }
                this.platform.vx = v.x;
                this.platform.vy = v.y;
                if (Keys.keyPressed(Key.Num1)) {
                    let tiledMap = GameObject.findObjectOfType(TiledMapComponent);
                    if (tiledMap !== null) {
                        console.log("tiledMap marked for destroy");
                        tiledMap.gameObject.markForDestroy();
                    }
                }
            };
            this.onCollisionExit = (response) => {
                //console.log(response.toString());
            };
            this.name = "ArrowTestPlatController";
        }
    }
    Comps.ArrowTestPlatController = ArrowTestPlatController;
})(Comps || (Comps = {}));
/// <reference path="../../Tygem/_ref.ts" />
var Comps;
(function (Comps) {
    class ControlCameraWithWASD extends Component {
        constructor() {
            super();
            this.onStart = () => {
            };
            this.panSpeed = 100;
            this.scaleMult = 1.2;
            this.onUpdate = () => {
                let v = new Vec2();
                if (Keys.keyHeld(Key.A)) {
                    v.x = -this.panSpeed;
                }
                else if (Keys.keyHeld(Key.D)) {
                    v.x = this.panSpeed;
                }
                else {
                    v.x = 0;
                }
                if (Keys.keyHeld(Key.W)) {
                    v.y = -this.panSpeed;
                }
                else if (Keys.keyHeld(Key.S)) {
                    v.y = this.panSpeed;
                }
                else {
                    v.y = 0;
                }
                if (Keys.keyPressed(Key.Q)) {
                    Camera.scale *= this.scaleMult;
                }
                if (Keys.keyPressed(Key.E)) {
                    Camera.scale /= this.scaleMult;
                }
                Camera.centerX -= v.x * Game.deltaTime;
                Camera.centerY -= v.y * Game.deltaTime;
            };
            this.name = "ControlCameraWithWASD";
        }
    }
    Comps.ControlCameraWithWASD = ControlCameraWithWASD;
})(Comps || (Comps = {}));
/// <reference path="../../Tygem/_ref.ts" />
var Comps;
(function (Comps) {
    class DotGraphic extends DrawerComponent {
        constructor() {
            super();
            this.color = "#FF0000";
            this.radius = 5;
            this.draw = (context) => {
                context.beginPath();
                context.fillStyle = this.color;
                context.arc(0, 0, this.radius, 0, Math.PI * 2);
                context.fill();
            };
            this.name = "DotGraphic";
        }
    }
    Comps.DotGraphic = DotGraphic;
})(Comps || (Comps = {}));
/// <reference path="../../Tygem/_ref.ts" />
/// <reference path="DotGraphic.ts" />
var Comps;
(function (Comps) {
    class DotFollowsMouse extends Comps.DotGraphic {
        constructor() {
            super();
            this.onUpdate = () => {
                if (this.anchored) {
                    this.getTransform().setGlobalPosition(Mouse.x, Mouse.y);
                }
                else {
                    let v = Camera.canvasToGlobal(Mouse.x, Mouse.y);
                    // extra testing
                    Camera.globalToCanvas(v.x, v.y, v);
                    Camera.canvasToGlobal(v.x, v.y, v);
                    this.getTransform().setGlobalPosition(v.x, v.y);
                }
            };
            this.name = "DotFollowsMouse";
            this.anchored = false;
            this.layer = DrawLayer.UI;
        }
    }
    Comps.DotFollowsMouse = DotFollowsMouse;
})(Comps || (Comps = {}));
/// <reference path="../../Tygem/_ref.ts" />
var Comps;
(function (Comps) {
    class FacesMouse extends Component {
        constructor() {
            super();
            // called once per frame, during the update step.  Is not called if the component is disabled.
            this.onUpdate = () => {
                let pos = this.getTransform().getGlobalPosition();
                let targetPos = Camera.canvasToGlobal(Mouse.x, Mouse.y);
                this.getTransform().setGlobalRotation(Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x) * M.radToDeg);
            };
            this.name = "FacesMouse";
            //this.componentProperties.requireComponent();
        }
    }
    Comps.FacesMouse = FacesMouse;
})(Comps || (Comps = {}));
/// <reference path="../../Tygem/_ref.ts" />
var Comps;
(function (Comps) {
    class MovePlatformWithIJKL extends Component {
        constructor() {
            super();
            this.speed = 40;
            // Called once for a Component.  Either called when a scene finishes loading, or just before update().
            this.onStart = () => {
                this.platform = this.getComponent(Platform);
            };
            // called once per frame, during the update step.  Is not called if the component is disabled.
            this.onUpdate = () => {
                if (Keys.keyHeld(Key.J)) {
                    this.platform.vx = -this.speed;
                }
                else if (Keys.keyHeld(Key.L)) {
                    this.platform.vx = this.speed;
                }
                else {
                    this.platform.vx = 0;
                }
                if (Keys.keyHeld(Key.I)) {
                    this.platform.vy = -this.speed;
                }
                else if (Keys.keyHeld(Key.K)) {
                    this.platform.vy = this.speed;
                }
                else {
                    this.platform.vy = 0;
                }
            };
            // called just before the component is destroyed.
            this.onDestroy = () => { };
            this.name = "MovePlatformWithIJKL";
            this.componentProperties.requireComponent(Platform);
        }
    }
    Comps.MovePlatformWithIJKL = MovePlatformWithIJKL;
})(Comps || (Comps = {}));
/// <reference path="../../Tygem/_ref.ts" />
var Comps;
(function (Comps) {
    class Preloader extends BasePreloader {
        constructor() {
            super();
            this.name = "Preloader";
            this.textColor = "#FFFFAA";
        }
    }
    Comps.Preloader = Preloader;
})(Comps || (Comps = {}));
/// <reference path="../../Tygem/_ref.ts" />
var Comps;
(function (Comps) {
    class Template extends Component {
        constructor() {
            super();
            // Called once for a Component.  Either called when a scene finishes loading, or just before update().
            this.onStart = () => { };
            // called once per frame, during the update step.  Is not called if the component is disabled.
            this.onUpdate = () => { };
            // called just before the component is destroyed.
            this.onDestroy = () => { };
            this.name = "";
            //this.componentProperties.requireComponent();
        }
    }
    Comps.Template = Template;
})(Comps || (Comps = {}));
/// <reference path="../../Tygem/_ref.ts" />
var Comps;
(function (Comps) {
    class TestRectOverlap extends Component {
        constructor() {
            super();
            // Called once for a Component.  Either called when a scene finishes loading, or just before update().
            this.onStart = () => {
                this.actor = this.getComponent(Actor);
            };
            this.actor = null;
            // called once per frame, during the update step.  Is not called if the component is disabled.
            this.onUpdate = () => {
                let overlaps = [];
                let rect = this.actor.getRect();
                Collision.rectOverlapAllPlatformObjectsNonAlloc(overlaps, rect, this.actor.collisionMask);
                console.log(overlaps.length > 0);
            };
            // called just before the component is destroyed.
            this.onDestroy = () => { };
            this.name = "TestRectOverlap";
            this.componentProperties.requireComponent(Actor);
        }
    }
    Comps.TestRectOverlap = TestRectOverlap;
})(Comps || (Comps = {}));
/// <reference path="../../Tygem/_ref.ts" />
var Comps;
(function (Comps) {
    class TestSound extends Component {
        constructor() {
            super();
            // Called once for a Component.  Either called when a scene finishes loading, or just before update().
            this.onStart = () => { };
            // called once per frame, during the update step.  Is not called if the component is disabled.
            this.onUpdate = () => {
                if (Keys.keyPressed(Key.Num2)) {
                    let sn = "Music/level_white";
                    if (AudioManager.isSoundPlaying(sn)) {
                        console.log("Sound already playing");
                    }
                    else {
                        console.log("Sound not playing yet");
                        AudioManager.playMusic(sn, 1, 1, true);
                    }
                }
            };
            // called just before the component is destroyed.
            this.onDestroy = () => { };
            this.name = "TestSound";
        }
    }
    Comps.TestSound = TestSound;
})(Comps || (Comps = {}));
/// <reference path="../../Tygem/_ref.ts" />
var Comps;
(function (Comps) {
    class Thing2 extends Component {
        constructor() {
            super();
            this.speed = 300;
            this.camSpeed = 400;
            this.onUpdate = () => {
                let v = new Vec2();
                if (Keys.keyHeld(Key.LeftArrow)) {
                    v.x = -this.speed;
                }
                else if (Keys.keyHeld(Key.RightArrow)) {
                    v.x = this.speed;
                }
                else {
                    v.x = 0;
                }
                if (Keys.keyHeld(Key.UpArrow)) {
                    v.y = -this.speed;
                }
                else if (Keys.keyHeld(Key.DownArrow)) {
                    v.y = this.speed;
                }
                else {
                    v.y = 0;
                }
                this.getTransform().x += v.x * Game.deltaTime;
                this.getTransform().y += v.y * Game.deltaTime;
                let rv = 0;
                if (Keys.keyHeld(Key.Q)) {
                    rv = -100;
                }
                else if (Keys.keyHeld(Key.E)) {
                    rv = 100;
                }
                else {
                    rv = 0;
                }
                this.getTransform().rotation += rv * Game.deltaTime;
                if (Keys.keyPressed(Key.Num1)) {
                    this.getTransform().scaleX *= 1.2;
                }
                if (Keys.keyPressed(Key.Num2)) {
                    this.getTransform().scaleX *= -1;
                }
                if (Keys.keyPressed(Key.Num3)) {
                    this.getTransform().scaleY *= .8;
                }
                v.x = 0;
                v.y = 0;
                if (Keys.keyHeld(Key.A)) {
                    v.x = -this.camSpeed;
                }
                else if (Keys.keyHeld(Key.D)) {
                    v.x = this.camSpeed;
                }
                else {
                    v.x = 0;
                }
                if (Keys.keyHeld(Key.W)) {
                    v.y = -this.camSpeed;
                }
                else if (Keys.keyHeld(Key.S)) {
                    v.y = this.camSpeed;
                }
                else {
                    v.y = 0;
                }
                Camera.centerX += v.x * Game.deltaTime;
                Camera.centerY += v.y * Game.deltaTime;
                if (Keys.keyPressed(Key.PageUp)) {
                    Camera.scale *= 1.2;
                }
                if (Keys.keyPressed(Key.PageDown)) {
                    Camera.scale /= 1.2;
                }
                // switching scenes
                if (Keys.keyPressed(Key.M)) {
                    if (Scene.currentScene === "testScene") {
                        Scene.loadAdditionalScene("testScene2");
                    }
                    else {
                        Scene.loadScene("testScene");
                    }
                }
                if (this.child != null) {
                    v.x = 0;
                    if (Keys.keyHeld(Key.J)) {
                        v.x = -this.speed;
                    }
                    else if (Keys.keyHeld(Key.L)) {
                        v.x = this.speed;
                    }
                    v.y = 0;
                    if (Keys.keyHeld(Key.I)) {
                        v.y = -this.speed;
                    }
                    else if (Keys.keyHeld(Key.K)) {
                        v.y = this.speed;
                    }
                    this.child.transform.x += v.x * Game.deltaTime;
                    this.child.transform.y += v.y * Game.deltaTime;
                    // destroying things
                    if (Keys.keyPressed(Key.Dash)) {
                        let thing1 = GameObject.findObject("thing 1");
                        if (thing1 !== null) {
                            thing1.markForDestroy();
                        }
                    }
                    // dereference child if it'll be destroyed
                    if (this.child.isMarkedForDestroy()) {
                        this.child = null;
                    }
                }
            };
            this.messageF = (num) => {
                console.log("received message: " + num);
            };
            this.name = "Thing2";
        }
    }
    Comps.Thing2 = Thing2;
})(Comps || (Comps = {}));
/// <reference path="../../Tygem/_ref.ts" />
var Prefabs;
(function (Prefabs) {
    function Sealime(props) {
        let go = new GameObject();
        let actor = go.addComponent(Actor);
        actor.offsetX = 0;
        actor.offsetY = 2;
        actor.halfWidth = 19;
        actor.halfHeight = 17;
        go.addComponent(ActorGizmo);
        go.addComponent(AttachBottom);
        let actorTestController = go.addComponent(Comps.ArrowTestController);
        let sr = go.addComponent(SpriteRenderer);
        sr.imageSmoothingEnabled = false;
        sr.playAnimationByName("sealime_leap", "sealime_idle");
        sr.order = 1.0;
        sr.tintColor = "blue";
        sr.tintAmount = .5;
        go.name = props.name;
        go.transform.x = props.x;
        go.transform.y = props.y;
        console.log(go.transform);
        return go;
    }
    Prefabs.Sealime = Sealime;
    TiledMap.addObjectParser("Sealime", Sealime);
})(Prefabs || (Prefabs = {}));
/// <reference path="../../Tygem/_ref.ts" />
var Prefabs;
(function (Prefabs) {
    function TestPlatform() {
        let go = new GameObject();
        let platform = go.addComponent(AABBPlatform);
        platform.setAABB(0, 0, 96 / 2, 32 / 2);
        let pir = go.addComponent(PackedImageRenderer);
        pir.setImageByName("platform.png");
        pir.setImageRect(16, 16, 96, 32);
        pir.imageSmoothingEnabled = false;
        pir.layer = DrawLayer.PLATFORMS;
        pir.tintColor = "red";
        pir.tintAmount = .5;
        return go;
    }
    Prefabs.TestPlatform = TestPlatform;
})(Prefabs || (Prefabs = {}));
/// <reference path="../../Tygem/_ref.ts" />
var Prefabs;
(function (Prefabs) {
    function TestPlatform2() {
        let go = new GameObject();
        let platform = go.addComponent(AABBPlatform);
        platform.setAABB(0, 0, 96 / 2, 32 / 2);
        let pir = go.addComponent(PackedImageRenderer);
        pir.setImageByName("platform_2.png");
        pir.setImageRect(16, 16, 96, 32);
        pir.imageSmoothingEnabled = false;
        pir.layer = DrawLayer.PLATFORMS;
        let atpc = go.addComponent(Comps.ArrowTestPlatController);
        return go;
    }
    Prefabs.TestPlatform2 = TestPlatform2;
})(Prefabs || (Prefabs = {}));
/// <reference path="_ref.ts" />
class ActorGizmo extends DrawerComponent {
    constructor() {
        super();
        this.onStart = () => {
            this.actor = this.getComponent(Actor);
        };
        this.color = "cyan";
        this.draw = (context) => {
            if (this.actor === null) {
                console.error("ActorGizmo needs Actor as a sibling component");
                return;
            }
            context.beginPath();
            context.strokeStyle = this.color;
            context.lineWidth = 1;
            context.strokeRect(this.actor.offsetX - this.actor.halfWidth, this.actor.offsetY - this.actor.halfHeight, this.actor.halfWidth * 2, this.actor.halfHeight * 2);
            context.stroke();
        };
        this.actor = null;
        this.name = "ActorGizmo";
        this.componentProperties.only1 = true;
        this.componentProperties.requireComponent(Actor);
        this.layer = DrawLayer.GIZMO;
    }
}
/// <reference path="_ref.ts" />
/**
 * Will automatically attach the bottom of the actor to the top of moving platform objects.
 */
class AttachBottom extends Component {
    constructor() {
        super();
        this.onStart = () => {
            this.actor = this.getComponent(Actor);
        };
        this.onUpdate = () => {
        };
        this.onCollisionEnter = (response) => {
            if (!this.isEnabled())
                return;
            if (response.platformObject instanceof Collision.MovingPlatformObject) {
                if (response.getNormalDirection() === Direction.UP) {
                    // attach actor
                    let mpo = response.platformObject;
                    mpo.attachActor(this.actor);
                }
            }
        };
        this.onCollisionExit = (response) => {
            if (this.actor.getAttachedMovingPlatformObject() === null)
                return;
            if (response.platformObject instanceof Collision.MovingPlatformObject) {
                let mpo = response.platformObject;
                if (mpo === this.actor.getAttachedMovingPlatformObject()) {
                    // detach actor
                    mpo.detachActor(this.actor);
                }
            }
        };
        this.name = "AttachBottom";
        this.componentProperties.requireComponent(Actor);
    }
}
/// <reference path="_ref.ts" />
class RaycastTestGizmo extends DrawerComponent {
    constructor() {
        super();
        this.onStart = () => {
        };
        this.color = "red";
        this.origin = new Vec2();
        this.direction = new Vec2(1, 0);
        this.distance = Number.POSITIVE_INFINITY;
        this.setAngle = (angleDegrees) => {
            this.direction.setValues(Math.cos(angleDegrees * M.degToRad), Math.sin(angleDegrees * M.degToRad));
        };
        this.getAngle = () => {
            return Math.atan2(this.direction.y, this.direction.x);
        };
        this.globalOrigin = new Vec2();
        this.pt1 = new Vec2();
        this.globalDirection = new Vec2();
        this.identityMatrix = new Matrix2x3();
        this.onUpdate = () => {
            this.getTransform().localToGlobal(this.origin.x, this.origin.y, this.globalOrigin);
            this.getTransform().localToGlobal(this.origin.x + this.direction.x, this.origin.y + this.direction.y, this.pt1);
            this.globalDirection.setValues(this.pt1.x - this.globalOrigin.x, this.pt1.y - this.globalOrigin.y);
            this.globalDirection.normalize();
            //Collision.raycastAllActorsNonAlloc(this.raycastHit, this.globalOrigin.x, this.globalOrigin.y, this.globalDirection.x, this.globalDirection.y, this.distance);
            Collision.raycastAllPlatformObjectsNonAlloc(this.raycastHit, this.globalOrigin.x, this.globalOrigin.y, this.globalDirection.x, this.globalDirection.y, this.distance);
        };
        this.raycastHit = new Collision.RaycastHit();
        this.draw = (context) => {
            Camera.setContextTransformFromMatrix(Matrix2x3.identity);
            let endX = this.globalOrigin.x;
            let endY = this.globalOrigin.y;
            if (this.raycastHit.hit) {
                endX = this.raycastHit.point.x;
                endY = this.raycastHit.point.y;
            }
            else {
                endX = this.globalOrigin.x + this.globalDirection.x * Math.min(this.distance, 2000);
                endY = this.globalOrigin.y + this.globalDirection.y * Math.min(this.distance, 2000);
            }
            context.beginPath();
            context.strokeStyle = this.color;
            context.lineWidth = 1;
            context.moveTo(this.globalOrigin.x, this.globalOrigin.y);
            context.lineTo(endX, endY);
            context.stroke();
        };
        this.actor = null;
        this.name = "RaycastTestGizmo";
        this.layer = DrawLayer.GIZMO;
    }
}
/// <reference path="../../Tygem/_ref.ts" />
var Prefabs;
(function (Prefabs) {
    function Thing1() {
        let go = new GameObject();
        let pir = go.addComponent(PackedImageRenderer);
        pir.setImageByName("sealime.png");
        pir.order = 1.0;
        pir.setImageRect(64, 64, 128, 64);
        return go;
    }
    Prefabs.Thing1 = Thing1;
})(Prefabs || (Prefabs = {}));
/// <reference path="../../Tygem/_ref.ts" />
var Prefabs;
(function (Prefabs) {
    function Thing2() {
        let go = new GameObject();
        // adding component
        let pir = go.addComponent(PackedImageRenderer);
        pir.setImageByName("sealime.png");
        pir.setImageRect(128, 0, 128, 64);
        pir.order = 1.1;
        let dg = go.addComponent(Comps.DotGraphic);
        dg.order = 999;
        // adding child gameObject
        let child = new GameObject();
        child.transform.setParent(go.transform);
        child.name = "pengrunt";
        // adding component to child
        let childPir = child.addComponent(PackedImageRenderer);
        childPir.setImageByName("pengrunt.png");
        childPir.setImageRect(0, 0, 64, 64);
        childPir.order = 1.0;
        // testing effect stuff
        childPir.imageSmoothingEnabled = false;
        childPir.tintColor = "#FF0000";
        childPir.tintAmount = .6;
        // adding Thing2 component
        let thing2 = go.addComponent(Comps.Thing2);
        thing2.pir = pir;
        thing2.child = child;
        thing2.childPir = childPir;
        return go;
    }
    Prefabs.Thing2 = Thing2;
})(Prefabs || (Prefabs = {}));
//# sourceMappingURL=game.js.map
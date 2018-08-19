/// <reference path="_ref.ts" />

namespace M {

    /**
     * Multiply a degree value by this to get its equivalent in radians.
     */
    export const degToRad: number = 0.017453292519943295;

    /**
     * Multiply a radian value by this to get its equivalent in degrees.
     */
    export const radToDeg: number = 57.295779513082323;

    /**
     * Epsilon value used for floating point comparisons.
     */
    export const EPSILON: number = .0001;

    /**
     * Calculates the distance between 2 points.
     * @param v1x x of vector 1
     * @param v1y y of vector 1
     * @param v2x x of vector 2
     * @param v2y y of vector 2
     */
    export function distance(v1x: number, v1y: number, v2x: number, v2y: number): number {
        return Math.sqrt((v2x - v1x) * (v2x - v1x) + (v2y - v1y) * (v2y - v1y));
    }

    /**
     * Calculates the magnitude of a vector.
     * @param vx x of the vector
     * @param vy y of the vector
     */
    export function magnitude(vx: number, vy: number): number {
        return Math.sqrt(vx * vx + vy * vy);
    }

    /**
     * Calculates the square of the magnitude of a vector.
     * @param vx x of the vector
     * @param vy y of the vector
     */
    export function sqrMagnitude(vx: number, vy: number): number {
        return vx * vx + vy * vy;
    }

    /**
     * Calculates the dot product of two vectors.
     * @param ax x of vector a
     * @param ay y of vector a
     * @param bx x of vector b
     * @param by y of vector b
     */
    export function dot(ax: number, ay: number, bx: number, by: number): number {
        return ax * bx + ay * by;
    }

    /**
     * Returns the result of projecting vector a onto vector b.
     * @param ax x of vector a
     * @param ay y of vector a
     * @param bx x of vector b
     * @param by y of vector b
     */
    export function vectorProject(ax: number, ay: number, bx: number, by: number): Vec2 {
        let s: number = dot(ax, ay, bx, by) / dot(bx, by, bx, by);
        return new Vec2(s * bx, s * by);
    }

    /**
     * Calculates x mod y for floats.  Always returns a positive value.
     */
    export function fmod(x: number, y: number): number {
        return x - Math.floor(x / y) * y;
    }
    
    /**
     * Literally just the classic atan2 function, but takes a Vec2 as an argument.  Returns angle in radians.
     */
    export function atan2(v: Vec2): number {
        return Math.atan2(v.y, v.x);
    }
        
    /**
     * Wraps a value in [0, 2*PI)
     */
    export function wrap2PI(angleRadians: number): number {
        return fmod(angleRadians, Math.PI * 2);
    }
    
    /**
     * Wraps a value in [-PI, PI)
     */
    export function wrapPI(angleRadians: number): number {
        return fmod(angleRadians + Math.PI, Math.PI * 2) - Math.PI;
    }

    /**
     * Wraps a value in [0, 360)
     */
    export function wrap360(angleDegrees: number): number {
        return fmod(angleDegrees, 360);
    }
    
    /**
     * Wraps a value in [-180, 180)
     */
    export function wrap180(angleDegrees: number): number {
        return fmod(angleDegrees + 180, 360) - 180;
    }
    
    /**
     * Returns the value (in radians) to be added to angleStart to reach angleEnd.  This value is wrappen in [-PI, PI)
     */
    export function angleDiffRadians(angleStartRadians: number, angleEndRadians: number): number {
        return wrapPI(angleEndRadians - angleStartRadians);
    }

    /**
     * Returns the value (in degrees) to be added to angleStart to reach angleEnd.  This value is wrappen in [-180, 180)
     */
    export function angleDiffDegrees(angleStartDegrees: number, angleEndDegrees: number): number {
        return wrap180(angleEndDegrees - angleStartDegrees);
    }
    
    /**
     * Given a sector defined by a center angle and spread, return if the given test angle is contained in the sector (all in degrees).
     * @param sectorAngle Angle defining the center of the sector.
     * @param sectorAngleSpread The angular size of the sector.
     * @param testAngle The angle to test if it's contained in the sector.
     */
    export function angleInSectorDegrees(sectorAngle: number, sectorAngleSpread: number, testAngle: number) {
        return Math.abs(angleDiffDegrees(testAngle, sectorAngle)) <= sectorAngleSpread / 2;
    }
    
    /**
     * Returns a Vec2 that's the rotation of a given vector around a given point.
     * @param vx x of the vector to rotate.
     * @param vy y of the vector to rotate.
     * @param pointX x of the point to rotate around.
     * @param pointY y of the point to rotate around.
     * @param rotationRadians Angle to rotate, in radians.
     */
    export function rotateAroundPoint(vx: number, vy: number, pointX: number, pointY: number, rotationRadians: number): Vec2 {
        let ret: Vec2 = new Vec2();
        let c: number = Math.cos(rotationRadians);
        let s: number = Math.sin(rotationRadians);
        ret.x = pointX + (vx - pointX) * c - (vy - pointY) * s;
        ret.y = pointY + (vx - pointX) * s + (vy - pointY) * c;
        return ret;
    }

    /**
     * Returns the point on the line defined by lineP0 and lineP1 that is closest to the given point.
     * @param lineP0x x of the first point that defines the line.
     * @param lineP0y y of the first point that defines the line.
     * @param lineP1x x of the other point that defines the line.
     * @param lineP1y y of the other point that defines the line.
     * @param pointX x of the point to consider.
     * @param pointY y of the point to consider.
     */
    export function pointOnLineClosestToPoint(lineP0x: number, lineP0y: number, lineP1x: number, lineP1y: number, pointX: number, pointY: number): Vec2 {
        let ret: Vec2 = vectorProject(pointX - lineP0x, pointY - lineP0y, lineP1x - lineP0x, lineP1y - lineP0y);
        ret.x += lineP0x;
        ret.y += lineP0y;
        return ret;
    }
    
    /**
     * Calculates the intersection points between circle 1 and circle 2.  Returns array of the 2 Vec2 intersections.  If there are no intersections, null is returned.
     * @param c1x x of circle 1
     * @param c1y y of circle 1
     * @param r1 radius of circle 1
     * @param c2x x of circle 2
     * @param c2y y of circle 2
     * @param r2 radius of circle 2
     */
    export function circleCircleIntersection(c1x: number, c1y: number, r1: number, c2x: number, c2y: number, r2: number): Array<Vec2> {
        let d: number = distance(c1x, c1y, c2x, c2y);
        if (d > r1 + r2) return null;
        if (d < Math.abs(r1 - r2)) return null;

        let a: number = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
        let h: number = Math.sqrt(r1 * r1 - a * a);

        let p2x = c1x + a * (c2x - c1x) / d;
        let p2y = c1y + a * (c2y - c1y) / d;

        return [
            new Vec2(p2x + h * (c2y - c1y) / d, p2y - h * (c2x - c1x) / d),
            new Vec2(p2x - h * (c2y - c1y) / d, p2y + h * (c2x - c1x) / d)
        ];
    }
    
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
    export function lineCircleIntersection(lineP0x: number, lineP0y: number, lineP1x: number, lineP1y: number, cx: number, cy: number, r: number): Array<Vec2> {
        let mid: Vec2 = pointOnLineClosestToPoint(lineP0x, lineP0y, lineP1x, lineP1y, cx, cy);
        let dist2: number = r * r - sqrMagnitude(cx - mid.x, cy - mid.y);
        if (dist2 < 0) return null;
        let s: number = Math.sqrt(dist2 / sqrMagnitude(lineP1x - lineP0x, lineP1y - lineP0y));
        let diffX: number = (lineP1x - lineP0x) * s;
        let diffY: number = (lineP1y - lineP0y) * s;
        return [
            new Vec2(mid.x - diffX, mid.y - diffY),
            new Vec2(mid.x + diffX, mid.y + diffY)
        ];
    }
    
    /**
     * Given elements in a line, all spaced a specified distance from each other, with the average displacement being 0, what's the position of each element?
     * @param spacing Distance between each element.
     * @param index Index of the given element.
     * @param numElements Total number of elements
     */
    export function centeredSpacing(spacing: number, index: number, numElements: number): number {
        if (numElements <= 1) return 0;
        return (index - (numElements - 1) / 2) * spacing;
    }
    
    /**
     * Returns of vector 2 is position clockwise to vector 1
     * @param v1x x of vector 1
     * @param v1y y of vector 1
     * @param v2x x of vector 2
     * @param v2y y of vector 2
     */
    export function isClockwise(v1x: number, v1y: number, v2x: number, v2y: number): boolean {
        return -v1x * v2y + v1y * v2x > 0;
    }
    
    /**
     * Returns the angle (in radians) formed from the two given vectors.
     * @param v0x x of the first vector to compare.
     * @param v0y y of the first vector to compare.
     * @param v1x x of the other vector to compare.
     * @param v1y y of the other vector to compare.
     */
    export function angleBetweenVectors(v0x: number, v0y: number, v1x: number, v1y: number): number {
        return Math.acos(dot(v0x, v0y, v1x, v1y) / (magnitude(v0x, v0y) * magnitude(v1x, v1y)));
    }
    
    /**
     * Returns the normal (with magnitude of 1) of the given vector.  If looking in the direction of the given vector, the normal will face to the "left".
     * @param vx x of the vector
     * @param vy y of the vector
     */
    export function normalVector(vx: number, vy: number): Vec2 {
        let ret: Vec2 = new Vec2(-vy, vx);
        ret.normalize();
        return ret;
    }

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
    export function linesParallel(line0P0x: number, line0P0y: number, line0P1x: number, line0P1y: number,
        line1P0x: number, line1P0y: number, line1P1x: number, line1P1y: number): boolean {

        return !isFinite(lineLineIntersection(line0P0x, line0P0y, line0P1x, line0P1y, line1P0x, line1P0y, line1P1x, line1P1y));
    }
    
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
    export function lineLineIntersection(line0P0x: number, line0P0y: number, line0P1x: number, line0P1y: number,
        line1P0x: number, line1P0y: number, line1P1x: number, line1P1y: number): number {
        let line0x: number = line0P1x - line0P0x;
        let line0y: number = line0P1y - line0P0y;
        let perpLine1x: number = line1P0y - line1P1y;
        let perpLine1y: number = line1P1x - line1P0x;

        let div: number = dot(perpLine1x, perpLine1y, line0x, line0y);
        if (Math.abs(div) < EPSILON) {
            // lines are parallel
            return Number.POSITIVE_INFINITY;
        }

        return dot(perpLine1x, perpLine1y, line1P0x - line0P0x, line1P0y - line0P0y) / div;
    }

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
    export function lineLineIntersectionPoint(line0P0x: number, line0P0y: number, line0P1x: number, line0P1y: number,
        line1P0x: number, line1P0y: number, line1P1x: number, line1P1y: number): Vec2 {

        let t: number = lineLineIntersection(line0P0x, line0P0y, line0P1x, line0P1y, line1P0x, line1P0y, line1P1x, line1P1y);
        if (!isFinite(t)) return null;

        return new Vec2(
            line0P0x + (line0P1x - line0P0x) * t,
            line0P0y + (line0P1y - line0P0y) * t);
    }
    
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
    export function rayLineIntersection(
        rayOriginX: number, rayOriginY: number, rayDirectionX: number, rayDirectionY: number,
        lineP0x: number, lineP0y: number, lineP1x: number, lineP1y: number,
        rayDistance: number = Number.POSITIVE_INFINITY): number {

        let t: number = lineLineIntersection(rayOriginX, rayOriginY, rayOriginX + rayDirectionX, rayOriginY + rayDirectionY, lineP0x, lineP0y, lineP1x, lineP1y);
        if (!isFinite(t)) return -1; // lines are parallel
        if (t <= -EPSILON) return -1; // ray would hit before the origin

        if (rayDistance > 0 && !isFinite(rayDistance)) {
            // ray is infinite, sure to hit line
            return t;
        }

        // ray isn't infinte, check if intersection would happen within the rayDistance
        let directionMagnitude: number = sqrMagnitude(rayDirectionX, rayDirectionY);
        if (Math.abs(directionMagnitude - 1) >= EPSILON) {
            // direction wasn't normalized
            directionMagnitude = Math.sqrt(directionMagnitude);
        }
        let intersectDistance: number = directionMagnitude * t;
        if (intersectDistance <= rayDistance + EPSILON)
            return t;
        
        return -1;
    }
    
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
    export function raySegmentIntersection(
        rayOriginX: number, rayOriginY: number, rayDirectionX: number, rayDirectionY: number,
        segmentP0x: number, segmentP0y: number, segmentP1x: number, segmentP1y: number,
        rayDistance: number = Number.POSITIVE_INFINITY): number {

        let t: number = rayLineIntersection(rayOriginX, rayOriginY, rayDirectionX, rayDirectionY, segmentP0x, segmentP0y, segmentP1x, segmentP1y, rayDistance);
        if (t == -1) return -1;

        // check that intersect point is contained in the segment
        let px: number = rayOriginX + rayDirectionX * t;
        let py: number = rayOriginY + rayDirectionY * t;
        if (Math.min(segmentP0x, segmentP1x) - EPSILON < px && px < Math.max(segmentP0x, segmentP1x) + EPSILON &&
            Math.min(segmentP0y, segmentP1y) - EPSILON < py && py < Math.max(segmentP0y, segmentP1y) + EPSILON) {
            return t;
        }
        return -1;
    }
    
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
    export function rayVerticalSegmentIntersection(
        rayOriginX: number, rayOriginY: number, rayDirectionX: number, rayDirectionY: number,
        segmentX: number, segmentP0y: number, segmentP1y: number,
        rayDistance: number = Number.POSITIVE_INFINITY): number {

        // vertical ray won't intersect
        if (Math.abs(rayDirectionX) < EPSILON) return -1;
        
        let t: number = (segmentX - rayOriginX) / rayDirectionX;
        if (t <= -EPSILON) return -1;

        // check that intersect point is contained in the segment
        let py: number = rayOriginY + rayDirectionY * t;
        if (Math.min(segmentP0y, segmentP1y) - EPSILON < py && py < Math.max(segmentP0y, segmentP1y) + EPSILON) {
            return t;
        }
        return -1;
    }

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
    export function rayHorizontalSegmentIntersection(
        rayOriginX: number, rayOriginY: number, rayDirectionX: number, rayDirectionY: number,
        segmentY: number, segmentP0x: number, segmentP1x: number,
        rayDistance: number = Number.POSITIVE_INFINITY): number {

        // horizontal ray won't intersect
        if (Math.abs(rayDirectionY) < EPSILON) return -1;
        
        let t: number = (segmentY - rayOriginY) / rayDirectionY;
        if (t <= -EPSILON) return -1;
        
        // check that intersect point is contained in the segment
        let px: number = rayOriginX + rayDirectionX * t;
        if (Math.min(segmentP0x, segmentP1x) - EPSILON < px && px < Math.max(segmentP0x, segmentP1x) + EPSILON) {
            return t;
        }
        return -1;
    }
    
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
    export function segmentSegmentIntersection(segment0P0x: number, segment0P0y: number, segment0P1x: number, segment0P1y: number,
        segment1P0x: number, segment1P0y: number, segment1P1x: number, segment1P1y: number): number {
        
        let t: number = raySegmentIntersection(segment0P0x, segment0P0y, segment0P1x - segment0P0x, segment0P1y - segment0P0y, segment1P0x, segment1P0y, segment1P1x, segment1P1y);
        if (t == -1) return -1;
        if (t > 1) return -1;
        return t;
    }

    /**
     * Gets if the given circle will intersect a vertical segment.
     * @param circleX x of the center of the circle.
     * @param circleY y of the center of the circle
     * @param circleRadius radius of the circle.
     * @param segmentX x of both points of the segment.
     * @param segmentP0y y of the first point that defines the segment.
     * @param segmentP1y y of the other point that defines the segment.
     */
    export function circleVerticalSegmentIntersects(
        circleX: number, circleY: number, circleRadius: number,
        segmentX: number, segmentP0y: number, segmentP1y: number): boolean {

        let xDist: number = segmentX - circleX;
        if (Math.abs(xDist) > circleRadius) return false;
        
        let yOff = Math.sqrt(circleRadius * circleRadius - xDist * xDist);

        return circleY - yOff <= Math.max(segmentP0y, segmentP1y) &&
            circleY + yOff >= Math.min(segmentP0y, segmentP1y);
    }
    /**
     * Gets if the given circle will intersect a horizontal segment.
     * @param circleX x of the center of the circle.
     * @param circleY y of the center of the circle
     * @param circleRadius radius of the circle.
     * @param segmentY y of both points of the segment.
     * @param segmentP0x x of the first point that defines the segment.
     * @param segmentP1x x of the other point that defines the segment.
     */
    export function circleHorizontalSegmentIntersects(
        circleX: number, circleY: number, circleRadius: number,
        segmentY: number, segmentP0x: number, segmentP1x: number): boolean {

        let yDist: number = segmentY - circleY;
        if (Math.abs(yDist) > circleRadius) return false;

        let xOff = Math.sqrt(circleRadius * circleRadius - yDist * yDist);

        return circleX - xOff <= Math.max(segmentP0x, segmentP1x) &&
            circleX + xOff >= Math.min(segmentP0x, segmentP1x);
    }

    /**
     * Returns if the given circle intersects or is contained by the given rectangle.
     * @param circleX x of the center of the circle.
     * @param circleY y of the center of the circle.
     * @param circleRadius radius of the circle.
     * @param rectX x (left side) of the rectangle.
     * @param rectY y (top side) of the rectangle.
     * @param rectWidth width of the rectangle
     * @param rectHeight height of the rectangle
     */
    export function circleRectangleIntersects(
        circleX: number, circleY: number, circleRadius: number,
        rectX: number, rectY: number, rectWidth: number, rectHeight: number): boolean {

        if (rectX <= circleX && circleX < rectX + rectWidth &&
            rectY <= circleY && circleY < rectY + rectHeight) return true;

        if (circleVerticalSegmentIntersects(circleX, circleY, circleRadius, rectX, rectY, rectY + rectHeight)) return true;
        if (circleVerticalSegmentIntersects(circleX, circleY, circleRadius, rectX + rectWidth, rectY, rectY + rectHeight)) return true;
        if (circleHorizontalSegmentIntersects(circleX, circleY, circleRadius, rectY, rectX, rectX + rectWidth)) return true;
        if (circleHorizontalSegmentIntersects(circleX, circleY, circleRadius, rectY + rectHeight, rectX, rectX + rectWidth)) return true;

        return false;
    }
    
    /**
     * Given a line defined by p0 and p1, returns if the point is to the left of the line ("left" when facing p1 from p0).
     * @param lineP0x x of the first point that defines the line
     * @param lineP0y y of the first point that defines the line.
     * @param lineP1x x of the other point that defines the line.
     * @param lineP1y y of the other point that defines the line.
     * @param pointX x of the point to test.
     * @param pointY y of the point to test.
     */
    export function pointToLeft(lineP0x: number, lineP0y: number, lineP1x: number, lineP1y: number, pointX: number, pointY: number): boolean {
        return ((lineP1x - lineP0x) * (pointY - lineP0y) - (lineP1y - lineP0y) * (pointX - lineP0x)) > 0;
    }

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
    export function pointsOnSameSideOfLine(lineP0x: number, lineP0y: number, lineP1x: number, lineP1y: number, point0x: number, point0y: number, point1x: number, point1y: number): boolean {
        return pointToLeft(lineP0x, lineP0y, lineP1x, lineP1y, point0x, point0y) == pointToLeft(lineP0x, lineP0y, lineP1x, lineP1y, point1x, point1y);
    }

    
    /**
     * Given a line, returns the point on the line with the given x coordinate.  Returns positive infinity if the line is vertical.
     * @param lineP0x x of the first point that defines the line
     * @param lineP0y y of the first point that defines the line.
     * @param lineP1x x of the other point that defines the line.
     * @param lineP1y y of the other point that defines the line.
     * @param x the x coordinate to consider
     */
    export function yFromXOnLine(lineP0x: number, lineP0y: number, lineP1x: number, lineP1y: number, x: number): number {
        if (Math.abs(lineP1x - lineP0x) < EPSILON)
            return Number.POSITIVE_INFINITY;
        let slope: number = (lineP1y - lineP0y) / (lineP1x - lineP0x);
        let yInt: number = lineP0y - slope * lineP0x;
        return slope * x + yInt;
    }

    /**
     * Given a line, returns the point on the line with the given y coordinate.  Returns positive infinity if the line is horizontal.
     * @param lineP0x x of the first point that defines the line
     * @param lineP0y y of the first point that defines the line.
     * @param lineP1x x of the other point that defines the line.
     * @param lineP1y y of the other point that defines the line.
     * @param y the y coordinate to consider
     */
    export function xFromYOnLine(lineP0x: number, lineP0y: number, lineP1x: number, lineP1y: number, y: number): number {
        if (Math.abs(lineP1y - lineP0y) < EPSILON)
            return Number.POSITIVE_INFINITY;
        let invSlope: number = (lineP1x - lineP0x) / (lineP1y - lineP0y);
        let xInt: number = lineP0x - invSlope * lineP0y;
        return invSlope * y + xInt;
    }

}
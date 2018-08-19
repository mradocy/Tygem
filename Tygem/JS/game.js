class Vec2 {
    constructor(x = 0, y = 0) {
        this.setValues = (x, y) => {
            this.x = x;
            this.y = y;
        };
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
        this.normalize = () => {
            let mag = Math.sqrt(this.x * this.x + this.y * this.y);
            if (mag > 0.000001) {
                this.x /= mag;
                this.y /= mag;
            }
        };
        this.clone = () => {
            return new Vec2(this.x, this.y);
        };
        this.toString = () => {
            return "(" + this.x + ", " + this.y + ")";
        };
        this.x = x;
        this.y = y;
    }
    static distance(v1, v2) {
        return Math.sqrt((v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y));
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
}
var M;
(function (M) {
    M.degToRad = 0.017453292519943295;
    M.radToDeg = 57.295779513082323;
    M.EPSILON = .0001;
    function distance(v1x, v1y, v2x, v2y) {
        return Math.sqrt((v2x - v1x) * (v2x - v1x) + (v2y - v1y) * (v2y - v1y));
    }
    M.distance = distance;
    function magnitude(vx, vy) {
        return Math.sqrt(vx * vx + vy * vy);
    }
    M.magnitude = magnitude;
    function sqrMagnitude(vx, vy) {
        return vx * vx + vy * vy;
    }
    M.sqrMagnitude = sqrMagnitude;
    function dot(ax, ay, bx, by) {
        return ax * bx + ay * by;
    }
    M.dot = dot;
    function vectorProject(ax, ay, bx, by) {
        let s = dot(ax, ay, bx, by) / dot(bx, by, bx, by);
        return new Vec2(s * bx, s * by);
    }
    M.vectorProject = vectorProject;
    function fmod(x, y) {
        return x - Math.floor(x / y) * y;
    }
    M.fmod = fmod;
    function atan2(v) {
        return Math.atan2(v.y, v.x);
    }
    M.atan2 = atan2;
    function wrap2PI(angleRadians) {
        return fmod(angleRadians, Math.PI * 2);
    }
    M.wrap2PI = wrap2PI;
    function wrapPI(angleRadians) {
        return fmod(angleRadians + Math.PI, Math.PI * 2) - Math.PI;
    }
    M.wrapPI = wrapPI;
    function wrap360(angleDegrees) {
        return fmod(angleDegrees, 360);
    }
    M.wrap360 = wrap360;
    function wrap180(angleDegrees) {
        return fmod(angleDegrees + 180, 360) - 180;
    }
    M.wrap180 = wrap180;
    function angleDiffRadians(angleStartRadians, angleEndRadians) {
        return wrapPI(angleEndRadians - angleStartRadians);
    }
    M.angleDiffRadians = angleDiffRadians;
    function angleDiffDegrees(angleStartDegrees, angleEndDegrees) {
        return wrap180(angleEndDegrees - angleStartDegrees);
    }
    M.angleDiffDegrees = angleDiffDegrees;
    function angleInSectorDegrees(sectorAngle, sectorAngleSpread, testAngle) {
        return Math.abs(angleDiffDegrees(testAngle, sectorAngle)) <= sectorAngleSpread / 2;
    }
    M.angleInSectorDegrees = angleInSectorDegrees;
    function rotateAroundPoint(vx, vy, pointX, pointY, rotationRadians) {
        let ret = new Vec2();
        let c = Math.cos(rotationRadians);
        let s = Math.sin(rotationRadians);
        ret.x = pointX + (vx - pointX) * c - (vy - pointY) * s;
        ret.y = pointY + (vx - pointX) * s + (vy - pointY) * c;
        return ret;
    }
    M.rotateAroundPoint = rotateAroundPoint;
    function pointOnLineClosestToPoint(lineP0x, lineP0y, lineP1x, lineP1y, pointX, pointY) {
        let ret = vectorProject(pointX - lineP0x, pointY - lineP0y, lineP1x - lineP0x, lineP1y - lineP0y);
        ret.x += lineP0x;
        ret.y += lineP0y;
        return ret;
    }
    M.pointOnLineClosestToPoint = pointOnLineClosestToPoint;
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
    function centeredSpacing(spacing, index, numElements) {
        if (numElements <= 1)
            return 0;
        return (index - (numElements - 1) / 2) * spacing;
    }
    M.centeredSpacing = centeredSpacing;
    function isClockwise(v1x, v1y, v2x, v2y) {
        return -v1x * v2y + v1y * v2x > 0;
    }
    M.isClockwise = isClockwise;
    function angleBetweenVectors(v0x, v0y, v1x, v1y) {
        return Math.acos(dot(v0x, v0y, v1x, v1y) / (magnitude(v0x, v0y) * magnitude(v1x, v1y)));
    }
    M.angleBetweenVectors = angleBetweenVectors;
    function normalVector(vx, vy) {
        let ret = new Vec2(-vy, vx);
        ret.normalize();
        return ret;
    }
    M.normalVector = normalVector;
    function linesParallel(line0P0x, line0P0y, line0P1x, line0P1y, line1P0x, line1P0y, line1P1x, line1P1y) {
        return !isFinite(lineLineIntersection(line0P0x, line0P0y, line0P1x, line0P1y, line1P0x, line1P0y, line1P1x, line1P1y));
    }
    M.linesParallel = linesParallel;
    function lineLineIntersection(line0P0x, line0P0y, line0P1x, line0P1y, line1P0x, line1P0y, line1P1x, line1P1y) {
        let line0x = line0P1x - line0P0x;
        let line0y = line0P1y - line0P0y;
        let perpLine1x = line1P0y - line1P1y;
        let perpLine1y = line1P1x - line1P0x;
        let div = dot(perpLine1x, perpLine1y, line0x, line0y);
        if (Math.abs(div) < M.EPSILON) {
            return Number.POSITIVE_INFINITY;
        }
        return dot(perpLine1x, perpLine1y, line1P0x - line0P0x, line1P0y - line0P0y) / div;
    }
    M.lineLineIntersection = lineLineIntersection;
    function lineLineIntersectionPoint(line0P0x, line0P0y, line0P1x, line0P1y, line1P0x, line1P0y, line1P1x, line1P1y) {
        let t = lineLineIntersection(line0P0x, line0P0y, line0P1x, line0P1y, line1P0x, line1P0y, line1P1x, line1P1y);
        if (!isFinite(t))
            return null;
        return new Vec2(line0P0x + (line0P1x - line0P0x) * t, line0P0y + (line0P1y - line0P0y) * t);
    }
    M.lineLineIntersectionPoint = lineLineIntersectionPoint;
    function rayLineIntersection(rayOriginX, rayOriginY, rayDirectionX, rayDirectionY, lineP0x, lineP0y, lineP1x, lineP1y, rayDistance = Number.POSITIVE_INFINITY) {
        let t = lineLineIntersection(rayOriginX, rayOriginY, rayOriginX + rayDirectionX, rayOriginY + rayDirectionY, lineP0x, lineP0y, lineP1x, lineP1y);
        if (!isFinite(t))
            return -1;
        if (t <= -M.EPSILON)
            return -1;
        if (rayDistance > 0 && !isFinite(rayDistance)) {
            return t;
        }
        let directionMagnitude = sqrMagnitude(rayDirectionX, rayDirectionY);
        if (Math.abs(directionMagnitude - 1) >= M.EPSILON) {
            directionMagnitude = Math.sqrt(directionMagnitude);
        }
        let intersectDistance = directionMagnitude * t;
        if (intersectDistance <= rayDistance + M.EPSILON)
            return t;
        return -1;
    }
    M.rayLineIntersection = rayLineIntersection;
    function raySegmentIntersection(rayOriginX, rayOriginY, rayDirectionX, rayDirectionY, segmentP0x, segmentP0y, segmentP1x, segmentP1y, rayDistance = Number.POSITIVE_INFINITY) {
        let t = rayLineIntersection(rayOriginX, rayOriginY, rayDirectionX, rayDirectionY, segmentP0x, segmentP0y, segmentP1x, segmentP1y, rayDistance);
        if (t == -1)
            return -1;
        let px = rayOriginX + rayDirectionX * t;
        let py = rayOriginY + rayDirectionY * t;
        if (Math.min(segmentP0x, segmentP1x) - M.EPSILON < px && px < Math.max(segmentP0x, segmentP1x) + M.EPSILON &&
            Math.min(segmentP0y, segmentP1y) - M.EPSILON < py && py < Math.max(segmentP0y, segmentP1y) + M.EPSILON) {
            return t;
        }
        return -1;
    }
    M.raySegmentIntersection = raySegmentIntersection;
    function rayVerticalSegmentIntersection(rayOriginX, rayOriginY, rayDirectionX, rayDirectionY, segmentX, segmentP0y, segmentP1y, rayDistance = Number.POSITIVE_INFINITY) {
        if (Math.abs(rayDirectionX) < M.EPSILON)
            return -1;
        let t = (segmentX - rayOriginX) / rayDirectionX;
        if (t <= -M.EPSILON)
            return -1;
        let py = rayOriginY + rayDirectionY * t;
        if (Math.min(segmentP0y, segmentP1y) - M.EPSILON < py && py < Math.max(segmentP0y, segmentP1y) + M.EPSILON) {
            return t;
        }
        return -1;
    }
    M.rayVerticalSegmentIntersection = rayVerticalSegmentIntersection;
    function rayHorizontalSegmentIntersection(rayOriginX, rayOriginY, rayDirectionX, rayDirectionY, segmentY, segmentP0x, segmentP1x, rayDistance = Number.POSITIVE_INFINITY) {
        if (Math.abs(rayDirectionY) < M.EPSILON)
            return -1;
        let t = (segmentY - rayOriginY) / rayDirectionY;
        if (t <= -M.EPSILON)
            return -1;
        let px = rayOriginX + rayDirectionX * t;
        if (Math.min(segmentP0x, segmentP1x) - M.EPSILON < px && px < Math.max(segmentP0x, segmentP1x) + M.EPSILON) {
            return t;
        }
        return -1;
    }
    M.rayHorizontalSegmentIntersection = rayHorizontalSegmentIntersection;
    function segmentSegmentIntersection(segment0P0x, segment0P0y, segment0P1x, segment0P1y, segment1P0x, segment1P0y, segment1P1x, segment1P1y) {
        let t = raySegmentIntersection(segment0P0x, segment0P0y, segment0P1x - segment0P0x, segment0P1y - segment0P0y, segment1P0x, segment1P0y, segment1P1x, segment1P1y);
        if (t == -1)
            return -1;
        if (t > 1)
            return -1;
        return t;
    }
    M.segmentSegmentIntersection = segmentSegmentIntersection;
    function circleVerticalSegmentIntersects(circleX, circleY, circleRadius, segmentX, segmentP0y, segmentP1y) {
        let xDist = segmentX - circleX;
        if (Math.abs(xDist) > circleRadius)
            return false;
        let yOff = Math.sqrt(circleRadius * circleRadius - xDist * xDist);
        return circleY - yOff <= Math.max(segmentP0y, segmentP1y) &&
            circleY + yOff >= Math.min(segmentP0y, segmentP1y);
    }
    M.circleVerticalSegmentIntersects = circleVerticalSegmentIntersects;
    function circleHorizontalSegmentIntersects(circleX, circleY, circleRadius, segmentY, segmentP0x, segmentP1x) {
        let yDist = segmentY - circleY;
        if (Math.abs(yDist) > circleRadius)
            return false;
        let xOff = Math.sqrt(circleRadius * circleRadius - yDist * yDist);
        return circleX - xOff <= Math.max(segmentP0x, segmentP1x) &&
            circleX + xOff >= Math.min(segmentP0x, segmentP1x);
    }
    M.circleHorizontalSegmentIntersects = circleHorizontalSegmentIntersects;
    function circleRectangleIntersects(circleX, circleY, circleRadius, rectX, rectY, rectWidth, rectHeight) {
        if (rectX <= circleX && circleX < rectX + rectWidth &&
            rectY <= circleY && circleY < rectY + rectHeight)
            return true;
        if (circleVerticalSegmentIntersects(circleX, circleY, circleRadius, rectX, rectY, rectY + rectHeight))
            return true;
        if (circleVerticalSegmentIntersects(circleX, circleY, circleRadius, rectX + rectWidth, rectY, rectY + rectHeight))
            return true;
        if (circleHorizontalSegmentIntersects(circleX, circleY, circleRadius, rectY, rectX, rectX + rectWidth))
            return true;
        if (circleHorizontalSegmentIntersects(circleX, circleY, circleRadius, rectY + rectHeight, rectX, rectX + rectWidth))
            return true;
        return false;
    }
    M.circleRectangleIntersects = circleRectangleIntersects;
    function pointToLeft(lineP0x, lineP0y, lineP1x, lineP1y, pointX, pointY) {
        return ((lineP1x - lineP0x) * (pointY - lineP0y) - (lineP1y - lineP0y) * (pointX - lineP0x)) > 0;
    }
    M.pointToLeft = pointToLeft;
    function pointsOnSameSideOfLine(lineP0x, lineP0y, lineP1x, lineP1y, point0x, point0y, point1x, point1y) {
        return pointToLeft(lineP0x, lineP0y, lineP1x, lineP1y, point0x, point0y) == pointToLeft(lineP0x, lineP0y, lineP1x, lineP1y, point1x, point1y);
    }
    M.pointsOnSameSideOfLine = pointsOnSameSideOfLine;
    function yFromXOnLine(lineP0x, lineP0y, lineP1x, lineP1y, x) {
        if (Math.abs(lineP1x - lineP0x) < M.EPSILON)
            return Number.POSITIVE_INFINITY;
        let slope = (lineP1y - lineP0y) / (lineP1x - lineP0x);
        let yInt = lineP0y - slope * lineP0x;
        return slope * x + yInt;
    }
    M.yFromXOnLine = yFromXOnLine;
    function xFromYOnLine(lineP0x, lineP0y, lineP1x, lineP1y, y) {
        if (Math.abs(lineP1y - lineP0y) < M.EPSILON)
            return Number.POSITIVE_INFINITY;
        let invSlope = (lineP1x - lineP0x) / (lineP1y - lineP0y);
        let xInt = lineP0x - invSlope * lineP0y;
        return invSlope * y + xInt;
    }
    M.xFromYOnLine = xFromYOnLine;
})(M || (M = {}));
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
class Matrix2x3 {
    constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
        this.setIdentity = () => {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.e = 0;
            this.f = 0;
        };
        this.setValues = (a, b, c, d, e, f) => {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.e = e;
            this.f = f;
        };
        this.setValuesFromMatrix = (m) => {
            this.a = m.a;
            this.b = m.b;
            this.c = m.c;
            this.d = m.d;
            this.e = m.e;
            this.f = m.f;
        };
        this.clone = () => {
            let ret = new Matrix2x3();
            ret.setValues(this.a, this.b, this.c, this.d, this.e, this.f);
            return ret;
        };
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
        this.scale = (sx, sy) => {
            this.multiply(sx, 0, 0, sy, 0, 0);
        };
        this.rotate = (angleRadians) => {
            let cos = Math.cos(angleRadians);
            let sin = Math.sin(angleRadians);
            this.multiply(cos, sin, -sin, cos, 0, 0);
        };
        this.translate = (tx, ty) => {
            this.multiply(1, 0, 0, 1, tx, ty);
        };
        this.transformVec2 = (v) => {
            let vx = v.x;
            let vy = v.y;
            v.x = vx * this.a + vy * this.c + this.e;
            v.y = vx * this.b + vy * this.d + this.f;
        };
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
    static get identity() { return Matrix2x3._identity; }
}
Matrix2x3._identity = new Matrix2x3();
var Material;
(function (Material) {
    function addMaterial(name, object) {
        if (materialDictionary.hasOwnProperty(name)) {
            console.error("Material " + name + " not added because there already exists a material with that name.");
            return;
        }
        materialDictionary[name] = object;
    }
    Material.addMaterial = addMaterial;
    function getMaterial(name) {
        if (!materialDictionary.hasOwnProperty(name)) {
            console.error("Material " + name + " has not been added.");
            return null;
        }
        return materialDictionary[name];
    }
    Material.getMaterial = getMaterial;
    function getProperty(materialName, propertyName, defaultValue = "") {
        let mat = getMaterial(materialName);
        if (mat === null || !mat.hasOwnProperty(propertyName)) {
            return defaultValue;
        }
        return mat[propertyName];
    }
    Material.getProperty = getProperty;
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
class ColorParser {
    constructor() {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.alpha = 1;
        this.parseCSSColor = (cssStr) => {
            let str = cssStr.replace(/ /g, '').toLowerCase();
            if (str in ColorParser.kCSSColorTable) {
                let colorInfo = ColorParser.kCSSColorTable[str];
                this.r = colorInfo[0];
                this.g = colorInfo[1];
                this.b = colorInfo[2];
                this.alpha = colorInfo[3];
                return true;
            }
            if (str[0] === '#') {
                if (str.length === 4) {
                    var iv = parseInt(str.substr(1), 16);
                    if (!(iv >= 0 && iv <= 0xfff))
                        return false;
                    this.r = ((iv & 0xf00) >> 4) | ((iv & 0xf00) >> 8);
                    this.g = (iv & 0xf0) | ((iv & 0xf0) >> 4);
                    this.b = (iv & 0xf) | ((iv & 0xf) << 4);
                    this.alpha = 1;
                    return true;
                }
                else if (str.length === 7) {
                    var iv = parseInt(str.substr(1), 16);
                    if (!(iv >= 0 && iv <= 0xffffff))
                        return false;
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
                let alpha = 1;
                switch (fname) {
                    case 'rgba':
                        if (params.length !== 4)
                            return false;
                        alpha = ColorParser.parse_css_float(params.pop());
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
                    case 'hsl':
                        if (params.length !== 3)
                            return false;
                        let h = (((parseFloat(params[0]) % 360) + 360) % 360) / 360;
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
        i = Math.round(i);
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
var StringUtils;
(function (StringUtils) {
    function isWhitespace(char) {
        return /\s/.test(typeof char === 'number' ? String.fromCharCode(char) : char.charAt(0));
    }
    StringUtils.isWhitespace = isWhitespace;
    function isAlphabetical(char) {
        let c = typeof char === 'string' ? char.charCodeAt(0) : char;
        return ((97 <= c && c <= 122) ||
            (65 <= c && c <= 90));
    }
    StringUtils.isAlphabetical = isAlphabetical;
    function isDigit(char) {
        let c = typeof char === 'string' ? char.charCodeAt(0) : char;
        return 48 <= c && c <= 57;
    }
    StringUtils.isDigit = isDigit;
    function trimLeft(str) {
        return str.replace(/^\s+/, "");
    }
    StringUtils.trimLeft = trimLeft;
    function trimRight(str) {
        return str.replace(/\s+$/, "");
    }
    StringUtils.trimRight = trimRight;
    function stringFromKeyCode(keyCode, shiftHeld = false) {
        if (keyCode < 0 || keyCode >= keyCodeArr.length)
            return "";
        if (shiftHeld) {
            return keyCodeShiftArr[keyCode];
        }
        else {
            return keyCodeArr[keyCode];
        }
    }
    StringUtils.stringFromKeyCode = stringFromKeyCode;
    function splitToLines(str, pixelWidth, context, ignoreHTMLTags = false) {
        let ret = [];
        let lineStart = 0;
        let lineEnd = 0;
        let insideAngleBracket = 0;
        let angleBracketStart = 0;
        let angleBracketLineWidth = 0;
        for (let i = 0; i < str.length; i++) {
            let c = str.charCodeAt(i);
            if (insideAngleBracket > 0) {
                if (c === 62) {
                    insideAngleBracket--;
                    if (insideAngleBracket === 0) {
                        angleBracketLineWidth += context.measureText(str.substring(angleBracketStart, i + 1)).width;
                        lineEnd = i + 1;
                    }
                }
            }
            else if (ignoreHTMLTags && c === 60) {
                if (insideAngleBracket === 0) {
                    angleBracketStart = i;
                }
                insideAngleBracket++;
            }
            else if (c === 10) {
                lineEnd = i;
                ret.push(str.substring(lineStart, lineEnd + 1));
                lineStart = lineEnd + 1;
                lineEnd = lineStart;
                angleBracketLineWidth = 0;
            }
            else if (c === 13) {
            }
            else if (isWhitespace(c)) {
                lineEnd = i + 1;
            }
            if (insideAngleBracket === 0 &&
                context.measureText(str.substring(lineStart, i + 1)).width - angleBracketLineWidth > pixelWidth) {
                if (lineStart !== lineEnd) {
                    ret.push(str.substring(lineStart, lineEnd));
                    lineStart = lineEnd;
                    angleBracketLineWidth = 0;
                }
            }
        }
        ret.push(str.substring(lineStart));
        if (ignoreHTMLTags && insideAngleBracket !== 0) {
            console.warn("HTML tags for '" + str + "' aren't properly formatted.");
        }
        return ret;
    }
    StringUtils.splitToLines = splitToLines;
    function trimHTMLTags(str) {
        let sb = [];
        let start = 0;
        let insideAngleBracket = 0;
        for (let i = 0; i < str.length; i++) {
            let c = str.charCodeAt(i);
            if (c === 60) {
                if (insideAngleBracket === 0) {
                    sb.push(str.substring(start, i));
                }
                insideAngleBracket++;
            }
            else if (c === 62) {
                insideAngleBracket--;
                if (insideAngleBracket === 0) {
                    start = i + 1;
                }
            }
        }
        sb.push(str.substring(start));
        if (insideAngleBracket !== 0) {
            console.warn("HTML tags for '" + str + "' aren't properly formatted.");
        }
        return sb.join("");
    }
    StringUtils.trimHTMLTags = trimHTMLTags;
    let keyCodeArr = [
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "\n", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", " ", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "0", "1",
        "2", "3", "4", "5", "6", "7", "8", "9", "", "",
        "", "", "", "", "", "a", "b", "c", "d", "e",
        "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
        "p", "q", "r", "s", "t", "u", "v", "w", "x", "y",
        "z", "", "", "", "", "", "0", "1", "2", "3",
        "4", "5", "6", "7", "8", "9", "*", "+", "", "-",
        ".", "/", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", ";", "=", ",", "-",
        ".", "/", "`", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "[",
        "\\", "]", "'", "", "", "", "", "", "", "", "",
    ];
    let keyCodeShiftArr = [
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "\n", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", " ", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", ")", "!",
        "@", "#", "$", "%", "^", "&", "*", "(", "", "",
        "", "", "", "", "", "A", "B", "C", "D", "E",
        "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
        "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y",
        "Z", "", "", "", "", "", "0", "1", "2", "3",
        "4", "5", "6", "7", "8", "9", "*", "+", "", "-",
        ".", "/", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", ":", "+", "<", "_",
        ">", "?", "~", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "", "", "{",
        "|", "}", "\"", "", "", "", "", "", "", "", "",
    ];
})(StringUtils || (StringUtils = {}));
class Transform {
    constructor() {
        this.getParent = () => {
            return this.parent;
        };
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
            if (this.parent !== null) {
                let index = this.parent.children.indexOf(this);
                this.parent.children.splice(index, 1);
            }
            this.parent = parent;
            if (this.parent !== null) {
                this.parent.children.push(this);
            }
        };
        this.getChildren = () => {
            return this.children.slice();
        };
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
        this.gameObject = null;
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.getGlobalPosition = (outPos = null) => {
            this.updateGlobalMatrix();
            if (outPos == null) {
                this.tempVec2.setValues(0, 0);
                this.globalMatrix.transformVec2(this.tempVec2);
                return this.tempVec2.clone();
            }
            else {
                outPos.setValues(0, 0);
                this.globalMatrix.transformVec2(outPos);
                return null;
            }
        };
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
        this.getGlobalRotation = () => {
            let ret = 0;
            let trans = this;
            while (trans !== null) {
                ret += trans.rotation;
                trans = trans.parent;
            }
            return ret;
        };
        this.setGlobalRotation = (rotationDegrees) => {
            let parentRot = 0;
            let trans = this.parent;
            while (trans !== null) {
                parentRot += trans.rotation;
            }
            this.rotation = rotationDegrees - parentRot;
        };
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
        this.getLocalMatrix = () => {
            this.updateLocalMatrix();
            return this.localMatrix.clone();
        };
        this.getGlobalMatrix = () => {
            this.updateGlobalMatrix();
            return this.globalMatrix.clone();
        };
        this.getInverseGlobalMatrix = () => {
            this.updateInverseGlobalMatrix();
            return this.inverseGlobalMatrix.clone();
        };
        this.multiplyByGlobalMatrix = (matrix) => {
            this.updateGlobalMatrix();
            matrix.multiply(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.e, this.globalMatrix.f);
        };
        this.updateLocalMatrix = () => {
            this.localMatrix.setIdentity();
            this.localMatrix.translate(this.x, this.y);
            this.localMatrix.rotate(this.rotation * 0.017453292519943295);
            this.localMatrix.scale(this.scaleX, this.scaleY);
        };
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
        this.updateInverseGlobalMatrix = () => {
            this.updateGlobalMatrix();
            let m = this.globalMatrix;
            this.inverseGlobalMatrix.setValues(m.a, m.b, m.c, m.d, m.e, m.f);
            this.inverseGlobalMatrix.invert();
        };
        this.localMatrix = new Matrix2x3();
        this.globalMatrix = new Matrix2x3();
        this.inverseGlobalMatrix = new Matrix2x3();
        this.tempMatrix = new Matrix2x3();
        this.tempVec2 = new Vec2();
        this.parent = null;
        this.children = [];
    }
}
class SaveBox {
    constructor() {
        this.fileIndex = 0;
        this.setBool = (key, value) => {
            this.bools[key] = value;
        };
        this.getBool = (key, defaultValue = false) => {
            if (!this.bools.hasOwnProperty(key))
                return defaultValue;
            return this.bools[key];
        };
        this.setNumber = (key, value) => {
            this.numbers[key] = value;
        };
        this.getNumber = (key, defaultValue = 0) => {
            if (!this.numbers.hasOwnProperty(key))
                return defaultValue;
            return this.numbers[key];
        };
        this.setString = (key, value) => {
            this.strings[key] = value;
        };
        this.setStringObject = (key, value) => {
            this.strings[key] = JSON.stringify(value);
        };
        this.getString = (key, defaultValue = "") => {
            if (!this.strings.hasOwnProperty(key))
                return defaultValue;
            return this.strings[key];
        };
        this.getStringObject = (key, defaultValue = undefined) => {
            if (!this.strings.hasOwnProperty(key))
                return defaultValue;
            return JSON.parse(this.strings[key]);
        };
        this.getBoolListElement = (key, index, defaultValue = false) => {
            if (!this.boolLists.hasOwnProperty(key))
                return defaultValue;
            let boolList = this.boolLists[key];
            if (index < 0 || index >= boolList.length)
                return defaultValue;
            return boolList[index];
        };
        this.getBoolListElements = (key, defaultValue = []) => {
            if (!this.boolLists.hasOwnProperty(key))
                return defaultValue;
            let boolList = this.boolLists[key];
            return boolList.concat([]);
        };
        this.getBoolListCount = (key) => {
            if (!this.boolLists.hasOwnProperty(key))
                return 0;
            return this.boolLists[key].length;
        };
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
        this.addBoolListElement = (key, value) => {
            if (!this.boolLists.hasOwnProperty(key))
                this.boolLists[key] = [];
            this.boolLists[key].push(value);
        };
        this.getNumberListElement = (key, index, defaultValue = 0) => {
            if (!this.numberLists.hasOwnProperty(key))
                return defaultValue;
            let numberList = this.numberLists[key];
            if (index < 0 || index >= numberList.length)
                return defaultValue;
            return numberList[index];
        };
        this.getNumberListElements = (key, defaultValue = []) => {
            if (!this.numberLists.hasOwnProperty(key))
                return defaultValue;
            let numberList = this.numberLists[key];
            return numberList.concat([]);
        };
        this.getNumberListCount = (key) => {
            if (!this.numberLists.hasOwnProperty(key))
                return 0;
            return this.numberLists[key].length;
        };
        this.getNumberListContains = (key, value) => {
            if (!this.numberLists.hasOwnProperty(key))
                return false;
            return this.numberLists[key].indexOf(value) != -1;
        };
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
        this.addNumberListElement = (key, value, ignoreIfDuplicate = false) => {
            if (ignoreIfDuplicate) {
                if (this.getNumberListContains(key, value))
                    return;
            }
            if (!this.numberLists.hasOwnProperty(key))
                this.numberLists[key] = [];
            this.numberLists[key].push(value);
        };
        this.getDateSaved = () => {
            return new Date(this.dateSaved.getTime());
        };
        this.clearAll = () => {
            this.bools = {};
            this.numbers = {};
            this.strings = {};
            this.boolLists = {};
            this.numberLists = {};
        };
        this.saveToString = () => {
            let sb = [];
            this.dateSaved = new Date();
            sb.push("" + this.dateSaved.getTime(), SaveBox.newLine);
            sb.push(JSON.stringify(this.bools), SaveBox.newLine);
            sb.push(JSON.stringify(this.numbers), SaveBox.newLine);
            sb.push(SaveBox.sourceToValid(JSON.stringify(this.strings)), SaveBox.newLine);
            sb.push(JSON.stringify(this.boolLists), SaveBox.newLine);
            sb.push(JSON.stringify(this.numberLists), SaveBox.newLine);
            let checksum = SaveBox.getChecksumFromArrStr(sb);
            sb.unshift(checksum + SaveBox.newLine);
            return sb.join("");
        };
        this.loadFromString = (str) => {
            this.clearAll();
            let index = str.indexOf(SaveBox.newLine);
            if (index == -1)
                return false;
            let checksumStr = str.substring(0, index);
            let checksum = Number(checksumStr);
            if (isNaN(checksum))
                return false;
            let content = str.substring(index + 1);
            if (checksum != SaveBox.getChecksumFromStr(content))
                return false;
            let lines = content.split(SaveBox.newLine);
            this.dateSaved = new Date(Number(lines[0]));
            this.bools = JSON.parse(lines[1]);
            this.numbers = JSON.parse(lines[2]);
            this.strings = JSON.parse(SaveBox.validToSource(lines[3]));
            this.boolLists = JSON.parse(lines[4]);
            this.numberLists = JSON.parse(lines[5]);
            return true;
        };
        this.saveToLocalStorage = () => {
            if (localStorage === undefined)
                return false;
            localStorage.setItem(SaveBox.getLocalStorageKey(this.fileIndex), this.saveToString());
            return true;
        };
        this.loadFromLocalStorage = () => {
            if (localStorage === undefined)
                return false;
            let str = localStorage.getItem(SaveBox.getLocalStorageKey(this.fileIndex));
            if (str == null)
                return false;
            return this.loadFromString(str);
        };
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
    static createNewSaveBox() {
        let existingSaveFiles = SaveBox.getSaveFileIndices();
        let fileIndex = existingSaveFiles.length;
        let collision = true;
        while (collision) {
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
        let saveBox = new SaveBox();
        saveBox.fileIndex = fileIndex;
        return saveBox;
    }
    static openSaveBox(fileIndex) {
        let saveBox = new SaveBox();
        saveBox.fileIndex = fileIndex;
        let status = saveBox.loadFromLocalStorage();
        if (!status)
            return null;
        return saveBox;
    }
    static deleteSaveBox(fileIndex) {
        if (localStorage == undefined)
            return;
        localStorage.removeItem(SaveBox.getLocalStorageKey(fileIndex));
    }
    static getLocalStorageKey(fileIndex) {
        return SaveBox.saveboxPrefix + fileIndex;
    }
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
    static sourceToValid(str) {
        let s = SaveBox.replaceAll(str, "%", "%0");
        s = SaveBox.replaceAll(s, SaveBox.newLine, "%1");
        s = SaveBox.replaceAll(s, SaveBox.separator1, "%2");
        s = SaveBox.replaceAll(s, SaveBox.separator2, "%3");
        return s;
    }
    static validToSource(str) {
        let s = SaveBox.replaceAll(str, "%3", SaveBox.separator2);
        s = SaveBox.replaceAll(s, "%2", SaveBox.separator1);
        s = SaveBox.replaceAll(s, "%1", SaveBox.newLine);
        s = SaveBox.replaceAll(s, "%0", "%");
        return s;
    }
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
var SaveManager;
(function (SaveManager) {
    SaveManager.data = {};
    function downloadSaveData() {
        if (saveDownloadURL != "") {
            window.URL.revokeObjectURL(saveDownloadURL);
        }
        let blob = new Blob([JSON.stringify(SaveManager.data)], { type: 'application/json' });
        saveDownloadURL = window.URL.createObjectURL(blob);
        var elem = window.document.createElement('a');
        elem.href = saveDownloadURL;
        elem.download = "data.sav";
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
    SaveManager.downloadSaveData = downloadSaveData;
    let saveDownloadURL = "";
})(SaveManager || (SaveManager = {}));
var Keys;
(function (Keys) {
    function _initialize(document) {
        if (initialized) {
            console.warn("Keys already initialized");
            return;
        }
        document.addEventListener("keydown", keyDown);
        document.addEventListener("keyup", keyUp);
        initialized = true;
    }
    Keys._initialize = _initialize;
    function keyPressed(key) {
        return keyCodePressed(key);
    }
    Keys.keyPressed = keyPressed;
    function keyCodePressed(keyCode) {
        return keysPressed.indexOf(keyCode) != -1;
    }
    Keys.keyCodePressed = keyCodePressed;
    function keyHeld(key) {
        return keyCodeHeld(key);
    }
    Keys.keyHeld = keyHeld;
    function keyCodeHeld(keyCode) {
        return keysHeld.indexOf(keyCode) != -1;
    }
    Keys.keyCodeHeld = keyCodeHeld;
    function keyReleased(key) {
        return keyCodeReleased(key);
    }
    Keys.keyReleased = keyReleased;
    function keyCodeReleased(keyCode) {
        return keysReleased.indexOf(keyCode) != -1;
    }
    Keys.keyCodeReleased = keyCodeReleased;
    function keyToString(key) {
        let s = Key[key];
        return s;
    }
    Keys.keyToString = keyToString;
    function keyCodeToString(keyCode) {
        return keyToString(keyCode);
    }
    Keys.keyCodeToString = keyCodeToString;
    function getKeyCodesPressed() {
        return keysPressed.concat([]);
    }
    Keys.getKeyCodesPressed = getKeyCodesPressed;
    function _lateUpdate() {
        keysPressed.splice(0);
        keysReleased.splice(0);
    }
    Keys._lateUpdate = _lateUpdate;
    function keyDown(event) {
        if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
            event.preventDefault();
        }
        if (keysHeld.indexOf(event.keyCode) != -1)
            return;
        if (keysPressed.indexOf(event.keyCode) == -1) {
            keysPressed.push(event.keyCode);
        }
        if (keysHeld.indexOf(event.keyCode) == -1) {
            keysHeld.push(event.keyCode);
        }
        if (event.keyCode === Key.F10) {
            if (Game.isFullscreen) {
                Game.exitFullscreen();
            }
            else {
                Game.requestFullscreen();
            }
        }
    }
    function keyUp(event) {
        if (keysReleased.indexOf(event.keyCode) == -1) {
            keysReleased.push(event.keyCode);
        }
        let index = keysHeld.indexOf(event.keyCode);
        if (index != -1) {
            keysHeld.splice(index, 1);
        }
    }
    let initialized = false;
    let keysPressed = [];
    let keysHeld = [];
    let keysReleased = [];
})(Keys || (Keys = {}));
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
    Key[Key["BackSlash"] = 220] = "BackSlash";
    Key[Key["ClosedBracket"] = 221] = "ClosedBracket";
    Key[Key["Quote"] = 222] = "Quote";
})(Key || (Key = {}));
var Mouse;
(function (Mouse) {
    function _initialize(_canvas) {
        if (initialized) {
            console.warn("Mouse already initialized");
            return;
        }
        canvas = _canvas;
        canvas.addEventListener("mousedown", mouseDown);
        document.addEventListener("mouseup", mouseUp);
        canvas.addEventListener("contextmenu", preventContextMenu);
        document.addEventListener("mousemove", mouseMove);
        initialized = true;
    }
    Mouse._initialize = _initialize;
    Mouse.x = 0;
    Mouse.y = 0;
    function buttonPressed(button) {
        return buttonsPressed.indexOf(button) !== -1;
    }
    Mouse.buttonPressed = buttonPressed;
    function buttonHeld(button) {
        return buttonsHeld.indexOf(button) !== -1;
    }
    Mouse.buttonHeld = buttonHeld;
    function buttonReleased(button) {
        return buttonsReleased.indexOf(button) !== -1;
    }
    Mouse.buttonReleased = buttonReleased;
    function hideCursor() {
        canvas.style.cursor = "none";
    }
    Mouse.hideCursor = hideCursor;
    function showCursor() {
        canvas.style.cursor = "";
    }
    Mouse.showCursor = showCursor;
    function _lateUpdate() {
        buttonsPressed.splice(0);
        buttonsReleased.splice(0);
    }
    Mouse._lateUpdate = _lateUpdate;
    function mouseDown(event) {
        updateMousePosition(event);
        if ([1, 2].indexOf(event.button) > -1) {
            event.preventDefault();
        }
        if (buttonsPressed.indexOf(event.button) == -1) {
            buttonsPressed.push(event.button);
        }
        if (buttonsHeld.indexOf(event.button) == -1) {
            buttonsHeld.push(event.button);
        }
        if (event.button === 2) {
            if (Game.isFullscreen) {
                Game.exitFullscreen();
            }
            else {
                Game.requestFullscreen();
            }
        }
    }
    function mouseUp(event) {
        let index = buttonsHeld.indexOf(event.button);
        if (index == -1) {
            return;
        }
        buttonsHeld.splice(index, 1);
        if (buttonsReleased.indexOf(event.button) == -1) {
            buttonsReleased.push(event.button);
        }
    }
    function mouseMove(event) {
        updateMousePosition(event);
    }
    function preventContextMenu(event) {
        event.preventDefault();
    }
    function updateMousePosition(event) {
        let mx = event.pageX;
        let my = event.pageY;
        if (mx === undefined) {
            mx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            my = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        Mouse.x = (mx - canvas.offsetLeft) * canvas.width / canvas.offsetWidth;
        Mouse.y = (my - canvas.offsetTop) * canvas.height / canvas.offsetHeight;
    }
    let buttonsPressed = [];
    let buttonsHeld = [];
    let buttonsReleased = [];
    let initialized = false;
    let canvas = null;
})(Mouse || (Mouse = {}));
class Gamepads {
    static _initialize(window) {
        if (Gamepads.initialized) {
            console.warn("Gamepads already initialized");
            return;
        }
        window.addEventListener("gamepadconnected", Gamepads.gamepadConnected);
        window.addEventListener("gamepaddisconnected", Gamepads.gamepadDisconnected);
        Gamepads.initialized = true;
    }
    static isGamepadConnected() {
        return Gamepads.getGamepad() !== null;
    }
    static buttonPressed(index) {
        return Gamepads.buttonsPressed.indexOf(index) !== -1;
    }
    static buttonHeld(index) {
        return Gamepads.buttonsHeld.indexOf(index) !== -1;
    }
    static buttonReleased(index) {
        return Gamepads.buttonsReleased.indexOf(index) !== -1;
    }
    static getButtonsPressed() {
        let ret = [];
        Gamepads.copyValues(Gamepads.buttonsPressed, ret);
        return ret;
    }
    static axisValue(index) {
        if (index < 0 || index >= Gamepads.axisValues.length)
            return 0;
        let val = Gamepads.axisValues[index];
        if (Math.abs(val) < Gamepads.AXIS_DEAD_ZONE) {
            val = 0;
        }
        return val;
    }
    static axisPositiveHeld(index) {
        let val = Gamepads.axisValue(index);
        return val > Gamepads.AXIS_PRESS_THRESHOLD;
    }
    static axisNegativeHeld(index) {
        let val = Gamepads.axisValue(index);
        return val < -Gamepads.AXIS_PRESS_THRESHOLD;
    }
    static axisPositivePressed(index) {
        let val = Gamepads.axisValue(index);
        let prevVal = Gamepads.axisPreviousValue(index);
        return val > Gamepads.AXIS_PRESS_THRESHOLD && prevVal <= Gamepads.AXIS_PRESS_THRESHOLD;
    }
    static axisNegativePressed(index) {
        let val = Gamepads.axisValue(index);
        let prevVal = Gamepads.axisPreviousValue(index);
        return val < -Gamepads.AXIS_PRESS_THRESHOLD && prevVal >= -Gamepads.AXIS_PRESS_THRESHOLD;
    }
    static axisPositiveReleased(index) {
        let val = Gamepads.axisValue(index);
        let prevVal = Gamepads.axisPreviousValue(index);
        return val <= Gamepads.AXIS_PRESS_THRESHOLD && prevVal > Gamepads.AXIS_PRESS_THRESHOLD;
    }
    static axisNegativeReleased(index) {
        let val = Gamepads.axisValue(index);
        let prevVal = Gamepads.axisPreviousValue(index);
        return val >= -Gamepads.AXIS_PRESS_THRESHOLD && prevVal < -Gamepads.AXIS_PRESS_THRESHOLD;
    }
    static getAxesPositivePressed() {
        let ret = [];
        for (let index = 0; index < Gamepads.axisValues.length; index++) {
            if (Gamepads.axisPositivePressed(index)) {
                ret.push(index);
            }
        }
        return ret;
    }
    static getAxesNegativePressed() {
        let ret = [];
        for (let index = 0; index < Gamepads.axisValues.length; index++) {
            if (Gamepads.axisNegativePressed(index)) {
                ret.push(index);
            }
        }
        return ret;
    }
    static _earlyUpdate() {
        Gamepads.buttonsPressed.splice(0);
        Gamepads.copyValues(Gamepads.buttonsHeld, Gamepads.buttonsPreviouslyHeld);
        Gamepads.buttonsHeld.splice(0);
        Gamepads.buttonsReleased.splice(0);
        Gamepads.copyValues(Gamepads.axisValues, Gamepads.axisPreviousValues);
        Gamepads.axisValues.splice(0);
        let gamepad = Gamepads.getGamepad();
        if (gamepad == null)
            return;
        for (let index = 0; index < gamepad.buttons.length; index++) {
            if (gamepad.buttons[index].pressed) {
                Gamepads.buttonsHeld.push(index);
            }
        }
        for (let i = 0; i < Gamepads.buttonsHeld.length; i++) {
            let button = Gamepads.buttonsHeld[i];
            if (Gamepads.buttonsPreviouslyHeld.indexOf(button) === -1) {
                Gamepads.buttonsPressed.push(button);
            }
        }
        for (let i = 0; i < Gamepads.buttonsPreviouslyHeld.length; i++) {
            let button = Gamepads.buttonsPreviouslyHeld[i];
            if (Gamepads.buttonsHeld.indexOf(button) === -1) {
                Gamepads.buttonsReleased.push(button);
            }
        }
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
Gamepads.AXIS_DEAD_ZONE = .1;
Gamepads.AXIS_PRESS_THRESHOLD = .6;
Gamepads.initialized = false;
Gamepads.buttonsPressed = [];
Gamepads.buttonsHeld = [];
Gamepads.buttonsPreviouslyHeld = [];
Gamepads.buttonsReleased = [];
Gamepads.axisValues = [];
Gamepads.axisPreviousValues = [];
class JSONLoadObject {
    constructor() {
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
        this.loadFromString = (jsonString) => {
            if (this.isLoaded()) {
                console.warn("JSON already loaded");
                return;
            }
            this._json = JSON.parse(jsonString);
            this._loaded = true;
        };
        this.getJSON = () => {
            return this._json;
        };
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
    static getJsonLoaded(name) {
        let n = name.toLowerCase();
        if (!JSONManager.jsonExists(n)) {
            console.warn("There doesn't exist json with the name \"" + n + "\"");
            return false;
        }
        return JSONManager.dictionary[n].isLoaded();
    }
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
    static jsonExists(name) {
        return JSONManager.dictionary.hasOwnProperty(name.toLowerCase());
    }
    static get numJsonLoaded() {
        return JSONManager._numJsonLoaded;
    }
    static get numJson() {
        return JSONManager._numJson;
    }
}
JSONManager.dictionary = {};
JSONManager._numJsonLoaded = 0;
JSONManager._numJson = 0;
var AudioManager;
(function (AudioManager) {
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
    function playSFX(soundFileName, volume = 1, pitch = 1, bypassGeneral = false) {
        let sourceNode = createSourceNode(soundFileName);
        if (sourceNode === null)
            return;
        sourceNode.playbackRate.value = pitch;
        let node = sourceNode;
        if (volume !== 1) {
            let gainNode = _audioContext.createGain();
            gainNode.gain.value = volume;
            node.connect(gainNode);
            node = gainNode;
        }
        if (bypassGeneral) {
            connectToMasterSFXNode(node);
        }
        else {
            connectToGeneralSFXNode(node);
        }
        sourceNode.play();
    }
    AudioManager.playSFX = playSFX;
    function playMusic(soundFileName, volume = 1, pitch = 1, loop = true, loopOffset = 0, bypassGeneral = false) {
        let sourceNode = createSourceNode(soundFileName);
        if (sourceNode === null)
            return;
        sourceNode.playbackRate.value = pitch;
        let node = sourceNode;
        if (volume !== 1) {
            let gainNode = _audioContext.createGain();
            gainNode.gain.value = volume;
            node.connect(gainNode);
            node = gainNode;
        }
        if (loop) {
            sourceNode.loop = true;
            sourceNode.loopStart = sourceNode.startTime + loopOffset;
        }
        else {
            sourceNode.loop = false;
        }
        if (bypassGeneral) {
            connectToMusicNode(node);
        }
        else {
            connectToGeneralMusicNode(node);
        }
        sourceNode.play();
    }
    AudioManager.playMusic = playMusic;
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
    function stopAllSounds() {
        let tempNodes = sourceNodes.concat([]);
        tempNodes.forEach((node) => {
            node.stop();
        });
    }
    AudioManager.stopAllSounds = stopAllSounds;
    function getAllSounds(searchPrefix = "") {
        let ret = [];
        for (let tag in soundDictionary) {
            if (searchPrefix == null || searchPrefix === "" ||
                tag.indexOf(searchPrefix) === 0)
                ret.push(tag);
        }
        ret.sort();
        return ret;
    }
    AudioManager.getAllSounds = getAllSounds;
    function getMasterSFXVolume() {
        return masterSFXGain.gain.value;
    }
    AudioManager.getMasterSFXVolume = getMasterSFXVolume;
    function setMasterSFXVolume(volume) {
        masterSFXGain.gain.value = volume;
    }
    AudioManager.setMasterSFXVolume = setMasterSFXVolume;
    function getGeneralSFXVolume() {
        return generalSFXGain.gain.value;
    }
    AudioManager.getGeneralSFXVolume = getGeneralSFXVolume;
    function setGeneralSFXVolume(volume) {
        generalSFXGain.gain.value = volume;
    }
    AudioManager.setGeneralSFXVolume = setGeneralSFXVolume;
    function getGeneralMusicVolume() {
        return generalMusicGain.gain.value;
    }
    AudioManager.getGeneralMusicVolume = getGeneralMusicVolume;
    function setGeneralMusicVolume(volume) {
        generalMusicGain.gain.value = volume;
    }
    AudioManager.setGeneralMusicVolume = setGeneralMusicVolume;
    function getMasterMusicVolume() {
        return masterMusicGain.gain.value;
    }
    AudioManager.getMasterMusicVolume = getMasterMusicVolume;
    function setMasterMusicVolume(volume) {
        masterMusicGain.gain.value = volume;
    }
    AudioManager.setMasterMusicVolume = setMasterMusicVolume;
    function getSoundDuration(fileName) {
        let sound = getSound(fileName);
        if (sound === null) {
            console.error("Sound \"" + fileName + "\" does not exist.");
            return 0;
        }
        return soundDictionary[fileName].duration;
    }
    AudioManager.getSoundDuration = getSoundDuration;
    class AudioSpriteSourceNode extends AudioBufferSourceNode {
        constructor(...args) {
            super(...args);
            this.play = () => {
                this._playCalled = true;
                if (this.loop)
                    this.start(0, this.startTime);
                else
                    this.start(0, this.startTime, this.duration);
            };
            this._playCalled = false;
        }
    }
    AudioManager.AudioSpriteSourceNode = AudioSpriteSourceNode;
    function createSourceNode(soundFileName) {
        let fn = soundFileName.toLowerCase();
        let sound = getSound(fn);
        if (sound === null) {
            console.error("Sound \"" + fn + "\" does not exist.");
            return null;
        }
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
        };
        sourceNode.buffer = audioSprites[sound.audioSpriteIndex].getAudioBuffer();
        if (sourceNode.buffer === null) {
            console.error("Audio sprite " + sound.audioSpriteIndex + " isn't ready to be played yet.");
            return null;
        }
        sourceNode.loopStart = sound.startTime;
        sourceNode.loopEnd = sound.startTime + sound.duration;
        sourceNodes.push(sourceNode);
        sourceNode.addEventListener("ended", audioSourceNodeOnEnd);
        return sourceNode;
    }
    AudioManager.createSourceNode = createSourceNode;
    function connectToGeneralSFXNode(audioNode) {
        audioNode.connect(generalSFXGain);
    }
    AudioManager.connectToGeneralSFXNode = connectToGeneralSFXNode;
    function connectToMasterSFXNode(audioNode) {
        audioNode.connect(masterSFXGain);
    }
    AudioManager.connectToMasterSFXNode = connectToMasterSFXNode;
    function connectToGeneralMusicNode(audioNode) {
        audioNode.connect(generalMusicGain);
    }
    AudioManager.connectToGeneralMusicNode = connectToGeneralMusicNode;
    function connectToMusicNode(audioNode) {
        audioNode.connect(masterMusicGain);
    }
    AudioManager.connectToMusicNode = connectToMusicNode;
    function getNumAudioSprites() {
        if (_waitForJsonLoad) {
            return audioSprites.length + 1;
        }
        return audioSprites.length;
    }
    AudioManager.getNumAudioSprites = getNumAudioSprites;
    function getNumAudioSpritesReady() {
        return _numAudioSpritesReady;
    }
    AudioManager.getNumAudioSpritesReady = getNumAudioSpritesReady;
    function userInput(onAudioContextRunCallback) {
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
    function isAudioContextRunning() {
        let acAny = _audioContext;
        if (acAny.state != undefined) {
            return acAny.state === "running";
        }
        return true;
    }
    AudioManager.isAudioContextRunning = isAudioContextRunning;
    AudioManager.audioSpritesDirectory = "Assets/Audiosprites/";
    function getAudioContext() {
        return _audioContext;
    }
    AudioManager.getAudioContext = getAudioContext;
    function canPlayOgg() {
        return dummyAudio.canPlayType("audio/ogg; codecs=\"vorbis\"") === "probably";
    }
    AudioManager.canPlayOgg = canPlayOgg;
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
        for (let i = 0; i < json.sounds.length; i++) {
            let soundJson = json.sounds[i];
            soundDictionary[soundJson.filename.toLowerCase()] = new Sound(soundJson.filename, soundJson.asIndex, soundJson.startTime, soundJson.duration);
        }
    }
    class AudioSprite {
        constructor(index, url) {
            this.getIndex = () => {
                return this._index;
            };
            this.getUrl = () => {
                return this._url;
            };
            this.isLoaded = () => {
                return this._loaded;
            };
            this.isDecoded = () => {
                return this._decoded;
            };
            this.isReady = () => {
                return this.isLoaded() && this.isDecoded();
            };
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
    let _waitForJsonLoad = false;
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
        masterSFXGain = _audioContext.createGain();
        masterSFXGain.connect(_audioContext.destination);
        generalSFXGain = _audioContext.createGain();
        generalSFXGain.connect(masterSFXGain);
        masterMusicGain = _audioContext.createGain();
        masterMusicGain.connect(_audioContext.destination);
        generalMusicGain = _audioContext.createGain();
        generalMusicGain.connect(masterMusicGain);
    }
    let dummyAudio = new Audio();
    let audioSprites = [];
    let soundDictionary = {};
    let sourceNodes = [];
    function audioSourceNodeOnEnd(e) {
        let sourceNode = e.target;
        let index = sourceNodes.indexOf(sourceNode);
        if (index !== -1) {
            sourceNodes.splice(index, 1);
        }
        sourceNode.removeEventListener("ended", audioSourceNodeOnEnd);
    }
})(AudioManager || (AudioManager = {}));
var TexPackManager;
(function (TexPackManager) {
    class PackedImage {
        constructor() {
            this.filename = "";
            this.atlasImage = null;
            this.isLoaded = () => {
                return this._textureAtlas.isLoaded();
            };
            this.frameX = 0;
            this.frameY = 0;
            this.frameWidth = 0;
            this.frameHeight = 0;
            this.frameJSON = null;
            this.trimLeft = 0;
            this.trimTop = 0;
            this.trimRight = 0;
            this.trimBottom = 0;
            this.getOriginalWidth = () => {
                return this.trimLeft + this.frameWidth + this.trimRight;
            };
            this.getOriginalHeight = () => {
                return this.trimTop + this.frameHeight + this.trimBottom;
            };
            this._textureAtlas = null;
        }
    }
    TexPackManager.PackedImage = PackedImage;
    function addTexturePack(packJsonUrl) {
        if (JSONManager.jsonExists(packJsonUrl)) {
            console.warn("texture pack " + packJsonUrl.toLowerCase() + " already added");
            return;
        }
        _numTexPacks++;
        JSONManager.addFromUrl(jsonNameFromURL(packJsonUrl), packJsonUrl, onJSONLoad);
    }
    TexPackManager.addTexturePack = addTexturePack;
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
    TexPackManager.texpacksDirectory = "Assets/Texpacks/";
    function getNumTexPacks() {
        return _numTexPacks;
    }
    TexPackManager.getNumTexPacks = getNumTexPacks;
    function getNumTexPacksLoaded() {
        return _numTexPacksLoaded;
    }
    TexPackManager.getNumTexPacksLoaded = getNumTexPacksLoaded;
    function getAllPackedImages(searchPrefix = "") {
        let ret = [];
        for (let tag in packedImageDictionary) {
            if (searchPrefix == null || searchPrefix === "" ||
                tag.indexOf(searchPrefix) === 0)
                ret.push(tag);
        }
        ret.sort();
        return ret;
    }
    TexPackManager.getAllPackedImages = getAllPackedImages;
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
        constructor(imageSource) {
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
    let _numTexPacks = 0;
    let _numTexPacksLoaded = 0;
})(TexPackManager || (TexPackManager = {}));
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
class Spritesheet {
    constructor() {
        this.imageFilename = "";
        this.frames = [];
        this.addFrame = () => {
            let sf = new SpriteFrame();
            sf.imageFilename = this.imageFilename;
            this.frames.push(sf);
            return sf;
        };
    }
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
    static addSpritesheetCustom(imageFilename) {
        if (Spritesheet.spritesheetDic.hasOwnProperty(imageFilename)) {
            console.warn("Cannot create spritesheet " + imageFilename + " because a spritesheet for that file has already been created.");
            return null;
        }
        let ret = new Spritesheet();
        ret.imageFilename = imageFilename;
        Spritesheet.spritesheetDic[imageFilename.toLowerCase()] = ret;
        return ret;
    }
    static getSpritesheet(imageFilename) {
        let fn = imageFilename.toLowerCase();
        if (!Spritesheet.spritesheetDic.hasOwnProperty(fn))
            return null;
        return Spritesheet.spritesheetDic[fn];
    }
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
class Animation {
    constructor() {
        this.name = "";
        this.frames = [];
        this.fps = 10;
        this.loops = false;
        this.getDuration = () => {
            return this.frames.length / this.fps;
        };
    }
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
    static getAnimation(name) {
        if (!Animation.animationsDic.hasOwnProperty(name))
            return null;
        return Animation.animationsDic[name];
    }
    static getAllAnimations(searchPrefix = "") {
        let ret = [];
        for (let tag in Animation.animationsDic) {
            if (searchPrefix == null || searchPrefix === "" ||
                tag.indexOf(searchPrefix) === 0)
                ret.push(tag);
        }
        ret.sort();
        return ret;
    }
}
Animation.animationsDic = {};
var Camera;
(function (Camera) {
    function _initialize(ctx) {
        if (_initialized)
            return;
        Camera.context = ctx;
        _initialized = true;
    }
    Camera._initialize = _initialize;
    Camera.context = null;
    Camera.centerX = 0;
    Camera.centerY = 0;
    Camera.scale = 1;
    function setCenter(center) {
        Camera.centerX = center.x;
        Camera.centerY = center.y;
    }
    Camera.setCenter = setCenter;
    function getCanvasWidth() {
        return Camera.context.canvas.width;
    }
    Camera.getCanvasWidth = getCanvasWidth;
    function getCanvasHeight() {
        return Camera.context.canvas.height;
    }
    Camera.getCanvasHeight = getCanvasHeight;
    function getLeftBound() {
        return Camera.centerX - getCanvasWidth() / 2 / Camera.scale;
    }
    Camera.getLeftBound = getLeftBound;
    function getTopBound() {
        return Camera.centerY - getCanvasHeight() / 2 / Camera.scale;
    }
    Camera.getTopBound = getTopBound;
    function getRightBound() {
        return Camera.centerX + getCanvasWidth() / 2 / Camera.scale;
    }
    Camera.getRightBound = getRightBound;
    function getBottomBound() {
        return Camera.centerY + getCanvasHeight() / 2 / Camera.scale;
    }
    Camera.getBottomBound = getBottomBound;
    function canvasToGlobal(x, y, outPos = null) {
        setMat(tempMatrix);
        tempMatrix.invert();
        if (outPos === null) {
            let v = new Vec2(x, y);
            tempMatrix.transformVec2(v);
            return v;
        }
        else {
            tempMatrix.transformVec2(outPos);
            return null;
        }
    }
    Camera.canvasToGlobal = canvasToGlobal;
    function globalToCanvas(x, y, outPos = null) {
        setMat(tempMatrix);
        if (outPos === null) {
            let v = new Vec2(x, y);
            tempMatrix.transformVec2(v);
            return v;
        }
        else {
            tempMatrix.transformVec2(outPos);
            return null;
        }
    }
    Camera.globalToCanvas = globalToCanvas;
    function getMatrix() {
        setMat(tempMatrix);
        return tempMatrix.clone();
    }
    Camera.getMatrix = getMatrix;
    function setContextTransform(transform) {
        if (Camera.context == null)
            return;
        let temp = tempMatrix;
        setMat(temp);
        transform.multiplyByGlobalMatrix(temp);
        temp.e = Math.floor(temp.e);
        temp.f = Math.floor(temp.f);
        Camera.context.setTransform(temp.a, temp.b, temp.c, temp.d, temp.e, temp.f);
    }
    Camera.setContextTransform = setContextTransform;
    function setContextTransformFromMatrix(matrix) {
        if (Camera.context == null)
            return;
        let temp = tempMatrix;
        setMat(temp);
        temp.multiply(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
        Camera.context.setTransform(temp.a, temp.b, temp.c, temp.d, temp.e, temp.f);
    }
    Camera.setContextTransformFromMatrix = setContextTransformFromMatrix;
    let _initialized = false;
    function setMat(matrix) {
        let tx = getCanvasWidth() / 2 - Camera.centerX * Camera.scale;
        let ty = getCanvasHeight() / 2 - Camera.centerY * Camera.scale;
        matrix.setValues(Camera.scale, 0, 0, Camera.scale, tx, ty);
    }
    let tempMatrix = new Matrix2x3();
})(Camera || (Camera = {}));
class Scene {
    constructor() {
        this.getID = () => {
            return this._id;
        };
        this.getName = () => {
            return this._name;
        };
        this.onLoad = () => { };
        this.onUnload = () => { };
        this._id = 0;
        this._name = "";
        this._id = Scene.sceneIDCounter;
        Scene.sceneIDCounter++;
    }
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
    static get currentScene() {
        if (Scene.loadedScenes.length === 0)
            return null;
        return Scene.loadedScenes[Scene.loadedScenes.length - 1].getName();
    }
    static getLoadedScenes() {
        let ret = [];
        for (let i = 0; i < Scene.loadedScenes.length; i++) {
            ret.push(Scene.loadedScenes[i].getName());
        }
        return ret;
    }
    static loadScene(sceneName) {
        Scene.unloadAllScenes();
        if (Scene.scenesToLoad.length !== 0) {
            Scene.scenesToLoad.splice(0);
        }
        Scene.loadAdditionalScene(sceneName);
    }
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
    static unloadAllScenes() {
        let scene;
        for (let i = 0; i < Scene.loadedScenes.length; i++) {
            scene = Scene.loadedScenes[i];
            if (Scene.scenesToUnload.indexOf(scene) != -1)
                continue;
            Scene.scenesToUnload.push(scene);
        }
    }
    static idFromSceneName(sceneName) {
        let scene = Scene._sceneFromName(sceneName);
        if (scene === null)
            return -1;
        return scene.getID();
    }
    static sceneFromName(sceneName) {
        if (sceneName == null || sceneName == "")
            return null;
        if (!Scene.sceneExists(name))
            return null;
        return Scene.dictionary[name];
    }
    static get numScenes() {
        return Scene._numScenes;
    }
    static getAllScenes(searchPrefix = "") {
        let ret = [];
        for (let tag in Scene.dictionary) {
            if (searchPrefix == null || searchPrefix === "" ||
                tag.indexOf(searchPrefix) === 0)
                ret.push(tag);
        }
        ret.sort();
        return ret;
    }
    static _loadScenesToLoad() {
        let scene;
        for (let i = 0; i < Scene.scenesToLoad.length; i++) {
            scene = Scene.scenesToLoad[i];
            if (Scene.loadedScenes.indexOf(scene) !== -1) {
                console.warn("Scene \"" + scene.getName() + "\" not loaded because it is already loaded.");
                continue;
            }
            Scene.loadedScenes.push(scene);
            scene.onLoad();
        }
        Scene.scenesToLoad.splice(0);
        GameObject._startAllUnstartedComponents();
    }
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
    static _unloadMarkedScenes() {
        let scene;
        for (let i = 0; i < Scene.scenesToUnload.length; i++) {
            scene = Scene.scenesToUnload[i];
            let loadedScenesIndex = Scene.loadedScenes.indexOf(scene);
            if (loadedScenesIndex === -1) {
                console.error("Trying to unload scene that hasn't been loaded.");
                continue;
            }
            scene.onUnload();
            Scene.loadedScenes.splice(loadedScenesIndex, 1);
        }
        Scene.scenesToUnload.splice(0);
    }
    static sceneExists(name) {
        if (name == null || name == "")
            return false;
        return Scene.dictionary.hasOwnProperty(name);
    }
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
Scene._numScenes = 0;
Scene.loadedScenes = [];
Scene.scenesToUnload = [];
Scene.scenesToLoad = [];
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
    function _add(drawer) {
        allDrawers.push(drawer);
    }
    Drawers._add = _add;
    function _remove(drawer) {
        let index = allDrawers.indexOf(drawer);
        if (index === -1)
            return;
        allDrawers.splice(index, 1);
    }
    Drawers._remove = _remove;
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
                if (dispObj.transform == null) {
                    context.setTransform(1, 0, 0, 1, 0, 0);
                }
                else {
                    dispObj.transform.multiplyByGlobalMatrix(m);
                    context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
                }
            }
            else {
                if (dispObj.transform == null) {
                    Camera.setContextTransformFromMatrix(m);
                }
                else {
                    Camera.setContextTransform(dispObj.transform);
                }
            }
            dispObj.draw(context);
            context.restore();
        }
    }
    Drawers._drawAll = _drawAll;
    let tempMatrix = new Matrix2x3();
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
var TiledMap;
(function (TiledMap) {
    TiledMap.tilesetImageDirectory = "";
    function addTileset(name, tilesetJSON) {
        if (tilesetJSONDictionary.hasOwnProperty(name) && tilesetJSONDictionary[name] !== "") {
            console.error("Cannot add tileset with name \"" + name + "\" because a tileset with that name has already been added.");
            return;
        }
        tilesetJSONDictionary[name] = tilesetJSON;
    }
    TiledMap.addTileset = addTileset;
    function addMap(name, mapJSON) {
        let n = name.toLowerCase();
        if (mapJSONDictionary.hasOwnProperty(n)) {
            console.error("Cannot add map \"" + n + "\" because a map with that name already exists.");
            return;
        }
        mapJSONDictionary[n] = mapJSON;
    }
    TiledMap.addMap = addMap;
    function createTiledMapData(mapName) {
        let mn = mapName.toLowerCase();
        if (!mapJSONDictionary.hasOwnProperty(mn)) {
            console.error("TiledMap " + mn + " doesn't exist.");
            return null;
        }
        let mapJSON = mapJSONDictionary[mn];
        let map = new MapData();
        map.parse(mapJSON);
        return map;
    }
    TiledMap.createTiledMapData = createTiledMapData;
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
    function parseMapObject(mapObject) {
        if (mapObject == null)
            return null;
        if (mapObject.type === "") {
            console.warn("Map objects with type \"\" cannot be parsed.");
            return null;
        }
        if (objectParserDictionary.hasOwnProperty(mapObject.type)) {
            let go = objectParserDictionary[mapObject.type](mapObject);
            if (go == null)
                return go;
            go.name = mapObject.name;
            go.transform.x = mapObject.x;
            go.transform.y = mapObject.y;
            return go;
        }
        console.warn("No object parser found mapped to the type \"" + mapObject.type + "\".  Add a parse function in addObjectParser().");
        return null;
    }
    TiledMap.parseMapObject = parseMapObject;
    class Layer {
        constructor() {
            this.name = "";
            this.mapData = null;
            this.layerIndex = 0;
            this.width = 0;
            this.height = 0;
            this.opacity = 1;
            this.visible = true;
            this.parse = (jsonObj) => {
                this.Layer_parse(jsonObj);
            };
            this.Layer_parse = (jsonObj) => {
                this.name = jsonObj.name;
                this.opacity = jsonObj.opacity;
                this.width = jsonObj.width;
                this.height = jsonObj.height;
                this.visible = jsonObj.visible;
                if (jsonObj.properties == undefined)
                    this.customProperties = undefined;
                else
                    this.customProperties = JSON.parse(JSON.stringify(jsonObj.properties));
                if (this.customProperties == undefined)
                    this.customProperties = {};
            };
            this.dispose = () => {
                this.Layer_dispose();
            };
            this.Layer_dispose = () => {
                this.mapData = null;
                this.customProperties = null;
            };
            this.type = LayerType.NONE;
        }
    }
    TiledMap.Layer = Layer;
    class TileLayer extends Layer {
        constructor() {
            super();
            this.tileData = null;
            this.getTileData = (x, y) => {
                if (!this.coordinatesAreValid(x, y)) {
                    return 0;
                }
                return this.tileData[x + y * this.width];
            };
            this.getGID = (x, y) => {
                let data = this.getTileData(x, y);
                let gid = data & ~(TiledMap.FLIPPED_HORIZONTALLY_FLAG |
                    TiledMap.FLIPPED_VERTICALLY_FLAG |
                    TiledMap.FLIPPED_DIAGONALLY_FLAG);
                return gid;
            };
            this.getTileInfo = (x, y) => {
                return this.mapData.getTileInfo(this.getGID(x, y));
            };
            this.setTileData = (x, y, data) => {
                if (!this.coordinatesAreValid(x, y)) {
                    console.warn("Cannot set GID at x: " + x + " y: " + y + ", coordinates are invalid");
                    return;
                }
                this.tileData[x + y * this.width] = data;
            };
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
            this.parse = (jsonObj) => {
                this.Layer_parse(jsonObj);
                if (this.tileData != null) {
                    this.tileData.splice(0);
                }
                this.tileData = new Array(jsonObj.data.length);
                for (let i = 0; i < jsonObj.data.length; i++) {
                    this.tileData[i] = jsonObj.data[i];
                }
            };
            this.dispose = () => {
                this.tileData.splice(0);
                this.tileData = null;
                this.Layer_dispose();
            };
            this.type = LayerType.TILE_LAYER;
        }
    }
    TiledMap.TileLayer = TileLayer;
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
    class TileInfo {
        constructor() {
            this.id = 0;
            this.tileset = null;
            this.material = "";
            this.collisionLayers = 0;
            this.recycled = false;
        }
        static get empty() { return TileInfo._empty; }
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
        static recycle(tileInfo) {
            if (tileInfo == null)
                return;
            if (tileInfo.recycled)
                return;
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
            this.packedImageFilename = "";
            this.packedImage = null;
            this.numTiles = 0;
            this.imageWidth = 0;
            this.imageHeight = 0;
            this.tileWidth = 0;
            this.tileHeight = 0;
            this.getNumColumns = () => {
                return Math.floor(this.imageWidth / this.tileWidth);
            };
            this.external = false;
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
            this.dispose = () => {
                if (this.external) {
                    console.warn("external tilesets should not be disposed");
                }
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
    class Object {
        constructor() {
            this.name = "";
            this.type = "";
            this.id = 0;
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            this.width = 0;
            this.height = 0;
            this.points = [];
            this.objectGroup = null;
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
                    console.log("Problem with setting properties to reference of jsonObj");
                    objPoints = jsonObject.polygon;
                }
                else if (jsonObject.polyline != undefined) {
                    this.objectType = ObjectType.POLYLINE;
                    console.log("Problem with setting properties to reference of jsonObj");
                    objPoints = jsonObject.polyline;
                }
                else {
                    this.objectType = ObjectType.RECTANGLE;
                }
                if (objPoints != null) {
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
            this.mapObjects = [];
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
            this.parse = (jsonObj) => {
                if (this._parsed) {
                    console.error("TileMap already parsed, cannot be parsed again.");
                    return;
                }
                this.height = jsonObj.height;
                this.width = jsonObj.width;
                this.tileWidth = jsonObj.tilewidth;
                this.tileHeight = jsonObj.tileheight;
                if (jsonObj.properties == undefined)
                    this.customProperties = undefined;
                else
                    this.customProperties = JSON.parse(JSON.stringify(jsonObj.properties));
                if (this.customProperties == undefined)
                    this.customProperties = {};
                for (let i = 0; i < jsonObj.layers.length; i++) {
                    let layer = null;
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
                this._tilesets.splice(0);
                for (let i = 0; i < jsonObj.tilesets.length; i++) {
                    let firstGID = jsonObj.tilesets[i].firstgid;
                    let tileset = null;
                    if (jsonObj.tilesets[i].source == undefined) {
                        tileset = new Tileset();
                        tileset.parse(jsonObj.tilesets[i]);
                    }
                    else {
                        let tilesetName = nameFromUrl(jsonObj.tilesets[i].source);
                        if (MapData.externalTilesetExists(tilesetName)) {
                            tileset = MapData.getExternalTileset(tilesetName);
                        }
                        else {
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
                            MapData.addExternalTileset(tilesetName, tileset);
                        }
                    }
                    this._tilesets.push(new TilesetElement(firstGID, tileset));
                }
                this._tilesets.sort(function (t1, t2) {
                    return t1.firstGID - t2.firstGID;
                });
                this._parsed = true;
            };
            this.height = 0;
            this.width = 0;
            this.tileWidth = 0;
            this.tileHeight = 0;
            this.layers = [];
            this.getLayerByName = (name) => {
                for (let i = 0; i < this.layers.length; i++) {
                    if (this.layers[i].name === name)
                        return this.layers[i];
                }
                return null;
            };
            this.getTileLayerByName = (name) => {
                for (let i = 0; i < this.layers.length; i++) {
                    if (this.layers[i].name === name &&
                        (this.layers[i] instanceof TileLayer))
                        return this.layers[i];
                }
                return null;
            };
            this.getTileInfo = (gid) => {
                if (gid < 0)
                    return null;
                if (gid === 0)
                    return TileInfo.empty;
                let tilesetElement = null;
                for (let i = 1; i < this._tilesets.length; i++) {
                    if (gid < this._tilesets[i].firstGID) {
                        tilesetElement = this._tilesets[i - 1];
                        break;
                    }
                }
                if (tilesetElement === null)
                    tilesetElement = this._tilesets[this._tilesets.length - 1];
                let id = gid - tilesetElement.firstGID;
                if (id < 0 || id >= tilesetElement.tileset.tileInfos.length)
                    return null;
                return tilesetElement.tileset.tileInfos[id];
            };
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
                    tileLayerGO.name = tileLayer.name;
                    let renderer = tileLayerGO.addComponent(TiledMapTileLayerRenderer);
                    renderer.tiledMapLayer = tileLayer;
                    renderer.order = i;
                    let platform = tileLayerGO.addComponent(TiledMapTileLayerPlatform);
                    platform.platformObject.tiledMapLayer = tileLayer;
                    tileLayerGO.transform.setParent(rootGO.transform);
                }
                this.callOnAllMapObjects(parseMapObject);
                return rootGO;
            };
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
                    if (!tilesetElement.tileset.external) {
                        tilesetElement.tileset.dispose();
                    }
                });
                this._tilesets = null;
                this.customProperties = null;
            };
            this._tilesets = [];
            this._parsed = false;
        }
        static addExternalTileset(tilesetName, tileset) {
            if (MapData.externalTilesetExists(tilesetName)) {
                console.warn("Tileset with name \"" + tilesetName + "\" already exists.");
                return;
            }
            tileset.external = true;
            MapData.externalTilesets[tilesetName] = tileset;
        }
        static getExternalTileset(tilesetSource) {
            if (!MapData.externalTilesetExists(tilesetSource)) {
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
    class TilesetElement {
        constructor(firstGID, tileset) {
            this.firstGID = firstGID;
            this.tileset = tileset;
        }
    }
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
class ComponentProperties {
    constructor() {
        this.only1 = false;
        this.requireComponent = (c) => {
            this._requireComponents.push(c);
        };
        this.excludeComponent = (c) => {
            this._excludeComponents.push(c);
        };
        this._requireComponents = [];
        this._excludeComponents = [];
    }
}
class Component {
    constructor() {
        this.name = "";
        this.gameObject = null;
        this.transform = null;
        this.isEnabled = () => {
            return this._enabled;
        };
        this.isActiveAndEnabled = () => {
            return this._enabled && this.gameObject.isActive();
        };
        this.isStarted = () => {
            return this._started;
        };
        this.getComponentProperties = () => {
            return this.componentProperties;
        };
        this.enable = () => {
            if (this._enabled)
                return;
            this._enabled = true;
            if (this.onEnable != undefined) {
                this.onEnable();
            }
        };
        this.disable = () => {
            if (!this._enabled)
                return;
            this._enabled = false;
            if (this.onDisable != undefined) {
                this.onDisable();
            }
        };
        this.getComponent = (c) => {
            return this.gameObject.getComponent(c);
        };
        this.getComponents = (c) => {
            return this.gameObject.getComponents(c);
        };
        this.toString = () => {
            return "Component " + this.name + " started: " + this.isStarted() + " enabled: " + this.isEnabled();
        };
        this.componentProperties = new ComponentProperties();
        this._enabled = true;
        this._started = false;
    }
    static _startUnstarted(component) {
        if (component._started)
            return;
        component._started = true;
        if (component.onStart != undefined) {
            component.onStart();
        }
    }
}
class DrawerComponent extends Component {
    constructor() {
        super();
        this.layer = DrawLayer.DEFAULT;
        this.order = 0;
        this.isVisible = () => {
            return this.isActiveAndEnabled() && !this.gameObject.isMarkedForDestroy();
        };
        this.anchored = false;
        this.draw = (context) => {
        };
    }
}
class PackedImageRenderer extends DrawerComponent {
    constructor() {
        super();
        this.getImage = () => {
            return this.image;
        };
        this.setImage = (image, setRectFull = true) => {
            this.setImage_PackedImageRenderer(image, setRectFull);
        };
        this.setImage_PackedImageRenderer = (image, setRectFull = true) => {
            this.image = image;
            if (setRectFull) {
                this.setImageRectFull();
            }
        };
        this.setImageByName = (filename, setRectFull = true) => {
            this.setImage(TexPackManager.getPackedImage(filename), setRectFull);
        };
        this.imageX = 0;
        this.imageY = 0;
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.setImageRect = (x, y, width, height) => {
            this.setImageRect_PackedImageRenderer(x, y, width, height);
        };
        this.setImageRect_PackedImageRenderer = (x, y, width, height) => {
            this.imageX = x;
            this.imageY = y;
            this.imageWidth = width;
            this.imageHeight = height;
        };
        this.setImageRectFull = () => {
            if (this.image === null) {
                this.setImageRect(0, 0, 0, 0);
            }
            else {
                this.setImageRect(0, 0, this.image.getOriginalWidth(), this.image.getOriginalHeight());
            }
        };
        this.pivotX = .5;
        this.pivotY = .5;
        this.imageSmoothingEnabled = true;
        this.tintColor = "#000000";
        this.tintAmount = 0;
        this.draw = (context) => {
            let packedImage = this.image;
            if (packedImage === null) {
                return;
            }
            if (!packedImage.isLoaded()) {
                console.warn("Attempting to draw with PackedImage that hasn't finished loading");
                return;
            }
            let piLeft = packedImage.frameX + Math.max(0, this.imageX - packedImage.trimLeft);
            let piRight = packedImage.frameX + Math.min(packedImage.frameWidth, this.imageX + this.imageWidth - packedImage.trimLeft);
            let piPivotX = packedImage.frameX + this.imageX + this.imageWidth * this.pivotX - packedImage.trimLeft;
            let piTop = packedImage.frameY + Math.max(0, this.imageY - packedImage.trimTop);
            let piBottom = packedImage.frameY + Math.min(packedImage.frameHeight, this.imageY + this.imageHeight - packedImage.trimTop);
            let piPivotY = packedImage.frameY + this.imageY + this.imageHeight * this.pivotY - packedImage.trimTop;
            piPivotX = Math.floor(piPivotX + .001);
            piPivotY = Math.floor(piPivotY + .001);
            if (!this.imageSmoothingEnabled) {
                context.mozImageSmoothingEnabled = false;
                context.webkitImageSmoothingEnabled = false;
                context.msImageSmoothingEnabled = false;
                context.imageSmoothingEnabled = false;
            }
            let usingEffect = false;
            usingEffect = this.tintAmount > 0;
            if (usingEffect) {
                Game.effectsContext.clearRect(0, 0, this.imageWidth, this.imageHeight);
                Game.effectsContext.save();
                Game.effectsContext.drawImage(packedImage.atlasImage, piLeft, piTop, piRight - piLeft, piBottom - piTop, 0, 0, piRight - piLeft, piBottom - piTop);
                if (this.tintAmount > 0) {
                    Game.effectsContext.globalCompositeOperation = "source-atop";
                    this.colorParser.parseCSSColor(this.tintColor);
                    this.colorParser.alpha = this.tintAmount;
                    Game.effectsContext.fillStyle = this.colorParser.toString();
                    Game.effectsContext.fillRect(0, 0, this.imageWidth, this.imageHeight);
                }
                Game.effectsContext.restore();
                context.drawImage(Game.effectsCanvas, 0, 0, piRight - piLeft, piBottom - piTop, piLeft - piPivotX, piTop - piPivotY, piRight - piLeft, piBottom - piTop);
            }
            else {
                context.drawImage(packedImage.atlasImage, piLeft, piTop, piRight - piLeft, piBottom - piTop, piLeft - piPivotX, piTop - piPivotY, piRight - piLeft, piBottom - piTop);
            }
        };
        this.image = null;
        this.colorParser = new ColorParser();
        this.name = "PackedImageRenderer";
        this.imageSmoothingEnabled = PackedImageRenderer.IMAGE_SMOOTHING_ENABLED_DEFAULT;
    }
}
PackedImageRenderer.IMAGE_SMOOTHING_ENABLED_DEFAULT = true;
class SpriteRenderer extends PackedImageRenderer {
    constructor() {
        super();
        this.getSpriteFrame = () => {
            return this.spriteFrame;
        };
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
        this.setSpriteFrameByName = (imageFilename, frameIndex) => {
            this.setSpriteFrame(Spritesheet.getSpriteFrame(imageFilename, frameIndex));
        };
        this.setImage = (image, setRectFull = true) => {
            this.setImage_PackedImageRenderer(image, setRectFull);
            this.spriteFrame = null;
        };
        this.setImageRect = (x, y, width, height) => {
            this.setImageRect_PackedImageRenderer(x, y, width, height);
            this.spriteFrame = null;
        };
        this.playAnimation = (animation, nextAnimation = null) => {
            if ((animation != null && (typeof animation === "string")) ||
                (nextAnimation != null && (typeof nextAnimation === "string"))) {
                if (nextAnimation == null) {
                    this.playAnimationByName(animation);
                }
                else if (typeof nextAnimation === "string") {
                    this.playAnimationByName(animation, nextAnimation);
                }
                else {
                    this.playAnimationByName(animation, nextAnimation.name);
                }
                return;
            }
            let anim = null;
            if (animation != null)
                anim = animation;
            let nextAnim = null;
            if (nextAnimation != null)
                nextAnim = nextAnimation;
            if (anim !== null && (anim.frames == null || anim.frames.length === 0)) {
                console.error("Cannot play animation " + anim.name + " because it has no frames");
                animation = null;
            }
            this.animation = anim;
            this.nextAnimation = nextAnim;
            if (this.animSpeed < 0 && this.animation !== null) {
                this.animTime = this.animation.getDuration() - .0001;
            }
            else {
                this.animTime = 0;
            }
            this.animPlaying = (animation !== null);
            this.updateSpriteFrameFromAnimation();
        };
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
        this.stopAnimation = () => {
            this.animPlaying = false;
        };
        this.getAnimation = () => {
            return this.animation;
        };
        this.isAnimationPlaying = () => {
            return this.animPlaying;
        };
        this.isAtEndOfAnimation = () => {
            if (this.animation === null)
                return false;
            if (this.animPlaying)
                return false;
            if (this.animSpeed >= 0) {
                if (this.animTime >= this.animation.getDuration() - .0002) {
                    return true;
                }
            }
            else {
                if (this.animTime <= .0001) {
                    return true;
                }
            }
            return false;
        };
        this.getAnimationTime = () => {
            return this.animTime;
        };
        this.getAnimationFrameIndex = () => {
            if (this.animation === null)
                return 0;
            return Math.floor(this.animTime * this.animation.fps);
        };
        this.setAnimationTime = (time) => {
            if (this.animation === null) {
                this.animTime = 0;
                return;
            }
            let duration = this.animation.getDuration();
            this.animTime = M.fmod(time, duration);
        };
        this.getAnimationSpeed = () => {
            return this.animSpeed;
        };
        this.setAnimationSpeed = (speed) => {
            this.animSpeed = speed;
        };
        this.onUpdate = () => {
            this.onUpdateAnimation();
        };
        this.onUpdateAnimation = () => {
            if (this.animPlaying && this.animation !== null) {
                this.animTime += this.animSpeed * Game.deltaTime;
                let animDuration = this.animation.getDuration();
                if (this.animSpeed >= 0) {
                    if (this.animTime >= animDuration) {
                        if (this.nextAnimation === null) {
                            if (this.animation.loops) {
                                this.animTime = M.fmod(this.animTime, animDuration);
                            }
                            else {
                                this.animTime = animDuration - .0001;
                                this.animPlaying = false;
                            }
                        }
                        else {
                            this.animation = this.nextAnimation;
                            this.nextAnimation = null;
                            this.animTime = M.fmod(this.animTime - animDuration, this.animation.getDuration());
                        }
                    }
                }
                else {
                    if (this.animTime < 0) {
                        if (this.animation.loops) {
                            this.animTime = M.fmod(this.animTime, animDuration);
                        }
                        else {
                            this.animTime = 0;
                            this.animPlaying = false;
                        }
                    }
                }
                this.updateSpriteFrameFromAnimation();
            }
        };
        this.updateSpriteFrameFromAnimation = () => {
            if (this.animation === null)
                return;
            let sf = null;
            let t = M.fmod(this.animTime, this.animation.frames.length / this.animation.fps);
            sf = this.animation.frames[Math.floor(t * this.animation.fps)];
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
class VisualEffect extends Component {
    constructor() {
        super();
        this.onStart = () => {
            this.spriteRenderer = this.getComponent(SpriteRenderer);
        };
        this.onUpdate = () => {
            if (this.spriteRenderer.isAtEndOfAnimation()) {
                this.gameObject.markForDestroy();
            }
        };
        this.onDestroy = () => {
            this.spriteRenderer = null;
        };
        this.spriteRenderer = null;
        this.name = "VisualEffect";
        this.componentProperties.requireComponent(SpriteRenderer);
    }
}
class ReceivesDamage extends Component {
    constructor() {
        super();
        this.maxHealth = 10;
        this.health = 0;
        this.team = Team.PLAYERS;
        this.isInTeam = (team) => {
            return (team & this.team) != 0;
        };
        this.receiveDamage = (ai) => {
            if (!this.isActiveAndEnabled())
                return;
            this.gameObject.sendMessage("preReceiveDamage", ai);
            this.health = Math.max(0, this.health - ai.damage);
            this.gameObject.sendMessage("onReceiveDamage", ai);
        };
        this.onStart = () => {
            this.health = this.maxHealth;
        };
        this.name = "ReceivesDamage";
    }
}
var Team;
(function (Team) {
    Team[Team["NONE"] = 0] = "NONE";
    Team[Team["PLAYERS"] = 15] = "PLAYERS";
    Team[Team["ENEMIES"] = 3840] = "ENEMIES";
    Team[Team["ALL"] = 2147483647] = "ALL";
})(Team || (Team = {}));
class AttackInfo {
    constructor() {
        this.damage = 0;
        this.knockbackHeading = 0;
        this.knockbackSpeed = AttackInfo.DEFAULT_KNOCKBACK_SPEED;
        this.knockbackDuration = AttackInfo.DEFAULT_KNOCKBACK_DURATION;
        this.resetValues = () => {
            this.damage = 0;
            this.knockbackHeading = 0;
            this.knockbackSpeed = AttackInfo.DEFAULT_KNOCKBACK_SPEED;
            this.knockbackDuration = AttackInfo.DEFAULT_KNOCKBACK_DURATION;
        };
        this.recycled = false;
    }
    static createNew() {
        let ret = null;
        if (AttackInfo.privateAIs.length > 0) {
            ret = AttackInfo.privateAIs.pop();
            ret.recycled = true;
        }
        else {
            ret = new AttackInfo();
        }
        ret.resetValues();
        return ret;
    }
    static recycle(ai) {
        if (ai.recycled)
            return;
        ai.recycled = true;
        AttackInfo.privateAIs.push(ai);
    }
}
AttackInfo.DEFAULT_KNOCKBACK_SPEED = 120;
AttackInfo.DEFAULT_KNOCKBACK_DURATION = .2;
AttackInfo.privateAIs = [];
var HorizAlign;
(function (HorizAlign) {
    HorizAlign[HorizAlign["LEFT"] = 0] = "LEFT";
    HorizAlign[HorizAlign["CENTER"] = 1] = "CENTER";
    HorizAlign[HorizAlign["RIGHT"] = 2] = "RIGHT";
})(HorizAlign || (HorizAlign = {}));
var VertAlign;
(function (VertAlign) {
    VertAlign[VertAlign["TOP"] = 0] = "TOP";
    VertAlign[VertAlign["MIDDLE"] = 1] = "MIDDLE";
    VertAlign[VertAlign["BOTTOM"] = 2] = "BOTTOM";
})(VertAlign || (VertAlign = {}));
class TextArea extends DrawerComponent {
    constructor() {
        super();
        this.text = "";
        this.visibleChars = -1;
        this.fontName = "Verdana";
        this.fontSize = 12;
        this.getFont = () => {
            return "" + this.fontSize + "px " + this.fontName;
        };
        this.lineSpacing = 16;
        this.width = 100;
        this.height = 50;
        this.horizAlign = HorizAlign.LEFT;
        this.vertAlign = VertAlign.TOP;
        this.color = "#FFFFFF";
        this.useColorTags = true;
        this.borderWidth = 0;
        this.borderStyle = "#FFFFFF";
        this.draw = (context) => {
            this.TextArea_draw(context);
        };
        this.getCharacterPosition = (index, context, outPos = null) => {
            let x = 0;
            let y = 0;
            context.font = this.getFont();
            let lines = StringUtils.splitToLines(this.text, this.width, context, this.useColorTags);
            switch (this.vertAlign) {
                case VertAlign.TOP:
                    y = -this.height / 2;
                    break;
                case VertAlign.MIDDLE:
                    y = 0 - this.lineSpacing * (lines.length - 1.0) / 2;
                    y -= this.fontSize / 2;
                    break;
                case VertAlign.BOTTOM:
                    y = this.height / 2 - this.lineSpacing * (lines.length - 1);
                    y -= this.fontSize;
                    break;
            }
            let line;
            let indexInLine = 0;
            let indexCount = 0;
            for (let i = 0; i < lines.length; i++) {
                let l = this.useColorTags ? StringUtils.trimHTMLTags(lines[i]) : lines[i];
                if (index < indexCount + l.length || i === lines.length - 1) {
                    line = l;
                    indexInLine = Math.max(0, Math.min(l.length, index - indexCount));
                    y += i * this.lineSpacing;
                    break;
                }
                indexCount += l.length;
            }
            let lineWidth = context.measureText(line).width;
            switch (this.horizAlign) {
                case HorizAlign.LEFT:
                    x = -this.width / 2;
                    break;
                case HorizAlign.CENTER:
                    x = -lineWidth / 2;
                    break;
                case HorizAlign.RIGHT:
                    x = this.width / 2 - lineWidth;
                    break;
            }
            x += context.measureText(line.substring(0, indexInLine)).width;
            if (outPos == null) {
                return new Vec2(x, y);
            }
            outPos.setValues(x, y);
            return null;
        };
        this.TextArea_draw = (context) => {
            if (this.borderWidth > 0) {
                context.beginPath();
                context.strokeStyle = this.borderStyle;
                context.lineWidth = this.borderWidth;
                context.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
                context.stroke();
            }
            context.font = this.getFont();
            let lines = StringUtils.splitToLines(this.text, this.width, context, this.useColorTags);
            let y0 = 0;
            context.textAlign = "left";
            let lineXs = Array(lines.length);
            for (let i = 0; i < lines.length; i++) {
                let lineWidth = context.measureText(this.useColorTags ? StringUtils.trimRight(StringUtils.trimHTMLTags(lines[i])) : StringUtils.trimRight(lines[i])).width;
                switch (this.horizAlign) {
                    case HorizAlign.LEFT:
                        lineXs[i] = -this.width / 2;
                        break;
                    case HorizAlign.CENTER:
                        lineXs[i] = -lineWidth / 2;
                        break;
                    case HorizAlign.RIGHT:
                        lineXs[i] = this.width / 2 - lineWidth;
                        break;
                }
            }
            switch (this.vertAlign) {
                case VertAlign.TOP:
                    context.textBaseline = "top";
                    y0 = -this.height / 2;
                    break;
                case VertAlign.MIDDLE:
                    context.textBaseline = "middle";
                    y0 = 0 - this.lineSpacing * (lines.length - 1.0) / 2;
                    break;
                case VertAlign.BOTTOM:
                    context.textBaseline = "bottom";
                    y0 = this.height / 2 - this.lineSpacing * (lines.length - 1);
                    break;
            }
            context.fillStyle = this.color;
            let styleStack = [];
            styleStack.push(context.fillStyle);
            let extraFormatting = this.useColorTags || this.visibleChars >= 0;
            let charCount = 0;
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                let x = lineXs[i];
                let y = y0 + i * this.lineSpacing;
                if (extraFormatting) {
                    let start = 0;
                    let tagStart = 0;
                    let inTag = false;
                    for (let j = 0; j < line.length; j++) {
                        let c = line.charCodeAt(j);
                        if (inTag) {
                            if (c === 62) {
                                let tag = line.substring(tagStart, j).trim();
                                if (tag.indexOf("/") === 0) {
                                    if (styleStack.length <= 1) {
                                        console.error("Improperly placed tag '" + tag + "' in text '" + this.text + "'");
                                    }
                                    else {
                                        styleStack.pop();
                                    }
                                }
                                else {
                                    let style = TextArea.fontFillStyleFromTag(tag);
                                    if (style === null) {
                                        console.error("Tag '" + tag + "' not defined.");
                                    }
                                    else {
                                        styleStack.push(style);
                                    }
                                }
                                context.fillStyle = styleStack[styleStack.length - 1];
                                inTag = false;
                                start = j + 1;
                            }
                        }
                        else {
                            if (this.useColorTags && c === 60) {
                                let subStr = line.substring(start, j);
                                context.fillText(subStr, x, y);
                                x += context.measureText(subStr).width;
                                tagStart = j + 1;
                                inTag = true;
                            }
                            else {
                                charCount++;
                                if (this.visibleChars >= 0 && charCount >= this.visibleChars) {
                                    context.fillText(line.substring(start, j), x, y);
                                    break;
                                }
                            }
                        }
                    }
                    if (!inTag &&
                        !(this.visibleChars >= 0 && charCount >= this.visibleChars)) {
                        context.fillText(line.substring(start), x, y);
                    }
                }
                else {
                    context.fillText(line, x, y);
                }
                if (this.visibleChars >= 0 && charCount >= this.visibleChars) {
                    break;
                }
            }
        };
        this.name = "TextArea";
        this.anchored = true;
    }
    static fontFillStyleFromTag(tag) {
        if (tag === "imp") {
            return TextArea.IMPORTANT_COLOR;
        }
        else if (tag === "transparent") {
            return "transparent";
        }
        return null;
    }
}
TextArea.IMPORTANT_COLOR = "#FFDE3A";
class InputTextArea extends TextArea {
    constructor() {
        super();
        this.inputEnabled = false;
        this.inputIndex = 0;
        this.onUpdate = () => {
            if (this.useColorTags) {
                console.warn("Cannot use color tags on an InputTextArea");
                this.useColorTags = false;
            }
            this.inputIndex = Math.max(0, this.inputIndex);
            this.inputIndex = Math.min(this.text.length, this.inputIndex);
            if (!this.inputEnabled)
                return;
            let shiftHeld = Keys.keyHeld(Key.Shift);
            let keyCodesPressed = Keys.getKeyCodesPressed();
            for (let i = 0; i < keyCodesPressed.length; i++) {
                let key = keyCodesPressed[i];
                let tryStr = false;
                switch (key) {
                    case Key.LeftArrow:
                        this.inputIndex = Math.max(0, this.inputIndex - 1);
                        break;
                    case Key.RightArrow:
                        this.inputIndex = Math.min(this.text.length, this.inputIndex + 1);
                        break;
                    case Key.Backspace:
                        if (this.inputIndex > 0) {
                            this.text = this.text.substring(0, this.inputIndex - 1) + this.text.substring(this.inputIndex);
                            this.inputIndex--;
                        }
                        break;
                    case Key.Delete:
                        if (this.inputIndex < this.text.length) {
                            this.text = this.text.substring(0, this.inputIndex) + this.text.substring(this.inputIndex + 1);
                        }
                        break;
                    default:
                        tryStr = true;
                }
                if (!tryStr)
                    continue;
                let str = StringUtils.stringFromKeyCode(key, shiftHeld);
                if (str === "")
                    continue;
                if (this.inputIndex >= this.text.length) {
                    this.text = this.text + str;
                }
                else {
                    this.text = this.text.substring(0, this.inputIndex) + str + this.text.substring(this.inputIndex);
                }
                this.inputIndex++;
            }
        };
        this.draw = (context) => {
            this.TextArea_draw(context);
            if (!this.inputEnabled)
                return;
            let carotPos = this.getCharacterPosition(this.inputIndex, context);
            context.beginPath();
            context.strokeStyle = "red";
            context.lineWidth = 2;
            context.moveTo(carotPos.x, carotPos.y);
            context.lineTo(carotPos.x, carotPos.y + this.fontSize);
            context.stroke();
        };
        this.name = "InputTextArea";
        this.useColorTags = false;
    }
}
class TiledMapTileLayerRenderer extends DrawerComponent {
    constructor() {
        super();
        this.tiledMapLayer = null;
        this.getMapData = () => {
            return this.tiledMapLayer.mapData;
        };
        this.getTiledMapComponent = () => {
            return this.transform.getParent().gameObject.getComponent(TiledMapComponent);
        };
        this.cameraCulling = true;
        this.onAwake = () => {
            this._transform = this.transform;
        };
        this.draw = (context) => {
            if (this.tiledMapLayer == null) {
                console.error("Must set TiledMapTileLayerRenderer.tiledMapLayer");
                return;
            }
            context.imageSmoothingEnabled = false;
            let tileXMin = 0;
            let tileXMax = this.tiledMapLayer.width;
            let tileYMin = 0;
            let tileYMax = this.tiledMapLayer.height;
            let tileWidth = this.tiledMapLayer.mapData.tileWidth;
            let tileHeight = this.tiledMapLayer.mapData.tileHeight;
            if (this.cameraCulling) {
                let boundXMin = Camera.getLeftBound();
                let boundYMin = Camera.getTopBound();
                let boundXMax = Camera.getRightBound();
                let boundYMax = Camera.getBottomBound();
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
                    packedImage = tileset.packedImage;
                    piLeft = packedImage.frameX + Math.max(0, rectX - packedImage.trimLeft);
                    piRight = packedImage.frameX + Math.min(packedImage.frameWidth, rectX + rectWidth - packedImage.trimLeft);
                    piPivotX = packedImage.frameX + rectX + -packedImage.trimLeft;
                    piTop = packedImage.frameY + Math.max(0, rectY - packedImage.trimTop);
                    piBottom = packedImage.frameY + Math.min(packedImage.frameHeight, rectY + rectHeight - packedImage.trimTop);
                    piPivotY = packedImage.frameY + rectY + -packedImage.trimTop;
                    piPivotX = Math.floor(piPivotX + .001);
                    piPivotY = Math.floor(piPivotY + .001);
                    context.drawImage(packedImage.atlasImage, piLeft, piTop, piRight - piLeft, piBottom - piTop, canvasOffsetX + piLeft - piPivotX, canvasOffsetY + piTop - piPivotY, piRight - piLeft, piBottom - piTop);
                }
            }
        };
        this.onDestroy = () => {
            this.tiledMapLayer = null;
        };
        this.name = "TiledMapTileLayerRenderer";
        this.layer = DrawLayer.PLATFORMS;
    }
}
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
class ScreenFilter extends DrawerComponent {
    constructor() {
        super();
        this.grayscale = false;
        this.invert = false;
        this.draw = (context) => {
            if (this.grayscale) {
                context.globalCompositeOperation = "saturation";
                context.fillStyle = "hsl(0,0%,50%)";
                context.fillRect(0, 0, Camera.getCanvasWidth(), Camera.getCanvasHeight());
            }
            if (this.invert) {
                context.globalCompositeOperation = "difference";
                context.fillStyle = "#FFFFFF";
                context.fillRect(0, 0, Camera.getCanvasWidth(), Camera.getCanvasHeight());
            }
        };
        this.anchored = true;
        this.order = 999;
    }
}
class BasePreloader extends DrawerComponent {
    constructor() {
        super();
        this.textFont = "24px Verdana";
        this.textColor = "#FFFFFF";
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
            context.fillText(text, Camera.getCanvasWidth() / 2, Camera.getCanvasHeight() / 2);
        };
        this.onUpdate = () => {
            this.onUpdate_BasePreloader();
        };
        this.onUpdate_BasePreloader = () => {
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
class BasePreloadScene extends Scene {
    constructor(...args) {
        super(...args);
        this.onLoad = () => {
            let go = new GameObject();
            go.addComponent(BasePreloader);
        };
        this.onUnload = () => { };
    }
}
class GameObject {
    constructor() {
        this.name = "";
        this.getInstanceID = () => {
            return this._instanceID;
        };
        this.getSceneID = () => {
            return this._sceneID;
        };
        this.transform = new Transform();
        this.isMarkedForDestroy = () => {
            return this._markedForDestroy;
        };
        this.isDontDestroyOnUnload = () => {
            return this._dontDestroyOnUnload;
        };
        this.setActive = (active) => {
            this._activeSelf = active;
        };
        this.isActive = () => {
            let trans = this.transform;
            while (trans !== null) {
                if (!trans.gameObject.isActiveSelf())
                    return false;
                trans = trans.getParent();
            }
            return true;
        };
        this.isActiveSelf = () => {
            return this._activeSelf;
        };
        this.addComponent = (c) => {
            let component = new c();
            if (component == null)
                return null;
            let compProps = component.getComponentProperties();
            if (component.name == null || component.name === "") {
                console.warn("Component added without a name");
            }
            if (compProps.only1) {
                if (this.getComponent(c) !== null) {
                    console.error("Only 1 instance of component " + component.name + " can be added to a GameObject");
                    return;
                }
            }
            for (let i = 0; i < compProps._requireComponents.length; i++) {
                if (this.getComponent(compProps._requireComponents[i]) === null) {
                    console.error("Component " + component.name + " requires component " +
                        (new compProps._requireComponents[i]()).name +
                        " to be added already.");
                    return;
                }
            }
            for (let i = 0; i < compProps._excludeComponents.length; i++) {
                if (this.getComponent(compProps._excludeComponents[i]) !== null) {
                    console.error("Component " + component.name + " requires component " +
                        (new compProps._excludeComponents[i]()).name +
                        " to not already be added.");
                    return;
                }
            }
            component.gameObject = this;
            component.transform = this.transform;
            this.components.push(component);
            if (component instanceof DrawerComponent) {
                Drawers._add(component);
            }
            if (component.onAwake != undefined) {
                component.onAwake();
            }
            return component;
        };
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
        this.getComponentsInChildren = (c) => {
            let ret = [];
            let children = this.transform.getChildren();
            children.forEach(function (child) {
                let childComps = child.gameObject.getComponentsAndInChildren(c);
                for (let i = 0; i < childComps.length; i++) {
                    ret.push(childComps[i]);
                }
            });
            return ret;
        };
        this.markForDestroy = () => {
            if (this._markedForDestroy)
                return;
            this._markedForDestroy = true;
            GameObject.gameObjectsMarkedForDestroy.push(this);
            this.transform.getChildren().forEach(function (transform) {
                if (transform.gameObject != null) {
                    transform.gameObject.markForDestroy();
                }
            });
        };
        this.dontDestroyOnUnload = () => {
            if (this._dontDestroyOnUnload)
                return;
            this._dontDestroyOnUnload = true;
            this.transform.getChildren().forEach(function (transform) {
                if (transform.gameObject != null) {
                    transform.gameObject.dontDestroyOnUnload();
                }
            });
        };
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
            for (let i = 0; i < this.components.length; i++) {
                if (!this.components[i].isStarted()) {
                    Component._startUnstarted(this.components[i]);
                }
            }
            if (this.isActive()) {
                for (let i = 0; i < this.components.length; i++) {
                    let component = this.components[i];
                    if (!component.isEnabled())
                        continue;
                    if (component.onUpdate != undefined) {
                        component.onUpdate();
                    }
                }
            }
        };
        this._lateUpdate = () => {
            for (let i = 0; i < this.components.length; i++) {
                if (!this.components[i].isStarted()) {
                    Component._startUnstarted(this.components[i]);
                }
            }
            if (this.isActive()) {
                for (let i = 0; i < this.components.length; i++) {
                    let component = this.components[i];
                    if (!component.isEnabled())
                        continue;
                    if (component.onLateUpdate != undefined) {
                        component.onLateUpdate();
                    }
                }
            }
        };
        this.destroyImmediately = () => {
            if (this.transform != null) {
                let children = this.transform.getChildren();
                children.forEach(function (transform) {
                    if (transform.gameObject != null) {
                        transform.gameObject.markForDestroy();
                    }
                    transform.setParent(null);
                });
                this.transform.setParent(null);
            }
            for (let i = 0; i < this.components.length; i++) {
                let component = this.components[i];
                if (component instanceof DrawerComponent) {
                    Drawers._remove(component);
                }
                if (component.onDestroy != undefined) {
                    component.onDestroy();
                }
                component.gameObject = null;
                component.transform = null;
            }
            this.components.splice(0);
            let index = GameObject.allGameObjects.indexOf(this);
            GameObject.allGameObjects.splice(index, 1);
            this.transform = null;
            this.components = null;
        };
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
        this._instanceID = 0;
        this._sceneID = 0;
        this.components = [];
        this._markedForDestroy = false;
        this._dontDestroyOnUnload = false;
        this._activeSelf = true;
        this.transform.gameObject = this;
        this._instanceID = GameObject.instanceIDCounter;
        GameObject.instanceIDCounter++;
        if (Scene.currentScene === null) {
            this._sceneID = -1;
        }
        else {
            this._sceneID = Scene.idFromSceneName(Scene.currentScene);
        }
        GameObject.allGameObjects.push(this);
    }
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
    static _forEach(callbackFunction) {
        GameObject.allGameObjects.forEach(callbackFunction);
    }
    static _updateAll() {
        GameObject._forEach(function (gameObject, index, array) {
            gameObject._update();
        });
    }
    static _lateUpdateAll() {
        GameObject._forEach(function (gameObject, index, array) {
            gameObject._lateUpdate();
        });
    }
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
class Actor extends ReceivesDamage {
    constructor() {
        super();
        this.getGlobalPosition = (outPos = null) => {
            return this.transform.getGlobalPosition(outPos);
        };
        this.setGlobalPosition = (x, y) => {
            this.transform.setGlobalPosition(x, y);
        };
        this.vx = 0;
        this.vy = 0;
        this.gravityScale = 1;
        this.windX = 0;
        this.windY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.halfWidth = 0;
        this.halfHeight = 0;
        this.setBounds = (offsetX, offsetY, halfWidth, halfHeight) => {
            this.Actor_setBounds(offsetX, offsetY, halfWidth, halfHeight);
        };
        this.Actor_setBounds = (offsetX, offsetY, halfWidth, halfHeight) => {
            this.offsetX = offsetX;
            this.offsetY = offsetY;
            this.halfWidth = halfWidth;
            this.halfHeight = halfHeight;
        };
        this.getRect = (outRect = null) => {
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
        };
        this.projectCollision = true;
        this.zeroVelocityOnCollision = true;
        this.crushAngleThreshold = 91;
        this.getDimensionRatioAngle = () => {
            return Math.atan2(this.halfHeight, this.halfWidth) * M.radToDeg;
        };
        this.getAttachedMovingPlatformObject = () => {
            return this.attachedMovingPlatformObject;
        };
        this.collisionMask = 0x7FFFFFFF;
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
            if (left < origin.x && origin.x < right &&
                top < origin.y && origin.y < bottom) {
                raycastHit.hit = false;
                return;
            }
            let vertTime = -1;
            let horizTime = -1;
            if (direction.y < 0) {
                vertTime = M.rayHorizontalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, bottom, left, right, distance);
            }
            else if (direction.y > 0) {
                vertTime = M.rayHorizontalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, top, left, right, distance);
            }
            if (direction.x < 0) {
                horizTime = M.rayVerticalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, right, top, bottom, distance);
            }
            else if (direction.x > 0) {
                horizTime = M.rayVerticalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, left, top, bottom, distance);
            }
            let time = -1;
            if (horizTime != -1 && (vertTime == -1 || horizTime <= vertTime)) {
                time = horizTime;
                if (direction.x > 0) {
                    raycastHit.normal.setValues(-1, 0);
                }
                else {
                    raycastHit.normal.setValues(1, 0);
                }
            }
            else if (vertTime != -1 && (horizTime == -1 || vertTime <= horizTime)) {
                time = vertTime;
                if (direction.y > 0) {
                    raycastHit.normal.setValues(0, -1);
                }
                else {
                    raycastHit.normal.setValues(0, 1);
                }
            }
            else {
                raycastHit.hit = false;
                return;
            }
            raycastHit.hit = true;
            raycastHit.actor = this;
            raycastHit.t = time;
            raycastHit.point.setValues(origin.x + direction.x * time, origin.y + direction.y * time);
        };
        this.rectOverlaps = (rect, teamMask = Team.ALL) => {
            if (!this.isInTeam(teamMask)) {
                return false;
            }
            this.getRect(this.tempRect);
            return rect.overlaps(this.tempRect);
        };
        this.onAwake = () => {
            this.Actor_onAwake();
        };
        this.Actor_onAwake = () => {
            Actor.allActors.push(this);
        };
        this.onStart = () => {
            this.health = this.maxHealth;
        };
        this.onUpdate = () => { };
        this.onEnable = () => { };
        this.onDisable = () => {
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
        this.onDestroy = () => {
            this.Actor_onDestroy();
        };
        this.Actor_onDestroy = () => {
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
        this.tempRect = new Rect();
        this.name = "Actor";
        this.componentProperties.only1 = true;
        this.componentProperties.excludeComponent(Platform);
    }
    static forEach(callbackFn) {
        Actor.allActors.forEach(callbackFn);
    }
}
Actor.allActors = [];
var Collision;
(function (Collision) {
    class PlatformObject {
        constructor(platform) {
            this.getPlatform = () => {
                return this._platform;
            };
            this.getPosition = (outPos = null) => {
                return this._platform.transform.getGlobalPosition(outPos);
            };
            this.isEnabled = () => {
                return this._enabled;
            };
            this.enable = () => {
                this._enabled = true;
            };
            this.disable = () => {
                this._enabled = false;
            };
            this.collisionLayers = 0x1;
            this.movingActorCollision = (response, movingActor, projectCollision) => {
                response.hit = false;
            };
            this.raycast = (raycastHit, origin, direction, distance = Number.POSITIVE_INFINITY, collisionMask = 0x7FFFFFFF) => {
                raycastHit.hit = false;
            };
            this.rectOverlaps = (rect, collisionMask = 0x7FFFFFFF) => {
                return false;
            };
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
        static forEach(callbackFn) {
            PlatformObject._allPlatformObjects.forEach(callbackFn);
        }
    }
    PlatformObject._allPlatformObjects = [];
    Collision.PlatformObject = PlatformObject;
})(Collision || (Collision = {}));
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
            this.attachActor = (actor) => {
                if (this.attachedActors.indexOf(actor) !== -1)
                    return;
                if (actor.getAttachedMovingPlatformObject() !== null) {
                    actor.getAttachedMovingPlatformObject().detachActor(actor);
                }
                this.attachedActors.push(actor);
                actor.gameObject.sendMessage("onPlatformAttach", this);
                this._platform.gameObject.sendMessage("onPlatformAttach", actor);
            };
            this.detachActor = (actor) => {
                let index = this.attachedActors.indexOf(actor);
                if (index !== -1) {
                    this.attachedActors.splice(index, 1);
                    actor.gameObject.sendMessage("onPlatformDetach", this);
                    this._platform.gameObject.sendMessage("onPlatformDetach", actor);
                    return;
                }
            };
            this.detachAllActors = () => {
                while (this.attachedActors.length > 0) {
                    this.detachActor(this.attachedActors[this.attachedActors.length - 1]);
                }
            };
            this.movingPlatformCollision = (response, stationaryActor) => {
                response.hit = false;
            };
            this.moveAttachedActor = (newPosition, stationaryActor) => {
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
var Collision;
(function (Collision) {
    class AABBPlatformObject extends Collision.MovingPlatformObject {
        constructor(platform) {
            super(platform);
            this.offsetX = 0;
            this.offsetY = 0;
            this.halfWidth = 0;
            this.halfHeight = 0;
            this.getLeft = () => {
                this.getPosition(this.tempVec2);
                return this.tempVec2.x + this.offsetX - this.halfWidth;
            };
            this.getRight = () => {
                this.getPosition(this.tempVec2);
                return this.tempVec2.x + this.offsetX + this.halfWidth;
            };
            this.getTop = () => {
                this.getPosition(this.tempVec2);
                return this.tempVec2.y + this.offsetY - this.halfHeight;
            };
            this.getBottom = () => {
                this.getPosition(this.tempVec2);
                return this.tempVec2.y + this.offsetY + this.halfHeight;
            };
            this.getRect = (outRect) => {
                this.getPosition(this.tempVec2);
                if (outRect == null) {
                    return new Rect(this.tempVec2.x + this.offsetX - this.halfWidth, this.tempVec2.y + this.offsetY - this.halfHeight, this.halfWidth * 2, this.halfHeight * 2);
                }
                else {
                    outRect.setValues(this.tempVec2.x + this.offsetX - this.halfWidth, this.tempVec2.y + this.offsetY - this.halfHeight, this.halfWidth * 2, this.halfHeight * 2);
                }
            };
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
                    let t = (left - aRight) / aDiffX - EPSILON;
                    if (-EPSILON < t && t <= 1) {
                        if (aTop + aDiffY * t <= bottom + EPSILON &&
                            aBottom + aDiffY * t >= top - EPSILON) {
                            response.hit = true;
                            response.time = t;
                            response.normal.setValues(-1, 0);
                            response.point.setValues(left, (Math.max(aTop + aDiffY * t, top) + Math.min(aBottom + aDiffY * t, bottom)) / 2);
                            response.reposition.setValues(movingActor.pos0.x + aDiffX * t - EPSILON * 2, movingActor.pos0.y + aDiffY * t);
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
                    let t = (right - aLeft) / aDiffX - EPSILON;
                    if (-EPSILON < t && t <= 1) {
                        if (aTop + aDiffY * t <= bottom + EPSILON &&
                            aBottom + aDiffY * t >= top - EPSILON) {
                            response.hit = true;
                            response.time = t;
                            response.normal.setValues(1, 0);
                            response.point.setValues(right, (Math.max(aTop + aDiffY * t, top) + Math.min(aBottom + aDiffY * t, bottom)) / 2);
                            response.reposition.setValues(movingActor.pos0.x + aDiffX * t + EPSILON * 2, movingActor.pos0.y + aDiffY * t);
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
                    let t = (top - aBottom) / aDiffY - EPSILON;
                    if (-EPSILON < t && t <= 1) {
                        if (aLeft + aDiffX * t <= right + EPSILON &&
                            aRight + aDiffX * t >= left - EPSILON) {
                            response.hit = true;
                            response.time = t;
                            response.normal.setValues(0, -1);
                            response.point.setValues((Math.max(aLeft + aDiffX * t, left) + Math.min(aRight + aDiffX * t, right)) / 2, top);
                            response.reposition.setValues(movingActor.pos0.x + aDiffX * t, movingActor.pos0.y + aDiffY * t - EPSILON * 2);
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
                    let t = (bottom - aTop) / aDiffY - EPSILON;
                    if (-EPSILON < t && t <= 1) {
                        if (aLeft + aDiffX * t <= right + EPSILON &&
                            aRight + aDiffX * t >= left - EPSILON) {
                            response.hit = true;
                            response.time = t;
                            response.normal.setValues(0, 1);
                            response.point.setValues((Math.max(aLeft + aDiffX * t, left) + Math.min(aRight + aDiffX * t, right)) / 2, bottom);
                            response.reposition.setValues(movingActor.pos0.x + aDiffX * t, movingActor.pos0.y + aDiffY * t + EPSILON * 2);
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
            };
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
                    t = (aLeft - right) / diffX;
                    if (-EPSILON < t && t <= 1) {
                        if (top + diffY * t <= aBottom + EPSILON &&
                            bottom + diffY * t >= aTop - EPSILON) {
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
                    t = (aRight - left) / diffX;
                    if (-EPSILON < t && t <= 1) {
                        if (top + diffY * t <= aBottom + EPSILON &&
                            bottom + diffY * t >= aTop - EPSILON) {
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
                    t = (aTop - bottom) / diffY;
                    if (-EPSILON < t && t <= 1) {
                        if (left + diffX * t <= aRight + EPSILON &&
                            right + diffX * t >= aLeft - EPSILON) {
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
                    t = (aBottom - top) / diffY;
                    if (-EPSILON < t && t <= 1) {
                        if (left + diffX * t <= aRight + EPSILON &&
                            right + diffX * t >= aLeft - EPSILON) {
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
            this.raycast = (raycastHit, origin, direction, distance = Number.POSITIVE_INFINITY, collisionMask = 0x7FFFFFFF) => {
                if (!Collision.maskCollidesWithLayers(collisionMask, this.collisionLayers)) {
                    raycastHit.hit = false;
                    return;
                }
                let pos = this.tempVec2;
                let left = this.getLeft();
                let top = this.getTop();
                let right = this.getRight();
                let bottom = this.getBottom();
                if (left < origin.x && origin.x < right &&
                    top < origin.y && origin.y < bottom) {
                    raycastHit.hit = false;
                    return;
                }
                let vertTime = -1;
                let horizTime = -1;
                if (direction.y < 0) {
                    vertTime = M.rayHorizontalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, bottom, left, right, distance);
                }
                else if (direction.y > 0) {
                    vertTime = M.rayHorizontalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, top, left, right, distance);
                }
                if (direction.x < 0) {
                    horizTime = M.rayVerticalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, right, top, bottom, distance);
                }
                else if (direction.x > 0) {
                    horizTime = M.rayVerticalSegmentIntersection(origin.x, origin.y, direction.x, direction.y, left, top, bottom, distance);
                }
                let time = -1;
                if (horizTime != -1 && (vertTime == -1 || horizTime <= vertTime)) {
                    time = horizTime;
                    if (direction.x > 0) {
                        raycastHit.normal.setValues(-1, 0);
                    }
                    else {
                        raycastHit.normal.setValues(1, 0);
                    }
                }
                else if (vertTime != -1 && (horizTime == -1 || vertTime <= horizTime)) {
                    time = vertTime;
                    if (direction.y > 0) {
                        raycastHit.normal.setValues(0, -1);
                    }
                    else {
                        raycastHit.normal.setValues(0, 1);
                    }
                }
                else {
                    raycastHit.hit = false;
                    return;
                }
                raycastHit.hit = true;
                raycastHit.platformObject = this;
                raycastHit.t = time;
                raycastHit.point.setValues(origin.x + direction.x * time, origin.y + direction.y * time);
            };
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
var Collision;
(function (Collision) {
    class TiledMapTileLayerPlatformObject extends Collision.MovingPlatformObject {
        constructor(platform) {
            super(platform);
            this.tiledMapLayer = null;
            this.raycast = (raycastHit, origin, direction, distance = Number.POSITIVE_INFINITY, collisionMask = 0x7FFFFFFF) => {
                let originX = origin.x;
                let originY = origin.y;
                this.getPosition(this.tempGlobalPos);
                originX -= this.tempGlobalPos.x;
                originY -= this.tempGlobalPos.y;
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
                    col = Math.ceil(originX / tileWidth);
                    for (; col < numCols; col++) {
                        x = col * tileWidth;
                        t = (x - originX) / direction.x;
                        y = originY + t * direction.y;
                        row = Math.floor(y / tileHeight);
                        if (direction.y <= 0 && row < 0)
                            break;
                        if (direction.y >= 0 && row >= numRows)
                            break;
                        if (t > distance)
                            break;
                        tileInfo = this.tiledMapLayer.getTileInfo(col, row);
                        if (!Collision.maskCollidesWithLayers(collisionMask, tileInfo.collisionLayers))
                            continue;
                        horizT = t;
                        horizX = x;
                        horizY = y;
                        break;
                    }
                }
                else if (direction.x < 0) {
                    col = Math.floor(originX / tileWidth) - 1;
                    for (; col >= 0; col--) {
                        x = (col + 1) * tileWidth;
                        t = (x - originX) / direction.x;
                        y = originY + t * direction.y;
                        row = Math.floor(y / tileHeight);
                        if (direction.y <= 0 && row < 0)
                            break;
                        if (direction.y >= 0 && row >= numRows)
                            break;
                        if (t > distance)
                            break;
                        tileInfo = this.tiledMapLayer.getTileInfo(col, row);
                        if (!Collision.maskCollidesWithLayers(collisionMask, tileInfo.collisionLayers))
                            continue;
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
                    row = Math.ceil(originY / tileHeight);
                    for (; row < numRows; row++) {
                        y = row * tileHeight;
                        t = (y - originY) / direction.y;
                        x = originX + t * direction.x;
                        col = Math.floor(x / tileWidth);
                        if (direction.x <= 0 && col < 0)
                            break;
                        if (direction.x >= 0 && col >= numCols)
                            break;
                        if (t > distance)
                            break;
                        tileInfo = this.tiledMapLayer.getTileInfo(col, row);
                        if (!Collision.maskCollidesWithLayers(collisionMask, tileInfo.collisionLayers))
                            continue;
                        vertT = t;
                        vertX = x;
                        vertY = y;
                        break;
                    }
                }
                else if (direction.y < 0) {
                    row = Math.floor(originY / tileHeight) - 1;
                    for (; row >= 0; row--) {
                        y = (row + 1) * tileHeight;
                        t = (y - originY) / direction.y;
                        x = originX + t * direction.x;
                        col = Math.floor(x / tileWidth);
                        if (direction.x <= 0 && col < 0)
                            break;
                        if (direction.x >= 0 && col >= numCols)
                            break;
                        if (t > distance)
                            break;
                        tileInfo = this.tiledMapLayer.getTileInfo(col, row);
                        if (!Collision.maskCollidesWithLayers(collisionMask, tileInfo.collisionLayers))
                            continue;
                        vertT = t;
                        vertX = x;
                        vertY = y;
                        break;
                    }
                }
                if (horizT == -1 && vertT == -1) {
                    raycastHit.hit = false;
                }
                else if (horizT !== -1 && (vertT === -1 || horizT < vertT)) {
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
                    raycastHit.point.x += this.tempGlobalPos.x;
                    raycastHit.point.y += this.tempGlobalPos.y;
                }
            };
            this.movingActorCollision = (response, movingActor, projectCollision) => {
                let aDiffX = movingActor.pos1.x - movingActor.pos0.x;
                let aDiffY = movingActor.pos1.y - movingActor.pos0.y;
                let aCollisionMask = movingActor.collisionMask;
                let aX = movingActor.pos0.x;
                let aY = movingActor.pos0.y;
                this.getPosition(this.tempGlobalPos);
                this.tempGlobalPos.x += this._platform.vx * Game.deltaTime;
                this.tempGlobalPos.y += this._platform.vy * Game.deltaTime;
                aX -= this.tempGlobalPos.x;
                aY -= this.tempGlobalPos.y;
                let aLeft = aX + movingActor.offset.x - movingActor.halfWidth;
                let aTop = aY + movingActor.offset.y - movingActor.halfHeight;
                let aRight = aLeft + movingActor.halfWidth * 2;
                let aBottom = aTop + movingActor.halfHeight * 2;
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
                    col = Math.ceil((aRight - EPSILON) / tileWidth);
                    for (; col < numCols; col++) {
                        x = col * tileWidth;
                        t = (x - aRight) / aDiffX;
                        yTop = aTop + t * aDiffY;
                        yBottom = aBottom + t * aDiffY;
                        rowTop = Math.max(0, Math.floor(yTop / tileHeight));
                        rowBottom = Math.min(numRows - 1, Math.floor(yBottom / tileHeight));
                        if (aDiffY <= 0 && rowBottom < 0)
                            break;
                        if (aDiffY >= 0 && rowTop >= numRows)
                            break;
                        if (t > 1)
                            break;
                        for (let r = rowTop; r <= rowBottom; r++) {
                            tileInfo = this.tiledMapLayer.getTileInfo(col, r);
                            if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                                continue;
                            horizT = t;
                            horizX = x;
                            horizY = (yTop + yBottom) / 2;
                            break;
                        }
                        if (horizT !== -1)
                            break;
                    }
                }
                else if (aDiffX < 0) {
                    col = Math.floor((aLeft + EPSILON) / tileWidth) - 1;
                    for (; col >= 0; col--) {
                        x = (col + 1) * tileWidth;
                        t = (x - aLeft) / aDiffX;
                        yTop = aTop + t * aDiffY;
                        yBottom = aBottom + t * aDiffY;
                        rowTop = Math.max(0, Math.floor(yTop / tileHeight));
                        rowBottom = Math.min(numRows - 1, Math.floor(yBottom / tileHeight));
                        if (aDiffY <= 0 && rowBottom < 0)
                            break;
                        if (aDiffY >= 0 && rowTop >= numRows)
                            break;
                        if (t > 1)
                            break;
                        for (let r = rowTop; r <= rowBottom; r++) {
                            tileInfo = this.tiledMapLayer.getTileInfo(col, r);
                            if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                                continue;
                            horizT = t;
                            horizX = x;
                            horizY = (yTop + yBottom) / 2;
                            break;
                        }
                        if (horizT !== -1)
                            break;
                    }
                }
                if (aDiffY > 0) {
                    row = Math.ceil((aBottom - EPSILON) / tileHeight);
                    for (; row < numRows; row++) {
                        y = row * tileHeight;
                        t = (y - aBottom) / aDiffY;
                        xLeft = aLeft + t * aDiffX;
                        xRight = aRight + t * aDiffX;
                        colLeft = Math.max(0, Math.floor(xLeft / tileWidth));
                        colRight = Math.min(numCols - 1, Math.floor(xRight / tileWidth));
                        if (aDiffX <= 0 && colLeft < 0)
                            break;
                        if (aDiffX >= 0 && colRight >= numCols)
                            break;
                        if (t > 1)
                            break;
                        for (let c = colLeft; c <= colRight; c++) {
                            tileInfo = this.tiledMapLayer.getTileInfo(c, row);
                            if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                                continue;
                            vertT = t;
                            vertY = y;
                            vertX = (xLeft + xRight) / 2;
                            break;
                        }
                        if (vertT !== -1)
                            break;
                    }
                }
                else if (aDiffY < 0) {
                    row = Math.floor((aTop + EPSILON) / tileHeight) - 1;
                    for (; row >= 0; row--) {
                        y = (row + 1) * tileHeight;
                        t = (y - aTop) / aDiffY;
                        xLeft = aLeft + t * aDiffX;
                        xRight = aRight + t * aDiffX;
                        colLeft = Math.max(0, Math.floor(xLeft / tileWidth));
                        colRight = Math.min(numCols - 1, Math.floor(xRight / tileWidth));
                        if (aDiffX <= 0 && colLeft < 0)
                            break;
                        if (aDiffX >= 0 && colRight >= numCols)
                            break;
                        if (t > 1)
                            break;
                        for (let c = colLeft; c <= colRight; c++) {
                            tileInfo = this.tiledMapLayer.getTileInfo(c, row);
                            if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                                continue;
                            vertT = t;
                            vertY = y;
                            vertX = (xLeft + xRight) / 2;
                            break;
                        }
                        if (vertT !== -1)
                            break;
                    }
                }
                if (horizT == -1 && vertT == -1) {
                    response.hit = false;
                }
                else if (horizT !== -1 && (vertT === -1 || horizT < vertT)) {
                    response.hit = true;
                    response.time = horizT;
                    if (aDiffX > 0) {
                        response.normal.setValues(-1, 0);
                        response.point.setValues(horizX, horizY);
                        response.reposition.setValues(aX + aDiffX * horizT - EPSILON * 2, aY + aDiffY * horizT);
                        if (projectCollision) {
                            response.repositionProject.setValues(horizX - movingActor.offset.x - movingActor.halfWidth - EPSILON * 2, aY + aDiffY);
                            response.type = Collision.ResponseType.PROJECT;
                        }
                        else {
                            response.type = Collision.ResponseType.BULLET;
                        }
                    }
                    else {
                        response.normal.setValues(1, 0);
                        response.point.setValues(horizX, horizY);
                        response.reposition.setValues(aX + aDiffX * horizT + EPSILON * 2, aY + aDiffY * horizT);
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
                    response.hit = true;
                    response.time = vertT;
                    if (aDiffY > 0) {
                        response.normal.setValues(0, -1);
                        response.point.setValues(vertX, vertY);
                        response.reposition.setValues(aX + aDiffX * vertT, aY + aDiffY * vertT - EPSILON * 2);
                        if (projectCollision) {
                            response.repositionProject.setValues(aX + aDiffX, vertY - movingActor.offset.y - movingActor.halfHeight - EPSILON * 2);
                            response.type = Collision.ResponseType.PROJECT;
                        }
                        else {
                            response.type = Collision.ResponseType.BULLET;
                        }
                    }
                    else {
                        response.normal.setValues(0, 1);
                        response.point.setValues(vertX, vertY);
                        response.reposition.setValues(aX + aDiffX * vertT, aY + aDiffY * vertT + EPSILON * 2);
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
                    response.point.x += this.tempGlobalPos.x;
                    response.reposition.x += this.tempGlobalPos.x;
                    response.repositionProject.x += this.tempGlobalPos.x;
                    response.point.y += this.tempGlobalPos.y;
                    response.reposition.y += this.tempGlobalPos.y;
                    response.repositionProject.y += this.tempGlobalPos.y;
                }
            };
            this.movingPlatformCollision = (response, stationaryActor) => {
                if (this._platform.vx === 0 && this._platform.vy === 0)
                    return;
                let diffX = this._platform.vx * Game.deltaTime;
                let diffY = this._platform.vy * Game.deltaTime;
                let aCollisionMask = stationaryActor.collisionMask;
                let aX = stationaryActor.pos.x;
                let aY = stationaryActor.pos.y;
                this.getPosition(this.tempGlobalPos);
                aX -= this.tempGlobalPos.x;
                aY -= this.tempGlobalPos.y;
                let aLeft = aX + stationaryActor.offset.x - stationaryActor.halfWidth;
                let aTop = aY + stationaryActor.offset.y - stationaryActor.halfHeight;
                let aRight = aLeft + stationaryActor.halfWidth * 2;
                let aBottom = aTop + stationaryActor.halfHeight * 2;
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
                    col = Math.ceil((aRight - EPSILON) / tileWidth);
                    for (; col < numCols; col++) {
                        x = col * tileWidth;
                        t = (x - aRight) / -diffX;
                        yTop = aTop + t * -diffY;
                        yBottom = aBottom + t * -diffY;
                        rowTop = Math.max(0, Math.floor(yTop / tileHeight));
                        rowBottom = Math.min(numRows - 1, Math.floor(yBottom / tileHeight));
                        if (diffY <= 0 && rowBottom < 0)
                            break;
                        if (diffY >= 0 && rowTop >= numRows)
                            break;
                        if (t > 1)
                            break;
                        for (let r = rowTop; r <= rowBottom; r++) {
                            tileInfo = this.tiledMapLayer.getTileInfo(col, r);
                            if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                                continue;
                            horizT = t;
                            horizX = x;
                            horizY = (yTop + yBottom) / 2;
                            break;
                        }
                        if (horizT !== -1)
                            break;
                    }
                }
                else if (diffX > 0) {
                    col = Math.floor((aLeft + EPSILON) / tileWidth) - 1;
                    for (; col >= 0; col--) {
                        x = (col + 1) * tileWidth;
                        t = (x - aLeft) / -diffX;
                        yTop = aTop + t * -diffY;
                        yBottom = aBottom + t * -diffY;
                        rowTop = Math.max(0, Math.floor(yTop / tileHeight));
                        rowBottom = Math.min(numRows - 1, Math.floor(yBottom / tileHeight));
                        if (diffY <= 0 && rowBottom < 0)
                            break;
                        if (diffY >= 0 && rowTop >= numRows)
                            break;
                        if (t > 1)
                            break;
                        for (let r = rowTop; r <= rowBottom; r++) {
                            tileInfo = this.tiledMapLayer.getTileInfo(col, r);
                            if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                                continue;
                            horizT = t;
                            horizX = x;
                            horizY = (yTop + yBottom) / 2;
                            break;
                        }
                        if (horizT !== -1)
                            break;
                    }
                }
                if (diffY < 0) {
                    row = Math.ceil((aBottom - EPSILON) / tileHeight);
                    for (; row < numRows; row++) {
                        y = row * tileHeight;
                        t = (y - aBottom) / -diffY;
                        xLeft = aLeft + t * -diffX;
                        xRight = aRight + t * -diffX;
                        colLeft = Math.max(0, Math.floor(xLeft / tileWidth));
                        colRight = Math.min(numCols - 1, Math.floor(xRight / tileWidth));
                        if (diffX <= 0 && colLeft < 0)
                            break;
                        if (diffX >= 0 && colRight >= numCols)
                            break;
                        if (t > 1)
                            break;
                        for (let c = colLeft; c <= colRight; c++) {
                            tileInfo = this.tiledMapLayer.getTileInfo(c, row);
                            if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                                continue;
                            vertT = t;
                            vertX = (xLeft + xRight) / 2;
                            vertY = y;
                            break;
                        }
                        if (vertT !== -1)
                            break;
                    }
                }
                else if (diffY > 0) {
                    row = Math.floor((aTop + EPSILON) / tileHeight) - 1;
                    for (; row >= 0; row--) {
                        y = (row + 1) * tileHeight;
                        t = (y - aTop) / -diffY;
                        xLeft = aLeft + t * -diffX;
                        xRight = aRight + t * -diffX;
                        colLeft = Math.max(0, Math.floor(xLeft / tileWidth));
                        colRight = Math.min(numCols - 1, Math.floor(xRight / tileWidth));
                        if (diffX <= 0 && colLeft < 0)
                            break;
                        if (diffX >= 0 && colRight >= numCols)
                            break;
                        if (t > 1)
                            break;
                        for (let c = colLeft; c <= colRight; c++) {
                            tileInfo = this.tiledMapLayer.getTileInfo(c, row);
                            if (!Collision.maskCollidesWithLayers(aCollisionMask, tileInfo.collisionLayers))
                                continue;
                            vertT = t;
                            vertX = (xLeft + xRight) / 2;
                            vertY = y;
                            break;
                        }
                        if (vertT !== -1)
                            break;
                    }
                }
                if (horizT == -1 && vertT == -1) {
                    response.hit = false;
                }
                else if (horizT !== -1 && (vertT === -1 || horizT < vertT)) {
                    response.hit = true;
                    response.time = horizT;
                    if (diffX < 0) {
                        response.normal.setValues(-1, 0);
                        response.point.setValues(horizX + diffX, horizY + diffY);
                        response.reposition.setValues(horizX + diffX - stationaryActor.offset.x - stationaryActor.halfWidth - EPSILON * 2, aY + diffY * (1 - horizT));
                    }
                    else {
                        response.normal.setValues(1, 0);
                        response.point.setValues(horizX + diffX, horizY + diffY);
                        response.reposition.setValues(horizX + diffX - stationaryActor.offset.x + stationaryActor.halfWidth + EPSILON * 2, aY + diffY * (1 - horizT));
                    }
                }
                else {
                    response.hit = true;
                    response.time = vertT;
                    if (diffY < 0) {
                        response.normal.setValues(0, -1);
                        response.point.setValues(vertX + diffX, vertY + diffY);
                        response.reposition.setValues(aX + diffX * (1 - vertT), vertY + diffY - stationaryActor.offset.y - stationaryActor.halfHeight - EPSILON * 2);
                    }
                    else {
                        response.normal.setValues(0, 1);
                        response.point.setValues(vertX + diffX, vertY + diffY);
                        response.reposition.setValues(aX + diffX * (1 - vertT), vertY + diffY - stationaryActor.offset.y + stationaryActor.halfHeight + EPSILON * 2);
                    }
                }
                if (response.hit) {
                    response.platformObject = this;
                    response.actor = stationaryActor.actor;
                    response.type = Collision.ResponseType.MOVING_PLATFORM;
                    response.point.x += this.tempGlobalPos.x;
                    response.reposition.x += this.tempGlobalPos.x;
                    response.point.y += this.tempGlobalPos.y;
                    response.reposition.y += this.tempGlobalPos.y;
                }
            };
            this.rectOverlaps = (rect, collisionMask = 0x7FFFFFFF) => {
                let left = rect.x;
                let top = rect.y;
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
            this.collisionLayers = 0x7FFFFFFF;
        }
    }
    Collision.TiledMapTileLayerPlatformObject = TiledMapTileLayerPlatformObject;
})(Collision || (Collision = {}));
class Platform extends Component {
    constructor() {
        super();
        this.onAwake = () => {
            Platform.allPlatforms.push(this);
        };
        this.getGlobalPosition = (outPos = null) => {
            return this.transform.getGlobalPosition(outPos);
        };
        this.setGlobalPosition = (x, y) => {
            this.transform.setGlobalPosition(x, y);
        };
        this.vx = 0;
        this.vy = 0;
        this.setVelocityForNextPosition = (x, y) => {
            if (Game.deltaTime < .0001) {
                this.setGlobalPosition(x, y);
                return;
            }
            this.getGlobalPosition(this.tempVec2);
            this.vx = (x - this.tempVec2.x) / Game.deltaTime;
            this.vy = (y - this.tempVec2.y) / Game.deltaTime;
        };
        this.setCollisionLayers = (collisionLayers) => {
            this.platformObjects.forEach(function (platformObject) {
                platformObject.collisionLayers = collisionLayers;
            });
        };
        this.onDestroy = () => {
            this.platformObjects.forEach(function (platformObject) {
                platformObject.destroy();
            });
            this.platformObjects.splice(0);
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
    static forEach(callbackFn) {
        Platform.allPlatforms.forEach(callbackFn);
    }
}
Platform.allPlatforms = [];
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
    Collision.gravityX = 0;
    Collision.gravityY = 600;
    class RaycastHit {
        constructor() {
            this.hit = false;
            this.actor = null;
            this.platformObject = null;
            this.point = new Vec2();
            this.t = 0;
            this.normal = new Vec2();
            this.clone = () => {
                let ret = new RaycastHit();
                ret.setRaycastHit(this);
                return ret;
            };
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
                    raycastHit.setRaycastHit(tempRaycastHit);
                }
            }
        });
    }
    Collision.raycastAllPlatformObjectsNonAlloc = raycastAllPlatformObjectsNonAlloc;
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
    function rectOverlapAllActorsNonAlloc(actors, rect, teamMask = Team.ALL) {
        actors.splice(0);
        Actor.forEach(function (actor) {
            if (actor.isInTeam(teamMask)) {
                if (actor.rectOverlaps(rect, teamMask)) {
                    actors.push(actor);
                }
            }
        });
    }
    Collision.rectOverlapAllActorsNonAlloc = rectOverlapAllActorsNonAlloc;
    function maskCollidesWithLayers(collisionMask, collisionLayers) {
        return (collisionMask & collisionLayers) !== 0;
    }
    Collision.maskCollidesWithLayers = maskCollidesWithLayers;
    function getNormalDirection(normalX, normalY, thresholdAngleDegrees = 45) {
        let thresholdAngle = thresholdAngleDegrees * M.degToRad;
        let normalAngle = Math.atan2(normalY, normalX);
        if (normalAngle < 0)
            normalAngle += Math.PI * 2;
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
    class StationaryActor {
        constructor() {
            this.pos = new Vec2();
            this.offset = new Vec2();
        }
    }
    Collision.StationaryActor = StationaryActor;
    class MovingActor {
        constructor() {
            this.pos0 = new Vec2();
            this.pos1 = new Vec2();
            this.offset = new Vec2();
        }
    }
    Collision.MovingActor = MovingActor;
    (function (ResponseType) {
        ResponseType[ResponseType["BULLET"] = 0] = "BULLET";
        ResponseType[ResponseType["PROJECT"] = 1] = "PROJECT";
        ResponseType[ResponseType["INTERSECT"] = 2] = "INTERSECT";
        ResponseType[ResponseType["MOVING_PLATFORM"] = 3] = "MOVING_PLATFORM";
    })(Collision.ResponseType || (Collision.ResponseType = {}));
    var ResponseType = Collision.ResponseType;
    class Response {
        constructor() {
            this.hit = false;
            this.reposition = new Vec2();
            this.repositionProject = new Vec2();
            this.point = new Vec2();
            this.normal = new Vec2();
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
    class Crush {
        constructor(response0, response1) {
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
            Handler.collisionsPrevFrame.splice(0);
            for (let i = 0; i < Handler.collisionsThisFrame.length; i++) {
                Handler.collisionsPrevFrame.push(Handler.collisionsThisFrame[i]);
            }
            Handler.collisionsThisFrame.splice(0);
            let actorCols = [];
            Actor.forEach(function (actor) {
                Handler.resolveActor(actorCols, actor, Collision.PlatformObject._allPlatformObjects, Collision.MovingPlatformObject._allMovingPlatformObjects);
                for (let i = 0; i < actorCols.length; i++) {
                    Handler.collisionsThisFrame.push(actorCols[i]);
                }
                actorCols.splice(0);
            });
            Platform.forEach(function (platform) {
                platform.getGlobalPosition(Handler.tempVec2);
                Handler.tempVec2.x += platform.vx * Game.deltaTime;
                Handler.tempVec2.y += platform.vy * Game.deltaTime;
                platform.setGlobalPosition(Handler.tempVec2.x, Handler.tempVec2.y);
            });
            Handler.collisionsThisFrame.forEach(function (response) {
                if (Handler.responseSearch(Handler.collisionsPrevFrame, response.actor, response.platformObject) === null) {
                    response.actor.gameObject.sendMessage("onCollisionEnter", response);
                    response.platformObject.getPlatform().gameObject.sendMessage("onCollisionEnter", response);
                }
                response.actor.gameObject.sendMessage("onCollisionStay", response);
                response.platformObject.getPlatform().gameObject.sendMessage("onCollisionStay", response);
                if (response.actor.zeroVelocityOnCollision) {
                    let normalDirection = response.getNormalDirection();
                    if (normalDirection === Direction.LEFT || normalDirection === Direction.RIGHT) {
                        response.actor.vx = 0;
                    }
                    else if (normalDirection === Direction.UP || normalDirection === Direction.DOWN) {
                        response.actor.vy = 0;
                    }
                }
            });
            Handler.collisionsPrevFrame.forEach(function (response) {
                if (Handler.responseSearch(Handler.collisionsThisFrame, response.actor, response.platformObject) === null) {
                    response.actor.gameObject.sendMessage("onCollisionExit", response);
                    response.platformObject.getPlatform().gameObject.sendMessage("onCollisionExit", response);
                }
            });
            Handler.collisionsPrevFrame.forEach(function (response) {
                Response._recycle(response);
            });
            Handler.collisionsPrevFrame.splice(0);
        }
        static responseSearch(responses, actor, platformObject) {
            for (let i = 0; i < responses.length; i++) {
                if (responses[i].actor === actor && responses[i].platformObject === platformObject)
                    return responses[i];
            }
            return null;
        }
        static resolveActor(outResponses, actor, platformObjects, movingPlatformObjects) {
            outResponses.splice(0);
            let actorIsActiveAndEnabled = actor.isActiveAndEnabled();
            let pushDistanceX = 0;
            let pushDistanceY = 0;
            actor.getGlobalPosition(Handler.tempVec2);
            let actorX0 = Handler.tempVec2.x;
            let actorY0 = Handler.tempVec2.y;
            let stationaryActor = Handler.stationaryActor;
            stationaryActor.actor = actor;
            stationaryActor.offset.setValues(actor.offsetX, actor.offsetY);
            stationaryActor.halfWidth = actor.halfWidth;
            stationaryActor.halfHeight = actor.halfHeight;
            stationaryActor.collisionMask = actor.collisionMask;
            stationaryActor.pos.setValues(actorX0, actorY0);
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
                        outResponses.push(resp);
                    }
                    else {
                        console.error("Response type for moving platform collision must be MOVING_PLATFORM");
                    }
                }
                else {
                    Response._recycle(resp);
                }
            }
            if (outResponses.length > 0) {
                stationaryActor.pos.setValuesVec2(outResponses[0].reposition);
            }
            pushDistanceX = stationaryActor.pos.x - actorX0;
            pushDistanceY = stationaryActor.pos.y - actorY0;
            if (actor.getAttachedMovingPlatformObject() !== null) {
                let sapx = stationaryActor.pos.x;
                let sapy = stationaryActor.pos.y;
                stationaryActor.pos.setValues(actorX0, actorY0);
                actor.getAttachedMovingPlatformObject().moveAttachedActor(this.tempVec2, stationaryActor);
                pushDistanceX = this.tempVec2.x - actorX0;
                pushDistanceY = this.tempVec2.y - actorY0;
                stationaryActor.pos.setValues(sapx, sapy);
            }
            let movingActor = Handler.movingActor;
            movingActor.actor = actor;
            movingActor.offset.setValues(actor.offsetX, actor.offsetY);
            movingActor.halfWidth = actor.halfWidth;
            movingActor.halfHeight = actor.halfHeight;
            movingActor.collisionMask = actor.collisionMask;
            movingActor.pos0.setValues(stationaryActor.pos.x, stationaryActor.pos.y);
            let dt = Game.deltaTime;
            actor.vx += actor.gravityScale * Collision.gravityX * dt;
            actor.vy += actor.gravityScale * Collision.gravityY * dt;
            movingActor.pos1.x = actorX0 + actor.vx * dt + actor.windX * dt + pushDistanceX;
            movingActor.pos1.y = actorY0 + actor.vy * dt + actor.windY * dt + pushDistanceY;
            let skipPlatformObject = null;
            let projectCollision = actor.projectCollision;
            for (let i = 0; i < this.MAX_RESOLVE_PASSES; i++) {
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
                    let resp = Response._create();
                    resp.hit = false;
                    resp.actor = actor;
                    resp.platformObject = platformObject;
                    platformObject.movingActorCollision(resp, movingActor, projectCollision);
                    if (resp.hit && (response === null || resp.time < response.time)) {
                        if (response !== null)
                            Response._recycle(response);
                        response = resp;
                    }
                    else {
                        Response._recycle(resp);
                    }
                }
                if (response === null)
                    break;
                switch (response.type) {
                    case ResponseType.BULLET:
                        movingActor.pos0.setValuesVec2(response.reposition);
                        movingActor.pos1.setValuesVec2(response.reposition);
                        break;
                    case ResponseType.PROJECT:
                        movingActor.pos0.setValuesVec2(response.reposition);
                        movingActor.pos1.setValuesVec2(response.repositionProject);
                        break;
                    case ResponseType.INTERSECT:
                        let diffX = movingActor.pos1.x - movingActor.pos0.x;
                        let diffY = movingActor.pos1.y - movingActor.pos0.y;
                        movingActor.pos0.setValuesVec2(response.reposition);
                        movingActor.pos1.setValues(movingActor.pos0.x + diffX, movingActor.pos0.y + diffY);
                        break;
                    default:
                        console.error("Don't use collision response type " + response.type + " for moving actor collision.");
                        break;
                }
                outResponses.push(response);
                if (movingActor.pos0.equalsVec2(movingActor.pos1)) {
                    break;
                }
                else {
                    if (i + 2 >= this.MAX_RESOLVE_PASSES) {
                        projectCollision = false;
                    }
                }
            }
            actor.setGlobalPosition(movingActor.pos1.x, movingActor.pos1.y);
            for (let i = 0; i < outResponses.length; i++) {
                let resp1 = outResponses[i];
                for (let j = i + 1; j < outResponses.length; j++) {
                    let resp2 = outResponses[j];
                    if (resp1.type != ResponseType.MOVING_PLATFORM && resp2.type != ResponseType.MOVING_PLATFORM)
                        continue;
                    if (M.angleBetweenVectors(resp1.normal.x, resp1.normal.y, resp2.normal.x, resp2.normal.y) * M.radToDeg > actor.crushAngleThreshold) {
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
class AABBPlatform extends Platform {
    constructor() {
        super();
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
class TiledMapTileLayerPlatform extends Platform {
    constructor() {
        super();
        this.platformObject = null;
        this.name = "TiledMapTileLayerPlatform";
        this.platformObject = new Collision.TiledMapTileLayerPlatformObject(this);
        this.platformObjects.push(this.platformObject);
    }
}
var Debug;
(function (Debug) {
    function listSprites(searchPrefix = "") {
        return TexPackManager.getAllPackedImages(searchPrefix);
    }
    Debug.listSprites = listSprites;
    function listSounds(searchPrefix = "") {
        return AudioManager.getAllSounds(searchPrefix);
    }
    Debug.listSounds = listSounds;
    function listAnimations(searchPrefix = "") {
        return Animation.getAllAnimations(searchPrefix);
    }
    Debug.listAnimations = listAnimations;
    function listScenes(searchPrefix = "") {
        return Scene.getAllScenes(searchPrefix);
    }
    Debug.listScenes = listScenes;
    function loadScene(sceneName) {
        Scene.loadScene(sceneName);
    }
    Debug.loadScene = loadScene;
    function listActors() {
        let names = [];
        Actor.forEach(function (actor) {
            names.push(actor.gameObject.name);
        });
        return names;
    }
    Debug.listActors = listActors;
})(Debug || (Debug = {}));
class Game {
    static initialize(canvas) {
        if (Game.initialized) {
            console.warn("Game already initialized");
            return;
        }
        Game.initialized = true;
        Game._canvas = canvas;
        Game._context = canvas.getContext("2d");
        Game._effectsCanvas = document.createElement("canvas");
        Game._effectsCanvas.width = canvas.width;
        Game._effectsCanvas.height = canvas.height;
        Game._effectsContext = Game._effectsCanvas.getContext("2d");
        Camera._initialize(Game.context);
        Keys._initialize(document);
        Mouse._initialize(canvas);
        Gamepads._initialize(window);
        Game.gameLoop();
        if (!Game.userInputSatisfied) {
            Game.userInputAddEventListeners();
        }
        if (Game.preloadScene === "BasePreloadScene") {
            Scene.addScene("BasePreloadScene", new BasePreloadScene());
        }
        else if (Game.preloadScene == "") {
            console.error("Game.preloadScene must be defined.");
        }
        Scene.loadScene(Game.preloadScene);
    }
    static get canvas() {
        return Game._canvas;
    }
    static get context() {
        return Game._context;
    }
    static get effectsCanvas() {
        return Game._effectsCanvas;
    }
    static get effectsContext() {
        return Game._effectsContext;
    }
    static get isFullscreen() {
        let doc = document;
        if (doc.fullscreenElement ||
            doc.webkitFullscreenElement ||
            doc.mozFullScreenElement ||
            doc.msFullscreenElement)
            return true;
        return false;
    }
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
    static get unscaledDeltaTime() {
        return Game._unscaledDeltaTime;
    }
    static get deltaTime() {
        return Game.unscaledDeltaTime * Game.timeScale;
    }
    static get realtimeSinceStartup() {
        return Game.timeStamp / 1000;
    }
    static get percentLoaded() {
        let thingsLoaded = TexPackManager.getNumTexPacksLoaded() + JSONManager.numJsonLoaded + AudioManager.getNumAudioSpritesReady();
        let things = TexPackManager.getNumTexPacks() + JSONManager.numJson + AudioManager.getNumAudioSprites();
        if (thingsLoaded >= things)
            return 1;
        return thingsLoaded / things;
    }
    static get userInputSatisfied() {
        return AudioManager.isAudioContextRunning();
    }
    static get ready() {
        return Game.percentLoaded >= 1 && Game.userInputSatisfied;
    }
    static gameLoop() {
        Game.inGameLoop = true;
        requestAnimationFrame(Game.gameLoop);
        Game.context.fillStyle = "black";
        Game.context.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
        let timeStamp = Game.timeStamp;
        Game._unscaledDeltaTime = Math.min((timeStamp - Game.lastTimeStamp) / 1000, Game.MAX_UNSCALED_DELTA_TIME);
        Game.lastTimeStamp = timeStamp;
        Gamepads._earlyUpdate();
        Scene._loadScenesToLoad();
        GameObject._updateAll();
        Collision.Handler._update();
        GameObject._lateUpdateAll();
        Drawers._drawAll();
        Scene._destroyGameObjectsInScenesToUnload();
        GameObject._destroyAllMarked();
        Scene._unloadMarkedScenes();
        Keys._lateUpdate();
        Mouse._lateUpdate();
        Game.inGameLoop = false;
    }
    static get timeStamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }
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
    }
    static userInputAudioContextRunningCallback() {
        Game.userInputRemoveEventListeners();
    }
}
Game.MAX_UNSCALED_DELTA_TIME = .1;
Game.timeScale = 1;
Game.preloadScene = "BasePreloadScene";
Game.startScene = "";
Game.inGameLoop = false;
Game._userInputSatisfied = false;
Game.initialized = false;
Game.lastTimeStamp = 0;
Game._unscaledDeltaTime = 0;
var Comps;
(function (Comps) {
    class TDActor extends Actor {
        constructor() {
            super();
            this.getFoot = () => {
                this.getGlobalPosition(this.tempVec2);
                return this.tempVec2.y + this.offsetY;
            };
            this.setFoot = (foot) => {
                this.getGlobalPosition(this.tempVec2);
                this.setGlobalPosition(this.tempVec2.x, foot - this.offsetY);
            };
            this.getAir = () => {
                return this.offsetY - this.baseOffsetY;
            };
            this.setAir = (air) => {
                let foot = this.getFoot();
                this.offsetY = air + this.baseOffsetY;
                this.setFoot(foot);
            };
            this.baseOffsetY = 0;
            this.setBounds = (offsetX, offsetY, halfWidth, halfHeight) => {
                this.Actor_setBounds(offsetX, offsetY, halfWidth, halfHeight);
                this.baseOffsetY = offsetY;
            };
            this.name = "TDActor";
        }
    }
    Comps.TDActor = TDActor;
})(Comps || (Comps = {}));
Material.addMaterial("SAND", {
    collisionLayers: 0x1
});
Material.addMaterial("WATER", {
    collisionLayers: 0x2
});
Material.addMaterial("CLIFF", {
    collisionLayers: 0x4
});
TexPackManager.addTexturePack("Assets/Texpacks/texpack-0.json");
Spritesheet.addSpritesheet("sealime.png", 64, 64, 8, 41);
Animation.addAnimation("sealime_idle", "sealime.png", [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
Animation.addAnimation("sealime_leap", "sealime.png", [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 10, false);
Spritesheet.addSpritesheet("hero/walk.png", 16, 32, 13, 52);
Spritesheet.addSpritesheet("hero/attack.png", 32, 32, 4, 16);
Animation.addAnimation("hero_idle_down", "hero/walk.png", [0], 10, true);
Animation.addAnimation("hero_idle_right", "hero/walk.png", [13], 10, true);
Animation.addAnimation("hero_idle_up", "hero/walk.png", [26], 10, true);
Animation.addAnimation("hero_walk_down", "hero/walk.png", [0, 1, 2, 3], 8, true);
Animation.addAnimation("hero_walk_right", "hero/walk.png", [13, 14, 15, 16], 8, true);
Animation.addAnimation("hero_walk_up", "hero/walk.png", [26, 27, 28, 29], 8, true);
Animation.addAnimation("hero_attack_down", "hero/attack.png", [0, 1, 2, 3], 4 / .2, false);
Animation.addAnimation("hero_attack_up", "hero/attack.png", [4, 5, 6, 7], 4 / .2, false);
Animation.addAnimation("hero_attack_right", "hero/attack.png", [8, 9, 10, 11], 4 / .2, false);
Spritesheet.addSpritesheet("hero/sword slash.png", 32, 48, 8, 8);
Animation.addAnimation("hero_sword_slash", "hero/sword slash.png", [0, 1, 2, 3, 4, 5, 6, 7], 8 / .25, false);
Spritesheet.addSpritesheet("log/log.png", 32, 32, 6, 23);
Animation.addAnimation("log_idle_down", "log/log.png", [0], 10, true);
Animation.addAnimation("log_idle_up", "log/log.png", [6], 10, true);
Animation.addAnimation("log_idle_right", "log/log.png", [12], 10, true);
Animation.addAnimation("log_idle_left", "log/log.png", [18], 10, true);
Animation.addAnimation("log_walk_down", "log/log.png", [0, 1, 2, 3], 10, true);
Animation.addAnimation("log_walk_up", "log/log.png", [6, 7, 8, 9], 10, true);
Animation.addAnimation("log_walk_right", "log/log.png", [12, 13, 14, 15], 10, true);
Animation.addAnimation("log_walk_left", "log/log.png", [18, 19, 20, 21], 10, true);
Animation.addAnimation("log_attack_down", "log/log.png", [2], 10, false);
Animation.addAnimation("log_attack_up", "log/log.png", [8], 10, false);
Animation.addAnimation("log_attack_right", "log/log.png", [14], 10, false);
Animation.addAnimation("log_attack_left", "log/log.png", [20], 10, false);
Spritesheet.addSpritesheet("Goblin/goblin.png", 26, 26, 4, 36);
Animation.addAnimation("goblin_idle_down", "goblin/goblin.png", [32, 33], 8, true);
Animation.addAnimation("goblin_idle_up", "goblin/goblin.png", [20, 21], 8, true);
Animation.addAnimation("goblin_idle_right", "goblin/goblin.png", [8, 9], 8, true);
Animation.addAnimation("goblin_walk_down", "goblin/goblin.png", [28, 29, 30, 31], 10, true);
Animation.addAnimation("goblin_walk_up", "goblin/goblin.png", [16, 17, 18, 19], 10, true);
Animation.addAnimation("goblin_walk_right", "goblin/goblin.png", [4, 5, 6], 10, true);
Animation.addAnimation("goblin_attack_down", "goblin/goblin.png", [24, 25, 26], 4 / .2, false);
Animation.addAnimation("goblin_attack_up", "goblin/goblin.png", [12, 13, 14], 4 / .2, false);
Animation.addAnimation("goblin_attack_right", "goblin/goblin.png", [0, 1, 2], 4 / .2, false);
AudioManager.addAudioSprites("Assets/Audiosprites/audioSprites.json");
var Scenes;
(function (Scenes) {
    class Preload extends Scene {
        constructor(...args) {
            super(...args);
            this.onLoad = () => {
                let go = new GameObject();
                go.addComponent(Comps.Preloader);
            };
            this.onUnload = () => { };
        }
    }
    Scenes.Preload = Preload;
})(Scenes || (Scenes = {}));
var Scenes;
(function (Scenes) {
    class TestScene extends Scene {
        constructor(...args) {
            super(...args);
            this.onLoad = () => {
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
                let tm = TiledMap.createTiledMapData("test2");
                tm.createGameObject();
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
            };
            this.onUnload = () => { };
        }
    }
    Scenes.TestScene = TestScene;
})(Scenes || (Scenes = {}));
var Scenes;
(function (Scenes) {
    class TestScene2 extends Scene {
        constructor(...args) {
            super(...args);
            this.onLoad = () => {
                Camera.scale = 2;
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
                let tm = TiledMap.createTiledMapData("test4");
                let tmGO = tm.createGameObject();
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
                let textArea = go.addComponent(TextArea);
                go.transform.x = 200;
                go.transform.y = 300;
                textArea.text = "Here are a bunch of words <imp>making up <transparent>this</transparent> text.\nThis starts</imp> a new line.  What's new?    4    spaces    wow    lots    of    space.";
                textArea.width = 100;
                textArea.height = 300;
                textArea.useColorTags = true;
                textArea.horizAlign = HorizAlign.LEFT;
                textArea.vertAlign = VertAlign.MIDDLE;
                textArea.borderWidth = 1;
                textArea.layer = DrawLayer.UI;
                textArea.order = 9999;
                go = new GameObject();
                let inputTextArea = go.addComponent(InputTextArea);
                go.transform.x = 500;
                go.transform.y = 200;
                inputTextArea.text = "Start text";
                inputTextArea.width = 200;
                inputTextArea.height = 300;
                inputTextArea.borderWidth = 1;
                inputTextArea.layer = DrawLayer.UI;
                inputTextArea.order = 9999;
                inputTextArea.inputEnabled = true;
                inputTextArea.horizAlign = HorizAlign.LEFT;
                inputTextArea.vertAlign = VertAlign.BOTTOM;
            };
            this.onUnload = () => { };
        }
    }
    Scenes.TestScene2 = TestScene2;
})(Scenes || (Scenes = {}));
var Scenes;
(function (Scenes) {
    class TestScene3 extends Scene {
        constructor(...args) {
            super(...args);
            this.onLoad = () => {
                Camera.scale = 2;
                Collision.gravityX = 0;
                Collision.gravityY = 0;
                let tm = TiledMap.createTiledMapData("test5");
                let tmGO = tm.createGameObject();
                let go;
                go = GameObject.findObject("Hero");
                Camera.setCenter(go.transform.getGlobalPosition());
            };
        }
    }
    Scenes.TestScene3 = TestScene3;
})(Scenes || (Scenes = {}));
Scene.addScene("Preload", new Scenes.Preload());
Scene.addScene("TestScene", new Scenes.TestScene());
Scene.addScene("TestScene2", new Scenes.TestScene2());
Scene.addScene("TestScene3", new Scenes.TestScene3());
TiledMap.tilesetImageDirectory = "Tilesets/";
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
    "nextobjectid": 4,
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
TiledMap.addMap("test5", { "height": 30,
    "layers": [
        {
            "data": [406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 243, 244, 244, 244, 245, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 283, 284, 284, 284, 403, 244, 244, 244, 245, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 283, 284, 284, 284, 284, 284, 284, 284, 285, 406, 406, 406, 406, 406, 406, 1175, 1176, 1176, 1176, 1176, 1176, 1176, 1176, 1176, 1176, 1176, 1177, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 283, 284, 284, 284, 284, 284, 284, 284, 285, 406, 406, 406, 406, 406, 406, 1215, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1217, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 283, 284, 284, 284, 284, 284, 284, 284, 285, 406, 406, 406, 406, 406, 406, 1215, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1217, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 323, 324, 324, 324, 364, 284, 284, 284, 285, 406, 406, 406, 406, 406, 406, 1215, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1217, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 323, 324, 324, 324, 325, 406, 406, 406, 406, 406, 406, 1215, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1217, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 1255, 1256, 1256, 1296, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1217, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 1215, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1217, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 1215, 1216, 1216, 1216, 1216, 1216, 1216, 1216, 1217, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 409, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 1255, 1256, 1256, 1256, 1256, 1256, 1256, 1256, 1257, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 446, 446, 446, 446, 446, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 486, 486, 486, 486, 486, 405, 406, 406, 406, 406, 406, 406, 1, 1, 1, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 526, 526, 526, 526, 526, 405, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 526, 526, 526, 526, 526, 405, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 526, 526, 526, 526, 526, 405, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 526, 526, 526, 526, 526, 405, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 526, 526, 526, 526, 526, 405, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 526, 526, 526, 526, 526, 405, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 526, 526, 526, 526, 526, 405, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 406, 406, 406, 406, 406, 526, 526, 526, 526, 526, 405, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 407, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 405, 406, 406, 406, 406, 526, 526, 526, 526, 526, 405, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 407, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 445, 446, 446, 446, 446, 526, 526, 526, 526, 526, 405, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 407, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 486, 486, 486, 486, 486, 526, 526, 526, 526, 526, 405, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 406, 407, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 445, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 446, 447, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 486, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526, 526],
            "height": 30,
            "name": "ground",
            "opacity": 1,
            "type": "tilelayer",
            "visible": true,
            "width": 50,
            "x": 0,
            "y": 0
        },
        {
            "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 561, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 646, 647, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 686, 687, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 522, 523, 603, 603, 603, 603, 604, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 562, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 602, 603, 603, 603, 642, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 204, 205, 205, 205, 205, 205, 205, 206, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 522, 603, 603, 603, 603, 603, 603, 603, 603, 603, 603, 524, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 562, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 562, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 601, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 601, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 561, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 561, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 564, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 601, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 601, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "height": 30,
            "name": "tile objects",
            "opacity": 1,
            "type": "tilelayer",
            "visible": true,
            "width": 50,
            "x": 0,
            "y": 0
        },
        {
            "draworder": "topdown",
            "height": 0,
            "name": "objects",
            "objects": [
                {
                    "height": 0,
                    "id": 1,
                    "name": "Hero",
                    "properties": {},
                    "rotation": 0,
                    "type": "Hero",
                    "visible": true,
                    "width": 0,
                    "x": 159.5,
                    "y": 109
                },
                {
                    "height": 0,
                    "id": 2,
                    "name": "Log",
                    "properties": {},
                    "rotation": 0,
                    "type": "Log",
                    "visible": true,
                    "width": 0,
                    "x": 227.5,
                    "y": 194
                },
                {
                    "height": 0,
                    "id": 5,
                    "name": "Goblin",
                    "properties": {},
                    "rotation": 0,
                    "type": "Goblin",
                    "visible": true,
                    "width": 0,
                    "x": 117.5,
                    "y": 195
                }],
            "opacity": 1,
            "type": "objectgroup",
            "visible": true,
            "width": 0,
            "x": 0,
            "y": 0
        }],
    "nextobjectid": 6,
    "orientation": "orthogonal",
    "properties": {
        "prop1": "prop val"
    },
    "renderorder": "right-down",
    "tileheight": 16,
    "tilesets": [
        {
            "firstgid": 1,
            "image": "..\/..\/..\/Workbench\/oga top down\/Overworld.png",
            "imageheight": 576,
            "imagewidth": 640,
            "margin": 0,
            "name": "Overworld",
            "properties": {},
            "spacing": 0,
            "tilecount": 1440,
            "tileheight": 16,
            "tileproperties": {
                "10": {
                    "col": "true"
                },
                "126": {
                    "col": "true"
                },
                "127": {
                    "col": "true"
                },
                "128": {
                    "col": "true"
                },
                "129": {
                    "col": "true"
                },
                "130": {
                    "col": "true"
                },
                "166": {
                    "col": "true"
                },
                "167": {
                    "col": "true"
                },
                "168": {
                    "col": "true"
                },
                "169": {
                    "col": "true"
                },
                "170": {
                    "col": "true"
                },
                "203": {
                    "col": "true"
                },
                "204": {
                    "col": "true"
                },
                "205": {
                    "col": "true"
                },
                "283": {
                    "material": "WATER"
                },
                "46": {
                    "col": "true"
                },
                "47": {
                    "col": "true"
                },
                "48": {
                    "col": "true"
                },
                "484": {
                    "material": "CLIFF"
                },
                "485": {
                    "material": "CLIFF"
                },
                "486": {
                    "material": "CLIFF"
                },
                "49": {
                    "col": "true"
                },
                "50": {
                    "col": "true"
                },
                "521": {
                    "col": "true"
                },
                "522": {
                    "col": "true"
                },
                "523": {
                    "col": "true"
                },
                "524": {
                    "material": "CLIFF"
                },
                "525": {
                    "material": "CLIFF"
                },
                "526": {
                    "material": "CLIFF"
                },
                "560": {
                    "col": "true"
                },
                "561": {
                    "col": "true"
                },
                "562": {
                    "col": "true"
                },
                "563": {
                    "col": "true"
                },
                "564": {
                    "material": "CLIFF"
                },
                "565": {
                    "material": "CLIFF"
                },
                "566": {
                    "material": "CLIFF"
                },
                "6": {
                    "col": "true"
                },
                "600": {
                    "col": "true"
                },
                "601": {
                    "col": "true"
                },
                "602": {
                    "col": "true"
                },
                "603": {
                    "col": "true"
                },
                "640": {
                    "col": "true"
                },
                "641": {
                    "col": "true"
                },
                "645": {
                    "col": "true"
                },
                "646": {
                    "col": "true"
                },
                "685": {
                    "col": "true"
                },
                "686": {
                    "col": "true"
                },
                "7": {
                    "col": "true"
                },
                "8": {
                    "col": "true"
                },
                "86": {
                    "col": "true"
                },
                "87": {
                    "col": "true"
                },
                "88": {
                    "col": "true"
                },
                "89": {
                    "col": "true"
                },
                "9": {
                    "col": "true"
                },
                "90": {
                    "col": "true"
                }
            },
            "tilewidth": 16
        }],
    "tilewidth": 16,
    "version": 1,
    "width": 50
});
Game.preloadScene = "Preload";
Game.startScene = "TestScene3";
PackedImageRenderer.IMAGE_SMOOTHING_ENABLED_DEFAULT = false;
window.onload = () => {
    let canvas = document.getElementById("canvas");
    Game.initialize(canvas);
    document.getElementById("download_save_data").onclick = SaveManager.downloadSaveData;
};
var PlayerInput;
(function (PlayerInput) {
    function isLeftHeld() {
        return Keys.keyHeld(Key.LeftArrow) || Keys.keyHeld(Key.A);
    }
    PlayerInput.isLeftHeld = isLeftHeld;
    function isRightHeld() {
        return Keys.keyHeld(Key.RightArrow) || Keys.keyHeld(Key.D);
    }
    PlayerInput.isRightHeld = isRightHeld;
    function isUpHeld() {
        return Keys.keyHeld(Key.UpArrow) || Keys.keyHeld(Key.W);
    }
    PlayerInput.isUpHeld = isUpHeld;
    function isDownHeld() {
        return Keys.keyHeld(Key.DownArrow) || Keys.keyHeld(Key.S);
    }
    PlayerInput.isDownHeld = isDownHeld;
    function isAttackPressed() {
        return Keys.keyPressed(Key.X) || Keys.keyPressed(Key.ForwardSlash);
    }
    PlayerInput.isAttackPressed = isAttackPressed;
})(PlayerInput || (PlayerInput = {}));
var Comps;
(function (Comps) {
    (function (Character_State) {
        Character_State[Character_State["NONE"] = 0] = "NONE";
        Character_State[Character_State["IDLE"] = 1] = "IDLE";
        Character_State[Character_State["WALK"] = 2] = "WALK";
        Character_State[Character_State["ACTION"] = 3] = "ACTION";
        Character_State[Character_State["KNOCKBACK"] = 4] = "KNOCKBACK";
    })(Comps.Character_State || (Comps.Character_State = {}));
    var Character_State = Comps.Character_State;
    (function (Character_PushMode) {
        Character_PushMode[Character_PushMode["NONE"] = 0] = "NONE";
        Character_PushMode[Character_PushMode["PUSHED"] = 1] = "PUSHED";
    })(Comps.Character_PushMode || (Comps.Character_PushMode = {}));
    var Character_PushMode = Comps.Character_PushMode;
    (function (Character_WalkMode) {
        Character_WalkMode[Character_WalkMode["NONE"] = 0] = "NONE";
        Character_WalkMode[Character_WalkMode["TO_POINT"] = 1] = "TO_POINT";
        Character_WalkMode[Character_WalkMode["TO_TDACTOR"] = 2] = "TO_TDACTOR";
    })(Comps.Character_WalkMode || (Comps.Character_WalkMode = {}));
    var Character_WalkMode = Comps.Character_WalkMode;
    class Character extends Comps.TDActor {
        constructor() {
            super();
            this.animPrefix = "[define animPrefix here]";
            this.symmetrical = true;
            this.canWalk = true;
            this.walkSpeed = 100;
            this.walkAccel = 500;
            this.friction = 800;
            this.setAction = (index, actionID) => {
                if (index < 0)
                    return;
                if (index >= this._actions.length && actionID === Actions.ID.NONE)
                    return;
                while (index >= this._actions.length) {
                    this._actions.push(null);
                    this._actionInfos.push(null);
                }
                let prevAction = this._actions[index];
                if (prevAction !== null) {
                    prevAction.stop();
                }
                let actionInfo = Actions.getActionInfo(actionID);
                this._actionInfos[index] = actionInfo;
                let actionInstance = new actionInfo.ctor(this);
                this._actions[index] = actionInstance;
            };
            this.getActionInfo = (index) => {
                if (index < 0 || index >= this._actionInfos.length)
                    return null;
                return this._actionInfos[index];
            };
            this.knockbackFriction = 600;
            this.mercyInvincibilityDuration = .4;
            this.mercyInvincibleFlashPeriod = .1;
            this.mercyInvincibleTintColor = "red";
            this.mercyInvincibleTintAmount1 = .6;
            this.mercyInvincibleTintAmount2 = .2;
            this.applyFriction = true;
            this.getState = () => {
                return this._state;
            };
            this.getCurrentActionIndex = () => {
                return this._currentActionIndex;
            };
            this.getDirection = () => {
                return this._direction;
            };
            this.isInputEnabled = () => {
                return this._inputEnabled;
            };
            this.isMercyInvincible = () => {
                return this._mercyInvincibleTime < this.mercyInvincibilityDuration;
            };
            this.pushMode = Character_PushMode.PUSHED;
            this.enableInput = () => {
                if (this._inputEnabled)
                    return;
                this._inputEnabled = true;
            };
            this.disableInput = () => {
                if (!this._inputEnabled)
                    return;
                this._inputEnabled = false;
                this.idle();
            };
            this.idle = () => {
                if (this.isInputEnabled()) {
                    console.warn("Shouldn't call Character.idle() when input is enabled");
                }
                this._startIdleState();
            };
            this.idleDirection = (direction) => {
                if (this.isInputEnabled()) {
                    console.warn("Shouldn't call Character.idle() when input is enabled");
                }
                this._direction = direction;
                this._startIdleState();
            };
            this.walkToPoint = (x, y) => {
                if (this.isInputEnabled()) {
                    console.warn("Shouldn't call Character.walk() when input is enabled");
                }
                if (!this.canWalk)
                    return;
                this._walkMode = Character_WalkMode.TO_POINT;
                this._targetRef = null;
                this._targetOffsetX = x;
                this._targetOffsetY = y;
                this._startWalkState();
            };
            this.walkToTDActor = (tdActor, offset) => {
                if (this.isInputEnabled()) {
                    console.warn("Shouldn't call Character.walk() when input is enabled");
                }
                if (!this.canWalk)
                    return;
                this._walkMode = Character_WalkMode.TO_TDACTOR;
                this._targetRef = tdActor;
                switch (offset) {
                    case Direction.RIGHT:
                        this._targetOffsetX = tdActor.halfWidth + this.halfWidth;
                        this._targetOffsetY = 0;
                        break;
                    case Direction.DOWN:
                        this._targetOffsetX = 0;
                        this._targetOffsetY = tdActor.halfHeight + this.halfHeight;
                        break;
                    case Direction.LEFT:
                        this._targetOffsetX = -tdActor.halfWidth - this.halfWidth;
                        this._targetOffsetY = 0;
                        break;
                    case Direction.UP:
                        this._targetOffsetX = 0;
                        this._targetOffsetY = -tdActor.halfHeight - this.halfHeight;
                        break;
                    default:
                        this._targetOffsetX = 0;
                        this._targetOffsetY = 0;
                        break;
                }
                this._startWalkState();
            };
            this.startAction = (actionIndex) => {
                if (actionIndex < 0 || actionIndex >= this._actions.length) {
                    console.warn("action index " + actionIndex + " is invalid.  Could not start action");
                    return;
                }
                let action = this._actions[actionIndex];
                if (action === null) {
                    console.warn("action at action index " + actionIndex + " is null.  Could not start action");
                    return;
                }
                this._endCurrentAction();
                this._state = Character_State.ACTION;
                this._currentActionIndex = actionIndex;
                action.start();
            };
            this.onAwake = () => {
                this.Actor_onAwake();
                Character.allCharacters.push(this);
            };
            this.onStart = () => {
                this.health = this.maxHealth;
                this.tdSpriteRenderer = this.getComponent(Comps.TDSpriteRenderer);
                this._startIdleState();
            };
            this.onUpdate = () => {
                this.transform.getGlobalPosition(this.tempVec2);
                let x = this.tempVec2.x;
                let foot = this.getFoot();
                let vx = this.vx;
                let vy = this.vy;
                this._time += Game.deltaTime;
                this._mercyInvincibleTime += Game.deltaTime;
                switch (this._state) {
                    case Character_State.IDLE:
                    case Character_State.WALK:
                        if (this.isInputEnabled()) {
                            if (PlayerInput.isLeftHeld() && !PlayerInput.isRightHeld()) {
                                if (vx > 0) {
                                    vx = Math.max(0, vx - this.friction * Game.deltaTime);
                                }
                                vx -= this.walkAccel * Game.deltaTime;
                            }
                            else if (PlayerInput.isRightHeld() && !PlayerInput.isLeftHeld()) {
                                if (vx < 0) {
                                    vx = Math.min(0, vx + this.friction * Game.deltaTime);
                                }
                                vx += this.walkAccel * Game.deltaTime;
                            }
                            else {
                                if (vx > 0) {
                                    vx = Math.max(0, vx - this.friction * Game.deltaTime);
                                }
                                else {
                                    vx = Math.min(0, vx + this.friction * Game.deltaTime);
                                }
                            }
                            if (PlayerInput.isUpHeld() && !PlayerInput.isDownHeld()) {
                                if (vy > 0) {
                                    vy = Math.max(0, vy - this.friction * Game.deltaTime);
                                }
                                vy -= this.walkAccel * Game.deltaTime;
                            }
                            else if (PlayerInput.isDownHeld() && !PlayerInput.isUpHeld()) {
                                if (vy < 0) {
                                    vy = Math.min(0, vy + this.friction * Game.deltaTime);
                                }
                                vy += this.walkAccel * Game.deltaTime;
                            }
                            else {
                                if (vy > 0) {
                                    vy = Math.max(0, vy - this.friction * Game.deltaTime);
                                }
                                else {
                                    vy = Math.min(0, vy + this.friction * Game.deltaTime);
                                }
                            }
                            let vMag = M.magnitude(vx, vy);
                            if (vMag >= this.walkSpeed) {
                                vx *= this.walkSpeed / vMag;
                                vy *= this.walkSpeed / vMag;
                            }
                            if (PlayerInput.isLeftHeld() !== PlayerInput.isRightHeld()) {
                                if (!(PlayerInput.isUpHeld() && this._direction === Direction.UP) &&
                                    !(PlayerInput.isDownHeld() && this._direction === Direction.DOWN)) {
                                    this._direction = PlayerInput.isLeftHeld() ? Direction.LEFT : Direction.RIGHT;
                                }
                                this._startWalkState();
                            }
                            else if (PlayerInput.isUpHeld() !== PlayerInput.isDownHeld()) {
                                this._direction = PlayerInput.isUpHeld() ? Direction.UP : Direction.DOWN;
                                this._startWalkState();
                            }
                            else {
                                this._startIdleState();
                            }
                            if (PlayerInput.isAttackPressed()) {
                                this.startAction(0);
                            }
                        }
                        else {
                            if (this._state === Character_State.WALK) {
                                let wx = 0;
                                let wy = 0;
                                switch (this._walkMode) {
                                    case Character_WalkMode.TO_POINT:
                                        wx = this._targetOffsetX;
                                        wy = this._targetOffsetY;
                                        break;
                                    case Character_WalkMode.TO_TDACTOR:
                                        this._targetRef.getGlobalPosition(this.tempVec2);
                                        wx = this.tempVec2.x + this._targetOffsetX;
                                        wy = this._targetRef.getFoot() + this._targetOffsetY;
                                        break;
                                }
                                let dx = wx - x;
                                let dy = wy - foot;
                                let dMag = M.magnitude(dx, dy);
                                if (dMag < this.walkSpeed * Game.deltaTime) {
                                    vx = dx / Game.deltaTime;
                                    vy = dy / Game.deltaTime;
                                    this.idle();
                                }
                                else {
                                    dx /= dMag;
                                    dy /= dMag;
                                    let targetVX = dx * this.walkSpeed;
                                    let targetVY = dy * this.walkSpeed;
                                    if (vx < targetVX) {
                                        vx = Math.min(targetVX, vx + this.walkAccel * Game.deltaTime);
                                    }
                                    else {
                                        vx = Math.max(targetVX, vx - this.walkAccel * Game.deltaTime);
                                    }
                                    if (vy < targetVY) {
                                        vy = Math.min(targetVY, vy + this.walkAccel * Game.deltaTime);
                                    }
                                    else {
                                        vy = Math.max(targetVY, vy - this.walkAccel * Game.deltaTime);
                                    }
                                }
                                this._direction = Collision.getNormalDirection(vx, vy);
                            }
                        }
                        break;
                    case Character_State.ACTION:
                        let action = this._getCurrentAction();
                        action.onUpdate();
                        if (!action.isRunning()) {
                            this._startIdleState();
                        }
                        break;
                    case Character_State.KNOCKBACK:
                        let vMag0 = M.magnitude(vx, vy);
                        if (vMag0 > .00001) {
                            let vMag1 = Math.max(0, vMag0 - this.knockbackFriction * Game.deltaTime);
                            vx *= vMag1 / vMag0;
                            vy *= vMag1 / vMag0;
                        }
                        if (this._time >= this._knockbackDuration) {
                            this._startIdleState();
                        }
                        break;
                }
                if (this.applyFriction) {
                    let friction = this.friction;
                    if (vx < 0) {
                        vx = Math.min(0, vx + friction * Game.deltaTime);
                    }
                    else {
                        vx = Math.max(0, vx - friction * Game.deltaTime);
                    }
                    if (vy < 0) {
                        vy = Math.min(0, vy + friction * Game.deltaTime);
                    }
                    else {
                        vy = Math.max(0, vy - friction * Game.deltaTime);
                    }
                }
                if (this.pushMode === Character_PushMode.PUSHED) {
                }
                this.vx = vx;
                this.vy = vy;
                this.updateAnimation();
            };
            this.preReceiveDamage = (ai) => {
                if (this.isMercyInvincible()) {
                    ai.damage = 0;
                }
            };
            this.onReceiveDamage = (ai) => {
                console.log("received damage.  damage: " + ai.damage + " health: " + this.health);
                if (ai.damage > 0) {
                    this._startKnockbackState(ai.knockbackSpeed, ai.knockbackHeading, ai.knockbackDuration, true);
                }
            };
            this.onDestroy = () => {
                this._endCurrentAction();
                this._actions.splice(0);
                this._actions = null;
                this._actionInfos.splice(0);
                this._actions = null;
                this.tdSpriteRenderer = null;
                let index = Character.allCharacters.indexOf(this);
                if (index !== -1) {
                    Character.allCharacters.splice(index, 1);
                }
                this.Actor_onDestroy();
            };
            this._startIdleState = () => {
                this._endCurrentAction();
                if (this._state != Character_State.IDLE) {
                    this._state = Character_State.IDLE;
                    this._time = 0;
                    this.applyFriction = true;
                }
                this.updateAnimation();
            };
            this._startWalkState = () => {
                this._endCurrentAction();
                if (this._state != Character_State.WALK) {
                    this._state = Character_State.WALK;
                    this._time = 0;
                    this.applyFriction = false;
                }
                this.updateAnimation();
            };
            this._startKnockbackState = (speed, heading, duration, startMercyInvincibility) => {
                this._endCurrentAction();
                if (this._state !== Character_State.KNOCKBACK) {
                    this._state = Character_State.KNOCKBACK;
                }
                this.vx = speed * Math.cos(heading * M.degToRad);
                this.vy = speed * Math.sin(heading * M.degToRad);
                this._time = 0;
                this._knockbackDuration = duration;
                this.applyFriction = false;
                if (startMercyInvincibility) {
                    this._mercyInvincibleTime = 0;
                }
                this.updateAnimation();
            };
            this.updateAnimation = () => {
                if ((this._direction === Direction.LEFT && this.symmetrical) === this.transform.scaleX > 0) {
                    this.transform.scaleX *= -1;
                }
                if (this.isMercyInvincible()) {
                    this.tdSpriteRenderer.tintColor = this.mercyInvincibleTintColor;
                    if (M.fmod(this._mercyInvincibleTime, this.mercyInvincibleFlashPeriod) < this.mercyInvincibleFlashPeriod / 2) {
                        this.tdSpriteRenderer.tintAmount = this.mercyInvincibleTintAmount1;
                    }
                    else {
                        this.tdSpriteRenderer.tintAmount = this.mercyInvincibleTintAmount2;
                    }
                }
                else {
                    this.tdSpriteRenderer.tintAmount = 0;
                }
                let anim = this.animPrefix;
                switch (this._state) {
                    case Character_State.IDLE:
                        anim += "_idle";
                        break;
                    case Character_State.WALK:
                        anim += "_walk";
                        break;
                    default:
                        return;
                }
                switch (this._direction) {
                    case Direction.NONE:
                        return;
                    case Direction.LEFT:
                        if (this.symmetrical) {
                            anim += "_right";
                        }
                        else {
                            anim += "_left";
                        }
                        break;
                    case Direction.RIGHT:
                        anim += "_right";
                        break;
                    case Direction.UP:
                        anim += "_up";
                        break;
                    case Direction.DOWN:
                        anim += "_down";
                        break;
                }
                if (this.tdSpriteRenderer.getAnimation() === null ||
                    this.tdSpriteRenderer.getAnimation().name !== anim) {
                    this.tdSpriteRenderer.playAnimation(anim);
                }
            };
            this._getCurrentAction = () => {
                if (this._currentActionIndex < 0 || this._currentActionIndex >= this._actions.length)
                    return null;
                return this._actions[this._currentActionIndex];
            };
            this._endCurrentAction = () => {
                let action = this._getCurrentAction();
                if (action === null)
                    return;
                action.stop();
                this._currentActionIndex = -1;
            };
            this.tdSpriteRenderer = null;
            this._state = Character_State.NONE;
            this._time = 0;
            this._direction = Direction.DOWN;
            this._inputEnabled = false;
            this._walkMode = Character_WalkMode.NONE;
            this._targetRef = null;
            this._targetOffsetX = 0;
            this._targetOffsetY = 0;
            this._knockbackDuration = 0;
            this._mercyInvincibleTime = 9999;
            this._actionInfos = [];
            this._actions = [];
            this._currentActionIndex = -1;
            this.name = "Character";
            this.componentProperties.requireComponent(Comps.TDSpriteRenderer);
        }
        static getCharacter(name) {
            if (name == null || name === "")
                return null;
            for (let i; i < Character.allCharacters.length; i++) {
                let c = Character.allCharacters[i];
                if (c.gameObject.name === name)
                    return c;
            }
            return null;
        }
        static forEach(callbackFn) {
            Character.allCharacters.forEach(callbackFn);
        }
        static setInputCharacter(character) {
            if (character == null || (typeof character === "string" && character === "")) {
                Character.allCharacters.forEach(function (c) {
                    c.disableInput();
                });
                return;
            }
            if (typeof character === "string") {
                let found = false;
                for (let i = 0; i < Character.allCharacters.length; i++) {
                    let c = Character.allCharacters[i];
                    if (c.gameObject.name === character) {
                        c.enableInput();
                        found = true;
                    }
                    else {
                        c.disableInput();
                    }
                }
                if (!found) {
                    console.warn(character + " was not set as the input character because no character with that name exists.");
                }
            }
            else {
                for (let i = 0; i < Character.allCharacters.length; i++) {
                    let c = Character.allCharacters[i];
                    if (c === character) {
                        c.enableInput();
                    }
                    else {
                        c.disableInput();
                    }
                }
            }
        }
        static getInputCharacter() {
            for (let i = 0; i < Character.allCharacters.length; i++) {
                let c = Character.allCharacters[i];
                if (c.isInputEnabled()) {
                    return c;
                }
            }
            return null;
        }
    }
    Character.allCharacters = [];
    Comps.Character = Character;
})(Comps || (Comps = {}));
var Debug;
(function (Debug) {
    function listCharacters() {
        let names = [];
        Comps.Character.forEach(function (character) {
            names.push(character.gameObject.name);
        });
        return names;
    }
    Debug.listCharacters = listCharacters;
    function setInputCharacter(characterName) {
        Comps.Character.setInputCharacter(characterName);
    }
    Debug.setInputCharacter = setInputCharacter;
})(Debug || (Debug = {}));
var Actions;
(function (Actions) {
    (function (ID) {
        ID[ID["NONE"] = 0] = "NONE";
        ID[ID["SWORD_SLASH"] = 1] = "SWORD_SLASH";
    })(Actions.ID || (Actions.ID = {}));
    var ID = Actions.ID;
})(Actions || (Actions = {}));
var Actions;
(function (Actions) {
    class Info {
        constructor(id, name, description, ctor) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.ctor = ctor;
        }
    }
    Actions.Info = Info;
    function getActionInfo(id) {
        let idN = id;
        if (!map.hasOwnProperty(idN)) {
            console.warn("No Actions.Info found with the id " + Actions.ID[id] + ".  It probably needs to be added internally with Actions.addAction()");
            return null;
        }
        return map[idN];
    }
    Actions.getActionInfo = getActionInfo;
    function addActionInfo(info) {
        if (info == null) {
            addInfoError("info is null");
            return;
        }
        if (info.id == undefined) {
            addInfoError("info.id is undefined or null");
            return;
        }
        if (typeof info.id !== "number") {
            addInfoError("info.id must be an Actions.ID");
            return;
        }
        let id = info.id;
        let idN = id;
        if (id === Actions.ID.NONE) {
            addInfoError("cannot add info with ID " + Actions.ID.NONE);
            return;
        }
        if (map.hasOwnProperty(idN)) {
            addInfoError("info with ID " + id + " already added.");
            return;
        }
        if (info.name == undefined) {
            addInfoError("info.name is undefined or null", id);
            return;
        }
        if (typeof info.name !== "string") {
            addInfoError("info.name must be a string", id);
            return;
        }
        if (info.ctor == undefined) {
            addInfoError("info.ctor is undefined or null", id);
            return;
        }
        if (info.description == undefined) {
            addInfoError("info.description is undefined or null", id);
            return;
        }
        if (typeof info.description !== "string") {
            addInfoError("info.description must be a string", id);
            return;
        }
        map[idN] = info;
    }
    Actions.addActionInfo = addActionInfo;
    function addInfoError(message, id = Actions.ID.NONE) {
        let idStr = id === Actions.ID.NONE ? "" : " " + Actions.ID[id];
        console.error("Error adding ActionInfo" + idStr + ": " + message);
    }
    let map = {};
})(Actions || (Actions = {}));
var Actions;
(function (Actions) {
    class Base {
        constructor(character) {
            this.power = 0;
            this.start = () => {
                if (this.isRunning())
                    return;
                this._running = true;
                this.onStart();
            };
            this.stop = () => {
                if (!this.isRunning())
                    return;
                this.onEnd();
                this._running = false;
            };
            this.isRunning = () => {
                return this._running;
            };
            this.onStart = () => { };
            this.onUpdate = () => { };
            this.onEnd = () => { };
            this.character = null;
            this._running = false;
            this.character = character;
        }
    }
    Actions.Base = Base;
})(Actions || (Actions = {}));
var Actions;
(function (Actions) {
    class SwordSlash extends Actions.Base {
        constructor(character) {
            super(character);
            this.duration = .25;
            this.onStart = () => {
                this.character.applyFriction = true;
                this.time = 0;
                let ssGO = new GameObject();
                let sr = ssGO.addComponent(SpriteRenderer);
                sr.playAnimation("hero_sword_slash");
                let ve = ssGO.addComponent(VisualEffect);
                let hitCircle = ssGO.addComponent(Comps.HitCircle);
                hitCircle.actionRef = this;
                switch (this.character.team) {
                    case Team.PLAYERS:
                        hitCircle.teamTargeting = Team.ENEMIES;
                        break;
                    case Team.ENEMIES:
                        hitCircle.teamTargeting = Team.PLAYERS;
                        break;
                    default:
                        hitCircle.teamTargeting = Team.ALL;
                }
                hitCircle.offsetX = -3;
                hitCircle.offsetY = 0;
                hitCircle.radius = 13;
                hitCircle.attackDelay = .03;
                hitCircle.attackDuration = .06;
                hitCircle.headingMode = Comps.HitCircle_HeadingMode.CHARACTER_POSITION;
                let slashOffsetMag = 16;
                let rect = this.character.getRect();
                let charAnim = this.character.animPrefix + "_attack";
                switch (this.character.getDirection()) {
                    case Direction.LEFT:
                        charAnim += this.character.symmetrical ? "_right" : "_left";
                        ssGO.transform.x = rect.x - slashOffsetMag;
                        ssGO.transform.y = rect.y + rect.height / 2;
                        ssGO.transform.scaleX = -1;
                        break;
                    case Direction.RIGHT:
                        charAnim += "_right";
                        ssGO.transform.x = rect.x + rect.width + slashOffsetMag;
                        ssGO.transform.y = rect.y + rect.height / 2;
                        break;
                    case Direction.UP:
                        charAnim += "_up";
                        ssGO.transform.x = rect.x + rect.width / 2;
                        ssGO.transform.y = rect.y - slashOffsetMag;
                        ssGO.transform.rotation = -90;
                        break;
                    case Direction.DOWN:
                        charAnim += "_down";
                        ssGO.transform.x = rect.x + rect.width / 2;
                        ssGO.transform.y = rect.y + rect.height + slashOffsetMag;
                        ssGO.transform.rotation = 90;
                        break;
                }
                this.character.getComponent(SpriteRenderer).playAnimation(charAnim);
            };
            this.onUpdate = () => {
                this.time += Game.deltaTime;
                if (this.time >= this.duration) {
                    this.stop();
                }
            };
            this.onEnd = () => { };
            this.time = 0;
            this.power = 1;
        }
    }
    Actions.SwordSlash = SwordSlash;
})(Actions || (Actions = {}));
Actions.addActionInfo({
    id: Actions.ID.SWORD_SLASH,
    name: "Sword Slash",
    ctor: Actions.SwordSlash,
    description: "Slashes foes with a sword."
});
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
            };
            this.onCollisionStay = (response) => {
            };
            this.onCollisionExit = (response) => {
            };
            this.name = "ArrowTestController";
        }
    }
    Comps.ArrowTestController = ArrowTestController;
})(Comps || (Comps = {}));
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
            };
            this.name = "ArrowTestPlatController";
        }
    }
    Comps.ArrowTestPlatController = ArrowTestPlatController;
})(Comps || (Comps = {}));
var Comps;
(function (Comps) {
    class CameraFollow extends Component {
        constructor() {
            super();
            this.onLateUpdate = () => {
                this.transform.getGlobalPosition(this.tempVec2);
                Camera.centerX = this.tempVec2.x;
                Camera.centerY = this.tempVec2.y;
            };
            this.tempVec2 = new Vec2();
            this.name = "CameraFollow";
        }
    }
    Comps.CameraFollow = CameraFollow;
})(Comps || (Comps = {}));
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
var Comps;
(function (Comps) {
    class DotFollowsMouse extends Comps.DotGraphic {
        constructor() {
            super();
            this.onUpdate = () => {
                if (this.anchored) {
                    this.transform.setGlobalPosition(Mouse.x, Mouse.y);
                }
                else {
                    let v = Camera.canvasToGlobal(Mouse.x, Mouse.y);
                    Camera.globalToCanvas(v.x, v.y, v);
                    Camera.canvasToGlobal(v.x, v.y, v);
                    this.transform.setGlobalPosition(v.x, v.y);
                }
            };
            this.name = "DotFollowsMouse";
            this.anchored = false;
            this.layer = DrawLayer.UI;
        }
    }
    Comps.DotFollowsMouse = DotFollowsMouse;
})(Comps || (Comps = {}));
var Comps;
(function (Comps) {
    class FacesMouse extends Component {
        constructor() {
            super();
            this.onUpdate = () => {
                let pos = this.transform.getGlobalPosition();
                let targetPos = Camera.canvasToGlobal(Mouse.x, Mouse.y);
                this.transform.setGlobalRotation(Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x) * M.radToDeg);
            };
            this.name = "FacesMouse";
        }
    }
    Comps.FacesMouse = FacesMouse;
})(Comps || (Comps = {}));
var Comps;
(function (Comps) {
    (function (HitCircle_HeadingMode) {
        HitCircle_HeadingMode[HitCircle_HeadingMode["CIRCLE_POSITION"] = 0] = "CIRCLE_POSITION";
        HitCircle_HeadingMode[HitCircle_HeadingMode["CHARACTER_POSITION"] = 1] = "CHARACTER_POSITION";
        HitCircle_HeadingMode[HitCircle_HeadingMode["MANUAL"] = 2] = "MANUAL";
    })(Comps.HitCircle_HeadingMode || (Comps.HitCircle_HeadingMode = {}));
    var HitCircle_HeadingMode = Comps.HitCircle_HeadingMode;
    class HitCircle extends DrawerComponent {
        constructor() {
            super();
            this.teamTargeting = Team.ENEMIES;
            this.radius = 10;
            this.offsetX = 0;
            this.offsetY = 0;
            this.attackDelay = 0;
            this.attackDuration = 9999;
            this.headingMode = HitCircle_HeadingMode.CIRCLE_POSITION;
            this.manualHeading = 0;
            this.gizmoColor = "red";
            this.isAttackActive = () => {
                return this.attackDelay <= this._attackTime && this._attackTime <= this.attackDelay + this.attackDuration;
            };
            this.actionRef = null;
            this.onStart = () => {
                if (this.actionRef === null) {
                    console.warn("actionRef has not been specified for this HitCircle");
                }
            };
            this.onUpdate = () => {
                this._attackTime += Game.deltaTime;
                if (!this.isAttackActive())
                    return;
                let trans = this.transform;
                trans.localToGlobal(this.offsetX, this.offsetY, this.tempVec2);
                let cx = this.tempVec2.x;
                let cy = this.tempVec2.y;
                let r = this.radius;
                while (trans !== null) {
                    r *= (Math.abs(trans.scaleX) + Math.abs(trans.scaleY)) / 2;
                    trans = trans.getParent();
                }
                let thisHitCircle = this;
                let tempVec2 = this.tempVec2;
                let tempRect = this.tempRect;
                Actor.forEach(function (actor) {
                    if (!actor.isInTeam(thisHitCircle.teamTargeting))
                        return;
                    actor.getRect(tempRect);
                    if (M.circleRectangleIntersects(cx, cy, r, tempRect.x, tempRect.y, tempRect.width, tempRect.height)) {
                        let ai = AttackInfo.createNew();
                        ai.damage = thisHitCircle.actionRef.power;
                        switch (thisHitCircle.headingMode) {
                            case HitCircle_HeadingMode.CIRCLE_POSITION:
                                ai.knockbackHeading = Math.atan2(tempRect.y + tempRect.height / 2 - cy, tempRect.x + tempRect.width / 2 - cx) * M.radToDeg;
                                break;
                            case HitCircle_HeadingMode.CHARACTER_POSITION:
                                thisHitCircle.actionRef.character.transform.getGlobalPosition(tempVec2);
                                let charX = tempVec2.x;
                                let charY = thisHitCircle.actionRef.character.getFoot();
                                ai.knockbackHeading = Math.atan2(tempRect.y + tempRect.height / 2 - charY, tempRect.x + tempRect.width / 2 - charX) * M.radToDeg;
                                break;
                            case HitCircle_HeadingMode.MANUAL:
                                ai.knockbackHeading = thisHitCircle.manualHeading;
                                break;
                        }
                        actor.receiveDamage(ai);
                        AttackInfo.recycle(ai);
                    }
                });
            };
            this.onDestroy = () => { };
            this.draw = (context) => {
                if (!HitCircle.SHOW_GIZMO)
                    return;
                if (!this.isAttackActive())
                    return;
                context.beginPath();
                context.strokeStyle = this.gizmoColor;
                context.lineWidth = 1;
                context.arc(this.offsetX, this.offsetY, this.radius, 0, Math.PI * 2);
                context.stroke();
            };
            this._attackTime = 0;
            this.tempVec2 = new Vec2();
            this.tempRect = new Rect();
            this.name = "HitCircle";
            this.layer = DrawLayer.GIZMO;
        }
    }
    HitCircle.SHOW_GIZMO = true;
    Comps.HitCircle = HitCircle;
})(Comps || (Comps = {}));
var Comps;
(function (Comps) {
    class MovePlatformWithIJKL extends Component {
        constructor() {
            super();
            this.speed = 40;
            this.onStart = () => {
                this.platform = this.getComponent(Platform);
            };
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
            this.onDestroy = () => { };
            this.name = "MovePlatformWithIJKL";
            this.componentProperties.requireComponent(Platform);
        }
    }
    Comps.MovePlatformWithIJKL = MovePlatformWithIJKL;
})(Comps || (Comps = {}));
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
var Comps;
(function (Comps) {
    class TDActorShadow extends DrawerComponent {
        constructor() {
            super();
            this.color = "#2A2A2A66";
            this.offsetX = 0;
            this.offsetY = 0;
            this.radiusX = 10;
            this.radiusY = 5;
            this.setSize = (offsetX, offsetY, radiusX, radiusY) => {
                this.offsetX = offsetX;
                this.offsetY = offsetY;
                this.radiusX = radiusX;
                this.radiusY = radiusY;
            };
            this.onStart = () => {
                this.tdActor = this.getComponent(Comps.TDActor);
            };
            this.onUpdate = () => { };
            this.draw = (context) => {
                let x = this.offsetX;
                let y = this.tdActor.offsetY + this.offsetY;
                let radiusX = this.radiusX;
                let radiusY = this.radiusY;
                context.fillStyle = this.color;
                context.beginPath();
                context.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
                context.fill();
            };
            this.onDestroy = () => {
                this.tdActor = null;
            };
            this.tdActor = null;
            this.name = "TDActorShadow";
            this.componentProperties.requireComponent(Comps.TDActor);
            this.order = -9999;
        }
    }
    Comps.TDActorShadow = TDActorShadow;
})(Comps || (Comps = {}));
var Comps;
(function (Comps) {
    class TDSpriteRenderer extends SpriteRenderer {
        constructor() {
            super();
            this.onStart = () => {
            };
            this.onUpdate = () => {
                this.onUpdateAnimation();
                if (this.tdActor === null) {
                    this.tdActor = this.getComponent(Comps.TDActor);
                }
                if (this.tdActor === null)
                    return;
                this.order = this.tdActor.getFoot();
            };
            this.onDestroy = () => {
                this.tdActor = null;
            };
            this.tdActor = null;
            this.name = "TDSpriteRenderer";
        }
    }
    Comps.TDSpriteRenderer = TDSpriteRenderer;
})(Comps || (Comps = {}));
var Comps;
(function (Comps) {
    class Template extends Component {
        constructor() {
            super();
            this.onStart = () => { };
            this.onUpdate = () => { };
            this.onDestroy = () => { };
            this.name = "";
        }
    }
    Comps.Template = Template;
})(Comps || (Comps = {}));
var Comps;
(function (Comps) {
    class TestCharacter extends Component {
        constructor() {
            super();
            this.onStart = () => {
                this.character = this.getComponent(Comps.Character);
                console.log("TestCharacter: Press 1 to walk to Hero");
            };
            this.onUpdate = () => {
                if (Keys.keyPressed(Key.Num1)) {
                    let hero = GameObject.findObject("Hero").getComponent(Comps.TDActor);
                    this.character.walkToTDActor(hero, Direction.RIGHT);
                }
            };
            this.onDestroy = () => { };
            this.character = null;
            this.name = "TestCharacter";
            this.componentProperties.requireComponent(Comps.Character);
        }
    }
    Comps.TestCharacter = TestCharacter;
})(Comps || (Comps = {}));
var Comps;
(function (Comps) {
    class TestRectOverlap extends Component {
        constructor() {
            super();
            this.onStart = () => {
                this.actor = this.getComponent(Actor);
            };
            this.actor = null;
            this.onUpdate = () => {
                let overlaps = [];
                let rect = this.actor.getRect();
                Collision.rectOverlapAllPlatformObjectsNonAlloc(overlaps, rect, this.actor.collisionMask);
                console.log(overlaps.length > 0);
            };
            this.onDestroy = () => { };
            this.name = "TestRectOverlap";
            this.componentProperties.requireComponent(Actor);
        }
    }
    Comps.TestRectOverlap = TestRectOverlap;
})(Comps || (Comps = {}));
var Comps;
(function (Comps) {
    class TestSound extends Component {
        constructor() {
            super();
            this.onStart = () => { };
            this.onUpdate = () => {
                if (Keys.keyPressed(Key.Num2)) {
                    let sn = "music/level_white";
                    if (AudioManager.isSoundPlaying(sn)) {
                        console.log("Sound already playing");
                    }
                    else {
                        console.log("Sound not playing yet");
                        AudioManager.playMusic(sn, .7, 1, true);
                    }
                }
                if (Keys.keyPressed(Key.Num3)) {
                    AudioManager.playSFX("sfx/boop1", .8);
                }
            };
            this.onDestroy = () => { };
            this.name = "TestSound";
        }
    }
    Comps.TestSound = TestSound;
})(Comps || (Comps = {}));
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
                this.transform.x += v.x * Game.deltaTime;
                this.transform.y += v.y * Game.deltaTime;
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
                this.transform.rotation += rv * Game.deltaTime;
                if (Keys.keyPressed(Key.Num1)) {
                    this.transform.scaleX *= 1.2;
                }
                if (Keys.keyPressed(Key.Num2)) {
                    this.transform.scaleX *= -1;
                }
                if (Keys.keyPressed(Key.Num3)) {
                    this.transform.scaleY *= .8;
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
                    if (Keys.keyPressed(Key.Dash)) {
                        let thing1 = GameObject.findObject("thing 1");
                        if (thing1 !== null) {
                            thing1.markForDestroy();
                        }
                    }
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
var Prefabs;
(function (Prefabs) {
    function Goblin(props) {
        let go = new GameObject();
        let tdsr = go.addComponent(Comps.TDSpriteRenderer);
        let character = go.addComponent(Comps.Character);
        character.animPrefix = "goblin";
        character.setBounds(0, 7, 6, 6);
        character.maxHealth = 10;
        character.team = Team.ENEMIES;
        character.setAction(0, Actions.ID.SWORD_SLASH);
        let actorGizmo = go.addComponent(ActorGizmo);
        let tdas = go.addComponent(Comps.TDActorShadow);
        tdas.setSize(0, 3, 6, 2);
        return go;
    }
    Prefabs.Goblin = Goblin;
    TiledMap.addObjectParser("Goblin", Goblin);
})(Prefabs || (Prefabs = {}));
var Prefabs;
(function (Prefabs) {
    function Hero(props) {
        let go = new GameObject();
        let tdsr = go.addComponent(Comps.TDSpriteRenderer);
        let character = go.addComponent(Comps.Character);
        character.animPrefix = "hero";
        character.setBounds(0, 6, 6, 6);
        character.maxHealth = 10;
        character.team = Team.PLAYERS;
        character.setAction(0, Actions.ID.SWORD_SLASH);
        character.enableInput();
        go.addComponent(Comps.CameraFollow);
        let tdas = go.addComponent(Comps.TDActorShadow);
        tdas.setSize(0, 4, 5, 2);
        return go;
    }
    Prefabs.Hero = Hero;
    TiledMap.addObjectParser("Hero", Hero);
})(Prefabs || (Prefabs = {}));
var Prefabs;
(function (Prefabs) {
    function Log(props) {
        let go = new GameObject();
        let tdsr = go.addComponent(Comps.TDSpriteRenderer);
        let character = go.addComponent(Comps.Character);
        character.animPrefix = "log";
        character.setBounds(0, 9, 6, 6);
        character.maxHealth = 10;
        character.team = Team.PLAYERS;
        character.setAction(0, Actions.ID.SWORD_SLASH);
        let testCharacter = go.addComponent(Comps.TestCharacter);
        let tdas = go.addComponent(Comps.TDActorShadow);
        tdas.setSize(0, 3, 6, 2);
        return go;
    }
    Prefabs.Log = Log;
    TiledMap.addObjectParser("Log", Log);
})(Prefabs || (Prefabs = {}));
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
        sr.playAnimation("sealime_leap", "sealime_idle");
        sr.order = 1.0;
        sr.tintColor = "blue";
        sr.tintAmount = .5;
        return go;
    }
    Prefabs.Sealime = Sealime;
    TiledMap.addObjectParser("Sealime", Sealime);
})(Prefabs || (Prefabs = {}));
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
                    mpo.detachActor(this.actor);
                }
            }
        };
        this.name = "AttachBottom";
        this.componentProperties.requireComponent(Actor);
    }
}
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
            this.transform.localToGlobal(this.origin.x, this.origin.y, this.globalOrigin);
            this.transform.localToGlobal(this.origin.x + this.direction.x, this.origin.y + this.direction.y, this.pt1);
            this.globalDirection.setValues(this.pt1.x - this.globalOrigin.x, this.pt1.y - this.globalOrigin.y);
            this.globalDirection.normalize();
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
var Prefabs;
(function (Prefabs) {
    function Thing2() {
        let go = new GameObject();
        let pir = go.addComponent(PackedImageRenderer);
        pir.setImageByName("sealime.png");
        pir.setImageRect(128, 0, 128, 64);
        pir.order = 1.1;
        let dg = go.addComponent(Comps.DotGraphic);
        dg.order = 999;
        let child = new GameObject();
        child.transform.setParent(go.transform);
        child.name = "pengrunt";
        let childPir = child.addComponent(PackedImageRenderer);
        childPir.setImageByName("pengrunt.png");
        childPir.setImageRect(0, 0, 64, 64);
        childPir.order = 1.0;
        childPir.imageSmoothingEnabled = false;
        childPir.tintColor = "#FF0000";
        childPir.tintAmount = .6;
        let thing2 = go.addComponent(Comps.Thing2);
        thing2.pir = pir;
        thing2.child = child;
        thing2.childPir = childPir;
        return go;
    }
    Prefabs.Thing2 = Thing2;
})(Prefabs || (Prefabs = {}));
//# sourceMappingURL=game.js.map
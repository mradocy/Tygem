/// <reference path="_ref.ts" />

class RaycastTestGizmo extends DrawerComponent {

    constructor() {
        super();
        this.name = "RaycastTestGizmo";
        this.layer = DrawLayer.GIZMO;
    }

    onStart = (): void => {
    }

    color: string = "red";

    origin: Vec2 = new Vec2();
    direction: Vec2 = new Vec2(1, 0);
    distance: number = Number.POSITIVE_INFINITY;

    setAngle = (angleDegrees: number): void => {
        this.direction.setValues(Math.cos(angleDegrees * M.degToRad), Math.sin(angleDegrees * M.degToRad));
    }
    getAngle = (): number => {
        return Math.atan2(this.direction.y, this.direction.x);
    }

    private globalOrigin: Vec2 = new Vec2();
    private pt1: Vec2 = new Vec2();
    private globalDirection: Vec2 = new Vec2();
    private identityMatrix: Matrix2x3 = new Matrix2x3();

    onUpdate = (): void => {

        this.transform.localToGlobal(this.origin.x, this.origin.y, this.globalOrigin);
        this.transform.localToGlobal(this.origin.x + this.direction.x, this.origin.y + this.direction.y, this.pt1);

        this.globalDirection.setValues(this.pt1.x - this.globalOrigin.x, this.pt1.y - this.globalOrigin.y);
        this.globalDirection.normalize();

        //Collision.raycastAllActorsNonAlloc(this.raycastHit, this.globalOrigin.x, this.globalOrigin.y, this.globalDirection.x, this.globalDirection.y, this.distance);
        Collision.raycastAllPlatformObjectsNonAlloc(this.raycastHit, this.globalOrigin.x, this.globalOrigin.y, this.globalDirection.x, this.globalDirection.y, this.distance);
        
    }

    private raycastHit: Collision.RaycastHit = new Collision.RaycastHit();

    draw = (context: CanvasRenderingContext2D): void => {

        Camera.setContextTransformFromMatrix(Matrix2x3.identity);

        let endX: number = this.globalOrigin.x;
        let endY: number = this.globalOrigin.y;

        if (this.raycastHit.hit) {

            endX = this.raycastHit.point.x;
            endY = this.raycastHit.point.y;

        } else {

            endX = this.globalOrigin.x + this.globalDirection.x * Math.min(this.distance, 2000);
            endY = this.globalOrigin.y + this.globalDirection.y * Math.min(this.distance, 2000);

        }

        context.beginPath();
        context.strokeStyle = this.color;
        context.lineWidth = 1;
        context.moveTo(this.globalOrigin.x, this.globalOrigin.y);
        context.lineTo(endX, endY);
        context.stroke();

        

    }

    protected actor: Actor = null;

}
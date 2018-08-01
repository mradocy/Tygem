/// <reference path="_ref.ts" />

class ActorGizmo extends DrawerComponent {

    constructor() {
        super();
        this.name = "ActorGizmo";
        this.componentProperties.only1 = true;
        this.componentProperties.requireComponent(Actor);
        this.layer = DrawLayer.GIZMO;
    }

    onStart = (): void => {
        this.actor = this.getComponent(Actor);
    }
    
    color: string = "cyan";

    draw = (context: CanvasRenderingContext2D): void => {

        if (this.actor === null) {
            console.error("ActorGizmo needs Actor as a sibling component");
            return;
        }

        context.beginPath();
        context.strokeStyle = this.color;
        context.lineWidth = 1;
        context.strokeRect(this.actor.offsetX - this.actor.halfWidth, this.actor.offsetY - this.actor.halfHeight, this.actor.halfWidth * 2, this.actor.halfHeight * 2);
        context.stroke();

    }

    protected actor: Actor = null;

}
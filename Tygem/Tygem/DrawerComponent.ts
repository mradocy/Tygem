/// <reference path="_ref.ts" />

/**
 * DrawerComponents are automatically added to and removed from Drawers.
 */
class DrawerComponent extends Component implements IDrawer {

    constructor() {
        super();
    }

    /**
     * Drawers are sorted by layer before being drawn.
     */
    layer: DrawLayer = DrawLayer.DEFAULT;

    /**
     * Drawers are sorted by this value (after Layer sorting) before being drawn.
     */
    order: number = 0;

    /**
     * If draw() should be called for this DrawComponent.  Is false if this component is disabled or the gameObject is marked for destroy.
     */
    isVisible = (): boolean => {
        return this.isActiveAndEnabled() && !this.gameObject.isMarkedForDestroy();
    }

    /**
     * When true, the position of the drawer when drawn will ignore the camera (e.g. UI elements).
     */
    anchored: boolean = false;

    /**
     * Draws to the given context.
     */
    draw = (context: CanvasRenderingContext2D): void => {

        // to be overridden

    }
    

}

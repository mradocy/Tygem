/// <reference path="_ref.ts" />

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
    transform: Transform;

    /**
     * Draws the IDrawer on the given context.
     * The transform of the context is set beforehand, depending on this IDrawer's transform and anchored properties.
     * context.save() is called beforehand and context.restore() is called afterwards.
     */
    draw(context: CanvasRenderingContext2D): void;

}

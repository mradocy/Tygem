/// <reference path="_ref.ts" />

/**
 * Sorting layer for IDrawer components.  Influences order in which IDrawers are drawn.
 */
enum DrawLayer {
    BG = 10,
    PLATFORMS = 20,
    DEFAULT = 50,
    FG = 60,
    GIZMO = 100,
    UI = 1000
}

namespace Drawers {
    
    /**
     * Adds IDrawer to list, letting it be drawn in drawAll().  Careful: DOES NOT CHECK if drawer already exists in the list.
     */
    export function _add(drawer: IDrawer): void {
        allDrawers.push(drawer);
    }
    /**
     * Removes IDrawer from list.
     */
    export function _remove(drawer: IDrawer): void {
        let index: number = allDrawers.indexOf(drawer);
        if (index === -1) return;
        allDrawers.splice(index, 1);
    }
    
    /**
     * To be called by Game in the game loop.  Sorts all the IDrawers, then draws them onto the Game context.
     */
    export function _drawAll(): void {

        let context: CanvasRenderingContext2D = Game.context;
        let m: Matrix2x3 = tempMatrix;

        sortDrawers();
        for (let i: number = 0; i < allDrawers.length; i++) {
            let dispObj: IDrawer = allDrawers[i];
            if (!dispObj.isVisible()) continue;

            m.setIdentity();

            context.save();

            if (dispObj.anchored) {
                if (dispObj.getTransform() == null) {
                    // identity transform
                    context.setTransform(1, 0, 0, 1, 0, 0);
                } else {
                    // transform of drawer without the camera
                    dispObj.getTransform().multiplyByGlobalMatrix(m);
                    context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
                }
            } else {
                if (dispObj.getTransform() == null) {
                    // transform of just the camera
                    Camera.setContextTransformFromMatrix(m);
                } else {
                    // transform of the camera and the drawer
                    Camera.setContextTransform(dispObj.getTransform());
                }
            }

            // draw object
            dispObj.draw(context);

            context.restore();

        }

    }

    let tempMatrix: Matrix2x3 = new Matrix2x3();

    /**
     * Sorts all the IDrawers based on their order.
     */
    function sortDrawers() {
        allDrawers.sort(
            (d1: IDrawer, d2: IDrawer): number => {
                let lComp: number = d1.layer - d2.layer;
                if (lComp === 0) return d1.order - d2.order;
                else return lComp;
            }
        );
    }

    let allDrawers: Array<IDrawer> = [];


}


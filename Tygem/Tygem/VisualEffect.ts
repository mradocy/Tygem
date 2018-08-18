/// <reference path="_ref.ts" />

/**
 * Destroys the gameObject once the animation of the SpriteRenderer component finishes
 */
class VisualEffect extends Component {

    constructor() {
        super();
        this.name = "VisualEffect";

        this.componentProperties.requireComponent(SpriteRenderer);
    }

    onStart = (): void => {
        this.spriteRenderer = this.getComponent(SpriteRenderer);
    }

    onUpdate = (): void => {
        if (this.spriteRenderer.isAtEndOfAnimation()) {
            this.gameObject.markForDestroy();
        }
    }
    
    onDestroy = (): void => {
        this.spriteRenderer = null;
    }

    private spriteRenderer: SpriteRenderer = null;

}


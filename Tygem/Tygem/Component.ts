/// <reference path="_ref.ts" />

/**
 * Messages received:
    
    // Called when the Component is added to a GameObject.
    onAwake = (): void => { }
    
    // Called once for a Component.  Either called when a scene finishes loading, or just before update().
    onStart = (): void => { }
    
    // called once per frame, during the update step.  Is not called if the component is disabled.
    onUpdate = (): void => { }

    // called once per frame, during the late update step (after collision handler update, but before drawing update)
    onLateUpdate = (): void => { }
    
    // called when the component is enabled.
    onEnable = (): void => { }
    
    // called when the component is disabled.
    onDisable = (): void => { }
    
    // called just before the component is destroyed.
    onDestroy = (): void => { }
    
*/

class ComponentProperties {
    /**
     * When true, there can only be 1 of this component on a GameObject.
     */
    only1: boolean = false;
    /**
     * Adds a Component constructor to the list of components that are required to be added before adding this one.
     */
    requireComponent = <T extends Component>(c: new () => T): void => {
        this._requireComponents.push(c);
    }
    /**
     * Adds a Component constructor to the list of components that are required to NOT be added when adding this one.
     */
    excludeComponent = <T extends Component>(c: new () => T): void => {
        this._excludeComponents.push(c);
    }
    
    _requireComponents: Array<any> = [];
    _excludeComponents: Array<any> = [];

}

class Component {

    constructor() { }

    /**
     * Name of the component.  Used for debugging.
     */
    name: string = "";

    /**
     * The GameObject this Component belongs to.  Please don't change.
     */
    gameObject: GameObject = null;

    /**
     * Transform for the GameObject this Component is attached to.  Please don't change.
     */
    transform: Transform = null;

    /**
     * Gets if this component is enabled.  Only active and enabled components receive calls to update() every frame.
     */
    isEnabled = (): boolean => {
        return this._enabled;
    }
    /**
     * Gets if this component's gameObject is active and this component is enabled.  Only active and enabled components receive calls to update() every frame.
     */
    isActiveAndEnabled = (): boolean => {
        return this._enabled && this.gameObject.isActive();
    }

    /**
     * Gets if onStarted() has been called yet for the component.
     */
    isStarted = (): boolean => {
        return this._started;
    }

    getComponentProperties = (): ComponentProperties => {
        return this.componentProperties;
    }

    /**
     * Enables this component, calling onEnable() if defined.
     */
    enable = (): void => {
        if (this._enabled) return;
        this._enabled = true;
        if ((this as any).onEnable != undefined) {
            (this as any).onEnable();
        }
    }
    /**
     * Disables this component, calling onDisable() if defined.
     */
    disable = (): void => {
        if (!this._enabled) return;
        this._enabled = false;
        if ((this as any).onDisable != undefined) {
            (this as any).onDisable();
        }
    }
    
    /**
     * Gets a component of or derived from the given type from this component's gameObject, or returns null if it doesn't exist.
     */
    getComponent = <T extends Component>(c: new () => T): T => {
        return this.gameObject.getComponent(c);
    }

    /**
     * Gets an array of all components of or derived from the given type from this component's gameObject.
     */
    getComponents = <T extends Component>(c: new () => T): T[] => {
        return this.gameObject.getComponents(c);
    }

    /**
     * Returns a string describing the component.
     */
    toString = (): string => {
        return "Component " + this.name + " started: " + this.isStarted() + " enabled: " + this.isEnabled();
    }

    protected componentProperties: ComponentProperties = new ComponentProperties();

    private _enabled: boolean = true;
    private _started: boolean = false;
    
    /**
     * Starts the given component (if it's unstarted) and marks it as started.
     */
    static _startUnstarted(component: Component): void {
        if (component._started) return;
        component._started = true;
        if ((component as any).onStart != undefined) {
            (component as any).onStart();
        }
    }
    
}

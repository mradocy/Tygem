/// <reference path="_ref.ts" />


class GameObject {

    /**
     * GameObject constructor.
     */
    constructor() {

        this.transform.gameObject = this;

        // set instance ID
        this._instanceID = GameObject.instanceIDCounter;
        GameObject.instanceIDCounter++;

        // set scene ID to the ID of the current scene
        if (Scene.currentScene === null) {
            this._sceneID = -1;
        } else {
            this._sceneID = Scene.idFromSceneName(Scene.currentScene);
        }

        // adds GameObject to list
        GameObject.allGameObjects.push(this);
    }


    // Properties

    /**
     * Name of this GameObject.  Used in functions that search for gameObjects by name.
     */
    name: string = "";

    /**
     * Gets instance ID for this GameObject.  Guaranteed to be unique for every GameObject.
     */
    getInstanceID = (): number => {
        return this._instanceID;
    }

    /**
     * Gets scene ID for this GameObject.  This is the ID of the scene last loaded when this GameObject was created.
     * When the scene is unloaded, this GameObject will be destroyed, unless it's marked to not be destroyed on unload.
     */
    getSceneID = (): number => {
        return this._sceneID;
    }
    
    /**
     * Transform for this GameObject.  Please don't change.
     */
    transform: Transform = new Transform();

    /**
     * When true, this object will be deleted at the end of the frame.
     */
    isMarkedForDestroy = (): boolean => {
        return this._markedForDestroy;
    }

    /**
     * When true, this object will not be destroyed when the scene it comes from unloads.
     */
    isDontDestroyOnUnload = (): boolean => {
        return this._dontDestroyOnUnload;
    }

    /**
     * Sets the local active state of this GameObject (isActiveSelf).
     */
    setActive = (active: boolean): void => {
        this._activeSelf = active;
    }
    /**
     * If this and every parent above it is active.
     */
    isActive = (): boolean => {
        let trans: Transform = this.transform;
        while (trans !== null) {
            if (!trans.gameObject.isActiveSelf())
                return false;
            trans = trans.getParent();
        }
        return true;
    }
    /**
     * The local active state of this GameObject.  This GameObject still isn't active if a parent is inactive however.
     */
    isActiveSelf = (): boolean => {
        return this._activeSelf;
    }
    


    // Functions

    /**
     * Adds a Component of the given type.
     */
    addComponent = <T extends Component>(c: new () => T): T => {
        let component: T = new c();
        if (component == null)
            return null;

        let compProps: ComponentProperties = component.getComponentProperties();

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
        for (let i: number = 0; i < compProps._requireComponents.length; i++) {
            if (this.getComponent(compProps._requireComponents[i]) === null) {
                console.error("Component " + component.name + " requires component " +
                    (new compProps._requireComponents[i]()).name +
                    " to be added already.");
                return;
            }
        }

        // check excludeComponents        
        for (let i: number = 0; i < compProps._excludeComponents.length; i++) {
            if (this.getComponent(compProps._excludeComponents[i]) !== null) {
                console.error("Component " + component.name + " requires component " +
                    (new compProps._excludeComponents[i]()).name +
                    " to not already be added.");
                return;
            }
        }
        
        // make component part of this gameObject
        component.gameObject = this;
        component.transform = this.transform;
        this.components.push(component);
        
        // add DrawerComponent to Drawers
        if (component instanceof DrawerComponent) {
            Drawers._add(component as any);
        }
        
        // call onAwake()
        if ((component as any).onAwake != undefined) {
            (component as any).onAwake();
        }

        return component;
    }

    /**
     * Gets a component of or derived from the given type from this gameObject, or returns null if it doesn't exist.
     */
    getComponent = <T extends Component>(c: new () => T): T => {

        let component: Component;
        for (let i: number = 0; i < this.components.length; i++) {
            component = this.components[i];
            if (component instanceof c) {
                return component as T;
            }

        }

        return null;
    }

    /**
     * Gets an array of all components of or derived from the given type from this gameObject.
     */
    getComponents = <T extends Component>(c: new () => T): T[] => {

        let ret: Array<T> = [];

        let component: Component;
        for (let i: number = 0; i < this.components.length; i++) {
            component = this.components[i];
            if (component instanceof c) {
                ret.push(component);
            }

        }

        return ret;
    }

    /**
     * Gets an array of all components in children of or derived from the given type from this gameObject.
     */
    getComponentsInChildren = <T extends Component>(c: new () => T): T[] => {

        let ret: Array<T> = [];
        let children: Array<Transform> = this.transform.getChildren();
        children.forEach(
            function (child: Transform): void {
                let childComps: Array<T> = child.gameObject.getComponentsAndInChildren(c); // using helper function
                for (let i: number = 0; i < childComps.length; i++) {
                    ret.push(childComps[i]);
                }
            }
        );

        return ret;
    }


    // (note: Components are automatically destroyed when the GameObject is destroyed.  There is currently no way to destroy a Component manually)

    /**
     * Marks object to be destroyed at the end of the frame.  Children will be recursively marked for destroy as well.  Won't do anything if already marked for destroy.
     */
    markForDestroy = (): void => {
        if (this._markedForDestroy) return;
        this._markedForDestroy = true;
        GameObject.gameObjectsMarkedForDestroy.push(this);

        // mark children for destroy too
        this.transform.getChildren().forEach(
            function (transform: Transform): void {
                if (transform.gameObject != null) {
                    transform.gameObject.markForDestroy();
                }
            }
        );

    }

    /**
     * Marks object to not be destroyed when the scene it comes from unloads.  Children will recursively be marked the same way.
     * Note this mark cannot be undone, and once this function is called this GameObject will need to be destroyed manually.
     */
    dontDestroyOnUnload = (): void => {
        if (this._dontDestroyOnUnload) return;
        this._dontDestroyOnUnload = true;

        // mark children to not be destroyed on unload too
        this.transform.getChildren().forEach(
            function (transform: Transform): void {
                if (transform.gameObject != null) {
                    transform.gameObject.dontDestroyOnUnload();
                }
            }
        );

    }
    
    /**
     * Calls a function (if the function exists) on every component in this GameObject.
     */
    sendMessage = (functionName: string, functionParam: any = undefined): void => {
        this.components.forEach(
            function (component: Component): void {
                if ((component as any)[functionName] != undefined) {
                    if (functionParam === undefined) {
                        (component as any)[functionName]();
                    } else {
                        (component as any)[functionName](functionParam);
                    }
                }
            }
        );
    }
    


    // Static functions for getting objects

    /**
     * Searches all gameObjects for a component of or derived from the given type, or returns null if it doesn't exist.
     */
    static findObjectOfType<T extends Component>(c: new () => T): T {

        let go: GameObject;
        let component: Component;

        for (let i: number = 0; i < GameObject.allGameObjects.length; i++) {
            go = GameObject.allGameObjects[i];
            for (let j: number = 0; j < go.components.length; j++) {
                component = go.components[j];
                if (component instanceof c) {
                    return component as T;
                }
            }
        }

        return null;
    }

    /**
     * Searches all gameObjects for components of or derived from the given type.
     */
    static findObjectsOfType<T extends Component>(c: new () => T): T[] {

        let ret: Array<T> = [];

        let go: GameObject;
        let component: Component;

        for (let i: number = 0; i < GameObject.allGameObjects.length; i++) {
            go = GameObject.allGameObjects[i];
            for (let j: number = 0; j < go.components.length; j++) {
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
    static findObject(name: string): GameObject {
        if (name == null) return null;
        if (name === "") return null;

        let go: GameObject;

        for (let i: number = 0; i < GameObject.allGameObjects.length; i++) {
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
    static _forEach(callbackFunction: (value: GameObject, index: number, array: GameObject[]) => void): void {
        GameObject.allGameObjects.forEach(callbackFunction);
    }
    
    /**
     * Calls onUpdate() on all the gameObjects.
     */
    static _updateAll(): void {
        GameObject._forEach(
            function (gameObject: GameObject, index: number, array: GameObject[]) {
                gameObject._update();
            }
        );
    }

    /**
     * Calls onLateUpdate() on all the gameObjects.
     */
    static _lateUpdateAll(): void {
        GameObject._forEach(
            function (gameObject: GameObject, index: number, array: GameObject[]) {
                gameObject._lateUpdate();
            }
        );
    }

    /**
     * Starts every unstarted component.  Called after a scene loads in.
     */
    static _startAllUnstartedComponents(): void {
        for (let i: number = 0; i < GameObject.allGameObjects.length; i++) {
            let go: GameObject = GameObject.allGameObjects[i];
            go.components.forEach(
                function (component: Component): void {
                    if (!component.isStarted()) {
                        Component._startUnstarted(component);
                    }
                }
            );
        }
    }

    /**
     * Destroys all GameObjects marked to be destroyed.  Should only be called by Game at the end of the frame.
     */
    static _destroyAllMarked(): void {

        for (let i: number = 0; i < GameObject.gameObjectsMarkedForDestroy.length; i++) {
            let GO = GameObject.gameObjectsMarkedForDestroy[i];

            GO.destroyImmediately();
        }
        GameObject.gameObjectsMarkedForDestroy.splice(0);

    }

    private _update = (): void => {

        // start all components that haven't been started yet
        for (let i: number = 0; i < this.components.length; i++) {
            if (!this.components[i].isStarted()) {
                Component._startUnstarted(this.components[i]);
            }
        }

        // call onUpdate() for all components
        if (this.isActive()) {
            for (let i: number = 0; i < this.components.length; i++) {
                let component: Component = this.components[i];
                if (!component.isEnabled()) continue;
                if ((component as any).onUpdate != undefined) {
                    (component as any).onUpdate();
                }
            }
        }
        
    }

    private _lateUpdate = (): void => {

        // start all components that haven't been started yet
        for (let i: number = 0; i < this.components.length; i++) {
            if (!this.components[i].isStarted()) {
                Component._startUnstarted(this.components[i]);
            }
        }

        // call onLateUpdate() for all components
        if (this.isActive()) {
            for (let i: number = 0; i < this.components.length; i++) {
                let component: Component = this.components[i];
                if (!component.isEnabled()) continue;
                if ((component as any).onLateUpdate != undefined) {
                    (component as any).onLateUpdate();
                }
            }
        }

    }

    /**
     * Destroys an object immediately, removing it from the game object list.
     */
    private destroyImmediately = (): void => {
        
        if (this.transform != null) { // failsafe, transform should be defined

            // disconnect transform children
            let children: Array<Transform> = this.transform.getChildren();
            children.forEach(
                function (transform: Transform): void {
                    if (transform.gameObject != null) {
                        transform.gameObject.markForDestroy();
                    }
                    transform.setParent(null);
                }
            );

            // disconnect transform from parent
            this.transform.setParent(null);
        }

        // destroy components
        for (let i: number = 0; i < this.components.length; i++) {
            let component: Component = this.components[i];
            // remove DrawerComponent from Drawers
            if (component instanceof DrawerComponent) {
                Drawers._remove(component as any);
            }
            // call onDestroy()
            if ((component as any).onDestroy != undefined) {
                (component as any).onDestroy();
            }
            component.gameObject = null;
            component.transform = null;
        }
        this.components.splice(0);
        
        // remove from allGameObjects
        let index: number = GameObject.allGameObjects.indexOf(this);
        GameObject.allGameObjects.splice(index, 1);

        // null stuff
        this.transform = null;
        this.components = null;

    }

    
    /**
     * Helper function for getComponentsInChildren().
     */
    private getComponentsAndInChildren = <T extends Component>(c: new () => T): T[] => {

        let ret: Array<T> = this.getComponents(c);
        let children: Array<Transform> = this.transform.getChildren();
        children.forEach(
            function (child: Transform): void {
                let childComps: Array<T> = child.gameObject.getComponentsInChildren(c);
                for (let i: number = 0; i < childComps.length; i++) {
                    ret.push(childComps[i]);
                }
            }
        );

        return ret;
    }


    // Private properties
    
    private _instanceID: number = 0;
    private _sceneID: number = 0;
    private components: Array<Component> = [];
    private _markedForDestroy: boolean = false;
    private _dontDestroyOnUnload: boolean = false;
    private _activeSelf: boolean = true;

    private static instanceIDCounter: number = 0;
    private static allGameObjects: Array<GameObject> = [];
    private static gameObjectsMarkedForDestroy: Array<GameObject> = [];

}


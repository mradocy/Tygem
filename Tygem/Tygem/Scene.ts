/// <reference path="_ref.ts" />


class Scene {

    // Static - Adding Scenes

    /**
     * Adds a scene to the list of scenes.  Intended to be done before Game is created.
     * @param sceneName Name of the Scene.
     * @param scene The just created Scene.
     */
    static addScene(sceneName: string, scene: Scene): void {
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

    
    // Static - Scene Management

    /**
     * Gets the name of the current scene, i.e. the scene last loaded.  Is "" when no scene is currently loaded.
     */
    static get currentScene(): string {
        if (Scene.loadedScenes.length === 0)
            return null;

        return Scene.loadedScenes[Scene.loadedScenes.length - 1].getName();
    }
    
    /**
     * Get a list of all the scenes currently loaded.  The last element in the list is the current scene.
     */
    static getLoadedScenes(): Array<string> {
        let ret: Array<string> = [];
        for (let i: number = 0; i < Scene.loadedScenes.length; i++) {
            ret.push(Scene.loadedScenes[i].getName());
        }
        return ret;
    }
    
    /**
     * Unloads all scenes currently loaded, then loads the given scene.  Scene is loaded at the beginning of next frame.
     * @param scene The scene to load.
     */
    static loadScene(sceneName: string): void {

        Scene.unloadAllScenes();

        // prevent other scenes from loading
        if (Scene.scenesToLoad.length !== 0) {
            Scene.scenesToLoad.splice(0);
        }

        Scene.loadAdditionalScene(sceneName);
    }

    /**
     * Loads a scene without unloading any first.  Scene is loaded at the beginning of next frame.  If Scene is already loaded at that time, it will not be loaded again.
     * @param scene The scene to load.
     */
    static loadAdditionalScene(sceneName: string): void {
        let scene: Scene = Scene._sceneFromName(sceneName);
        if (scene == null) return;

        if (Scene.scenesToLoad.indexOf(scene) !== -1) {
            console.warn("Scene \"" + sceneName + "\" will not be loaded because it is already being loaded.");
            return;
        }

        Scene.scenesToLoad.push(scene);
    }

    /**
     * Unloads the given scene.  Does nothing if the given scene is not currently loaded.
     * Scene will be unloaded at the end of the frame.
     * @param scene The scene to unload.  Leave as "" to unload the current scene.
     */
    static unloadScene(sceneName: string = ""): void {
        let name: string = sceneName;
        if (sceneName == null || sceneName == "") {
            name = Scene.currentScene;
            if (name == "")
                return;
        }
        let scene: Scene = Scene._sceneFromName(name);
        if (scene == null) return;

        let index: number = Scene.loadedScenes.indexOf(scene);
        if (index === -1) return;

        if (Scene.scenesToUnload.indexOf(scene) != -1) return;

        Scene.scenesToUnload.push(scene);
    }

    /**
     * Unloads all currently loaded scenes.
     * Scenes will be unloaded at the end of the frame.
     */
    static unloadAllScenes(): void {
        let scene: Scene;
        for (let i: number = 0; i < Scene.loadedScenes.length; i++) {
            scene = Scene.loadedScenes[i];
            if (Scene.scenesToUnload.indexOf(scene) != -1) continue;
            Scene.scenesToUnload.push(scene);
        }
    }

    /**
     * Gets the unique ID of the scene with the given scene name.
     * @param sceneName Name of the scene.
     */
    static idFromSceneName(sceneName: string): number {
        let scene: Scene = Scene._sceneFromName(sceneName);
        if (scene === null)
            return -1;

        return scene.getID();
    }

    /**
     * Returns the Scene with the given name, or null if no scene with the name exists.
     */
    static sceneFromName(sceneName: string): Scene {
        if (sceneName == null || sceneName == "") return null;
        if (!Scene.sceneExists(name))
            return null;
        return Scene.dictionary[name];
    }

    /**
     * Gets the total number of scenes.
     */
    static get numScenes(): number {
        return Scene._numScenes;
    }

    /**
     * Returns a list of all scenes by name.
     * @param searchPrefix If given, limits results to names that start with this string.
     */
    static getAllScenes(searchPrefix: string = ""): Array<string> {

        let ret: Array<string> = [];
        for (let tag in Scene.dictionary) {
            if (searchPrefix == null || searchPrefix === "" ||
                tag.indexOf(searchPrefix) === 0)
                ret.push(tag);
        }
        ret.sort();
        return ret;
    }

    // Scene Properties

    /**
     * Gets ID for this Scene.  Each Scene is guaranteed to have a unique ID.
     */
    getID = (): number => {
        return this._id;
    }

    /**
     * Gets name of the scene.  This is the name that was set when the scene was added.
     */
    getName = (): string => {
        return this._name;
    }

    /**
        * Called when a scene is loaded.  Should be overridden to create the GameObjects in this scene.
        */
    onLoad = (): void => { }

    /**
     * Called when a scene is unloaded.  GameObjects loaded by the scene will be automatically destroyed, so there's no need to do that here.
     */
    onUnload = (): void => { }

    /**
     * Scene constructor.
     */
    constructor() {
        // give unique ID
        this._id = Scene.sceneIDCounter;
        Scene.sceneIDCounter++;
    }
        

    // Static - Called from Game

    /**
     * Load scenes that have been marked to be loaded.
     * Then starts all components that haven't been started yet.
     */
    static _loadScenesToLoad(): void {

        let scene: Scene;
        for (let i: number = 0; i < Scene.scenesToLoad.length; i++) {
            scene = Scene.scenesToLoad[i];

            if (Scene.loadedScenes.indexOf(scene) !== -1) {
                console.warn("Scene \"" + scene.getName() + "\" not loaded because it is already loaded.");
                continue;
            }

            // add scene to loaded scenes
            Scene.loadedScenes.push(scene);

            // call scene's onLoad() (which should load its GameObjects)
            scene.onLoad();

        }

        // clear list of scenes to load
        Scene.scenesToLoad.splice(0);

        // start components that haven't been started
        GameObject._startAllUnstartedComponents();
    }

    /**
     * Destroys all GameObjects in scenes that are marked to be unloaded.
     * Except for GameObjects where isDontDestroyOnUnload() is true.
     */
    static _destroyGameObjectsInScenesToUnload(): void {

        let scene: Scene;
        for (let i: number = 0; i < Scene.scenesToUnload.length; i++) {
            scene = Scene.scenesToUnload[i];

            GameObject._forEach(
                function (gameObject: GameObject): void {
                    if (!gameObject.isDontDestroyOnUnload() &&
                        gameObject.getSceneID() === scene.getID()) {
                        gameObject.markForDestroy();
                    }
                }
            );

        }

    }

    /**
     * Unloads all scenes in scenesToUnload.  Assumes all GameObjects from those scenes have been destroyed already.
     */
    static _unloadMarkedScenes(): void {

        let scene: Scene;
        for (let i: number = 0; i < Scene.scenesToUnload.length; i++) {
            scene = Scene.scenesToUnload[i];

            let loadedScenesIndex: number = Scene.loadedScenes.indexOf(scene);
            if (loadedScenesIndex === -1) {
                console.error("Trying to unload scene that hasn't been loaded.");
                continue;
            }
            
            // call scene's onUnload
            scene.onUnload();

            // remove scene from loaded scenes
            Scene.loadedScenes.splice(loadedScenesIndex, 1);
        }

        // clear list of scenes to unload
        Scene.scenesToUnload.splice(0);

    }


    // Private

    private _id: number = 0;
    private static sceneIDCounter: number = 0;
    private _name: string = "";

    private static dictionary: { [key: string]: Scene; } = {};
    private static _numScenes: number = 0; // counter goes up whenever a scene is added

    private static loadedScenes: Array<Scene> = [];

    private static scenesToUnload: Array<Scene> = [];
    private static scenesToLoad: Array<Scene> = [];


    private static sceneExists(name: string): boolean {
        if (name == null || name == "") return false;
        return Scene.dictionary.hasOwnProperty(name);
    }

    /**
     * Gets scene from name.  Prints an error to the console if no scene with the name exists.
     */
    private static _sceneFromName(name: string): Scene {
        if (!Scene.sceneExists(name)) {
            console.error("Scene \"" + name + "\" does not exist.");
            return null;
        }
        return Scene.dictionary[name];
    }


}


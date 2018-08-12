/// <reference path="_ref.ts" />


class Game {

    /**
     * Initializes Game and other classes.  Starts the game loop as well, and loads the scene defined by Game.preloadScene.
     * @param canvas Reference to the canvas defined in the html.
     */
    static initialize(canvas: HTMLCanvasElement): void {
        if (Game.initialized) {
            console.warn("Game already initialized");
            return;
        }
        Game.initialized = true;

        Game._canvas = canvas;
        Game._context = canvas.getContext("2d");
        
        // separate canvas for effects
        Game._effectsCanvas = document.createElement("canvas");
        Game._effectsCanvas.width = canvas.width;
        Game._effectsCanvas.height = canvas.height;
        Game._effectsContext = Game._effectsCanvas.getContext("2d");

        // create camera
        Camera._initialize(Game.context);

        // initialize Keys (input)
        Keys._initialize(document);

        // initialize Mouse (input)
        Mouse._initialize(canvas);

        // initialize Gamepad (input)
        Gamepads._initialize(window);

        // start gameloop
        Game.gameLoop();

        // user input requirements must be satisfied before the game is ready to be played
        if (!Game.userInputSatisfied) {
            Game.userInputAddEventListeners();
        }
        

        // start preload scene
        if (Game.preloadScene === "BasePreloadScene") {
            Scene.addScene("BasePreloadScene", new BasePreloadScene());
        } else if (Game.preloadScene == "") {
            console.error("Game.preloadScene must be defined.");
        }
        Scene.loadScene(Game.preloadScene);
        

        


    }
    

    // Canvas related

    /**
     * The canvas element used to display the game.
     */
    static get canvas(): HTMLCanvasElement {
        return Game._canvas;
    }

    /**
     * Object used for manipulating shapes and graphics on the canvas.
     */
    static get context(): CanvasRenderingContext2D {
        return Game._context;
    }
    
    /**
     * Hidden canvas used to help make effects.
     */
    static get effectsCanvas(): HTMLCanvasElement {
        return Game._effectsCanvas;
    }
    /**
     * Hidden context used to help make effects.
     */
    static get effectsContext(): CanvasRenderingContext2D {
        return Game._effectsContext;
    }



    // Fullscreen
    
    /**
     * If the window is currently in fullscreen mode.
     */
    static get isFullscreen(): boolean {
        let doc: any = document;
        if (doc.fullscreenElement ||
            doc.webkitFullscreenElement ||
            doc.mozFullScreenElement ||
            doc.msFullscreenElement)
            return true;
        return false;
    }

    /**
     * Requests the browser to go into fullscreen.  Must be called from user input.
     */
    static requestFullscreen(): void {
        
        let canvas: any = Game.canvas;
        if (canvas.requestFullscreen) {
            console.log("requestFullscreen");
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            console.log("webkitRequestFullscreen");
            canvas.webkitRequestFullscreen();
        } else if (canvas.mozRequestFullScreen) {
            console.log("mozRequestFullScreen");
            canvas.mozRequestFullScreen();
        } else if (canvas.msRequestFullscreen) {
            console.log("msRequestFullscreen");
            canvas.msRequestFullscreen();
        }
    }

    /**
     * Exits fullscreen.
     */
    static exitFullscreen(): void {
        let doc: any = document;
        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
            doc.msExitFullscreen();
        }
    }



    // Time related

    /**
     * max value unscaledDeltaTime can be.
     */
    static MAX_UNSCALED_DELTA_TIME: number = .1;
    
    /**
     * Time, in seconds, since the last frame.
     */
    static get unscaledDeltaTime(): number {
        return Game._unscaledDeltaTime;
    }

    /**
     * Scaled time, in seconds, since the last frame.
     */
    static get deltaTime(): number {
        return Game.unscaledDeltaTime * Game.timeScale;
    }

    /**
     * Time, in seconds, since window opened.  This is not affected by delta time.
     */
    static get realtimeSinceStartup(): number {
        return Game.timeStamp / 1000;
    }

    /**
     * value unscaledDeltaTime is multiplied by to get deltaTime.
     */
    static timeScale: number = 1;
        

    // Loading related

    /**
     * The first scene to run.  Should be a scene that just waits for assets to load.
     */
    static preloadScene: string = "BasePreloadScene";

    /**
     * The scene that should load after the game is finished preloading.  This should be defined before Game is initialized.
     */
    static startScene: string = "";
    
    /**
     * Gets percent of game assets loaded.  1 means fully loaded.
     * A fully loaded game does not necessarily mean the game is ready to play.  Use Game.gameReady() for that.
     */
    static get percentLoaded(): number {

        let thingsLoaded: number = TexPackManager.getNumTexPacksLoaded() + JSONManager.numJsonLoaded + AudioManager.getNumAudioSpritesReady();

        let things: number = TexPackManager.getNumTexPacks() + JSONManager.numJson + AudioManager.getNumAudioSprites();

        if (thingsLoaded >= things)
            return 1;

        return thingsLoaded / things;
    }

    /**
     * Gets if the user input requirement has been satisfied.  Sound won't play until user input is given, so it's best to wait until this is true for the game to start.
     */
    static get userInputSatisfied(): boolean {
        return AudioManager.isAudioContextRunning();
    }

    /**
     * If game is ready to be started (i.e. advance past preloader) with no problems.
     * Essentially this means the game is fully loaded and user input was given.
     */
    static get ready(): boolean {
        return Game.percentLoaded >= 1 && Game.userInputSatisfied;
    }


    // Private


    public static inGameLoop: boolean = false;

    /**
     * gameLoop that runs the game.
     */
    private static gameLoop(): void {

        Game.inGameLoop = true;

        // makes sure that gameLoop is called every time the game draws a new frame to the canvas
        requestAnimationFrame(Game.gameLoop);

        // clear canvas
        Game.context.fillStyle = "black";
        Game.context.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

        // update deltaTime
        let timeStamp: number = Game.timeStamp;
        Game._unscaledDeltaTime = Math.min((timeStamp - Game.lastTimeStamp) / 1000, Game.MAX_UNSCALED_DELTA_TIME);
        Game.lastTimeStamp = timeStamp;

        // poll gamepads
        Gamepads._earlyUpdate();
        
        // load scenes that are marked to be loaded
        Scene._loadScenesToLoad();

        
        // call update() on all GameObjects
        GameObject._updateAll();


        // moving Actors and collision resolution
        Collision.Handler._update();



        // (move camera here)
        

        // draw all Drawers
        Drawers._drawAll();
        
        // mark all GameObjects in scenes that are going to be unloaded to be destroyed
        Scene._destroyGameObjectsInScenesToUnload();
        
        // destroying all GameObjects marked for destroy
        GameObject._destroyAllMarked();

        // unload all scenes to be unloaded
        Scene._unloadMarkedScenes();
        

        // clearing records of buttons pressed
        Keys._lateUpdate();
        Mouse._lateUpdate();

        Game.inGameLoop = false;
    }

    /**
     * Gets the time passed (in milliseconds) since the window opened.
     */
    private static get timeStamp(): number {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

    // Private user input related

    private static userInputAddEventListeners(): void {
        window.addEventListener("mousedown", Game.userInputOnMouseDown);
        document.addEventListener("keydown", Game.userInputOnKeyDown);
    }
    private static userInputRemoveEventListeners(): void {
        window.removeEventListener("mousedown", Game.userInputOnMouseDown);
        document.removeEventListener("keydown", Game.userInputOnKeyDown);
    }
    private static userInputOnMouseDown(event: MouseEvent): void {
        Game.userInputOnInput();
    }
    private static userInputOnKeyDown(event: KeyboardEvent): void {
        Game.userInputOnInput();
    }
    private static userInputOnInput() {
        AudioManager.userInput(Game.userInputAudioContextRunningCallback);
        // wait for callback before confirming that user input was given
    }
    private static userInputAudioContextRunningCallback() {
        Game.userInputRemoveEventListeners();
    }
    private static _userInputSatisfied: boolean = false;

    private static initialized: boolean = false;

    private static _canvas: HTMLCanvasElement;
    private static _context: CanvasRenderingContext2D;
    private static _effectsCanvas: HTMLCanvasElement;
    private static _effectsContext: CanvasRenderingContext2D;

    private static lastTimeStamp: number = 0;
    private static _unscaledDeltaTime: number = 0;


}

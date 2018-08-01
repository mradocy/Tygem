/// <reference path="../app.ts" />

// master list of scenes being added to the game

/// <reference path="Scenes/Preload.ts" />
/// <reference path="Scenes/TestScene.ts" />
/// <reference path="Scenes/TestScene2.ts" />

Scene.addScene("Preload", new Scenes.Preload());
Scene.addScene("TestScene", new Scenes.TestScene());
Scene.addScene("TestScene2", new Scenes.TestScene2());

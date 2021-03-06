﻿/// <reference path="_ref.ts" />

/**
 * Contains debug functions intended to be called in the console window.
 */
namespace Debug {

    /**
     * List all sprites by name.
     * @param searchPrefix If given, limits results to names that start with this string.
     */
    export function listSprites(searchPrefix: string = ""): Array<string> {
        return TexPackManager.getAllPackedImages(searchPrefix);
    }

    /**
     * List all sounds by name.
     * @param searchPrefix If given, limits results to names that start with this string.
     */
    export function listSounds(searchPrefix: string = ""): Array<string> {
        return AudioManager.getAllSounds(searchPrefix);
    }

    /**
     * List all animations by name.
     * @param searchPrefix If given, limits results to names that start with this string.
     */
    export function listAnimations(searchPrefix: string = ""): Array<string> {
        return Animation.getAllAnimations(searchPrefix);
    }

    /**
     * List all scenes by name.
     * @param searchPrefix If given, limits results to names that start with this string.
     */
    export function listScenes(searchPrefix: string = ""): Array<string> {
        return Scene.getAllScenes(searchPrefix);
    }

    /**
     * Load the given scene at the end of the next frame.
     */
    export function loadScene(sceneName: string): void {
        Scene.loadScene(sceneName);
    }

    /**
     * Lists the names of the GameObject of all Actors in the scene
     */
    export function listActors(): Array<string> {
        let names: Array<string> = [];
        Actor.forEach(
            function (actor: Actor): void {
                names.push(actor.gameObject.name);
            }
        );
        return names;
    }
    
}
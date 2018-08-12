/// <reference path="_ref.ts" />

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

}
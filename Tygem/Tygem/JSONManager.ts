/// <reference path="_ref.ts" />


class JSONLoadObject {

    constructor() { }

    /**
     * Loads json from the given url.
     */
    loadFromUrl = (url: string, onLoad: ((json: any) => void) = null): void => {
        if (this.isLoaded()) {
            console.warn("JSON already loaded");
            return;
        }
        this._url = url;
        this._onLoadF = onLoad;
        this.request = new XMLHttpRequest();
        this.request.open("GET", url, true);
        this.request.onload = this.requestOnLoad;
        this.request.send();
    }

    /**
        * Loads (parses) json from the given string.
        */
    loadFromString = (jsonString: string): void => {
        if (this.isLoaded()) {
            console.warn("JSON already loaded");
            return;
        }
        this._json = JSON.parse(jsonString);
        this._loaded = true;
    }

    /**
        * Gets the JSON, or null if it hasn't loaded.
        */
    getJSON = (): any => {
        return this._json;
    }

    /**
        * Gets if the JSON is loaded.
        */
    isLoaded = (): boolean => {
        return this._loaded;
    }

    private _json: any = null;
    private _url: string = "";
    private _onLoadF: ((json: void) => void) = null;
    private _loaded: boolean = false;
    private request: XMLHttpRequest = null;

    private requestOnLoad = (): void => {

        if (this.request.status == 200) {

            this._loaded = true;
            this._json = JSON.parse(this.request.responseText);
            JSONManager._numJsonLoaded++;

            if (this._onLoadF !== null) {
                this._onLoadF(this._json);
            }

        } else {
            console.error("JSON \"" + this._url + "\" didn\'t load successfully; error code: " + this.request.status);
        }

    }

}

class JSONManager {

    /**
     * Loads a JSON from the given local url.
     * @param name Key of the json to use when getting it later.
     * @param localPath local url of the JSON.
     * @param onLoad function to call once the JSON has been loaded correctly.
     */
    static addFromUrl(name: string, localPath: string, onLoad: ((json: any) => void) = null): void {
        let n: string = name.toLowerCase();
        if (JSONManager.jsonExists(n)) {
            console.warn("JSON with name \"" + n + "\" already exists");
            return;
        }

        let jlo: JSONLoadObject = new JSONLoadObject();
        JSONManager.dictionary[n] = jlo;
        JSONManager._numJson++;
        
        jlo.loadFromUrl(localPath, onLoad);
    }

    /**
     * Loads (parses) a JSON from the given string.
     */
    static addFromString(name: string, jsonString: string): void {
        let n: string = name.toLowerCase();
        if (JSONManager.jsonExists(n)) {
            console.warn("JSON with name \"" + n + "\" already exists");
            return;
        }

        let jlo: JSONLoadObject = new JSONLoadObject();
        JSONManager.dictionary[n] = jlo;
        JSONManager._numJson++;

        jlo.loadFromString(jsonString);
    }

    /**
        * Gets if the JSON by the given name has been loaded.
        */
    static getJsonLoaded(name: string): boolean {
        let n: string = name.toLowerCase();
        if (!JSONManager.jsonExists(n)) {
            console.warn("There doesn't exist json with the name \"" + n + "\"");
            return false;
        }
        return JSONManager.dictionary[n].isLoaded();
    }

    /**
        * Gets the JSON with the given name.  Returns null if it doesn't exist or hasn't been loaded.
        * @param name
        */
    static getJson(name: string): any {
        let n: string = name.toLowerCase();
        if (!JSONManager.jsonExists(n)) {
            console.warn("There doesn't exist json with the name \"" + n + "\"");
            return null;
        }
        let jlo: JSONLoadObject = JSONManager.dictionary[n];
        if (!jlo.isLoaded()) {
            console.warn("JSON with the name \"" + n + "\" hasn't been loaded yet.");
            return null;
        }
        return jlo.getJSON();
    }

    /**
     * Returns if there exists in the dictionary a JSON with the given name.
     */
    static jsonExists(name: string): boolean {
        return JSONManager.dictionary.hasOwnProperty(name.toLowerCase());
    }

    /**
        * Gets the number of JSON loaded.
        */
    static get numJsonLoaded(): number {
        return JSONManager._numJsonLoaded;
    }

    /**
        * Gets the number of JSON.
        */
    static get numJson(): number {
        return JSONManager._numJson;
    }

    private static dictionary: { [key: string]: JSONLoadObject; } = {};

    static _numJsonLoaded: number = 0;
    private static _numJson: number = 0;

}

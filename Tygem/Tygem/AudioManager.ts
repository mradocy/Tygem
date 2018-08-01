/// <reference path="_ref.ts" />

namespace AudioManager {

    // Adding Sounds

    /**
     * Loads audio sprites from the json of the given url.  This can only be called once (the json should point to all the audio sprites).
     * @param jsonUrl url pointing to the json mapping the audiosprites.
     */
    export function addAudioSprites(jsonUrl: string): void {

        if (JSONManager.jsonExists(jsonUrl)) {
            console.warn("audio sprites " + jsonUrl.toLowerCase() + " already added");
            return;
        }

        if (_addAudioSpritesCalled) {
            console.warn("AudioManager.addAudioSprites() should only be called once.");
            return;
        }
        _addAudioSpritesCalled = true;
        _waitForJsonLoad = true;

        JSONManager.addFromUrl(
            jsonNameFromURL(jsonUrl),
            jsonUrl,
            onJSONLoad);
        
    }
    
    

    // Playing sounds
    
    /**
     * Play a sound in the SFX sound channel.
     * @param soundFileName The path of the sound before it was packed into the audio sprite.  The .wav extension is optional.
     * @param volume Volume of the sound.  Default is 1.
     * @param pitch Pitch of the sound (playback rate).  Default is 1.
     * @param bypassGeneral Bypass the general SFX channel (affected by general sfx volume) and instead have the sound feed directly into the master SFX channel.  Default is false.
     */
    export function playSFX(soundFileName: string, volume: number = 1, pitch: number = 1, bypassGeneral: boolean = false): void {

        let sourceNode: AudioSpriteSourceNode = createSourceNode(soundFileName);
        if (sourceNode === null) return;

        // setting pitch
        sourceNode.playbackRate.value = pitch;

        // adding a gain node if volume is specified
        let node: AudioNode = sourceNode;
        if (volume !== 1) {
            let gainNode: GainNode = _audioContext.createGain();
            gainNode.gain.value = volume;
            node.connect(gainNode);
            node = gainNode;
        }
        
        // connecting to the main node
        if (bypassGeneral) {
            connectToMasterSFXNode(node);
        } else {
            connectToGeneralSFXNode(node);
        }

        // playing sound
        sourceNode.play();
    }

    /**
     * Play sound in the music channel.  Does not stop music currently playing.
     * @param soundFileName The path of the sound before it was packed into the audio sprite.  The .wav extension is optional.
     * @param volume Volume of the sound.  Default is 1.
     * @param pitch Pitch of the sound (playback rate).  Default is 1.
     * @param loop If the sound should be looped.  Default is true.
     * @param loopOffset If looping, this is how long in seconds after the start of the sound it loops back to.  Default is 0.
     * @param bypassGeneral Bypass the general music channel (affected by general music volume) and instead have the sound feed directly into the master music channel.  Default is false.
     */
    export function playMusic(soundFileName: string, volume: number = 1, pitch: number = 1,
        loop: boolean = true, loopOffset: number = 0,
        bypassGeneral: boolean = false): void {

        let sourceNode: AudioSpriteSourceNode = createSourceNode(soundFileName);
        if (sourceNode === null) return;

        // setting pitch
        sourceNode.playbackRate.value = pitch;

        // adding a gain node if volume is specified
        let node: AudioNode = sourceNode;
        if (volume !== 1) {
            let gainNode: GainNode = _audioContext.createGain();
            gainNode.gain.value = volume;
            node.connect(gainNode);
            node = gainNode;
        }
        
        // looping
        if (loop) {
            sourceNode.loop = true;
            sourceNode.loopStart = sourceNode.startTime + loopOffset;
        } else {
            sourceNode.loop = false;
        }

        // connecting to the main node
        if (bypassGeneral) {
            connectToMusicNode(node);
        } else {
            connectToGeneralMusicNode(node);
        }

        // playing sound
        sourceNode.play();        
    }

    /**
     * Searches all AudioSpriteSourceNodes to see if there's a node that's playing the given sound.
     * NOTE: Annoyingly calling start() on a node doesn't leave a record of the node playing.  To get around this, never call start(), and instead call play().  The playSFX() and playMusic() functions do this automatically.
     */
    export function isSoundPlaying(soundFileName: string): boolean {
        let sound: Sound = getSound(soundFileName);
        if (sound === null) {
            console.error("Sound \"" + soundFileName.toLowerCase() + "\" does not exist.");
            return null;
        }

        for (let i: number = 0; i < sourceNodes.length; i++) {
            if (sourceNodes[i].fileName === sound.fileName && sourceNodes[i]._playCalled) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Stops all AudioSpriteSourceNodes that are playing the given sound.
     */
    export function stopSound(soundFileName: string): void {

        let sound: Sound = getSound(soundFileName);
        if (sound === null) {
            console.error("Sound \"" + soundFileName.toLowerCase() + "\" does not exist.");
            return null;
        }

        for (let i: number = 0; i < sourceNodes.length; i++) {
            if (sourceNodes[i].fileName === sound.fileName) {
                sourceNodes[i].stop(0);
            }
        }
    }
    /**
     * Stops all created AudioSpriteSourceNodes.
     */
    export function stopAllSounds(): void {

        let tempNodes: Array<AudioSpriteSourceNode> = sourceNodes.concat([]);
        tempNodes.forEach((node: AudioSpriteSourceNode): void => {
            node.stop();
        });
    }
    
    /**
     * Gets the volume of the gain node that all sound effects pass through.  This is a setting that'd be in an options menu.
     */
    export function getMasterSFXVolume(): number {
        return masterSFXGain.gain.value;
    }
    /**
     * Sets the volume of the gain node that all sound effects pass through.  This is a setting that'd be in an options menu.
     */
    export function setMasterSFXVolume(volume: number): void {
        masterSFXGain.gain.value = volume;
    }

    /**
     * Gets the volume of the gain node that general sound effects pass through.  This would be set in-game as part of gameplay.
     */
    export function getGeneralSFXVolume(): number {
        return generalSFXGain.gain.value;
    }
    /**
     * Sets the volume of the gain node that general sound effects pass through.  This would be set in-game as part of gameplay.
     */
    export function setGeneralSFXVolume(volume: number): void {
        generalSFXGain.gain.value = volume;
    }

    /**
     * Gets the volume of the gain node that general music passes through.  This would be set in-game as part of gameplay (e.g. fading in/out).
     */
    export function getGeneralMusicVolume(): number {
        return generalMusicGain.gain.value;
    }
    /**
     * Sets the volume of the gain node that general music passes through.  This would be set in-game as part of gameplay (e.g. fading in/out).
     */
    export function setGeneralMusicVolume(volume: number): void {
        generalMusicGain.gain.value = volume;
    }

    /**
     * Gets the volume of the gain node that all music passes through.  This is a setting that'd be in an options menu.
     */
    export function getMasterMusicVolume(): number {
        return masterMusicGain.gain.value;
    }
    /**
     * Sets the volume of the gain node that all music passes through.  This is a setting that'd be in an options menu.
     */
    export function setMasterMusicVolume(volume: number): void {
        masterMusicGain.gain.value = volume;
    }

    /**
     * Gets the duration of the given sound.
     * @param fileName The path of the sound before it was packed into the audio sprite.  The .wav extension is optional.
     */
    export function getSoundDuration(fileName: string): number {
        let sound: Sound = getSound(fileName);
        if (sound === null) {
            console.error("Sound \"" + fileName + "\" does not exist.");
            return 0;
        }
        return soundDictionary[fileName].duration;
    }
    

    // Playing sounds (advanced)

    /**
     * Extension of AudioBufferSourceNode with a few extra properties.
     */
    export class AudioSpriteSourceNode extends AudioBufferSourceNode {
        /**
         * The path of the sound before it was packed into the audio sprite.
         */
        fileName: string;
        /**
         * Time of the AudioSprite buffer to start playing.
         */
        startTime: number;
        /**
         * How much of the AudioSprite buffer to play, in seconds.
         */
        duration: number;
        /**
         * Simpler version of start() that automatically uses the correct variables.
         */
        play = (): void => {
            this._playCalled = true;
            if (this.loop) this.start(0, this.startTime);
            else this.start(0, this.startTime, this.duration);
        }

        /**
         * Flag if play() was called.
         */
        _playCalled: boolean = false;
    }
    
    /**
     * Creates an AudioBufferSourceNode for the given sound.  The node is not connected to anything.
     * Source nodes can only be played once and are "very inexpensive to create".
     * Automatically sets loopStart and loopEnd to the bounds of the sound within the audio sprite (but does not set loop).
     * Call sourceNode.play() to play the sound at the correct position.
     * IMPORTANT: Do not call sourceNode.start() manually.
     * Returns null if the sound doesn't exist.
     * @param soundFileName The path of the sound before it was packed into the audio sprite.  The .wav extension is optional.
     */
    export function createSourceNode(soundFileName: string): AudioSpriteSourceNode {

        let fn: string = soundFileName.toLowerCase();
        let sound: Sound = getSound(fn);
        if (sound === null) {
            console.error("Sound \"" + fn + "\" does not exist.");
            return null;
        }

        // this compiles, but sourceNode doesn't have properties that AudioSpriteSourceNode defines.
        let sourceNode: AudioSpriteSourceNode = (_audioContext.createBufferSource() as AudioSpriteSourceNode);
        sourceNode.fileName = sound.fileName;
        sourceNode.startTime = sound.startTime;
        sourceNode.duration = sound.duration;
        sourceNode._playCalled = false;
        sourceNode.play = (): void => {
            sourceNode._playCalled = true;
            if (sourceNode.loop) sourceNode.start(0, sourceNode.startTime);
            else sourceNode.start(0, sourceNode.startTime, sourceNode.duration);
        }; // this is so whack

        sourceNode.buffer = audioSprites[sound.audioSpriteIndex].getAudioBuffer();
        if (sourceNode.buffer === null) {
            console.error("Audio sprite " + sound.audioSpriteIndex + " isn't ready to be played yet.");
            return null;
        }
        sourceNode.loopStart = sound.startTime;
        sourceNode.loopEnd = sound.startTime + sound.duration;

        // add record of source node
        sourceNodes.push(sourceNode);
        sourceNode.addEventListener("ended", audioSourceNodeOnEnd);
        
        return sourceNode;
    }
    

    /**
     * Connects the given AudioNode to the general SFX node.  This lets the node be played, and volume multiplied by the general and master SFX volumes.
     */
    export function connectToGeneralSFXNode(audioNode: AudioNode): void {
        audioNode.connect(generalSFXGain);
    }
    /**
     * Connects the given AudioNode to the master SFX node.  This lets the node be played, and volume multiplied by the master SFX volume.
     */
    export function connectToMasterSFXNode(audioNode: AudioNode): void {
        audioNode.connect(masterSFXGain);
    }
    /**
     * Connects the given AudioNode to the general Mmusic node.  This lets the node be played, and volume multiplied by the general and master music volumes.
     */
    export function connectToGeneralMusicNode(audioNode: AudioNode): void {
        audioNode.connect(generalMusicGain);
    }
    /**
     * Connects the given AudioNode to the master music node.  This lets the node be played, and volume multiplied by the master music volume.
     */
    export function connectToMusicNode(audioNode: AudioNode): void {
        audioNode.connect(masterMusicGain);
    }
    

    // Instantiation

    /**
     * Gets number of audio sprites added.
     */
    export function getNumAudioSprites(): number {
        if (_waitForJsonLoad) { // expecting audio sprites once the json gets loaded
            return audioSprites.length + 1;
        }
        return audioSprites.length;
    }

    /**
     * Gets number of audio sprites currently ready to be played.
     */
    export function getNumAudioSpritesReady(): number {
        return _numAudioSpritesReady;
    }

    /**
     * To be called on user input to resume the AudioContext.  
     * @param onAudioContextRunCallback Function to be called once the AudioContext resumes, or called immediately if it's already running.
     */
    export function userInput(onAudioContextRunCallback: () => void) {
        
        // needs user input to get AudioContext running
        let acAny: any = (_audioContext as any);
        if (acAny.resume != undefined &&
            acAny.state === "suspended") {
            acAny.resume().then(onAudioContextRunCallback);
        } else if (acAny.state == undefined || acAny.state === "running") {
            onAudioContextRunCallback();
        }

    }

    /**
     * Gets if the audio context is running, which is needed to play sounds.
     * The audio context can only run if userInput() is called from an event function that was triggered by user input.
     */
    export function isAudioContextRunning(): boolean {

        let acAny: any = (_audioContext as any);
        if (acAny.state != undefined) {
            return acAny.state === "running";
        }
        return true;
    }
    
    /**
     * Directory containing the audio sprites and json file.
     * Capitalization matters when getting images in the web browser.
     */
    export const audioSpritesDirectory: string = "Assets/Audiosprites/";

    /**
     * Gets the AudioContext used to decode sound.
     */
    export function getAudioContext(): AudioContext {
        return _audioContext;
    }

    /**
     * Gets if the browser can play .ogg files.
     */
    export function canPlayOgg(): boolean {
        return dummyAudio.canPlayType("audio/ogg; codecs=\"vorbis\"") === "probably";
    }
    

    
    // Private


    function jsonNameFromURL(jsonURL: string): string {

        let index: number = Math.max(jsonURL.lastIndexOf("/"), jsonURL.lastIndexOf("\\"));
        let trimmedStr: string;
        if (index == -1) {
            trimmedStr = jsonURL;
        } else {
            trimmedStr = jsonURL.slice(index + 1);
        }
        index = trimmedStr.lastIndexOf(".");
        trimmedStr = trimmedStr.slice(0, index);

        return trimmedStr;
    }
    
    function onJSONLoad(json: any): void {

        _waitForJsonLoad = false;

        if (json == null) {
            console.error("Something went wrong with loading the audio sprite json.");
            return;
        }
        if (json.audioSprites == null) {
            console.error("The audioSprites field is null in the audio sprite json.");
            return;
        }

        // create audio sprites
        for (let i = 0; i < json.audioSprites.length; i++) {
            let sourceURL: string;
            if (canPlayOgg()) {
                sourceURL = json.audioSprites[i].ogg;
            } else {
                sourceURL = json.audioSprites[i].mp3;
            }

            if (sourceURL == undefined || sourceURL == "") {
                console.error("Something is wrong with the audioSprites of the audio sprite json.");
                continue;
            }

            sourceURL = audioSpritesDirectory + sourceURL;

            let audioSprite: AudioSprite = new AudioSprite(i, sourceURL);
            audioSprites.push(audioSprite);
        }
        
        // create sounds
        for (let i = 0; i < json.sounds.length; i++) {
            let soundJson: any = json.sounds[i];
            
            soundDictionary[soundJson.filename.toLowerCase()] = new Sound(
                soundJson.filename,
                soundJson.asIndex,
                soundJson.startTime,
                soundJson.duration
            );
        }
        
    }
    

    class AudioSprite {

        constructor(index: number, url: string) {
            this._index = index;
            this._url = url;

            // load audio
            this.request.open('GET', url, true);
            this.request.responseType = 'arraybuffer';
            this.request.onload = this.requestOnLoad;
            this.request.send();
        }

        /**
         * Gets index of this audio sprite.
         */
        getIndex = (): number => {
            return this._index;
        }

        /**
         * Gets source url of this audio sprite.
         */
        getUrl = (): string => {
            return this._url;
        }

        /**
         * If the audio has been loaded.
         */
        isLoaded = (): boolean => {
            return this._loaded;
        }

        /**
         * If the audio has been decoded.
         */
        isDecoded = (): boolean => {
            return this._decoded;
        }

        /**
         * If the audio is ready to be played.
         */
        isReady = (): boolean => {
            return this.isLoaded() && this.isDecoded();
        }

        /**
         * Gets the AudioBuffer for this audio sprite.  Returns null if the sound isn't ready.
         */
        getAudioBuffer = (): AudioBuffer => {
            return this.buffer;
        }
        


        private _index: number = 0;
        private _url: string = "";
        private buffer: AudioBuffer = null;
        private request: XMLHttpRequest = new XMLHttpRequest();

        private _loaded: boolean = false;
        private _decoded: boolean = false;


        private requestOnLoad = (): void => {

            if (this.request.status == 200) {

                this._loaded = true;
                
                _audioContext.decodeAudioData(this.request.response, this.decodeSuccess, this.decodeFailure);
                
            } else {
                console.error("Audio \"" + this._url + "\" didn\'t load successfully; error code:" + this.request.statusText);
            }

        }

        private decodeSuccess = (buffer: AudioBuffer): void => {
            if (this._decoded) return;

            this.buffer = buffer;
            this._decoded = true;
            _numAudioSpritesReady++;
        }

        private decodeFailure = (): void => {

            console.error("Error decoding audio data from \"" + this._url + "\"");

        }

    }

    class Sound {

        constructor(fileName: string, audioSpriteIndex: number, startTime: number, duration: number) {
            this.fileName = fileName;
            this.audioSpriteIndex = audioSpriteIndex;
            this.startTime = startTime;
            this.duration = duration;
        }

        fileName: string = "";
        audioSpriteIndex: number = 0;
        startTime: number = 0;
        duration: number = 0;

    }

    function getSound(soundFileName: string): Sound {
        let fn: string;
        let extIndex: number = soundFileName.lastIndexOf(".");
        if (extIndex === -1) {
            // add wav extension
            fn = (soundFileName + ".wav").toLowerCase();
        } else {
            fn = soundFileName.toLowerCase();
        }
        if (!soundDictionary.hasOwnProperty(fn)) {
            return null;
        }
        return soundDictionary[fn];
    }
    


    let _addAudioSpritesCalled: boolean = false;
    let _waitForJsonLoad: boolean = false; // used to fudge number of audio sprites so the game doesn't load without them being ready
    let _numAudioSpritesReady: number = 0;
    
    let _audioContext: AudioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();

    let masterSFXGain: GainNode = null;
    let masterMusicGain: GainNode = null;
    let generalSFXGain: GainNode = null;
    let generalMusicGain: GainNode = null;
    if (_audioContext == null) {
        console.error("AudioContext could not be created.  This browser does not support this game's audio.");
    } else {
        // setting up nodes to link sound through
        masterSFXGain = _audioContext.createGain();
        masterSFXGain.connect(_audioContext.destination);
        generalSFXGain = _audioContext.createGain();
        generalSFXGain.connect(masterSFXGain);
        masterMusicGain = _audioContext.createGain();
        masterMusicGain.connect(_audioContext.destination);
        generalMusicGain = _audioContext.createGain();
        generalMusicGain.connect(masterMusicGain);
    }
    
    let dummyAudio: HTMLAudioElement = new Audio(); // only used to check if the browser can play .ogg files or not.

    let audioSprites: Array<AudioSprite> = [];
    let soundDictionary: { [filename: string]: Sound; } = {};

    let sourceNodes: Array<AudioSpriteSourceNode> = []; // record of source nodes formed.  Are removed when the source nodes stop playing.
    function audioSourceNodeOnEnd(e: Event) { // removes from record of source nodes
        let sourceNode: AudioSpriteSourceNode = (e.target as AudioSpriteSourceNode);
        let index: number = sourceNodes.indexOf(sourceNode);
        if (index !== -1) {
            sourceNodes.splice(index, 1);
        }
        sourceNode.removeEventListener("ended", audioSourceNodeOnEnd);
    }


    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API

}
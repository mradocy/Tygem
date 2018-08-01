/// <reference path="_ref.ts" />

class SaveBox {

    /**
        * Gets a list of indexes of save files currently stored in localStorage.
        */
    static getSaveFileIndices(): Array<number> {
        let ret: Array<number> = [];
        if (localStorage == undefined) return ret;
        let key: string = "";
        let index: number = -1;
        for (let i: number = 0; i < localStorage.length; i++) {
            key = localStorage.key(i);
            index = key.indexOf(SaveBox.saveboxPrefix);
            if (index == -1) continue;
            index = Number(key.substring(index + SaveBox.saveboxPrefix.length));
            if (isNaN(index)) continue;
            ret.push(index);
        }
        return ret;
    }

    /**
        * Creates a new SaveBox with a fileIndex that doesn't match any other save file.  The created SaveBox is NOT saved to a file.
        */
    static createNewSaveBox(): SaveBox {
        let existingSaveFiles: Array<number> = SaveBox.getSaveFileIndices();
        // find index that doesn't collide
        let fileIndex: number = existingSaveFiles.length;
        let collision: boolean = true;
        while (collision) {
            // check collisions
            collision = false;
            for (let i: number = 0; i < existingSaveFiles.length; i++) {
                if (existingSaveFiles[i] == fileIndex) {
                    collision = true;
                    break;
                }
            }
            if (collision) {
                fileIndex++;
            }
        }
        // create new SaveBox
        let saveBox: SaveBox = new SaveBox();
        saveBox.fileIndex = fileIndex;
        return saveBox;
    }

    /**
        * Creates a SaveBox loaded from localStorage with the given file index.  Returns null if there was a problem (e.g. if there's no file with the given index)
        */
    static openSaveBox(fileIndex: number): SaveBox {
        let saveBox: SaveBox = new SaveBox();
        saveBox.fileIndex = fileIndex;
        let status: boolean = saveBox.loadFromLocalStorage();
        if (!status) return null;
        return saveBox;
    }

    /**
        * Deletes the saveBox file with the given fileIndex from local storage.
        */
    static deleteSaveBox(fileIndex: number): void {
        if (localStorage == undefined) return;
        localStorage.removeItem(SaveBox.getLocalStorageKey(fileIndex));
    }
    
    /**
        * Gets the key used when saving a SaveBox with the given fileIndex to localStorage.
        */
    static getLocalStorageKey(fileIndex: number): string {
        return SaveBox.saveboxPrefix + fileIndex;
    }
    
    /**
        * Index used to differentiate multiple save files.
        */
    fileIndex: number = 0;
    
    /**
        * Sets a boolean value.
        */
    setBool = (key: string, value: boolean): void => {
        this.bools[key] = value;
    }

    /**
        * Gets a boolean value.
        * @param defaultValue If the given key doesn't exist, this value will be returned instead.
        */
    getBool = (key: string, defaultValue: boolean = false): boolean => {
        if (!this.bools.hasOwnProperty(key)) return defaultValue;
        return this.bools[key];
    }

    /**
        * Sets a number value.
        */
    setNumber = (key: string, value: number): void => {
        this.numbers[key] = value;
    }
    
    /**
        * Gets a number value.
        * @param defaultValue If the given key doesn't exist, this value will be returned instead.
        */
    getNumber = (key: string, defaultValue: number = 0): number => {
        if (!this.numbers.hasOwnProperty(key)) return defaultValue;
        return this.numbers[key];
    }

    /**
        * Sets a string value.
        */
    setString = (key: string, value: string): void => {
        this.strings[key] = value;
    }

    /**
        * Converts the given object to a JSON string, then saves it as a string.
        */
    setStringObject = (key: string, value: any): void => {
        this.strings[key] = JSON.stringify(value);
    }
    
    /**
        * Gets a string value.
        * @param defaultValue If the given key doesn't exist, this value will be returned instead.
        */
    getString = (key: string, defaultValue: string = ""): string => {
        if (!this.strings.hasOwnProperty(key)) return defaultValue;
        return this.strings[key];
    }

    /**
        * Gets a string value, parses it into a JSON object and returns it.
        * @param defaultValue If the given key doesn't exist, this value will be returned instead.
        */
    getStringObject = (key: string, defaultValue: any = undefined): any => {
        if (!this.strings.hasOwnProperty(key)) return defaultValue;
        return JSON.parse(this.strings[key]);
    }

    /**
        * Returns the value stored at the given index for the given bool list.  If the index is invalid, defaultValue is returned.
        */
    getBoolListElement = (key: string, index: number, defaultValue: boolean = false): boolean => {
        if (!this.boolLists.hasOwnProperty(key)) return defaultValue;
        let boolList: Array<boolean> = this.boolLists[key];
        if (index < 0 || index >= boolList.length) return defaultValue;
        return boolList[index];
    }

    /**
        * Returns a copy of the stored bool list.
        */
    getBoolListElements = (key: string, defaultValue: Array<boolean> = []): Array<boolean> => {
        if (!this.boolLists.hasOwnProperty(key)) return defaultValue;
        let boolList: Array<boolean> = this.boolLists[key];
        return boolList.concat([]);
    }

    /**
        * Returns count of the given bool list, or 0 if list does not exist.
        */
    getBoolListCount = (key: string): number => {
        if (!this.boolLists.hasOwnProperty(key)) return 0;
        return this.boolLists[key].length;
    }

    /**
        * Sets all elements of the bool list (clearing the elements that were there originally).
        */
    setBoolListElements = (key: string, values: Array<boolean>): void => {
        let boolList: Array<boolean> = null;
        if (this.boolLists.hasOwnProperty(key)) {
            boolList = this.boolLists[key];
        } else {
            boolList = [];
            this.boolLists[key] = boolList;
        }
        boolList.splice(0, boolList.length);
        for (let i: number = 0; i < values.length; i++) {
            boolList.push(values[i]);
        }
    }

    /**
        * Pushes the given element to the end of the specified bool list.  Automatically creates the list if it's not made already.
        */
    addBoolListElement = (key: string, value: boolean): void => {
        if (!this.boolLists.hasOwnProperty(key))
            this.boolLists[key] = [];
        this.boolLists[key].push(value);
    }

    /**
        * Returns the value stored at the given index for the given number list.  If the index is invalid, defaultValue is returned.
        */
    getNumberListElement = (key: string, index: number, defaultValue: number = 0): number => {
        if (!this.numberLists.hasOwnProperty(key)) return defaultValue;
        let numberList: Array<number> = this.numberLists[key];
        if (index < 0 || index >= numberList.length) return defaultValue;
        return numberList[index];
    }

    /**
        * Returns a copy of the stored number list.
        */
    getNumberListElements = (key: string, defaultValue: Array<number> = []): Array<number> => {
        if (!this.numberLists.hasOwnProperty(key)) return defaultValue;
        let numberList: Array<number> = this.numberLists[key];
        return numberList.concat([]);
    }

    /**
        * Returns count of the given number list, or 0 if list does not exist.
        */
    getNumberListCount = (key: string): number => {
        if (!this.numberLists.hasOwnProperty(key)) return 0;
        return this.numberLists[key].length;
    }

    /**
        *  Returns if the given value is contained in the given number list.
        */
    getNumberListContains = (key: string, value: number): boolean => {
        if (!this.numberLists.hasOwnProperty(key)) return false;
        return this.numberLists[key].indexOf(value) != -1;
    }

    /**
        * Sets all elements of the number list (clearing the elements that were there originally).
        */
    setNumberListElements = (key: string, values: Array<number>): void => {
        let numberList: Array<number> = null;
        if (this.numberLists.hasOwnProperty(key)) {
            numberList = this.numberLists[key];
        } else {
            numberList = [];
            this.numberLists[key] = numberList;
        }
        numberList.splice(0, numberList.length);
        for (let i: number = 0; i < values.length; i++) {
            numberList.push(values[i]);
        }
    }

    /**
        * Pushes the given element to the end of the specified number list.  Automatically creates the list if it's not made already.
        * @param ignoreIfDuplicate When set to true, first checks to see if the number is already in the list.  If it is, the number is not added again.  
        */
    addNumberListElement = (key: string, value: number, ignoreIfDuplicate: boolean = false): void => {
        if (ignoreIfDuplicate) {
            if (this.getNumberListContains(key, value))
                return;
        }
        if (!this.numberLists.hasOwnProperty(key))
            this.numberLists[key] = [];
        this.numberLists[key].push(value);
    }

    /**
        * Gets when this SaveBox was last saved (to a string or to localStorage).
        */
    getDateSaved = (): Date => {
        return new Date(this.dateSaved.getTime());
    }
    
    /**
        * Clears everything.
        */
    clearAll = (): void => {
        this.bools = {};
        this.numbers = {};
        this.strings = {};
        this.boolLists = {};
        this.numberLists = {};
    }


    /**
        * Returns this saveBox converted to a string.
        */
    saveToString = (): string => {
        
        // getto string builder
        let sb: Array<string> = [];

        // datetime saved (milliseconds since epoch)
        this.dateSaved = new Date();
        sb.push("" + this.dateSaved.getTime(), SaveBox.newLine);

        // bools
        sb.push(JSON.stringify(this.bools), SaveBox.newLine);

        // numbers
        sb.push(JSON.stringify(this.numbers), SaveBox.newLine);

        // strings
        sb.push(SaveBox.sourceToValid(JSON.stringify(this.strings)), SaveBox.newLine);

        // bool lists
        sb.push(JSON.stringify(this.boolLists), SaveBox.newLine);

        // number lists
        sb.push(JSON.stringify(this.numberLists), SaveBox.newLine);


        // get checksum of "string builder"
        let checksum = SaveBox.getChecksumFromArrStr(sb);

        // append checksum in front
        sb.unshift(checksum + SaveBox.newLine);


        return sb.join("");
    }

    /**
        * Loads data from the given string.  Returns false if there was a problem.
        */
    loadFromString = (str: string): boolean => {

        this.clearAll();

        // trim checksum
        let index: number = str.indexOf(SaveBox.newLine);
        if (index == -1) return false;
        let checksumStr: string = str.substring(0, index);
        let checksum: number = Number(checksumStr);
        if (isNaN(checksum)) return false;

        // get content
        let content: string = str.substring(index + 1);

        // check checksum of content
        if (checksum != SaveBox.getChecksumFromStr(content))
            return false;
        
        // parse content
        let lines: Array<string> = content.split(SaveBox.newLine);
        this.dateSaved = new Date(Number(lines[0]));
        this.bools = JSON.parse(lines[1]);
        this.numbers = JSON.parse(lines[2]);
        this.strings = JSON.parse(SaveBox.validToSource(lines[3]));
        this.boolLists = JSON.parse(lines[4]);
        this.numberLists = JSON.parse(lines[5]);

        return true;
    }

    /**
        * Converts this saveBox to a string, then sets it to getLocalStorageKey() in localStorage.  Returns false if there was a problem.
        */
    saveToLocalStorage = (): boolean => {
        if (localStorage === undefined)
            return false;
        localStorage.setItem(SaveBox.getLocalStorageKey(this.fileIndex), this.saveToString());
        return true;
    }

    /**
        * Loads a string of key getLocalStorageKey() from localStorage, then parses it into this saveBox.  Returns false if there was a problem.
        */
    loadFromLocalStorage = (): boolean => {
        if (localStorage === undefined)
            return false;
        let str: string = localStorage.getItem(SaveBox.getLocalStorageKey(this.fileIndex));
        if (str == null)
            return false;
        return this.loadFromString(str);
    }

    /**
        * Creates a copy of this saveBox and returns it.  This does NOT save the clone to a file.
        */
    clone = (newFileIndex: number): SaveBox => {
        let ret: SaveBox = new SaveBox();
        if (newFileIndex == this.fileIndex) {
            console.warn("fileIndex of clone is the same as the current file index");
        }
        ret.fileIndex = newFileIndex;
        ret.loadFromString(this.saveToString());
        return ret;
    }

    private static saveboxPrefix: string = "savebox";
    private static newLine: string = "|";
    private static separator1: string = "<";
    private static separator2: string = ">";

    /**
        * Sums up characters of the given "string builder"
        */
    private static getChecksumFromArrStr(sb: Array<string>): number {
        let ret: number = 0;
        for (let i: number = 0; i < sb.length; i++) {
            for (let j: number = 0; j < sb[i].length; j++) {
                ret += sb[i].charCodeAt(j);
            }
        }
        return ret;
    }
    private static getChecksumFromStr(str: string): number {
        let ret: number = 0;
        for (let i: number = 0; i < str.length; i++) {
            ret += str.charCodeAt(i);
        }
        return ret;
    }

    /**
        * Returns the given string with all invalid characters replaced with %x, making it valid.  If the string contains no invalid characters, nothing is changed.
        */
    private static sourceToValid(str: string): string {
        let s: string = SaveBox.replaceAll(str, "%", "%0");
        s = SaveBox.replaceAll(s, SaveBox.newLine, "%1");
        s = SaveBox.replaceAll(s, SaveBox.separator1, "%2");
        s = SaveBox.replaceAll(s, SaveBox.separator2, "%3");
        return s;
    }

    /**
        * Returns the given string with all %x sequences replaced with their invalid characters.
        */
    private static validToSource(str: string): string {
        let s: string = SaveBox.replaceAll(str, "%3", SaveBox.separator2);
        s = SaveBox.replaceAll(s, "%2", SaveBox.separator1);
        s = SaveBox.replaceAll(s, "%1", SaveBox.newLine);
        s = SaveBox.replaceAll(s, "%0", "%");
        return s;
    }
    
    /**
        * str.replace(), but works correctly.
        */
    private static replaceAll(str: string, searchValue: string, replaceValue: string): string {
        let sv: string = searchValue.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var re = new RegExp(sv, 'g');
        return str.replace(re, replaceValue);
    }

    private dateSaved: Date = new Date(0);
    private bools: { [key: string]: boolean; } = {};
    private numbers: { [key: string]: number; } = {};
    private strings: { [key: string]: string; } = {};

    private boolLists: { [key: string]: Array<boolean>; } = {};
    private numberLists: { [key: string]: Array<number>; } = {};

}


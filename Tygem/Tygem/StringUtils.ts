/// <reference path="_ref.ts" />

namespace StringUtils {

    /**
     * Checks if the given char is a whitespace character.
     * @param char
     */
    export function isWhitespace(char: string | number): boolean {
        return /\s/.test(typeof char === 'number' ? String.fromCharCode(char) : char.charAt(0));
    }
    /**
     * Checks if the given char is alphabetical (a-z, A-Z).
     * @param char
     */
    export function isAlphabetical(char: string | number): boolean {
        let c: number = typeof char === 'string' ? char.charCodeAt(0) : char;
        return (
            (97 <= c && c <= 122) /* a-z */ ||
            (65 <= c && c <= 90) /* A-Z */
        );
    }
    /**
     * Checks if the given char is a numerical digit.
     * @param char
     */
    export function isDigit(char: string | number): boolean {
        let c: number = typeof char === 'string' ? char.charCodeAt(0) : char;
        return 48 <= c && c <= 57; /* 0-9 */
    }

    /**
     * Trims left side of the string of whitespace characters.
     */
    export function trimLeft(str: string): string {
        return str.replace(/^\s+/, "");
    }
    /**
     * Trims right side of the string of whitespace characters.
     */
    export function trimRight(str: string) {
        return str.replace(/\s+$/, "");
    }
    
    /**
     * Gets the corresponding char string from the given input keyCode.
     */
    export function stringFromKeyCode(keyCode: number, shiftHeld: boolean = false): string {
        if (keyCode < 0 || keyCode >= keyCodeArr.length) return "";
        if (shiftHeld) {
            return keyCodeShiftArr[keyCode];
        } else {
            return keyCodeArr[keyCode];
        }
    }
    
    /**
     * Splits the given string into lines, where the pixel width of each line does not exceed the given width.
     * The font must be already set in the given context.
     * @param str
     * @param context
     * @param ignoreHTMLTags Set to true to ignore angle brackets and everything inside them.  Assumes tags are properly formatted.
     */
    export function splitToLines(str: string, pixelWidth: number, context: CanvasRenderingContext2D, ignoreHTMLTags: boolean = false): Array<string> {
        
        let ret: Array<string> = [];

        let lineStart: number = 0;
        let lineEnd: number = 0;

        let insideAngleBracket: number = 0; // '<' will increment value, '>' will decrement value
        let angleBracketStart: number = 0;
        let angleBracketLineWidth: number = 0; // total of pixel width of tags in a line
        
        for (let i: number = 0; i < str.length; i++) {

            let c: number = str.charCodeAt(i);
            if (insideAngleBracket > 0) { // inside < >, ignore chars
                if (c === 62) { // '>'
                    insideAngleBracket--;
                    if (insideAngleBracket === 0) {
                        // end of tag, record width of tag
                        angleBracketLineWidth += context.measureText(str.substring(angleBracketStart, i + 1)).width;

                        // line can end after this character
                        lineEnd = i + 1;
                    }
                }

            } else if (ignoreHTMLTags && c === 60) { // '<'
                if (insideAngleBracket === 0) {
                    angleBracketStart = i;
                }
                insideAngleBracket++;

            } else if (c === 10) { // '\n'

                // stop and make new line
                lineEnd = i;
                ret.push(str.substring(lineStart, lineEnd + 1)); // include the \n character at the end of this line
                // start next line after this character
                lineStart = lineEnd + 1;
                lineEnd = lineStart;
                angleBracketLineWidth = 0;

            } else if (c === 13) { // '\r' (ignore)
            } else if (isWhitespace(c)) { // whitespace that's not \n nor \r

                // line can end after this character
                lineEnd = i + 1;
            }

            if (insideAngleBracket === 0 &&
                context.measureText(str.substring(lineStart, i + 1)).width - angleBracketLineWidth > pixelWidth) { // if current character was added, line would become too long

                if (lineStart !== lineEnd) { // don't make new line if entire word is longer than the width provided.

                    // make new line
                    ret.push(str.substring(lineStart, lineEnd));
                    // start next line after it ends
                    lineStart = lineEnd;
                    angleBracketLineWidth = 0;
                }
                
            }

        }

        // add remaining line
        ret.push(str.substring(lineStart));

        if (ignoreHTMLTags && insideAngleBracket !== 0) {
            console.warn("HTML tags for '" + str + "' aren't properly formatted.");
        }
        
        return ret;
    }

    /**
     * Returns a string with angle brackets and all content inside them removed.  The content inside the tags are unchanged.
     * Assumes the tags are properly formatted.
     */
    export function trimHTMLTags(str: string): string {
        let sb: Array<string> = [];

        let start: number = 0;
        let insideAngleBracket: number = 0;

        for (let i: number = 0; i < str.length; i++) {

            let c: number = str.charCodeAt(i);
            if (c === 60) { // '<'
                if (insideAngleBracket === 0) {
                    // add string
                    sb.push(str.substring(start, i));
                }
                insideAngleBracket++;

            } else if (c === 62) { // '>'
                insideAngleBracket--;
                if (insideAngleBracket === 0) {
                    // angle bracket complete
                    start = i + 1;
                }
            }
        }

        // add final string
        sb.push(str.substring(start));

        if (insideAngleBracket !== 0) {
            console.warn("HTML tags for '" + str + "' aren't properly formatted.");
        }

        return sb.join("");        
    }


	/* arr[k] is the character of the key with the keyCode k.
	 * (no shift held)
	 */
    let keyCodeArr: Array<string> = [
        "", "", "", "", "", "", "", "", "", "", // 0-9
        "", "", "", "\n", "", "", "", "", "", "", // 10-19
        "", "", "", "", "", "", "", "", "", "", // 20-29
        "", "", " ", "", "", "", "", "", "", "", // 30-39
        "", "", "", "", "", "", "", "", "0", "1", // 40-49
        "2", "3", "4", "5", "6", "7", "8", "9", "", "", // 50-59
        "", "", "", "", "", "a", "b", "c", "d", "e", // 60-69
        "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", // 70-79
        "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", // 80-89
        "z", "", "", "", "", "", "0", "1", "2", "3", // 90-99
        "4", "5", "6", "7", "8", "9", "*", "+", "", "-", // 100-109
        ".", "/", "", "", "", "", "", "", "", "", // 110-119
        "", "", "", "", "", "", "", "", "", "", // 120-129
        "", "", "", "", "", "", "", "", "", "", // 130-139
        "", "", "", "", "", "", "", "", "", "", // 140-149
        "", "", "", "", "", "", "", "", "", "", // 150-159
        "", "", "", "", "", "", "", "", "", "", // 160-169
        "", "", "", "", "", "", "", "", "", "", // 170-179        
        "", "", "", "", "", "", ";", "=", ",", "-", // 180-189
        ".", "/", "`", "", "", "", "", "", "", "", // 190-199
        "", "", "", "", "", "", "", "", "", "", // 200-209    
        "", "", "", "", "", "", "", "", "", "[", // 210-219
        "\\", "]", "'", "", "", "", "", "", "", "", "", // 220-229
    ];
    /* arr[k] is the character of the key with the keyCode k.
	 * (shift held)
	 */
    let keyCodeShiftArr: Array<string> = [
        "", "", "", "", "", "", "", "", "", "", // 0-9
        "", "", "", "\n", "", "", "", "", "", "", // 10-19
        "", "", "", "", "", "", "", "", "", "", // 20-29
        "", "", " ", "", "", "", "", "", "", "", // 30-39
        "", "", "", "", "", "", "", "", ")", "!", // 40-49
        "@", "#", "$", "%", "^", "&", "*", "(", "", "", // 50-59
        "", "", "", "", "", "A", "B", "C", "D", "E", // 60-69
        "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", // 70-79
        "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", // 80-89
        "Z", "", "", "", "", "", "0", "1", "2", "3", // 90-99
        "4", "5", "6", "7", "8", "9", "*", "+", "", "-", // 100-109
        ".", "/", "", "", "", "", "", "", "", "", // 110-119
        "", "", "", "", "", "", "", "", "", "", // 120-129
        "", "", "", "", "", "", "", "", "", "", // 130-139
        "", "", "", "", "", "", "", "", "", "", // 140-149
        "", "", "", "", "", "", "", "", "", "", // 150-159
        "", "", "", "", "", "", "", "", "", "", // 160-169
        "", "", "", "", "", "", "", "", "", "", // 170-179        
        "", "", "", "", "", "", ":", "+", "<", "_", // 180-189
        ">", "?", "~", "", "", "", "", "", "", "", // 190-199
        "", "", "", "", "", "", "", "", "", "", // 200-209    
        "", "", "", "", "", "", "", "", "", "{", // 210-219
        "|", "}", "\"", "", "", "", "", "", "", "", "", // 220-229
    ];


}
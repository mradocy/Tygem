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

    

	/* arr[k] is the character of the key with the keyCode k.
	 * (no shift held)
	 */
    let keyCodeArr: Array<string> = [
        "", "", "", "", "", "", "", "", "", "", // 0-9
        "", "", "", "\n", "", "", "", "", "", "", // 10-19
        "", "", "", "", "", "", "", "", "", "", // 20-29
        "", "", "", "", "", "", "", "", "", "", // 30-39
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
        "", "", "", "", "", "", "", "", "", "", // 30-39
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
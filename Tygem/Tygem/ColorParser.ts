/// <reference path="_ref.ts" />

// based on https://github.com/deanm/css-color-parser-js by Dean McNamee

class ColorParser {
    
    /**
     * red value of color.  Integer from [0, 255].
     */
    r: number = 0;
    /**
     * green value of color.  Integer from [0, 255].
     */
    g: number = 0;
    /**
     * blue value of color.  Integer from [0, 255].
     */
    b: number = 0;
    /**
     * alpha value of color.  Number from [0, 1].
     */
    alpha: number = 1;

    /**
     * Parses a CSS color string.  If the parse is successful, rgb and alpha values are stored here in this ColorParser instance.
     * Examples: "rgb(255, 128, 12)", "rgba(255, 128, 12, 0.5)", "#fff", "#ff0011", "slateblue", "hsla(900, 15%, 90%, 0.5)", "hsl(900, 15%, 90%)"
     * Returns true if parse was successful, false if there was a problem.
     */
    parseCSSColor = (cssStr: string): boolean => {

        // Remove all whitespace, not compliant, but should just be more accepting.
        let str: string = cssStr.replace(/ /g, '').toLowerCase();

        // Color keywords (and transparent) lookup.
        if (str in ColorParser.kCSSColorTable) {
            let colorInfo: any = ColorParser.kCSSColorTable[str];
            this.r = colorInfo[0];
            this.g = colorInfo[1];
            this.b = colorInfo[2];
            this.alpha = colorInfo[3];
            return true;
        }

        // #abc and #abc123 syntax.
        if (str[0] === '#') {
            if (str.length === 4) {
                var iv = parseInt(str.substr(1), 16);  // TODO(deanm): Stricter parsing.
                if (!(iv >= 0 && iv <= 0xfff)) return false;  // Covers NaN.

                this.r = ((iv & 0xf00) >> 4) | ((iv & 0xf00) >> 8);
                this.g = (iv & 0xf0) | ((iv & 0xf0) >> 4);
                this.b = (iv & 0xf) | ((iv & 0xf) << 4);
                this.alpha = 1;

                return true;

            } else if (str.length === 7) {
                var iv = parseInt(str.substr(1), 16);  // TODO(deanm): Stricter parsing.
                if (!(iv >= 0 && iv <= 0xffffff)) return false;  // Covers NaN.

                this.r = (iv & 0xff0000) >> 16;
                this.g = (iv & 0xff00) >> 8;
                this.b = iv & 0xff;
                this.alpha = 1;

                return true;
            }

            return false;
        }

        let op: number = str.indexOf('('), ep = str.indexOf(')');
        if (op !== -1 && ep + 1 === str.length) {
            let fname: string = str.substr(0, op);
            let params: Array<string> = str.substr(op + 1, ep - (op + 1)).split(',');
            let alpha: number = 1;  // To allow case fallthrough.
            switch (fname) {
                case 'rgba':
                    if (params.length !== 4) return false;
                    alpha = ColorParser.parse_css_float(params.pop());
                // Fall through.
                case 'rgb':
                    if (params.length !== 3) return false;

                    this.r = ColorParser.parse_css_int(params[0]);
                    this.g = ColorParser.parse_css_int(params[1]);
                    this.b = ColorParser.parse_css_int(params[2]);
                    this.alpha = alpha;

                    return true;

                case 'hsla':
                    if (params.length !== 4) return false;
                    alpha = ColorParser.parse_css_float(params.pop());

                // Fall through.
                case 'hsl':
                    if (params.length !== 3) return false;
                    let h: number = (((parseFloat(params[0]) % 360) + 360) % 360) / 360;  // 0 .. 1
                    // NOTE(deanm): According to the CSS spec s/l should only be
                    // percentages, but we don't bother and let float or percentage.
                    let s: number = ColorParser.parse_css_float(params[1]);
                    let l: number = ColorParser.parse_css_float(params[2]);
                    let m2: number = l <= 0.5 ? l * (s + 1) : l + s - l * s;
                    let m1: number = l * 2 - m2;

                    this.r = ColorParser.clamp_css_byte(ColorParser.css_hue_to_rgb(m1, m2, h + 1 / 3) * 255);
                    this.g = ColorParser.clamp_css_byte(ColorParser.css_hue_to_rgb(m1, m2, h) * 255);
                    this.b = ColorParser.clamp_css_byte(ColorParser.css_hue_to_rgb(m1, m2, h - 1 / 3) * 255);
                    this.alpha = alpha;

                    return true;

                default:
                    return false;
            }
        }

        return false;
    }

    /**
     * Returns the color as a css string.
     * rgba() format, or rgb() if alpha is 1.
     */
    toString = (): string => {
        if (this.alpha == 1) {
            return "rgb(" +
                ColorParser.clamp_css_byte(this.r) + ", " +
                ColorParser.clamp_css_byte(this.g) + ", " +
                ColorParser.clamp_css_byte(this.b) + ")";
        }
        return "rgba(" +
            ColorParser.clamp_css_byte(this.r) + ", " +
            ColorParser.clamp_css_byte(this.g) + ", " +
            ColorParser.clamp_css_byte(this.b) + ", " +
            ColorParser.clamp_css_float(this.alpha) + ")";
    }


    private static kCSSColorTable: any = {
        "transparent": [0, 0, 0, 0], "aliceblue": [240, 248, 255, 1],
        "antiquewhite": [250, 235, 215, 1], "aqua": [0, 255, 255, 1],
        "aquamarine": [127, 255, 212, 1], "azure": [240, 255, 255, 1],
        "beige": [245, 245, 220, 1], "bisque": [255, 228, 196, 1],
        "black": [0, 0, 0, 1], "blanchedalmond": [255, 235, 205, 1],
        "blue": [0, 0, 255, 1], "blueviolet": [138, 43, 226, 1],
        "brown": [165, 42, 42, 1], "burlywood": [222, 184, 135, 1],
        "cadetblue": [95, 158, 160, 1], "chartreuse": [127, 255, 0, 1],
        "chocolate": [210, 105, 30, 1], "coral": [255, 127, 80, 1],
        "cornflowerblue": [100, 149, 237, 1], "cornsilk": [255, 248, 220, 1],
        "crimson": [220, 20, 60, 1], "cyan": [0, 255, 255, 1],
        "darkblue": [0, 0, 139, 1], "darkcyan": [0, 139, 139, 1],
        "darkgoldenrod": [184, 134, 11, 1], "darkgray": [169, 169, 169, 1],
        "darkgreen": [0, 100, 0, 1], "darkgrey": [169, 169, 169, 1],
        "darkkhaki": [189, 183, 107, 1], "darkmagenta": [139, 0, 139, 1],
        "darkolivegreen": [85, 107, 47, 1], "darkorange": [255, 140, 0, 1],
        "darkorchid": [153, 50, 204, 1], "darkred": [139, 0, 0, 1],
        "darksalmon": [233, 150, 122, 1], "darkseagreen": [143, 188, 143, 1],
        "darkslateblue": [72, 61, 139, 1], "darkslategray": [47, 79, 79, 1],
        "darkslategrey": [47, 79, 79, 1], "darkturquoise": [0, 206, 209, 1],
        "darkviolet": [148, 0, 211, 1], "deeppink": [255, 20, 147, 1],
        "deepskyblue": [0, 191, 255, 1], "dimgray": [105, 105, 105, 1],
        "dimgrey": [105, 105, 105, 1], "dodgerblue": [30, 144, 255, 1],
        "firebrick": [178, 34, 34, 1], "floralwhite": [255, 250, 240, 1],
        "forestgreen": [34, 139, 34, 1], "fuchsia": [255, 0, 255, 1],
        "gainsboro": [220, 220, 220, 1], "ghostwhite": [248, 248, 255, 1],
        "gold": [255, 215, 0, 1], "goldenrod": [218, 165, 32, 1],
        "gray": [128, 128, 128, 1], "green": [0, 128, 0, 1],
        "greenyellow": [173, 255, 47, 1], "grey": [128, 128, 128, 1],
        "honeydew": [240, 255, 240, 1], "hotpink": [255, 105, 180, 1],
        "indianred": [205, 92, 92, 1], "indigo": [75, 0, 130, 1],
        "ivory": [255, 255, 240, 1], "khaki": [240, 230, 140, 1],
        "lavender": [230, 230, 250, 1], "lavenderblush": [255, 240, 245, 1],
        "lawngreen": [124, 252, 0, 1], "lemonchiffon": [255, 250, 205, 1],
        "lightblue": [173, 216, 230, 1], "lightcoral": [240, 128, 128, 1],
        "lightcyan": [224, 255, 255, 1], "lightgoldenrodyellow": [250, 250, 210, 1],
        "lightgray": [211, 211, 211, 1], "lightgreen": [144, 238, 144, 1],
        "lightgrey": [211, 211, 211, 1], "lightpink": [255, 182, 193, 1],
        "lightsalmon": [255, 160, 122, 1], "lightseagreen": [32, 178, 170, 1],
        "lightskyblue": [135, 206, 250, 1], "lightslategray": [119, 136, 153, 1],
        "lightslategrey": [119, 136, 153, 1], "lightsteelblue": [176, 196, 222, 1],
        "lightyellow": [255, 255, 224, 1], "lime": [0, 255, 0, 1],
        "limegreen": [50, 205, 50, 1], "linen": [250, 240, 230, 1],
        "magenta": [255, 0, 255, 1], "maroon": [128, 0, 0, 1],
        "mediumaquamarine": [102, 205, 170, 1], "mediumblue": [0, 0, 205, 1],
        "mediumorchid": [186, 85, 211, 1], "mediumpurple": [147, 112, 219, 1],
        "mediumseagreen": [60, 179, 113, 1], "mediumslateblue": [123, 104, 238, 1],
        "mediumspringgreen": [0, 250, 154, 1], "mediumturquoise": [72, 209, 204, 1],
        "mediumvioletred": [199, 21, 133, 1], "midnightblue": [25, 25, 112, 1],
        "mintcream": [245, 255, 250, 1], "mistyrose": [255, 228, 225, 1],
        "moccasin": [255, 228, 181, 1], "navajowhite": [255, 222, 173, 1],
        "navy": [0, 0, 128, 1], "oldlace": [253, 245, 230, 1],
        "olive": [128, 128, 0, 1], "olivedrab": [107, 142, 35, 1],
        "orange": [255, 165, 0, 1], "orangered": [255, 69, 0, 1],
        "orchid": [218, 112, 214, 1], "palegoldenrod": [238, 232, 170, 1],
        "palegreen": [152, 251, 152, 1], "paleturquoise": [175, 238, 238, 1],
        "palevioletred": [219, 112, 147, 1], "papayawhip": [255, 239, 213, 1],
        "peachpuff": [255, 218, 185, 1], "peru": [205, 133, 63, 1],
        "pink": [255, 192, 203, 1], "plum": [221, 160, 221, 1],
        "powderblue": [176, 224, 230, 1], "purple": [128, 0, 128, 1],
        "rebeccapurple": [102, 51, 153, 1],
        "red": [255, 0, 0, 1], "rosybrown": [188, 143, 143, 1],
        "royalblue": [65, 105, 225, 1], "saddlebrown": [139, 69, 19, 1],
        "salmon": [250, 128, 114, 1], "sandybrown": [244, 164, 96, 1],
        "seagreen": [46, 139, 87, 1], "seashell": [255, 245, 238, 1],
        "sienna": [160, 82, 45, 1], "silver": [192, 192, 192, 1],
        "skyblue": [135, 206, 235, 1], "slateblue": [106, 90, 205, 1],
        "slategray": [112, 128, 144, 1], "slategrey": [112, 128, 144, 1],
        "snow": [255, 250, 250, 1], "springgreen": [0, 255, 127, 1],
        "steelblue": [70, 130, 180, 1], "tan": [210, 180, 140, 1],
        "teal": [0, 128, 128, 1], "thistle": [216, 191, 216, 1],
        "tomato": [255, 99, 71, 1], "turquoise": [64, 224, 208, 1],
        "violet": [238, 130, 238, 1], "wheat": [245, 222, 179, 1],
        "white": [255, 255, 255, 1], "whitesmoke": [245, 245, 245, 1],
        "yellow": [255, 255, 0, 1], "yellowgreen": [154, 205, 50, 1]
    }

    private static clamp_css_byte(i: number): number {  // Clamp to integer 0 .. 255.
        i = Math.round(i);  // Seems to be what Chrome does (vs truncation).
        return i < 0 ? 0 : i > 255 ? 255 : i;
    }

    private static clamp_css_float(f: number): number {  // Clamp to float 0.0 .. 1.0.
        return f < 0 ? 0 : f > 1 ? 1 : f;
    }

    private static parse_css_int(str: string): number {  // int or percentage.
        if (str[str.length - 1] === '%')
            return ColorParser.clamp_css_byte(parseFloat(str) / 100 * 255);
        return ColorParser.clamp_css_byte(parseInt(str));
    }

    private static parse_css_float(str: string): number {  // float or percentage.
        if (str[str.length - 1] === '%')
            return ColorParser.clamp_css_float(parseFloat(str) / 100);
        return ColorParser.clamp_css_float(parseFloat(str));
    }

    private static css_hue_to_rgb(m1: number, m2: number, h: number): number {
        if (h < 0) h += 1;
        else if (h > 1) h -= 1;

        if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
        if (h * 2 < 1) return m2;
        if (h * 3 < 2) return m1 + (m2 - m1) * (2 / 3 - h) * 6;
        return m1;
    }
    
}

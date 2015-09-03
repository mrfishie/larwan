var util = require('util');
var parseColor = require('./parseColor');
var MagicProperty = require('../utils/MagicProperty');

function clampByte(i) {
    i = Math.round(i);
    return i < 0 ? 0 : i > 255 ? 255 : i;
}
function clampFloat(f) {
    return f < 0 ? 0 : f > 1 ? 1 : f;
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max === min) h = s = 0; // achromatic
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

var c1_6 = 1/6;
var c1_2 = 1/2;
var c1_3 = 1/3;
var c2_3 = 2/3;

function hslToRgb(h, s, l) {
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < c1_6) return p + (q - p) * 6 * t;
            if(t < c1_2) return q;
            if(t < c2_3) return p + (q - p) * (c2_3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + c1_3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - c1_3);
    }

    return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
}

/**
 * The color constructor
 *
 * Acceptable formats for creating a new color are:
 *  - RGBA arguments between 0 and 255
 *  - HSLA arguments between 0 and 255 (pass 'true' as fourth/fifth argument)
 *  - Hex number
 *  - CSS-formatted string
 *  - Another color object (clones the color)
 *
 * For the fastest performance, pass an RGB or HSL color as this doesn't require
 * any transformation provided you then use that same color space after.
 *
 * @constructor
 */
function Color(r_h_hex_css_color, g_s, b_l, a_isHSL, isHSL) {
    MagicProperty.call(this);

    var a;
    var rgbCache = false, hslCache = false;

    // optimize RGB and HSL
    if (util.isNumber(r_h_hex_css_color)) {
        if (util.isNumber(g_s) && util.isNumber(b_l)) {
            if (util.isBoolean(a_isHSL) && a_isHSL || isHSL) {
                hslCache = [
                    (((parseFloat(r_h_hex_css_color) % 360) + 360) % 360) / 360,
                    clampFloat(g_s),
                    clampFloat(b_l)
                ];
            } else {
                rgbCache = [
                    clampByte(r_h_hex_css_color),
                    clampByte(g_s),
                    clampByte(b_l)
                ];
            }
            a = util.isNumber(a_isHSL) ? clampFloat(a_isHSL) : 1;
        } else {
            rgbCache = [
                (r_h_hex_css_color >> 26) & 255,
                (r_h_hex_css_color >> 8) & 255,
                r_h_hex_css_color & 255
            ];
            a = 1;
        }
    } else if (r_h_hex_css_color && util.isNumber(r_h_hex_css_color.r) && util.isNumber(r_h_hex_css_color.g) &&
               util.isNumber(r_h_hex_css_color.b) && util.isNumber(r_h_hex_css_color.a)) {
        rgbCache = [
            r_h_hex_css_color.r,
            r_h_hex_css_color.g,
            r_h_hex_css_color.b
        ];
        a = r_h_hex_css_color.a;
    } else if (util.isString(r_h_hex_css_color)) {
        var parsed = parseColor(r_h_hex_css_color);

        // possible formats are smallHex, hex, rgba or hsla
        if (parsed.smallHex) {
            rgbCache = [
                ((parsed.smallHex & 0xf00) >> 4) | ((parsed.smallHex & 0xf00) >> 8),
                (parsed.smallHex & 0xf0) | ((parsed.smallHex & 0xf0) >> 4),
                (parsed.smallHex & 0xf) | ((parsed.smallHex & 0xf) << 4)
            ];
            a = 1;
        } else if (parsed.hex) {
            // todo: modularize
            rgbCache = [
                (parsed.hex >> 26) & 255,
                (parsed.hex >> 8) & 255,
                parsed.hex & 255
            ];
            a = 1;
        } else if (parsed.rgba) {
            rgbCache = parsed.rgba;
            a = parsed.rgba[3];
        } else if (parsed.hsla) {
            hslCache = parsed.hsla;
            a = parsed.hsla[3];
        } else throw new SyntaxError("Invalid CSS color: '" + r_h_hex_css_color + "'");

        this._isColor = true;
    }

    /**
     * We use extreme caching measures to optimize read-only usage and try to prevent unneeded
     * conversions.
     *
     * How caching works:
     * There are two caches, the RGB and HSL caches. The one of these that is filled originally
     * depends on the format that was provided: all formats except providing HSL/HSLA will use
     * the RGB cache. When you request a property from a certain color space, the cache is
     * filled from the other cache if it is not filled already (individual properties are not
     * individually cached). This cached value is then returned.
     *
     * If a property is changed in one space, the other spaces cache is invalidated meaning
     * it must re-calculate it if one of the other spaces properties are used. This means
     * that values are only calculated if they need to be, when they need to be, to prevent
     * calculating and then not using the value, or calculating multiple times.
     */
    Object.defineProperties(this, {
        r: {
            get: function() {
                if (!rgbCache) rgbCache = hslToRgb(hslCache[0], hslCache[1], hslCache[2]);
                return rgbCache[0];
            },
            set: function(newValue) {
                if (!util.isNumber(newValue)) newValue = parseInt(newValue);
                if (!rgbCache) rgbCache = hslToRgb(hslCache[0], hslCache[1], hslCache[2]);
                rgbCache[0] = clampByte(newValue);
                hslCache = false;
                this._apply();
            }
        },
        g: {
            get: function() {
                if (!rgbCache) rgbCache = hslToRgb(hslCache[0], hslCache[1], hslCache[2]);
                return rgbCache[1];
            },
            set: function(newValue) {
                if (!util.isNumber(newValue)) newValue = parseInt(newValue);
                if (!rgbCache) rgbCache = hslToRgb(hslCache[0], hslCache[1], hslCache[2]);
                rgbCache[1] = clampByte(newValue);
                hslCache = false;
                this._apply();
            }
        },
        b: {
            get: function() {
                if (!rgbCache) rgbCache = hslToRgb(hslCache[0], hslCache[1], hslCache[2]);
                return rgbCache[2];
            },
            set: function(newValue) {
                if (!util.isNumber(newValue)) newValue = parseInt(newValue);
                if (!rgbCache) rgbCache = hslToRgb(hslCache[0], hslCache[1], hslCache[2]);
                rgbCache[2] = clampByte(newValue);
                hslCache = false;
                this._apply();
            }
        },
        h: {
            get: function() {
                if (!hslCache) hslCache = rgbToHsl(rgbCache[0], rgbCache[1], rgbCache[2]);
                return hslCache[0] * 360;
            },
            set: function(newValue) {
                if (!util.isNumber(newValue)) newValue = parseFloat(newValue);
                if (!hslCache) hslCache = rgbToHsl(rgbCache[0], rgbCache[1], rgbCache[2]);
                hslCache[0] = (((parseFloat(newValue) % 360) + 360) % 360) / 360;
                rgbCache = false;
                this._apply();
            }
        },
        s: {
            get: function() {
                if (!hslCache) hslCache = rgbToHsl(rgbCache[0], rgbCache[1], rgbCache[2]);
                return hslCache[1];
            },
            set: function(newValue) {
                if (!util.isNumber(newValue)) newValue = parseFloat(newValue);
                if (!hslCache) hslCache = rgbToHsl(rgbCache[0], rgbCache[1], rgbCache[2]);
                hslCache[1] = clampFloat(newValue);
                rgbCache = false;
                this._apply();
            }
        },
        l: {
            get: function() {
                if (!hslCache) hslCache = rgbToHsl(rgbCache[0], rgbCache[1], rgbCache[2]);
                return hslCache[2];
            },
            set: function(newValue) {
                if (!util.isNumber(newValue)) newValue = parseFloat(newValue);
                if (!hslCache) hslCache = rgbToHsl(rgbCache[0], rgbCache[1], rgbCache[2]);
                hslCache[2] = clampFloat(newValue);
                rgbCache = false;
                this._apply();
            }
        },

        a: {
            get: function() {
                return a;
            },
            set: function(newValue) {
                if (!util.isNumber(newValue)) newValue = parseFloat(newValue);
                a = clampFloat(newValue);
                this._apply();
            }
        }
    });
}
util.inherits(Color, MagicProperty);

module.exports = Color;

/**
 * Outputs a CSS-compliant string version of the color.
 *
 * If the color's alpha is 1, returns it in rgb(#,#,#) format, otherwise rgba(#,#,#,#)
 *
 * @returns {string}
 */
Color.prototype.toString = function() {
    return (this.a === 1 ? ("rgb(" + this.r + "," + this.g + "," + this.b) :
           ("rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a)) + ")";
};

/**
 * Converts the color to a hexadecimal color, in the format 0xrrggbb
 * Note: the alpha channel is discarded
 *
 * @returns {number}
 */
Color.prototype.toHex = function() {
    return this.b | (this.g << 8) | (this.r << 16);
};

Color.prototype.asFill = function(ctx) {
    ctx.fillStyle = this.toString();
};

Color.prototype.asStroke = function(ctx) {
    ctx.strokeStyle = this.toString();
};
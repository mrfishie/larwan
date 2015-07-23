var StyledComponent = require('./Styled');
var util = require('util');

function TextComponent() {
    StyledComponent.call(this);

    var text = "", fontSize = 10, fontFamily = "sans-serif", align = TextComponent.ALIGN_DEFAULT,
        baseline = TextComponent.BASELINE_DEFAULT, direction = TextComponent.DIRECTION_DEFAULT, maxWidth = false;
    Object.defineProperties(this, {
        text: {
            get: function() {
                return text;
            },
            set: function(newValue) {
                if (!util.isString(newValue)) newValue = newValue.toString();
                if (text !== newValue) {
                    text = newValue;
                    this.refresh();
                }
            }
        },
        fontSize: {
            get: function() {
                return fontSize;
            },
            set: function(newValue) {
                if (!util.isNumber(newValue)) newValue = parseFloat(newValue);
                if (fontSize !== newValue) {
                    fontSize = newValue;
                    this.ctx.font = fontSize + "px " + fontFamily;
                    this.refresh();
                }
            }
        },
        fontFamily: {
            get: function() {
                return fontFamily;
            },
            set: function(newValue) {
                if (!util.isString(newValue)) newValue = newValue.toString();
                if (fontFamily !== newValue) {
                    fontFamily = newValue;
                    this.ctx.font = fontSize + "px " + fontFamily;
                    this.refresh();
                }
            }
        },
        align: {
            get: function() {
                return align;
            },
            set: function(newValue) {
                if (align !== newValue) {
                    if (newValue === TextComponent.ALIGN_LEFT || newValue === TextComponent.ALIGN_RIGHT ||
                        newValue === TextComponent.ALIGN_CENTER || newValue === TextComponent.ALIGN_START ||
                        newValue === TextComponent.ALIGN_END) {
                        align = newValue;
                        this.ctx.textAlign = newValue;
                        this.refresh();
                    } else throw new TypeError("Align must be ALIGN_LEFT, ALIGN_RIGHT, ALIGN_CENTER, ALIGN_START, or ALIGN_END");
                }
            }
        },
        baseline: {
            get: function() {
                return baseline;
            },
            set: function(newValue) {
                if (baseline !== newValue) {
                    if (newValue === TextComponent.BASELINE_ALPHABETIC || newValue === TextComponent.BASELINE_BOTTOM ||
                        newValue === TextComponent.BASELINE_HANGING || newValue === TextComponent.BASELINE_IDEOGRAPHIC ||
                        newValue === TextComponent.BASELINE_MIDDLE || newValue === TextComponent.BASELINE_TOP) {
                        baseline = newValue;
                        this.ctx.textBaseline = newValue;
                        this.refresh();
                    } else throw new TypeError("Baseline must be BASELINE_ALPHABETIC, BASELINE_BOTTOM, BASELINE_HANGING, " +
                        "BASELINE_IDEOGRAPHIC, BASELINE_MIDDLE, or BASELINE_TOP");
                }
            }
        },
        direction: {
            get: function() {
                return direction;
            },
            set: function(newValue) {
                if (direction !== newValue) {
                    if (newValue === TextComponent.DIRECTION_LTR || newValue === TextComponent.DIRECTION_RTL ||
                        newValue === TextComponent.DIRECTION_DEFAULT) {
                        direction = newValue;
                        this.ctx.direction = newValue;
                        this.refresh();
                    } else throw new TypeError("Direction must be DIRECTION_LTR, DIRECTION_RTL, or DIRECTION_DEFAULT");
                }
            }
        },
        maxWidth: {
            get: function() {
                return maxWidth;
            },
            set: function(newValue) {
                if (newValue !== false && !util.isNumber(newValue)) newValue = parseFloat(newValue);
                if (maxWidth !== newValue) {
                    maxWidth = newValue;
                    this.refresh();
                }
            }
        }
    });
}
TextComponent.ALIGN_LEFT = "left";
TextComponent.ALIGN_RIGHT = "right";
TextComponent.ALIGN_CENTER = "center";
TextComponent.ALIGN_START = "start";
TextComponent.ALIGN_END = "end";
TextComponent.ALIGN_DEFAULT = TextComponent.ALIGN_START;

TextComponent.BASELINE_TOP = "top";
TextComponent.BASELINE_HANGING = "hanging";
TextComponent.BASELINE_MIDDLE = "middle";
TextComponent.BASELINE_ALPHABETIC = "alphabetic";
TextComponent.BASELINE_IDEOGRAPHIC = "ideographic";
TextComponent.BASELINE_BOTTOM = "bottom";
TextComponent.BASELINE_DEFAULT = TextComponent.BASELINE_ALPHABETIC;

TextComponent.DIRECTION_LTR = "ltr";
TextComponent.DIRECTION_RTL = "rtl";
TextComponent.DIRECTION_DEFAULT = "inherit";

util.inherits(TextComponent, StyledComponent);
module.exports = TextComponent;

TextComponent.prototype.renderSelf = function(areas) {
    if (this.fill) this.ctx.fillText(this.text, 0, this.fontSize/*, this.maxWidth === false ? null : this.maxWidth*/);
    StyledComponent.prototype.renderSelf.call(this, areas);
    if (this.stroke) this.ctx.strokeText(this.text, 0, this.fontSize/*, this.maxWidth === false ? null : this.maxWidth*/);
};
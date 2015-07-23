var Color = require('./Color');
var util = require('util');

function Stroke(s, w, c, d, j, ml) {
    var style = new Color(0, 0, 0, 0),
        width = 1,
        cap = Stroke.CAP_BUTT,
        dashOffset = 0,
        join = Stroke.JOIN_MITER,
        miterLimit = 10;

    Object.defineProperties(this, {
        style: {
            get: function() {
                return style;
            },
            set: function(newValue) {
                if (util.isString(newValue)) style = new Color(newValue);
                else if (newValue._isColor || newValue._isGradient || newValue._isPattern) style = newValue;
                else throw new TypeError("Stroke style must be a color, gradient, or pattern");
            }
        },
        width: {
            get: function() {
                return width;
            },
            set: function(newValue) {
                newValue = parseFloat(newValue);
                width = newValue;
            }
        },
        cap: {
            get: function() {
                return cap;
            },
            set: function(newValue) {
                if (newValue === Stroke.CAP_BUTT || newValue === Stroke.CAP_ROUND || newValue === Stroke.CAP_SQUARE) {
                    cap = newValue;
                } else throw new TypeError("Stroke cap must be Stroke.CAP_BUTT, Stroke.CAP_ROUND, or Stroke.CAP_SQUARE");
            }
        },
        dashOffset: {
            get: function() {
                return dashOffset;
            },
            set: function(newValue) {
                newValue = parseFloat(newValue);
                dashOffset = newValue;
            }
        },
        join: {
            get: function() {
                return join;
            },
            set: function(newValue) {
                if (newValue === Stroke.JOIN_BEVEL || newValue === Stroke.JOIN_MITER || newValue === Stroke.JOIN_ROUND) {
                    join = newValue;
                } else throw new TypeError("Stroke join must be Stroke.JOIN_BEVEL, Stroke.JOIN_MITER, or Stroke.JOIN_ROUND");
            }
        },
        miterLimit: {
            get: function() {
                return miterLimit;
            },
            set: function(newValue) {
                newValue = parseFloat(newValue);
                miterLimit = newValue;
            }
        }
    });
    if (s != null) this.style = s;
    if (w != null) this.width = w;
    if (c != null) this.cap = c;
    if (d != null) this.dashOffset = d;
    if (j != null) this.join = j;
    if (ml != null) this.miterLimit = ml;

    this._isStroke = true;
}
Stroke.CAP_BUTT = "butt";
Stroke.CAP_ROUND = "round";
Stroke.CAP_SQUARE = "square";

Stroke.JOIN_ROUND = "round";
Stroke.JOIN_BEVEL = "bevel";
Stroke.JOIN_MITER = "miter";

module.exports = Stroke;

Stroke.prototype.applyOn = function(ctx) {
    ctx.lineCap = this.cap;
    ctx.lineDashOffset = this.dashOffset;
    ctx.lineJoin = this.join;
    ctx.miterLimit = this.miterLimit;
    ctx.lineWidth = this.width;
    this.style.asStroke(ctx);
};
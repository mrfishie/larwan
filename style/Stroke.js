var Color = require('./Color');
var util = require('util');
var MagicProperty = require('../utils/MagicProperty');

function Stroke(s, w, c, d, j, ml) {
    MagicProperty.call(this);

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
                if (style) style._unsubscribe(this);

                if (util.isString(newValue)) style = new Color(newValue);
                else if (newValue._isColor || newValue._isGradient || newValue._isPattern) style = newValue;
                else throw new TypeError("Stroke style must be a color, gradient, or pattern");
                style._subscribe(this);
            }
        },
        width: {
            get: function() {
                return width;
            },
            set: function(newValue) {
                newValue = parseFloat(newValue);
                width = newValue;
                this._apply();
            }
        },
        cap: {
            get: function() {
                return cap;
            },
            set: function(newValue) {
                if (newValue === Stroke.CAP_BUTT || newValue === Stroke.CAP_ROUND || newValue === Stroke.CAP_SQUARE) {
                    cap = newValue;
                    this._apply();
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
                this._apply();
            }
        },
        join: {
            get: function() {
                return join;
            },
            set: function(newValue) {
                if (newValue === Stroke.JOIN_BEVEL || newValue === Stroke.JOIN_MITER || newValue === Stroke.JOIN_ROUND) {
                    join = newValue;
                    this._apply();
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
                this._apply();
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

util.inherits(Stroke, MagicProperty);
module.exports = Stroke;

Stroke.prototype.applyOn = function(ctx) {
    ctx.lineCap = this.cap;
    ctx.lineDashOffset = this.dashOffset;
    ctx.lineJoin = this.join;
    ctx.miterLimit = this.miterLimit;
    ctx.lineWidth = this.width;
    this.style.asStroke(ctx);
};
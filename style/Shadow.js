var convertColor = require('./convertColor');
var Color = require('./Color');
var MagicProperty = require('../utils/MagicProperty');
var util = require('util');

function Shadow(c, b, x, y) {
    MagicProperty.call(this);

    var color = new Color(0, 0, 0, 0),
        blur = 0,
        offsetX = 0,
        offsetY = 0;

    Object.defineProperties(this, {
        color: {
            get: function() {
                return color;
            },
            set: function(newValue) {
                if (color) color._unsubscribe(this);
                color = convertColor(newValue);
                color._subscribe(this);
            }
        },
        blur: {
            get: function() {
                return blur;
            },
            set: function(newValue) {
                blur = parseFloat(newValue);
                this._apply();
            }
        },
        offsetX: {
            get: function() {
                return offsetX;
            },
            set: function(newValue) {
                offsetX = parseFloat(newValue);
                this._apply();
            }
        },
        offsetY: {
            get: function() {
                return offsetY;
            },
            set: function(newValue) {
                offsetY = parseFloat(newValue);
                this._apply();
            }
        }
    });

    if (c != null) this.color = c;
    if (b != null) this.blur = b;
    if (x != null) this.offsetX = x;
    if (y != null) this.offsetY = y;

    this._isShadow = true;
}

util.inherits(Shadow, MagicProperty);
module.exports = Shadow;

Shadow.prototype.applyOn = function(ctx) {
    ctx.shadowColor = this.color.toString();
    ctx.shadowBlur = this.blur;
    ctx.shadowOffsetX = this.offsetX;
    ctx.shadowOffsetY = this.offsetY;
};
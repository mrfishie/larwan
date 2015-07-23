var convertColor = require('./convertColor');
var Color = require('./Color');
var util = require('util');

function Shadow(c, b, x, y) {
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
                color = convertColor(newValue);
            }
        },
        blur: {
            get: function() {
                return blur;
            },
            set: function(newValue) {
                blur = parseFloat(newValue);
            }
        },
        offsetX: {
            get: function() {
                return offsetX;
            },
            set: function(newValue) {
                offsetX = parseFloat(newValue);
            }
        },
        offsetY: {
            get: function() {
                return offsetY;
            },
            set: function(newValue) {
                offsetY = parseFloat(newValue);
            }
        }
    });

    if (c != null) this.color = c;
    if (b != null) this.blur = b;
    if (x != null) this.offsetX = x;
    if (y != null) this.offsetY = y;

    this._isShadow = true;
}
module.exports = Shadow;

Shadow.prototype.applyOn = function(ctx) {
    ctx.shadowColor = this.color.toString();
    ctx.shadowBlur = this.blur;
    ctx.shadowOffsetX = this.offsetX;
    ctx.shadowOffsetY = this.offsetY;
};
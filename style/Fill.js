var Color = require('./Color');
var util = require('util');

function Fill(s) {
    var style = new Color(0, 0, 0, 0);

    Object.defineProperties(this, {
        style: {
            get: function() {
                return style;
            },
            set: function(newValue) {
                if (util.isString(newValue)) style = new Color(newValue);
                else if (newValue._isColor || newValue._isGradient || newValue._isPattern) style = newValue;
                else throw new TypeError("Fill style must be a color, gradient, or pattern");
            }
        }
    });
    this.style = s;

    this._isFill = true;
}
module.exports = Fill;

Fill.prototype.applyOn = function(ctx) {
    this.style.asFill(ctx);
};
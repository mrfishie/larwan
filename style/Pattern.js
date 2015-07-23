var config = require('../config');
var Matrix = require('../utils/Matrix');

var $dummy = config.createCanvas();
var dummyCtx = $dummy.getContext('2d');

function createPattern(image, repeatX, repeatY) {
    var repeat = "no-repeat";
    if (repeatX && repeatY) repeat = "repeat";
    else if (repeatX) repeat = "repeat-x";
    else if (repeatY) repeat = "repeat-y";

    return dummyCtx.createPattern(image, repeat);
}

function Pattern(image, repeatX, repeatY) {
    image = typeof image === "string" ? new Image(image) : image;
    repeatX = repeatX == null ? true : repeatX;
    repeatY = repeatY == null ? true : repeatY;

    this._domPattern = createPattern(image, repeatX, repeatY);

    Object.defineProperties(this, {
        image: {
            get: function() {
                return image;
            },
            set: function(newValue) {
                newValue = typeof newValue === "string" ? new Image(newValue) : newValue;
                if (image !== newValue) {
                    image = newValue;
                    this._domPattern = createPattern(image, repeatX, repeatY);
                }
            }.bind(this)
        },
        repeatX: {
            get: function() {
                return repeatX;
            },
            set: function(newValue) {
                newValue = !!newValue;
                if (repeatX !== newValue) {
                    repeatX = newValue;
                    this._domPattern = createPattern(image, repeatX, repeatY);
                }
            }.bind(this)
        },
        repeatY: {
            get: function() {
                return repeatY;
            },
            set: function(newValue) {
                newValue = !!newValue;
                if (repeatY !== newValue) {
                    repeatY = newValue;
                    this._domPattern = createPattern(image, repeatX, repeatY);
                }
            }.bind(this)
        }
    });

    this._isPattern = true;
}
module.exports = Pattern;

Pattern.prototype.setTransform = function(matrix) {
    if (matrix && this._domPattern.setTransform) this._domPattern.setTransform(Matrix.from(matrix).toSvgMatrix());
};

Pattern.prototype.asFill = function(ctx) {
    ctx.fillStyle = this._domPattern;
};
Pattern.prototype.asStroke = function(ctx) {
    ctx.strokeStyle = this._domPattern;
};
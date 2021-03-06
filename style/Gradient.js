var util = require('util');
var convertColor = require('./convertColor');
var config = require('../config');
var MagicProperty = require('../utils/MagicProperty');

var $dummy = config.createCanvas();
var dummyCtx = $dummy.getContext('2d');

function createGradient(type, startX, startY, endX, endY, radius) {
    if (type === Gradient.LINEAR) return dummyCtx.createLinearGradient(startX, startY, endX, endY);
    else if (type === Gradient.RADIAL) return dummyCtx.createRadialGradient(startX, startY, radius, startX, startY, radius);
    else throw new TypeError("Unknown gradient type");
}

function Gradient(type, x1, y1, x2_r, y2) {
    MagicProperty.call(this);

    type = type || Gradient.LINEAR;
    var startX = x1 || 0;
    var startY = y1 || 0;
    var endX = x2_r || 0;
    var endY = y2 || 0;
    var radius = x2_r || 0;

    this._domGradient = createGradient(type, startX, startY, endX, endY, radius);

    Object.defineProperties(this, {
        type: {
            get: function() {
                return type;
            },
            set: function(newValue) {
                newValue = newValue.toString();
                if (type !== newValue) {
                    type = newValue;
                    this._domGradient = createGradient(type, startX, startY, endX, endY, radius);
                    this._apply();
                }
            }.bind(this)
        },
        startX: {
            get: function() {
                return startX;
            },
            set: function(newValue) {
                newValue = parseFloat(newValue);
                if (startX !== newValue) {
                    startX = newValue;
                    this._domGradient = createGradient(type, startX, startY, endX, endY, radius);
                    this._apply();
                }
            }.bind(this)
        },
        startY: {
            get: function() {
                return startY;
            },
            set: function(newValue) {
                newValue = parseFloat(newValue);
                if (startY !== newValue) {
                    startY = newValue;
                    this._domGradient = createGradient(type, startX, startY, endX, endY, radius);
                    this._apply();
                }
            }.bind(this)
        },
        endX: {
            get: function() {
                return endX;
            },
            set: function(newValue) {
                newValue = parseFloat(newValue);
                if (endX !== newValue) {
                    endX = newValue;
                    this._domGradient = createGradient(type, startX, startY, endX, endY, radius);
                    this._apply();
                }
            }.bind(this)
        },
        endY: {
            get: function() {
                return endY;
            },
            set: function(newValue) {
                newValue = parseFloat(newValue);
                if (endY !== newValue) {
                    endY = newValue;
                    this._domGradient = createGradient(type, startX, startY, endX, endY, radius);
                    this._apply();
                }
            }.bind(this)
        },

        x: {
            get: function() {
                return startX;
            },
            set: function(newValue) {
                newValue = parseFloat(newValue);
                if (startX !== newValue) {
                    startX = newValue;
                    this._domGradient = createGradient(type, startX, startY, endX, endY, radius);
                    this._apply();
                }
            }.bind(this)
        },
        y: {
            get: function() {
                return startY;
            },
            set: function(newValue) {
                newValue = parseFloat(newValue);
                if (startY !== newValue) {
                    startY = newValue;
                    this._domGradient = createGradient(type, startX, startY, endX, endY, radius);
                    this._apply();
                }
            }.bind(this)
        },
        radius: {
            get: function() {
                return radius;
            },
            set: function(newValue) {
                newValue = parseFloat(newValue);
                if (radius !== newValue) {
                    radius = newValue;
                    this._domGradient = createGradient(type, startX, startY, endX, endY, radius);
                    this._apply();
                }
            }.bind(this)
        }
    });

    this._isGradient = true;
}
util.inherits(Gradient, MagicProperty);

Gradient.LINEAR = "linear";
Gradient.RADIAL = "radial";

module.exports = Gradient;

Gradient.prototype.addStop = function(position, color) {
    position = position < 0 ? 0 : position > 1 ? 1 : position;
    this._domGradient.addColorStop(position, convertColor(color).toString());
    this._apply();
};

Gradient.prototype.asFill = function(ctx) {
    ctx.fillStyle = this._domGradient;
};
Gradient.prototype.asStroke = function(ctx) {
    ctx.strokeStyle = this._domGradient;
};
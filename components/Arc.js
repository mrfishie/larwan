var StyledComponent = require('./Styled');
var util = require('util');

var pathEllipse = (function() {
    if (document.createElement("canvas").getContext('2d').ellipse) {
        return function(ctx, x, y, rx, ry, rotation, start, end, anticlockwise) {
            return ctx.ellipse(x, y, rx, ry, rotation, start, end, anticlockwise);
        };
    } else {
        return function(ctx, x, y, rx, ry, rotation, start, end, anticlockwise) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.scale(rx, ry);
            ctx.arc(0, 0, 1, start, end, anticlockwise);
            ctx.restore();
        }
    }
}());

function ArcComponent() {
    StyledComponent.call(this);

    var startAngle = 0,
        endAngle = 2 * Math.PI,
        antiClockwise = false;

    Object.defineProperties(this, {
        startAngle: {
            get: function() {
                return startAngle;
            },
            set: function(newValue) {
                if (startAngle !== newValue) {
                    startAngle = newValue;
                    this.refresh();
                }
            }
        },
        endAngle: {
            get: function() {
                return endAngle;
            },
            set: function(newValue) {
                if (endAngle !== newValue) {
                    endAngle = newValue;
                    this.refresh();
                }
            }
        },
        antiClockwise: {
            get: function() {
                return antiClockwise;
            },
            set: function(newValue) {
                if (antiClockwise !== newValue) {
                    antiClockwise = newValue;
                    this.refresh();
                }
            }
        }
    });
}
util.inherits(ArcComponent, StyledComponent);
module.exports = ArcComponent;

ArcComponent.prototype.renderSelf = function(areas) {
    StyledComponent.prototype.renderSelf.call(this, areas);

    if (this.fill || this.stroke) {
        this.ctx.beginPath();

        if (this.width === this.height) {
            var halfSize = this.width / 2;
            this.ctx.arc(halfSize, halfSize, this.startAngle, this.endAngle, this.antiClockwise);
        } else {
            var halfWidth = this.width / 2, halfHeight = this.height / 2;

            pathEllipse(this.ctx, halfWidth, halfHeight, halfWidth, halfHeight, 0, this.startAngle, this.endAngle,
                this.antiClockwise);
        }

        if (this.fill) this.ctx.fill();
        if (this.stroke) this.ctx.stroke();
    }
};
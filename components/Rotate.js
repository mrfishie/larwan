var Component = require('./Component');
var util = require('util');

var maxRad = 2 * Math.PI;

function RotateComponent(angle) {
    Component.call(this);

    angle = angle || 0;

    var centerX = false, centerY = false;

    Object.defineProperties(this, {
        angle: {
            get: function() {
                return angle;
            },
            set: function(newValue) {
                newValue %= maxRad;
                if (angle !== newValue) {
                    this.refreshChildren();
                    angle = newValue;
                    this.refreshChildren();
                }
            }
        },
        centerX: {
            get: function() {
                return centerX;
            },
            set: function(newValue) {
                if (centerX !== newValue) {
                    centerX = newValue;
                    this.refresh();
                }
            }
        },
        centerY: {
            get: function() {
                return centerY;
            },
            set: function(newValue) {
                if (centerY !== newValue) {
                    centerY = newValue;
                    this.refresh();
                }
            }
        }
    });
}
util.inherits(RotateComponent, Component);
module.exports = RotateComponent;

RotateComponent.prototype.renderSelf = function(areas) {
    if (this.angle) {
        this.ctx.save();

        var centerX = this.centerX === false ? this.width / 2 : this.centerX;
        var centerY = this.centerY === false ? this.height / 2 : this.centerY;

        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(this.angle);
        this.ctx.translate(-centerX, -centerY);
        Component.prototype.renderSelf.call(this, areas);

        this.ctx.restore();
    } else Component.prototype.renderSelf.call(this, areas);
};

var quarter_rad = Math.PI / 2;

RotateComponent.prototype.transformDirtyArea = function(c) {
    if (this.angle === 0) return c;

    var rotation = this.angle;
    var ct = Math.cos(rotation), st = Math.sin(rotation);

    var originalX = c[0], originalY = c[1], originalWidth = c[2], originalHeight = c[3];

    var x1 = originalX, y1 = originalY, x2 = originalX + originalWidth, y2 = originalY + originalHeight;

    var centerX = this.centerX === false ? this.width / 2 : this.centerX;
    var centerY = this.centerY === false ? this.height / 2 : this.centerY;

    var x1c = x1 - centerX;
    var x2c = x2 - centerX;
    var y1c = y1 - centerY;
    var y2c = y2 - centerY;

    var x1prim = x1c * ct - y1c * st;
    var y1prim = x1c * st + y1c * ct;
    var x12prim = x1c * ct - y2c * st;
    var y12prim = x1c * st + y2c * ct;
    var x2prim = x2c * ct - y2c * st;
    var y2prim = x2c * st + y2c * ct;
    var x21prim = x2c * ct - y1c * st;
    var y21prim = x2c * st + y1c * ct;

    // add some padding to account for anti-aliasing
    var rx1 = centerX + Math.min(x1prim, x2prim, x12prim, x21prim) - 2;
    var ry1 = centerY + Math.min(y1prim, y2prim, y12prim, y21prim) - 2;
    var rx2 = centerX + Math.max(x1prim, x2prim, x12prim, x21prim) + 2;
    var ry2 = centerY + Math.max(y1prim, y2prim, y12prim, y21prim) + 2;

    return Component.prototype.transformDirtyArea.call(this, [
        rx1,
        ry1,
        rx2 - rx1,
        ry2 - ry1
    ]);
};
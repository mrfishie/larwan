var Component = require('./Component');
var util = require('util');

function ScaleComponent(scaleX, scaleY) {
    Component.call(this);

    scaleX = scaleX || 1;
    scaleY = scaleY || 1;

    Object.defineProperties(this, {
        scaleX: {
            get: function() {
                return scaleX;
            },
            set: function(newValue) {
                if (scaleX !== newValue) {
                    scaleX = newValue;
                    this.refresh();
                }
            }
        },
        scaleY: {
            get: function() {
                return scaleY;
            },
            set: function(newValue) {
                if (scaleY !== newValue) {
                    scaleY = newValue;
                    this.refresh();
                }
            }
        }
    });
}
util.inherits(ScaleComponent, Component);
module.exports = ScaleComponent;

ScaleComponent.prototype.renderSelf = function(areas) {
    if (this.scaleX === 1 && this.scaleY === 1) Component.prototype.renderSelf.call(this, areas);
    else {
        this.ctx.save();

        this.ctx.scale(this.scaleX, this.scaleY);
        Component.prototype.renderSelf.call(this, areas);

        this.ctx.restore();
    }
};
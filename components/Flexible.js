var Component = require('./Component');
var util = require('util');

function FlexibleComponent() {
    Component.call(this);

    var minWidth = 0, minHeight = 0, maxWidth = false, maxHeight = false;

    Object.defineProperties(this, {
        minWidth: {
            get: function() {
                return minWidth;
            },
            set: function(newValue) {
                if (!util.isNumber(newValue)) newValue = parseFloat(newValue);
                if (newValue < 0) newValue = 0;
                if (minWidth !== newValue) {
                    minWidth = newValue;
                    if (this.width < minWidth) this.refresh();
                }
            }
        },
        minHeight: {
            get: function() {
                return minHeight;
            },
            set: function(newValue) {
                if (!util.isNumber(newValue)) newValue = parseFloat(newValue);
                if (newValue < 0) newValue = 0;
                if (minHeight !== newValue) {
                    minHeight = newValue;
                    if (this.height < minHeight) this.refresh();
                }
            }
        },
        maxWidth: {
            get: function() {
                return maxWidth;
            },
            set: function(newValue) {
                if (!util.isNumber(newValue)) newValue = parseFloat(newValue);
                if (newValue < 0) newValue = false;
                if (maxWidth !== newValue) {
                    maxWidth = newValue;
                    if (maxWidth !== false && this.width > maxWidth) this.refresh();
                }
            }
        },
        maxHeight: {
            get: function() {
                return maxHeight;
            },
            set: function(newValue) {
                if (!util.isNumber(newValue)) newValue = parseFloat(newValue);
                if (newValue < 0) newValue = false;
                if (maxHeight !== newValue) {
                    maxHeight = newValue;
                    if (maxHeight !== false && this.height > maxHeight) this.refresh();
                }
            }
        }
    });
}
util.inherits(FlexibleComponent, Component);

module.exports = FlexibleComponent;

FlexibleComponent.prototype.renderSelf = function(areas) {
    var furthestX = this.minWidth;
    var furthestY = this.minHeight;

    this.dirtyChildren.forEach(function(item) {
        var rightX = item.x + item.width, bottomY = item.y + item.height;
        if (rightX > furthestX) furthestX = rightX;
        if (bottomY > furthestY) furthestY = bottomY;
    });

    if (this.maxWidth !== false) furthestX = Math.min(this.maxWidth, furthestX);
    if (this.maxHeight !== false) furthestY = Math.min(this.maxHeight, furthestY);

    this.width = furthestX;
    this.height = furthestY;

    Component.prototype.renderSelf.call(this, areas);
};
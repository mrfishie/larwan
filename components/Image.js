var RectangleComponent = require('./Rectangle');
var util = require('util');

function ImageComponent() {
    RectangleComponent.call(this);

    var source = false,
        rectX = 0,
        rectY = 0,
        rectWidth = false,
        rectHeight = false;

    Object.defineProperties(this, {
        source: {
            get: function() {
                return source;
            },
            set: function(newValue) {
                if (source !== newValue) {
                    if (typeof newValue === "string") {
                        source = new Image();
                        source.src = newValue;
                    } else source = newValue;
                    this.refresh();
                }
            }
        },
        rectX: {
            get: function() {
                return rectX;
            },
            set: function(newValue) {
                if (rectX !== newValue) {
                    rectX = newValue;
                    this.refresh();
                }
            }
        },
        rectY: {
            get: function() {
                return rectY;
            },
            set: function(newValue) {
                if (rectY !== newValue) {
                    rectY = newValue;
                    this.refresh();
                }
            }
        },
        rectWidth: {
            get: function() {
                return rectWidth;
            },
            set: function(newValue) {
                if (rectWidth !== newValue) {
                    rectWidth = newValue;
                    this.refresh();
                }
            }
        },
        rectHeight: {
            get: function() {
                return rectHeight;
            },
            set: function(newValue) {
                if (rectHeight !== newValue) {
                    rectHeight = newValue;
                    this.refresh();
                }
            }
        }
    });
}
util.inherits(ImageComponent, RectangleComponent);
module.exports = ImageComponent;

ImageComponent.prototype.renderSelf = function(areas) {
    RectangleComponent.prototype.renderSelf.call(this, areas);

    var rectWidth = this.rectWidth ? this.rectWidth : this.source.width;
    var rectHeight = this.rectHeight ? this.rectHeight : this.source.height;

    if (this.source) this.ctx.drawImage(this.source, this.rectX, this.rectY, rectWidth, rectHeight, 0, 0, this.width, this.height);
};
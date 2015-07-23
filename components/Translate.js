var Component = require('./Component');
var util = require('util');

function TranslateComponent(translateX, translateY) {
    Component.call(this);

    translateX = translateX || 0;
    translateY = translateY || 0;

    Object.defineProperties(this, {
        translateX: {
            get: function() {
                return translateX;
            },
            set: function(newValue) {
                if (translateX !== newValue) {
                    translateX = newValue;
                    this.refresh();
                }
            }
        },
        translateY: {
            get: function() {
                return translateY;
            },
            set: function(newValue) {
                if (translateY !== newValue) {
                    translateY = newValue;
                    this.refresh();
                }
            }
        }
    });
}
util.inherits(TranslateComponent, Component);
module.exports = TranslateComponent;

TranslateComponent.prototype.renderSelf = function(areas) {
    if (this.translateX || this.translateY) {
        this.ctx.save();

        this.ctx.translate(this.translateX, this.translateY);
        Component.prototype.renderSelf.call(this, areas);

        this.ctx.restore();
    } else Component.prototype.renderSelf.call(this, areas);
};
var Component = require('./Component');
var convertFill = require('../style/convertFill');
var convertStroke = require('../style/convertStroke');
var convertShadow = require('../style/convertShadow');
var util = require('util');

function StyledComponent() {
    Component.call(this);

    var fill = false,
        stroke = false,
        shadow = false;

    Object.defineProperties(this, {
        fill: {
            get: function() {
                return fill;
            },
            set: function(newValue) {
                if (newValue === false) fill = false;
                else {
                    fill = convertFill(newValue);
                    fill.applyOn(this.ctx);
                }
                this.refresh();
            }
        },
        stroke: {
            get: function() {
                return stroke;
            },
            set: function(newValue) {
                if (newValue === false) stroke = false;
                else {
                    stroke = convertStroke(newValue);
                    stroke.applyOn(this.ctx);
                }
                this.refresh();
            }
        },
        shadow: {
            get: function() {
                return shadow;
            },
            set: function(newValue) {
                if (newValue === false) shadow = false;
                else {
                    shadow = convertShadow(newValue);
                    shadow.applyOn(this.ctx);
                }
                this.refresh();
            }
        }
    });

    this.on('resize', function() {
        if (fill) fill.applyOn(this.ctx);
        if (stroke)stroke.applyOn(this.ctx);
        if (shadow) shadow.applyOn(this.ctx);
    }.bind(this));
}
util.inherits(StyledComponent, Component);
module.exports = StyledComponent;
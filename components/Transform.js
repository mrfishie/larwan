var Component = require('./Component');
var Matrix = require('../utils/Matrix');
var util = require('util');

function TransformComponent(m) {
    Component.call(this);

    var matrix;

    Object.defineProperties(this, {
        matrix: {
            get: function() {
                return matrix;
            },
            set: function(newValue) {
                matrix = Matrix.from(newValue);
            }
        }
    });

    this.matrix = m;
}
util.inherits(TransformComponent, Component);
module.exports = TransformComponent;

TransformComponent.prototype.renderSelf = function(areas) {
    if (this.matrix.isIdentity()) Component.prototype.renderSelf.call(this, areas);
    else {
        this.ctx.save();

        // todo: cache transforming
        this.ctx.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e,
                              this.matrix.f);

        Component.prototype.renderSelf.call(this, areas);

        this.ctx.restore();
    }
};
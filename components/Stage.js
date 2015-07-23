var util = require('util');
var Component = require('./Component');

function StageComponent() {
    Component.call(this);

    this.isStage = true;
    this.clearDirty = true;
}
util.inherits(StageComponent, Component);

module.exports = StageComponent;

StageComponent.prototype.render = function(renderer) {
    this.$canvas = renderer.$canvas;
    this.ctx = renderer.ctx;

    Component.prototype.render.call(this);
};
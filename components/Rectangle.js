var StyledComponent = require('./Styled');
var util = require('util');

function RectangleComponent() {
    StyledComponent.call(this);
}
util.inherits(RectangleComponent, StyledComponent);
module.exports = RectangleComponent;

RectangleComponent.prototype.renderSelf = function(areas) {
    if (this.fill) this.ctx.fillRect(0, 0, this.width, this.height);

    StyledComponent.prototype.renderSelf.call(this, areas);

    if (this.stroke) {
        var strokeSize = this.stroke.width,
            twoStroke = strokeSize * 2;

        this.ctx.strokeRect(strokeSize, strokeSize, this.width - twoStroke, this.height - twoStroke);
    }
};
exports.createCanvas = function() {
    var $canvas = document.createElement('canvas');
    //document.body.appendChild($canvas);
    return $canvas;
};
exports.createSvg = function() {
    return document.createElement('svg');
};

exports.drawRenderAreas = false;

exports.snapToPixel = true;
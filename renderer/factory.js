var Renderer = require('./Renderer');

/**
 * Creates a Renderer instance
 *
 * @param {HTMLCanvasElement} $canvas
 * @returns {Renderer}
 */
exports.create = function($canvas) {
    return new Renderer($canvas);
};
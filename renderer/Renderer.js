var EventEmitter = require('events').EventEmitter;
var util = require('util');

var g = window || global || this;

var raf = g ? (g.requestAnimationFrame || g.mozRequestAnimationFrame || g.oRequestAnimationFrame ||
                    g.webkitRequestAnimationFrame) : false;

if (!raf && console && console.warn) {
    console.warn("No requestAnimationFrame function is defined in the global namespace. A 30FPS render loop will be" +
        "used instead");

    raf = function(func) {
        setTimeout(func, 1000 / 30);
    };
}

/**
 * Get a current timestamp in milliseconds.
 * Uses Performance.now if present, else Date.now if present, else Date#getTime.
 */
var getNow = (function() {
    if (g.performance && typeof g.performance.now === "function") return g.performance.now.bind(g.performance);
    else if (typeof Date.now === "function") return Date.now.bind(Date);

    return function() {
        return (new Date()).getTime();
    };
}());

/**
 * The top-level item of the rendering tree, which manages the stage and rendering/update loops.
 *
 * @param {HTMLCanvasElement} $canvas The canvas element to render to
 * @param {Number=60} updateFps The FPS at which to run the update loop, set to false to disable, or 0 to run as fast
 *                              as possible.
 * @constructor
 */
function Renderer($canvas, updateFps) {
    EventEmitter.call(this);

    this._queueFunc = raf;
    this.stage = false;

    this.updateFps = updateFps || 60;
    this._updateInterval = false;

    this.running = false;

    this.$canvas = $canvas;
    this.ctx = $canvas.getContext('2d');

    this._lastRenderUpdate = getNow();
}
util.inherits(Renderer, EventEmitter);

module.exports = Renderer;

/**
 * Called every render cycle to renew the loop and start the render operation.
 *
 * @private
 */
Renderer.prototype._cycle = function() {
    this._queueFunc.call(g, function() {
        if (!this.running) return;

        var now = getNow();
        var dt = now - this._lastRenderUpdate;
        this._lastRenderUpdate = now;

        this.emit('preRender', dt);
        if (this.stage && this.stage.isStage) {
            this.stage.render(this);
            this._cycle();
        }
        this.emit('postRender');
    }.bind(this), this.running);
};

/**
 * Set the render loop queue function. The function is called every render frame with two arguments:
 * the function to call for the next loop, and whether the loop is still running.
 *
 * This function *should not* call the next loop function synchronously; this will result in
 * the browser hanging.
 *
 * @param {Function} func
 */
Renderer.prototype.queue = function(func) {
    if (typeof func !== "function") throw new TypeError("Argument passed to #queue must be a function");
    this._queueFunc = func;
};

/**
 * Starts the render and update (if enabled) loops.
 */
Renderer.prototype.start = function() {
    if (!this._queueFunc || typeof this._queueFunc !== "function") throw new Error("No queue function has been set");
    if (this.running) throw new Error("The renderer is already running");

    var lastUpdate = getNow();

    if (this.updateFps !== false) {
        if (this._updateInterval !== false) clearInterval(this._updateInterval);
        this._updateInterval = setInterval(function () {
            var now = getNow();
            var dt = now - lastUpdate;
            lastUpdate = now;

            this.emit('update', dt);
            if (this.stage && this.stage.isStage) this.stage.update(dt);
        }.bind(this), this.updateFps !== 0 ? 1000 / this.updateFps : 0);
    }

    this.running = true;
    this._cycle();
};

/**
 * Stops the render and update loops.
 */
Renderer.prototype.stop = function() {
    if (this._updateInterval !== false) {
        clearInterval(this._updateInterval);
        this._updateInterval = false;
    }
    this.running = false;
};
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function MagicProperty() {
    EventEmitter.call(this);

    this._subscribers = [];

    this.on('refresh', this._apply.bind(this));
}
util.inherits(MagicProperty, EventEmitter);

module.exports = MagicProperty;

MagicProperty.prototype._subscribe = function(component, update) {
    this._subscribers.push(component);
    this._subscribers.push(update || function() { });

    if (update) update();
};

MagicProperty.prototype._unsubscribe = function(component) {
    var index = this._subscribers.indexOf(component);
    if (index !== -1) this._subscribers.splice(index, 2);
};

MagicProperty.prototype._apply = function() {
    for (var i = 0; i < this._subscribers.length; i += 2) {
        this._subscribers[i + 1]();
        this._subscribers[i].emit('refresh', this);
    }
};
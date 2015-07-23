var Stroke = require('./Stroke');

module.exports = function(s) {
    if (s._isStroke) return s;
    return new Stroke(s);
};
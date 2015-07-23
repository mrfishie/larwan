var Color = require('./Color');

module.exports = function(c) {
    if (c._isColor) return c;
    return new Color(c);
};
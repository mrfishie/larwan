var Shadow = require('./Shadow');

module.exports = function(s) {
    if (s._isShadow) return s;
    return new Shadow(s);
};
var Fill = require('./Fill');

module.exports = function(f) {
    if (f._isFill) return f;
    return new Fill(f);
};
function RollingFpsCounter() {
    this.limit = 60;
    this._list = [];
}
module.exports = RollingFpsCounter;

RollingFpsCounter.prototype.add = function(n) {
    this._list.push(n);
    if (this._list.length > this.limit) this._list.shift();
};

RollingFpsCounter.prototype.current = function() {
    // calculate the average
    var total = 0, listLength = this._list.length;
    if (listLength === 0) return 0;
    for (var i = 0; i < listLength; i++) total += this._list[i];

    return total / listLength;
};
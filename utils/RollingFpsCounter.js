function RollingFpsCounter() {
    this.limit = 60;
    this._list = [];

    this._current = false;
}
module.exports = RollingFpsCounter;

RollingFpsCounter.prototype.add = function(n) {
    this._list.push(n);
    if (this._list.length > this.limit) this._list.shift();
    this._current = false;
};

RollingFpsCounter.prototype.current = function() {
    if (this._current === false) {
        // calculate the average
        var total = 0, listLength = this._list.length;
        if (listLength === 0) this._current = 0;
        else {
            for (var i = 0; i < listLength; i++) total += this._list[i];
            this._current = total / listLength;
        }
    }
    return this._current;
};
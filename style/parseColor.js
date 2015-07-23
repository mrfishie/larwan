var cssColors = require('./cssColors');

function clampByte(i) {
    i = Math.round(i);
    return i < 0 ? 0 : i > 255 ? 255 : i;
}

function clampFloat(f) {
    return f < 0 ? 0 : f > 1 ? 1 : f;
}

function parseCssInt(str) {
    if (str[str.length - 1] === '%') return clampByte(parseFloat(str) / 100 * 255);
    return clampByte(parseInt(str));
}

function parseCssFloat(str) {
    if (str[str.length - 1] === '%') return clampFloat(parseFloat(str) / 100);
    return clampFloat(parseFloat(str));
}

module.exports = function(str) {
    str = str.replace(/ /g, '').toLowerCase();
    if (cssColors[str]) return { rgba: cssColors[str] };

    if (str[0] === '#') {
        if (str.length === 4) {
            var n = parseInt(str.substr(1), 16);
            if (n >= 0 && n <= 0xfff) return { smallHex: n };
        } else if (str.length === 7) {
            var n2 = parseInt(str.substr(1), 16);
            if (n2 >= 0 && n2 <= 0xffffff) return { hex: n2 };
        }
        return { invalid: true };
    }

    var op = str.indexOf('('), ep = str.indexOf(')');
    if (op !== -1 && ep + 1 === str.length) {
        var fname = str.substr(0, op);
        var params = str.substr(op + 1, ep - (op + 1)).split(',');
        var alpha = 1;

        //noinspection FallThroughInSwitchStatementJS
        switch (fname) {
            case 'rgba':
                if (params.length === 4) alpha = parseCssFloat(params.pop());
            case 'rgb':
                if (params.length === 3) {
                    return { rgba: [
                        parseCssInt(params[0]),
                        parseCssInt(params[1]),
                        parseCssInt(params[2]),
                        alpha
                    ] };
                } else return { invalid: true };
            case 'hsla':
                if (params.length === 4) alpha = parseCssFloat(params.pop());
            case 'hsl':
                if (params.length === 3) {
                    return {
                        hsla: [
                            (((parseFloat(params[0]) % 360) + 360) % 360) / 360,
                            parseCssFloat(params[1]),
                            parseCssFloat(params[2]),
                            alpha
                        ]
                    };
                } else return { invalid: true };
            default:
                return { invalid: true };
        }
    }

    return { invalid: true };
};
var config = require('../config');
var util = require('util');
var svg = config.createSvg();

function Matrix(a, b, c, d, e, f) {
    a = a == null ? 1 : a;
    b = b || 0;
    c = c || 0;
    d = d == null ? 1 : d;
    e = e || 0;
    f = f || 0;

    this._svgMatrixCache = false;

    Object.defineProperties(this, {
        a: {
            get: function() {
                return a;
            },
            set: function(newValue) {
                newValue = parseFloat(newValue);
                if (a !== newValue) {
                    a = newValue;
                    this._svgMatrixCache = false;
                }
            }.bind(this)
        },
        b: {
            get: function() {
                return b;
            },
            set: function(newValue) {
                newValue = parseFloat(newValue);
                if (b !== newValue) {
                    b = newValue;
                    this._svgMatrixCache = false;
                }
            }.bind(this)
        },
        c: {
            get: function() {
                return c;
            },
            set: function(newValue) {
                newValue = parseFloat(newValue);
                if (c !== newValue) {
                    c = newValue;
                    this._svgMatrixCache = false;
                }
            }.bind(this)
        },
        d: {
            get: function() {
                return d;
            },
            set: function(newValue) {
                newValue = parseFloat(newValue);
                if (d !== newValue) {
                    d = newValue;
                    this._svgMatrixCache = false;
                }
            }.bind(this)
        },
        e: {
            get: function() {
                return e;
            },
            set: function(newValue) {
                newValue = parseFloat(newValue);
                if (e !== newValue) {
                    e = newValue;
                    this._svgMatrixCache = false;
                }
            }.bind(this)
        },
        f: {
            get: function() {
                return f;
            },
            set: function(newValue) {
                newValue = parseFloat(newValue);
                if (f !== newValue) {
                    f = newValue;
                    this._svgMatrixCache = false;
                }
            }.bind(this)
        }
    });
}
module.exports = Matrix;

Matrix.fromSvgMatrix = function(svgMatrix) {
    return new Matrix(svgMatrix.a, svgMatrix.b, svgMatrix.c, svgMatrix.d, svgMatrix.e, svgMatrix.f);
};

Matrix.fromArray = function(z) {
    var a = 1, b = 0, c = 0, d = 1, e = 0, f = 0;

    var zLength = z.length;
    if (zLength) {
        if (util.isArray(z[0])) {
            var topRow, bottomRow, topLength, bottomLength;

            if (z.length === 3 && z[0].length < 3) {
                // 3x2 matrix
                topRow = z[0];
                var middleRow = z[1];
                bottomRow = z[2];

                topLength = topRow.length;
                var middleLength = middleRow.length;
                bottomLength = bottomRow.length;

                //noinspection FallThroughInSwitchStatementJS
                switch (topLength) {
                    case 2:
                        b = topRow[1];
                    case 1:
                        a = topRow[0];
                }
                //noinspection FallThroughInSwitchStatementJS
                switch (middleLength) {
                    case 2:
                        d = middleRow[1];
                    case 1:
                        c = middleRow[0];
                }
                //noinspection FallThroughInSwitchStatementJS
                switch (bottomLength) {
                    case 2:
                        f = bottomRow[1];
                    case 1:
                        e = bottomRow[0];
                }
            } else if (z.length >= 2) {
                // 2x3 matrix
                topRow = z[0];
                bottomRow = z[1];
                topLength = topRow.length;
                bottomLength = bottomRow.length;

                //noinspection FallThroughInSwitchStatementJS
                switch (topLength) {
                    case 3:
                        e = topRow[2];
                    case 2:
                        c = topRow[1];
                    case 1:
                        a = topRow[0];
                }
                //noinspection FallThroughInSwitchStatementJS
                switch (bottomLength) {
                    case 3:
                        f = bottomRow[2];
                    case 2:
                        d = bottomRow[1];
                    case 1:
                        b = bottomRow[0];
                }
            }
        } else {
            //noinspection FallThroughInSwitchStatementJS
            switch (zLength) {
                case 6:
                    f = z[5];
                case 5:
                    e = z[4];
                case 4:
                    d = z[3];
                case 3:
                    c = z[2];
                case 2:
                    b = z[1];
                case 1:
                    a = z[0];
            }
        }
    }

    return new Matrix(a, b, c, d, e, f);
};

Matrix.from = function(z) {
    if (z instanceof Matrix) return z;
    if (util.isArray(z)) return Matrix.fromArray(z);
    if (SVGMatrix && z instanceof SVGMatrix) return Matrix.fromSvgMatrix(z);
    throw new Error("Invalid matrix");
};

Matrix.prototype.toSvgMatrix = function() {
    if (this._svgMatrixCache) return this._svgMatrixCache;

    var m = svg.createSVGMatrix();
    m.a = this.a;
    m.b = this.b;
    m.c = this.c;
    m.d = this.d;
    m.e = this.e;
    m.f = this.f;
    this._svgMatrixCache = m;

    return m;
};

Matrix.prototype.multiply = function(matrix) {
    return Matrix.fromSvgMatrix(this.toSvgMatrix().multiply(Matrix.from(matrix)));
};

Matrix.prototype.inverse = function() {
    return Matrix.fromSvgMatrix(this.toSvgMatrix().inverse());
};

Matrix.prototype.translate = function(x, y) {
    return Matrix.fromSvgMatrix(this.toSvgMatrix().translate(x, y));
};

Matrix.prototype.scale = function(factorX, factorY) {
    var scaled, self = this.toSvgMatrix();
    if (factorY == null) scaled = self.scale(factorX);
    else scaled = self.scaleNonUniform(factorX, factorY);

    return Matrix.fromSvgMatrix(scaled);
};

Matrix.prototype.rotate = function(angle_x, y) {
    var rotated, self = this.toSvgMatrix();
    if (y == null) rotated = self.rotate(angle_x);
    else rotated = self.rotateFromVector(angle_x, y);

    return Matrix.fromSvgMatrix(rotated);
};

Matrix.prototype.flipX = function() {
    return Matrix.fromSvgMatrix(this.toSvgMatrix().flipX());
};

Matrix.prototype.flipY = function() {
    return Matrix.fromSvgMatrix(this.toSvgMatrix().flipY());
};

Matrix.prototype.skewX = function(angle) {
    return Matrix.fromSvgMatrix(this.toSvgMatrix().skewX(angle));
};

Matrix.prototype.skewY = function(angle) {
    return Matrix.fromSvgMatrix(this.toSvgMatrix().skewY(angle));
};

Matrix.prototype.isIdentity = function() {
    return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.e === 0 && this.f === 0;
};
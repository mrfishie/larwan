var EventEmitter = require('events').EventEmitter;
var util = require('util');

var config = require('../config');

function Component() {
    EventEmitter.call(this);

    this.children = [];

    this.dirty = false;
    this.dirtyChildren = [];
    this.dirtyPositions = [];
    this._isAllDirty = false;

    this.parent = false;

    this.clones = [];

    this.isStage = false;

    this.on('dirty', this._isDirty.bind(this));
    this.on('dirtyChild', this._dirtyChild.bind(this));

    var x = 0, y = 0, z = 0;

    Object.defineProperties(this, {
        x: {
            /**
             * Gets the X position of the component
             *
             * @returns {number}
             */
            get: function() {
                return x;
            },
            /**
             * Sets the X position of the component, and marks the parent as dirty
             * in the old and new position.
             *
             * @param {number} newValue
             */
            set: function(newValue) {
                if (typeof newValue !== "number") newValue = parseFloat(newValue);
                if (newValue != x) {
                    if (this.parent) this.parent.emit('dirtyChild', this);
                    x = newValue;
                    if (this.parent) this.parent.emit('dirtyChild', this);
                }
            }.bind(this)
        },
        y: {
            /**
             * Gets the Y position of the component
             *
             * @returns {number}
             */
            get: function() {
                return y;
            },
            /**
             * Sets the Y position of the component, and marks the parent as dirty
             * in the old and new position.
             *
             * @param {number} newValue
             */
            set: function(newValue) {
                if (typeof newValue !== "number") newValue = parseFloat(newValue);
                if (newValue != y) {
                    if (this.parent) this.parent.emit('dirtyChild', this);
                    y = newValue;
                    if (this.parent) this.parent.emit('dirtyChild', this);
                }
            }.bind(this)
        },
        z: {
            /**
             * Gets the Z position (i.e layer) of the component
             *
             * @returns {number}
             */
            get: function() {
                return z;
            },
            /**
             * Sets the Z position of the component, and marks the parent as dirty.
             * There is no point in setting the parent as dirty twice as the component
             * has not actually 'moved'.
             *
             * @param {number} newValue
             */
            set: function(newValue) {
                if (typeof newValue !== "number") newValue = parseFloat(newValue);
                if (newValue != z) {
                    z = newValue;
                    if (this.parent) this.parent.emit('dirtyChild', this);
                }
            }.bind(this)
        },

        stageX: {
            /**
             * Gets the X position of the component relative to the stage instead of parent.
             * Note: if the component does not have a stage, it will return the X position
             * relative to the highest parent.
             *
             * @returns {number}
             */
            get: function() {
                var position = this.x;

                var stage = this.parent;
                while (stage && !stage.isStage) {
                    position += stage.x;
                    stage = stage.parent;
                }

                return position;
            }.bind(this)
        },
        stageY: {
            /**
             * Gets the Y position of the component relative to the stage instead of parent.
             * Note: if the component does not have a stage, it will return the Y position
             * relative to the highest parent.
             *
             * @returns {number}
             */
            get: function() {
                var position = this.y;

                var stage = this.parent;
                while (stage && !stage.isStage) {
                    position += stage.y;
                    stage = stage.parent;
                }

                return position;
            }.bind(this)
        },
        stageZ: {
            /**
             * Gets the Z position of the component relative to the stage instead of parent.
             * Note: if the component does not have a stage, it will return the Z position
             * relative to the highest parent.
             *
             * @returns {number}
             */
            get: function() {
                var position = this.z;

                var stage = this.parent;
                while (stage && !stage.isStage) {
                    position += stage.z;
                    stage = stage.parent;
                }

                return position;
            }.bind(this)
        },
        stagePosition: {
            /**
             * A more optimized version of stageX, stageY, and stageZ. If you need more than
             * one of the absolute values, it is better to use this function to avoid
             * traversing the render tree multiple times.
             *
             * @see stageX, stageY, stageZ
             * @returns {number}
             */
            get: function() {
                var positionX = this.x;
                var positionY = this.y;
                var positionZ = this.z;

                var stage = this.parent;
                while (stage && !stage.isStage) {
                    positionX += stage.x;
                    positionY += stage.y;
                    positionZ += stage.z;
                    stage = stage.parent;
                }

                return {
                    x: positionX,
                    y: positionY,
                    z: positionY
                };
            }.bind(this)
        },

        width: {
            get: function() {
                return this.$canvas.width;
            }.bind(this),
            set: function(newValue) {
                if (typeof newValue !== "number") newValue = parseFloat(newValue);

                if (newValue < 0) newValue = 0;

                if (newValue != this.$canvas.width) {
                    if (newValue < this.$canvas.width && this.parent) this.parent.emit('dirtyChild', this);
                    this.$canvas.width = newValue;
                    this.emit('resize');
                    this.refresh();
                }
            }.bind(this)
        },
        height: {
            get: function() {
                return this.$canvas.height;
            }.bind(this),
            set: function(newValue) {
                if (typeof newValue !== "number") newValue = parseFloat(newValue);

                if (newValue < 0) newValue = 0;

                if (newValue != this.$canvas.height) {
                    if (newValue < this.$canvas.height && this.parent) this.parent.emit('dirtyChild', this);
                    this.$canvas.height = newValue;
                    this.emit('resize');
                    this.refresh();
                }
            }.bind(this)
        }
    });

    this.$canvas = config.createCanvas();
    this.$canvas.width = this.width;
    this.$canvas.height = this.height;
    this.ctx = this.$canvas.getContext('2d');

    this.clearDirty = true;
}
util.inherits(Component, EventEmitter);
module.exports = Component;

/**
 * Update the component and children.
 *
 * This method should be overridden by Component classes, but they should always call this to
 * update all children.
 *
 * @param {number} delta The milliseconds between the last tick
 */
Component.prototype.update = function(delta) {
    this.children.forEach(function(child) {
        child.update(delta);
    });
};

function doFloatClear(a) {
    var area = a[1];
    this.ctx.clearRect(area[0], area[1], area[2], area[3]);
}
function doIntClear(a) {
    var area = a[1];
    this.ctx.clearRect(Math.floor(area[0]), Math.floor(area[1]), Math.ceil(area[2]), Math.ceil(area[3]));
}

/**
 * Render all dirty areas of the component.
 *
 * The rendering process is:
 *  1. Render any dirty children to their own canvas
 *  2. Clear all dirty areas on-screen
 *  3. Call the components renderer. This renderer will then call the area renderer, which renders the dirty
 *     areas with all children who are in the areas
 *  4. Reset dirty positions
 */
Component.prototype.render = function() {
    if (!this.dirtyPositions && !this.dirtyPositions.length) return;

    var ctx = this.ctx;

    // render all dirty children
    this.dirtyChildren.forEach(function(child) {
        child.render();
    });

    // clear all render areas
    if (this.clearDirty) {
        this.dirtyPositions.forEach((config.snapToPixel ? doIntClear : doFloatClear).bind(this));
    }

    // call the component renderer
    this.renderSelf(this.dirtyPositions);

    this.dirty = false;
    this.dirtyChildren = [];
    this.dirtyPositions = [];
    this._isAllDirty = false;
};

/**
 * Re-renders children components in the specified areas.
 * Note: this method does not clear the areas.
 *
 * @param {Array<Array>} areas The areas to clear, with each area in the format [x, y, width, height]
 * @private
 */
Component.prototype._renderAreas = function(areas) {
    var ctx = this.ctx;

    if (this.$canvas.width <= 0 || this.$canvas.height <= 0) return;

    areas.forEach(function(a) {
        var area = a[0];
        var leftX = area[0], topY = area[1], width = area[2], height = area[3];

        if (config.snapToPixel) {
            leftX = Math.floor(leftX);
            topY = Math.floor(topY);
            width = Math.ceil(width);
            height = Math.ceil(height);
        }

        var rightX = leftX + width, bottomY = topY + height;

        // children are already sorted in z-order
        this.children.forEach(function(child) {
            var childX = child.x, childY = child.y, childWidth = child.width, childHeight = child.height;

            //var checkSizes = this.transformDirtyArea([childX, childY, childWidth, childHeight]);
            //var checkX = checkSizes[0], checkY = checkSizes[1], checkWidth = checkSizes[2], checkheight = checkSizes[3];


            if (config.snapToPixel) {
                childX = Math.floor(childX);
                childY = Math.floor(childY);
                childWidth = Math.ceil(childWidth);
                childHeight = Math.ceil(childHeight);
            }

            var childRightX = childX + childWidth;
            var childBottomY = childY + childHeight;

            // calculate overlap area
            var overlapX = Math.max(leftX, childX),
                overlapY = Math.max(topY, childY),
                num1 = Math.min(rightX, childRightX),
                num2 = Math.min(bottomY, childBottomY);

            if (num1 < overlapX || num2 < overlapY) return;

            var overlapWidth = num1 - overlapX, overlapHeight = num2 - overlapY;

            // no point rendering if width or height is 0
            if (overlapWidth === 0 || overlapHeight === 0) return;

            // find extraction X and Y in child's coordinates
            var childOverlapX = overlapX - childX,
                childOverlapY = overlapY - childY;

            // if the child is completely inside the parent, we don't need to extract an area
            if (childOverlapX === 0 && childOverlapY === 0 && overlapWidth === childWidth && overlapHeight === childHeight) {
                ctx.drawImage(child.$canvas, overlapX, overlapY);
            } else {
                ctx.drawImage(child.$canvas,
                              childOverlapX, childOverlapY,  // extract position (in child's coordinates)
                              overlapWidth, overlapHeight,   // extract size (in child's coordinates)
                              overlapX, overlapY,            // position to place (in parent's coordinates)
                              overlapWidth, overlapHeight);  // size to place (in parent's coordinates)
            }

            // render a red box around the dirty area
            if (config.drawRenderAreas) {
                ctx.save();
                ctx.strokeStyle = "red";
                ctx.lineWidth = 1;
                ctx.strokeRect(overlapX, overlapY, overlapWidth, overlapHeight);
                ctx.restore();
            }
        }.bind(this));
    }.bind(this));
};

/**
 * The component-customizable render function. Components that override this should call the parent classes
 * renderSelf method, passing the areas array, which will end up calling _renderAreas. As a result the
 * position of the call can be used to layer things in front or behind of the components.
 *
 * Note: only the dirty areas will be copied to this components parent.
 *
 * @param {Array<Array>} areas The dirty areas, with each area in the format [x, y, width, height]
 */
Component.prototype.renderSelf = function(areas) {
    this._renderAreas(areas);
};

/**
 * Marks an area as dirty *in this component*, causing child components' canvases to be redrawn.
 *
 * @param {Object?} rect The area to mark as dirty, omitting marks the whole component as dirty.
 */
Component.prototype.refresh = function(rect) {
    rect = rect || {};
    this.emit('dirty', [
        Math.max(0, rect.x || 0),
        Math.max(0, rect.y || 0),
        rect.width == null ? this.width : Math.min(this.width, rect.width),
        rect.height == null ? this.height : Math.min(this.height, rect.height)
    ]);
    return this;
};

Component.prototype.refreshChildren = function() {
    this.children.forEach(function(child) {
        this.emit('dirtyChild', child);
    }.bind(this));
    return this;
};

/**
 * Forces this component and all child components to re-render all of themselves.
 */
Component.prototype.flush = function() {
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].flush();
    }

    this.refresh();
    return this;
};

/**
 * Marks an area as dirty.
 *
 * @param {Array} positions The position of the dirty area, in the format [x, y, width, height]
 * @param {Array} propagate
 * @private
 */
Component.prototype._isDirty = function(positions, propagate) {
    propagate = propagate || positions;

    if (!this._isAllDirty) {
        if (positions[0] === 0 && positions[1] === 0 &&
            positions[2] === this.width && positions[3] === this.height) {
            this.dirtyPositions = [[positions, propagate]];
            this._isAllDirty = true;
        } else this.dirtyPositions.push([positions, propagate]);
    }

    if (!this.dirty) {
        this.dirty = true;
        if (this.parent) this.parent.emit('dirtyChild', this, propagate);
    }
};

/**
 * Emitted by a dirty child, marks the provided position as dirty on this canvas and then continues
 * the chain.
 *
 * @param {Component} child The child component that is dirty
 * @param {Array?} positions The dirty position relative to the child, in the format [x, y, width, height]
 * @private
 */
Component.prototype._dirtyChild = function(child, positions) {
    if (this.children.indexOf(child) !== -1) {
        if (this.dirtyChildren.indexOf(child) === -1) this.dirtyChildren.push(child);

        positions = positions || [0, 0, child.width, child.height];

        var realPositions = [
            child.x + positions[0],
            child.y + positions[1],
            positions[2],
            positions[3]
        ];

        this.emit('dirty', realPositions, this.transformDirtyArea(realPositions));
    }
};

/**
 * Adds a child to the component. If the component is already a child, nothing happens.
 *
 * @param {Component} child The child to add
 */
Component.prototype.addChild = function(child) {
    if (child.isStage) throw new TypeError("Can't add a stage as a child!");

    if (this.children.indexOf(child) === -1) {
        if (child.parent) child = child.clone();
        child.parent = this;
        this.children.push(child);
        this.emit('dirtyChild', child);

        // re-sort children
        this.children = this.children.sort(function(a, b) {
            return a.z - b.z;
        });
    }

    return this;
};

/**
 * Removes a child from the component. If the component is not a child, it is ignored.
 * If the child was marked as dirty, it will remain dirty.
 *
 * @param {Component} child The child component
 */
Component.prototype.removeChild = function(child) {
    var childrenIndex = this.children.indexOf(child);
    var dirtyIndex = this.dirtyChildren.indexOf(child);
    if (childrenIndex !== -1) this.children.splice(childrenIndex, 1);
    if (dirtyIndex !== -1) this.dirtyChildren.splice(dirtyIndex, 1);

    this.emit('dirty', [
        child.x,
        child.y,
        child.width,
        child.height
    ]);
    child.parent = false;

    return this;
};

/**
 * Performs a modification on the dimensions that are used for dirty checking.
 * This is used for components such as rotate and scale, that must mark a
 * different area as dirty.
 *
 * @param {Array} c The dimensions array, in the format [x, y, width, height]
 * @returns {Array} The transformed array, in the format [x, y, width, height]
 */
Component.prototype.transformDirtyArea = function(c) {
    return c;
};

/**
 * Returns a 'dumb' copy of the component that maintains a two-way relationship,
 * i.e modifying a property on the main and clone modifies the other side.
 * The clone will also use the main component's canvas, and rendering or
 * marking it as dirty will do the same to the main component.
 *
 * Normally this is used to give a component two parents, however it can also
 * be useful for having two of the same item that update together.
 *
 * TODO: implement cloning
 *
 * @returns {Component} The cloned component
 */
Component.prototype.clone = function() {
    return this;
};
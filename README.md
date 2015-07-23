# Larwan

> Larwan is an efficient low-level 2D tree-based rendering engine.

**Larwan is nowhere near completion yet, and probably isn't very stable.**

Larwan designed **for modern browsers only**, making use of new features like `Object.defineProperties` to provide a painless and fast interface, that looks just like normal Javascript. As a result it works in **Internet Explorer 9+, Firefox 4+, Chrome and Opera 12+**. That means it supports all current major browsers. *Note: Larwan hasn't actually been tested in some of these browsers, yet.*

## Installation

Larwan is distributed via NPM. To install Larwan for your project, run

```shell
$ npm install larwan --save
```

Since Larwan is extremely component-based, you will need to build your project (or part of it) with a CommonJS packing system such as Browserify.

Here's an example of using Larwan to draw a colorful rotating square.

```js
var rendererFactory = require('larwan/renderer/factory');
var StageComponent = require('larwan/components/Stage');
var RectangleComponent = require('larwan/components/Rectangle');
var RotateComponent = require('larwan/components/Rotate');

var $canvas = document.getElementById('canvas');
$canvas.width = 500;
$canvas.height = 500;

var renderer = rendererFactory.create($canvas);
var stage = new StageComponent();

var square = new RectangleComponent();
square.width = 100;
square.height = 100;
square.x = 200;
square.y = 200;
square.fill = "red";

var rotator = new RotateComponent();
rotator.width = 500;
rotator.height = 500;

rotator.addChild(square);
stage.addChild(rotator);

renderer.on('update', function(dt) {
	rotator.angle += dt / 3600;
	square.fill.style.h += dt / 16;
	square.fill.applyOn(square.ctx);
});

renderer.stage = stage;
renderer.start();
```

Larwan can also headlessly render in Node with [node-canvas](https://github.com/Automattic/node-canvas).

## Why?

Javascript's canvas system is extremely low-level, and not very fast, and as a result requires a lot of work and optimization to use for complex projects. Many other Javascript rendering engines try to provide everything, and end up being bloated and complicated. Larwan is simple to use, has a familiar syntax and usage, is very fast, and most importantly, is lightweight.

Additionally, Larwan isn't just geared to just games. It's great for any project using canvases.

## Current Features

The following features are currently implemented in Larwan:

 - Standard components for most of CanvasRenderingContext2D's features (including transforms)
 - Complex color and style system (conversion between CSS-formatted colors, RGB(A), and HSL(A))
 - Extensible tree-based component system
 - Efficient rendering mechanism

## Backlog

The following features still need to be completed:

 - Documentation!
 - Path component (allows creation of canvas paths)
 - Tweener (a powerful system to animate properties between values, supporting complex objects like colors)
 - Hit box component?
 - Proper dirty syncing for colors and other complex properties (modifying a color or style currently doesn't mark the object as dirty)
 - Cloning (creates a clone object with the same canvas and two-way property syncing with the base object)

## Contributing

If you've found a bug or have an idea, feel free to create a new issue and provide some information. I'm working on this project in my free time, so please don't feel offended if I can't/don't implement your idea.

If you have some experience with canvas or Javascript optimization, or just want to help with something, I welcome your contributions and pull requests. This is probably the best way to get your 'new feature' implemented: make it work yourself and then create a pull request.

## License

Larwan is licensed under the MIT license. See the LICENSE file for more info.

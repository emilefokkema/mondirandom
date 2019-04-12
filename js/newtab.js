var f = function(require){
	var Instruction = require("./instruction");
	var CanvasWithSize = require("./canvas-with-size");
	var configProvider = require("./config-provider");
	var RandomValueProvider = require("./random-value-provider");
	var FieldSplitter = require("./field-splitter");

	var draw = function(width, height, canvasElement){
		var canvas = new CanvasWithSize(canvasElement, width, height);
		var config = configProvider.getConfig();
		var splitter = new FieldSplitter(width, height, {borderThickness: config.borderThickness});
		splitter.splitAndColor(new RandomValueProvider(config.random), config.numberOfSplits);
		splitter.draw(canvas.context);
		console.log("https://emilefokkema.github.io/mondirandom/?i="+splitter.instruction.toString());
	};

	draw(window.innerWidth, window.innerHeight, document.getElementById("canvas"));
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function" && typeof requirejs !== "undefined"){
	define(f);
}
var f = function(require){
	var Instruction = require("./instruction");
	var CanvasWithSize = require("./canvas-with-size");
	var InstructionValueProvider = require("./instruction-value-provider");
	var FieldSplitter = require("./field-splitter");

	var draw = function(width, height, canvasElement){
		var canvas = new CanvasWithSize(canvasElement, width, height);
		var queryStringParams = window.location.search;
		if(queryStringParams){
			var match = queryStringParams.match(/i=([^&]+)/);
			if(match){
				var instruction = Instruction.parse(match[1]);
				var splitter = new FieldSplitter(width, height, {borderThickness: instruction.borderThickness});
				splitter.splitAndColor(new InstructionValueProvider(instruction), instruction.numberOfSplits);
				splitter.draw(canvas.context);
				return;
			}
		}
	};

	draw(window.innerWidth, window.innerHeight, document.getElementById("canvas"));
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function" && typeof requirejs !== "undefined"){
	define(f);
}
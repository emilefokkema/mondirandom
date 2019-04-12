var f = function(require){
	var Instruction = require("./instruction");
	var CanvasWithSize = require("./canvas-with-size");
	var FieldSplitter = require("./field-splitter");

	var draw = function(width, height, canvasElement){
		var canvas = new CanvasWithSize(canvasElement, width, height);
		var queryStringParams = new URLSearchParams(window.location.search);
		var i = queryStringParams.get("i");
		if(i){
			var instruction = Instruction.parse(i);
			var splitter = new FieldSplitter(instruction.width, instruction.height, {borderThickness: instruction.borderThickness});
			splitter.splitAndColor(instruction.getValueProvider(), instruction.numberOfSplits);
			canvas.fitDrawingOfSize(instruction.width, instruction.height);
			splitter.draw(canvas.context);
			return;
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
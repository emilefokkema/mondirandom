var f = function(require){
	var Instruction = require("./instruction");
	var CanvasWithSize = require("./canvas-with-size");
	var configProvider = require("./config-provider");

	var draw = function(width, height, canvasElement){
		var canvas = new CanvasWithSize(canvasElement, width, height);
		var instruction = Instruction.createForCanvas(canvas, configProvider.getConfig());
		console.log("?i="+instruction.toString());
	};

	draw(window.innerWidth, window.innerHeight, document.getElementById("canvas"));
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function" && typeof requirejs !== "undefined"){
	define(f);
}
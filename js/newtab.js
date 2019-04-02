var f = function(require){
	var Instruction = require("./instruction");
	var CanvasWithSize = require("./canvas-with-size");
	var configProvider = require("./config-provider");
	var Vue = require("vue");

	var draw = function(width, height, canvasElement){
		var canvas = new CanvasWithSize(canvasElement, width, height);
		var instruction = Instruction.createForCanvas(canvas, configProvider.getConfig());
		console.log("https://emilefokkema.github.io/mondirandom/?i="+instruction.toString());
	};

	draw(window.innerWidth, window.innerHeight, document.getElementById("main_canvas"));
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function" && typeof requirejs !== "undefined"){
	requirejs.config({
		paths:{
			vue:["../node_modules/vue/dist/vue"]
		}
	});
	define(f);
}
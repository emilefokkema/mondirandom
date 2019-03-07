var f = function(require){
	var FieldSplitter = require("./field-splitter");
	var Distribution = require("./distribution");
	var RandomValueProvider = require("./random-value-provider");

	var draw = function(width, height, canvasElement){
		canvasElement.setAttribute("width", width);
		canvasElement.setAttribute("height", height);
		var context = canvasElement.getContext("2d");
		var splitter = new FieldSplitter(width, height, new RandomValueProvider(), 5);
		for(var i=0;i<40;i++){
			splitter.splitRandomField();
		}
		splitter.draw(context);
	};

	draw(window.innerWidth, window.innerHeight, document.getElementById("canvas"));
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function" && typeof requirejs !== "undefined"){
	define(f);
}
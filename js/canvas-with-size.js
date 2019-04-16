var f = function(require){
	var FieldSplitter = require("./field-splitter");
	var RandomValueProvider = require("./random-value-provider");

	var CanvasWithSize = function(canvasElement, width, height){
		canvasElement.setAttribute("width", width);
		canvasElement.setAttribute("height", height);
		this.width = width;
		this.height = height;
		this.context = canvasElement.getContext("2d");
	};
	CanvasWithSize.prototype.fitDrawingOfSize = function(width, height){
		var scaling = Math.min(this.width / width, this.height / height);
		this.context.setTransform(scaling, 0, 0, scaling, 0, 0);
	};
	CanvasWithSize.prototype.createMondirandom = function(config){
		var splitter = new FieldSplitter(this.width, this.height, {borderThickness: config.borderThickness});
		splitter.splitAndColor(new RandomValueProvider(config.random), config.numberOfSplits);
		splitter.draw(this.context);
		return splitter.instruction;
	};
	CanvasWithSize.prototype.displayMondirandom = function(instruction){
		var splitter = new FieldSplitter(instruction.width, instruction.height, {borderThickness: instruction.borderThickness});
		splitter.splitAndColor(instruction.getValueProvider(), instruction.numberOfSplits);
		this.fitDrawingOfSize(instruction.width, instruction.height);
		splitter.draw(this.context);
	};

	return CanvasWithSize;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function" && typeof requirejs !== "undefined"){
	define(f);
}
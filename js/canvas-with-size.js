var f = function(require){

	var CanvasWithSize = function(canvasElement, width, height){
		canvasElement.setAttribute("width", width);
		canvasElement.setAttribute("height", height);
		this.width = width;
		this.height = height;
		this.context = canvasElement.getContext("2d");
	};
	CanvasWithSize.prototype.fitDrawingOfSize = function(width, height){
		var horizontalScaling = this.width / width;
		var verticalScaling = this.height / height;
		this.context.setTransform(horizontalScaling, 0, 0, verticalScaling, 0, 0);
	};

	return CanvasWithSize;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function" && typeof requirejs !== "undefined"){
	define(f);
}
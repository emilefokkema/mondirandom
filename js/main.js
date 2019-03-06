(function(){
	var FieldSplitter = require("./field-splitter.js");

	var draw = function(width, height, canvasElement){
		canvasElement.setAttribute("width", width);
		canvasElement.setAttribute("height", height);
		var context = canvasElement.getContext("2d");
		var splitter = new FieldSplitter(width, height);
		for(var i=0;i<40;i++){
			splitter.splitRandomField();
		}
		splitter.drawFields(context);
		splitter.drawBorders(context);
	};

	draw(window.innerWidth, window.innerHeight, document.getElementById("canvas"));
})();
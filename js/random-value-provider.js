var f = function(require){
	var Direction = require("./direction");
	var Color = require("./color");

	var RandomValueProvider = function(){
		this.colors = [Color.RED, Color.BLUE, Color.YELLOW, Color.WHITE, Color.BLACK];
		this.directions = [Direction.VERTICAL, Direction.HORIZONTAL];
	};
	RandomValueProvider.prototype.provideRandomField = function(fieldSplitter){
		var distribution = fieldSplitter.getFieldDistribution();
		var fields = fieldSplitter.fields;
		return distribution.getWeightedValues(fields).getValueAtCutoffRatio(Math.random());
	};
	RandomValueProvider.prototype.provideRandomDirection = function(field){
		var distribution = field.getDirectionDistribution();
		return distribution.getWeightedValues(this.directions).getValueAtCutoffRatio(Math.random());
	};
	RandomValueProvider.prototype.provideRandomColor = function(field){
		var colorDistribution = field.getColorDistribution();
		return colorDistribution.getWeightedValues(this.colors).getValueAtCutoffRatio(Math.random());
	};
	RandomValueProvider.prototype.provideRandomRatio = function(continuousDistribution){
		return continuousDistribution.from + Math.random() * (continuousDistribution.to - continuousDistribution.from);
	};
	return RandomValueProvider;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
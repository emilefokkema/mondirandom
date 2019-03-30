var f = function(require){
	var Direction = require("./direction");
	var Color = require("./color");

	var RandomValueProvider = function(config){
		this.colors = [Color.RED, Color.BLUE, Color.YELLOW, Color.WHITE, Color.BLACK];
		this.directions = [Direction.VERTICAL, Direction.HORIZONTAL];
		this.config = config;
	};
	RandomValueProvider.prototype.provideField = function(fieldSplitter){
		var distribution = fieldSplitter.getFieldDistribution(this.config);
		var fields = fieldSplitter.fields;
		return distribution.getWeightedValues(fields).getValueAtCutoffRatio(Math.random());
	};
	RandomValueProvider.prototype.provideDirection = function(field){
		var distribution = field.getDirectionDistribution(this.config);
		return distribution.getWeightedValues(this.directions).getValueAtCutoffRatio(Math.random());
	};
	RandomValueProvider.prototype.provideSplitPoint = function(field, direction){
		var distribution = field.getSplitPointDistribution(direction, this.config);
		return Math.floor(distribution.getValueAtCutoffRatio(Math.random()));
	};
	RandomValueProvider.prototype.provideColor = function(field, fieldColoring){
		var colorDistribution = field.getColorDistribution(fieldColoring, this.config);
		return colorDistribution.getWeightedValues(this.colors).getValueAtCutoffRatio(Math.random());
	};
	return RandomValueProvider;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
var Direction = require("./direction.js");
var Color = require("./color.js");

var getRandomValue = function(getValueWeight, values){
	var totalWeight = 0;
	var weightedValues = [];
	var i, value;
	for(i=0;i<values.length;i++){
		value = values[i];
		var weight = getValueWeight(value);
		totalWeight += weight;
		weightedValues.push({value:value, weight:weight});
	}
	var cutOff = totalWeight * Math.random();
	totalWeight = 0;
	for(i=0;i<values.length;i++){
		value = values[i];
		totalWeight += weightedValues[i].weight;
		if(totalWeight >= cutOff){
			return value;
		}
	}
};

var RandomValueProvider = function(){
	this.colors = [Color.RED, Color.BLUE, Color.YELLOW, Color.WHITE, Color.BLACK];
	this.directions = [Direction.VERTICAL, Direction.HORIZONTAL];
};
RandomValueProvider.prototype.provideRandomField = function(distribution, fields){
	return getRandomValue(distribution.getValueWeight, fields);
};
RandomValueProvider.prototype.provideRandomDirection = function(distribution){
	return getRandomValue(distribution.getValueWeight, this.directions);
};
RandomValueProvider.prototype.provideRandomColor = function(distribution){
	return getRandomValue(distribution.getValueWeight, this.colors);
};
RandomValueProvider.prototype.provideRandomRatio = function(continuousDistribution){
	return continuousDistribution.from + Math.random() * (continuousDistribution.to - continuousDistribution.from);
};

module.exports = RandomValueProvider;
var TestRandomValueProvider = require("./test-random-value-provider.js");

var splitFieldInDirection = function(splitter, field, direction, splitPoint){
	var randomValueProvider = new TestRandomValueProvider();
	randomValueProvider.randomField = field;
	randomValueProvider.randomDirection = direction;
	randomValueProvider.randomSplitPoint = splitPoint;
	splitter.splitRandomField(randomValueProvider);
};

module.exports = splitFieldInDirection;
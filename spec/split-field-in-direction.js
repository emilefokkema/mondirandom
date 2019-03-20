var TestRandomValueProvider = require("./test-random-value-provider.js");

var splitFieldInDirection = function(splitter, field, direction, ratio){
	var randomValueProvider = new TestRandomValueProvider();
	randomValueProvider.randomField = field;
	randomValueProvider.randomDirection = direction;
	randomValueProvider.randomRatio = ratio;
	splitter.splitRandomField(randomValueProvider);
};

module.exports = splitFieldInDirection;
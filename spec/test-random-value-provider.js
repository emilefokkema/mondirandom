var TestRandomValueProvider = function(){
	this.randomField = undefined;
	this.randomDirection = undefined;
	this.randomColor = undefined;
	this.randomRatio = undefined;
};
TestRandomValueProvider.prototype.provideRandomField = function(fieldSplitter){
	return this.randomField;
};
TestRandomValueProvider.prototype.provideRandomDirection = function(field){
	return this.randomDirection;
};
TestRandomValueProvider.prototype.provideRandomColor = function(field, initialDistribution){
	return this.randomColor;
};
TestRandomValueProvider.prototype.provideRandomRatio = function(){
	return this.randomRatio;
};

module.exports = TestRandomValueProvider;
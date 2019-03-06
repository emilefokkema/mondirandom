var TestRandomValueProvider = function(){
	this.randomField = undefined;
	this.randomDirection = undefined;
	this.randomColor = undefined;
	this.randomRatio = undefined;
};
TestRandomValueProvider.prototype.provideRandomField = function(distribution, fields){
	return this.randomField;
};
TestRandomValueProvider.prototype.provideRandomDirection = function(distribution){
	return this.randomDirection;
};
TestRandomValueProvider.prototype.provideRandomColor = function(distribution){
	return this.randomColor;
};
TestRandomValueProvider.prototype.provideRandomRatio = function(){
	return this.randomRatio;
};

module.exports = TestRandomValueProvider;
var TestRandomValueProvider = function(){
	this.randomField = undefined;
	this.randomDirection = undefined;
	this.fieldColors = [];
	this.randomRatio = undefined;
};
TestRandomValueProvider.prototype.provideRandomField = function(fieldSplitter){
	return this.randomField;
};
TestRandomValueProvider.prototype.provideRandomDirection = function(field){
	return this.randomDirection;
};
TestRandomValueProvider.prototype.provideRandomColor = function(field, initialDistribution){
	for(var i=0;i<this.fieldColors.length;i++){
		var fieldColor = this.fieldColors[i];
		if(fieldColor.field == field){
			return fieldColor.color;
		}
	}
	throw 'No color provided for field';
};
TestRandomValueProvider.prototype.provideRandomRatio = function(){
	return this.randomRatio;
};

module.exports = TestRandomValueProvider;
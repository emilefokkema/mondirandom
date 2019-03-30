var TestRandomValueProvider = function(){
	this.randomField = undefined;
	this.randomDirection = undefined;
	this.fieldColors = [];
	this.randomRatio = undefined;
	this.randomSplitPoint = undefined;
};
TestRandomValueProvider.prototype.provideField = function(fieldSplitter){
	return this.randomField;
};
TestRandomValueProvider.prototype.provideDirection = function(field){
	return this.randomDirection;
};
TestRandomValueProvider.prototype.provideSplitPoint = function(field, direction){
	return this.randomSplitPoint;
};
TestRandomValueProvider.prototype.provideColor = function(field, fieldColoring){
	for(var i=0;i<this.fieldColors.length;i++){
		var fieldColor = this.fieldColors[i];
		if(fieldColor.field == field){
			return fieldColor.color;
		}
	}
	throw 'No color provided for field';
};

module.exports = TestRandomValueProvider;
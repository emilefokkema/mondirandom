var TestRandomValueProvider = function(){
	this._randomFieldIndices = [];
	this._randomDirections = [];
	this.fieldColors = [];
	this._randomSplitPoints = [];
};
TestRandomValueProvider.prototype.provideField = function(fieldSplitter){
	return fieldSplitter.fields[this._randomFieldIndices.shift()];
};
TestRandomValueProvider.prototype.provideDirection = function(field){
	return this._randomDirections.shift();
};
TestRandomValueProvider.prototype.provideSplitPoint = function(field, direction){
	return this._randomSplitPoints.shift();
};
TestRandomValueProvider.prototype.provideColor = function(field, fieldColoring){
	return this.fieldColors.shift();
};
Object.defineProperties(TestRandomValueProvider.prototype, {
	randomFieldIndex:{
		set:function(i){
			this._randomFieldIndices.push(i)
		}
	},
	randomDirection:{
		set:function(d){
			this._randomDirections.push(d);
		}
	},
	randomSplitPoint:{
		set:function(p){
			this._randomSplitPoints.push(p);
		}
	}
});

module.exports = TestRandomValueProvider;
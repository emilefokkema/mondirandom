var f = function(require){
	
	var TrackingValueProvider = function(valueProvider, instruction){
		this.valueProvider = valueProvider;
		this.instruction = instruction;
	};
	TrackingValueProvider.prototype.provideField = function(fieldSplitter){
		var result = this.valueProvider.provideField(fieldSplitter);
		var index = fieldSplitter.fields.indexOf(result);
		this.instruction.chooseFieldIndex(index);
		return result;
	};
	TrackingValueProvider.prototype.provideDirection = function(field){
		var result = this.valueProvider.provideDirection(field);
		this.instruction.chooseDirection(result);
		return result;
	};
	TrackingValueProvider.prototype.provideSplitPoint = function(field, direction){
		var result = this.valueProvider.provideSplitPoint(field, direction);
		this.instruction.chooseSplitPoint(result);
		return result;
	};
	TrackingValueProvider.prototype.provideColor = function(field, fieldColoring){
		var result = this.valueProvider.provideColor(field, fieldColoring);
		this.instruction.chooseColor(result);
		return result;
	};
	return TrackingValueProvider;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
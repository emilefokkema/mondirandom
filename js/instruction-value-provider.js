var f = function(require){
	var InstructionValueProvider = function(instruction){
		this.fieldIndices = instruction.fieldIndices.slice();
		this.directions = instruction.directions.slice();
		this.colors = instruction.colors.slice();
		this.splitPoints = instruction.splitPoints.slice();
	};
	InstructionValueProvider.prototype.provideField = function(fieldSplitter){
		return fieldSplitter.fields[this.fieldIndices.shift()];
	};
	InstructionValueProvider.prototype.provideDirection = function(field){
		return this.directions.shift();
	};
	InstructionValueProvider.prototype.provideSplitPoint = function(field, direction){
		return this.splitPoints.shift();
	};
	InstructionValueProvider.prototype.provideColor = function(field, fieldColoring){
		return this.colors.shift();
	};
	return InstructionValueProvider;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
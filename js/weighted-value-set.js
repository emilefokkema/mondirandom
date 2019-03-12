var f = function(require){
	var WeightedValueSet = function(values, getValueWeight){
		var totalWeight = 0;
		var weightedValues = [];
		var i, value;
		for(i=0;i<values.length;i++){
			value = values[i];
			var weight = getValueWeight(value);
			totalWeight += weight;
			weightedValues.push({value:value, weight:weight});
		}
		this.totalWeight = totalWeight;
		this.values = weightedValues;
	};
	WeightedValueSet.prototype.getValueAtCutoffRatio = function(cutOffRatio){
		var cutOff = this.totalWeight * cutOffRatio;
		var totalWeight = 0;
		for(i=0;i<this.values.length;i++){
			var value = this.values[i].value;
			totalWeight += this.values[i].weight;
			if(totalWeight >= cutOff){
				return value;
			}
		}
	};

	return WeightedValueSet;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
var Distribution = function(getValueWeight){
	this.getValueWeight = getValueWeight || function(){return 1;};
};
Distribution.prototype.scale = function(ratio){
	var newGetValueWeight = (function(old){
		return function(v){
			return ratio * old(v);
		};
	})(this.getValueWeight);
	return new Distribution(newGetValueWeight);
};
Distribution.prototype.add = function(other){
	var newGetValueWeight = (function(one, two){
		return function(v){
			return one(v) + two(v);
		};
	})(this.getValueWeight, other.getValueWeight);
	return new Distribution(newGetValueWeight);
};
Distribution.prototype.getRandomValue = function(values){
	var totalWeight = 0;
	var weightedValues = [];
	var i, value;
	for(i=0;i<values.length;i++){
		value = values[i];
		var weight = this.getValueWeight(value);
		totalWeight += weight;
		weightedValues.push({value:value, weight:weight});
	}
	var cutOff = totalWeight * Math.random();
	totalWeight = 0;
	for(i=0;i<values.length;i++){
		value = values[i];
		totalWeight += weightedValues[i].weight;
		if(totalWeight >= cutOff){
			return value;
		}
	}
};
Distribution.prototype.except = function(value){
	var newGetValueWeight = (function(old){
		return function(v){
			return v == value ? 0 : old(v);
		};
	})(this.getValueWeight);
	return new Distribution(newGetValueWeight);
};
Distribution.only = function(singleValue){
	return new Distribution(function(v){return v == singleValue ? 1 : 0;});
};
Distribution.constant = function(){
	return new Distribution();
};

module.exports = Distribution;
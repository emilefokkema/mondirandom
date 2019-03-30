var f = function(require){
	var WeightedValueSet = require("./weighted-value-set");

	var ContinuousDistribution = function(from, to){
		this.from = from;
		this.to = to;
	};
	ContinuousDistribution.prototype.getValueAtCutoffRatio = function(ratio){
		return this.from + (this.to - this.from) * ratio;
	};

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
	Distribution.prototype.getWeightedValues = function(values){
		return new WeightedValueSet(values, this.getValueWeight);
	};
	Distribution.prototype.multiply = function(other){
		var newGetValueWeight = (function(one, two){
			return function(v){
				return one(v) * two(v);
			};
		})(this.getValueWeight, other.getValueWeight);
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
	Distribution.prototype.multiplySingleValue = function(value, ratio){
		return this.multiply(Distribution.not(value).add(Distribution.only(value).scale(ratio)));
	};
	Distribution.prototype.except = function(value){
		return this.multiply(Distribution.not(value));
	};
	Distribution.only = function(singleValue){
		return new Distribution(function(v){return v == singleValue ? 1 : 0;});
	};
	Distribution.not = function(singleValue){
		return new Distribution(function(v){return v == singleValue ? 0 : 1;});
	};
	Distribution.constant = function(){
		return new Distribution();
	};
	Distribution.continuous = function(from, to){
		return new ContinuousDistribution(from, to);
	};
	return Distribution;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
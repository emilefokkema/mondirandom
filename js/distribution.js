var ContinuousDistribution = function(from, to){
	this.from = from;
	this.to = to;
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
Distribution.prototype.add = function(other){
	var newGetValueWeight = (function(one, two){
		return function(v){
			return one(v) + two(v);
		};
	})(this.getValueWeight, other.getValueWeight);
	return new Distribution(newGetValueWeight);
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
Distribution.continuous = function(from, to){
	return new ContinuousDistribution(from, to);
};

module.exports = Distribution;
var f = function(require){
	var Distribution = require("./distribution");

	var Interval = function(from, to, randomValueProvider){
		this.randomValueProvider = randomValueProvider;
		this.from = from;
		this.to = to;
		this.length = this.to - this.from;
		this.splitPointDistribution = Distribution.continuous(0.1, 0.9);
	};
	Interval.prototype.split = function(){
		var ratio = this.randomValueProvider.provideRandomRatio(this.splitPointDistribution);
		var newPoint = this.from + ratio * this.length;
		return {
			splitPoint:newPoint,
			intervals: [new Interval(this.from, newPoint, this.randomValueProvider), new Interval(newPoint, this.to, this.randomValueProvider)]
		};
	};
	Interval.prototype.contains = function(point){
		return point >= this.from && point <= this.to;
	};
	Interval.prototype.getOverlapWith = function(other){
		if(this.to <= other.from || this.from >= other.to){
			return null;
		}
		var min = Math.max(this.from, other.from);
		var max = Math.min(this.to, other.to);
		if(min == max){
			return null;
		}
		return new Interval(min, max, this.randomValueProvider);
	};
	Interval.around = function(point, radius, randomValueProvider){
		return new Interval(point - radius, point + radius, randomValueProvider);
	};
	return Interval;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
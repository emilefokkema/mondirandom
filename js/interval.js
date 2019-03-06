var Distribution = require("./distribution.js");

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
Interval.around = function(point, radius, randomValueProvider){
	return new Interval(point - radius, point + radius, randomValueProvider);
};

module.exports = Interval;
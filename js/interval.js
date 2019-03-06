var Interval = function(from, to){
	this.from = from;
	this.to = to;
	this.length = this.to - this.from;
};
Interval.prototype.split = function(){
	var ratio = 0.1 + Math.random() * 0.8;
	var newPoint = this.from + ratio * this.length;
	return {
		splitPoint:newPoint,
		intervals: [new Interval(this.from, newPoint), new Interval(newPoint, this.to)]
	};
};

module.exports = Interval;
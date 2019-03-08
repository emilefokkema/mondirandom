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
		var allPoints = [this.from, this.to, other.from, other.to];
		var sorted = allPoints.sort();
		var from, to;
		for(var i = 0; i < 4; i++){
			var point = sorted[i];
			if(this.contains(point) && other.contains(point)){
				if(from == undefined){
					from = point;
					continue;
				}
				if(to == undefined){
					to = point;
					break;
				}
			}
		}
		if(from !== undefined){
			return new Interval(from, to, this.randomValueProvider);
		}
		return null;
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
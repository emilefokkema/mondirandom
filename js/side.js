var f = function(require){
	var Side = function(interval, position, direction){
		this.interval = interval;
		this.position = position;
		this.direction = direction;
		
	};
	Side.prototype.overlapsWith = function(other){
		if(other.direction != this.direction || other.position != this.position){
			return false;
		}
		return this.interval.overlapsWith(other.interval);
	};
	Side.prototype.getOverlapWith = function(other){
		if(other.direction != this.direction || other.position != this.position){
			return null;
		}
		var overlappingInterval = this.interval.getOverlapWith(other.interval);
		if(!overlappingInterval){
			return null;
		}
		return new Side(overlappingInterval, this.position, this.direction);
	};
	return Side;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
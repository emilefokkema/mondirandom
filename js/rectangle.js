var f = function(require){
	var Interval = require("./interval");
	var Side = require("./side");
	var Direction = require("./direction");

	var Rectangle = function(horizontalInterval, verticalInterval){
		this.horizontalInterval = horizontalInterval;
		this.verticalInterval = verticalInterval;
		this.area = horizontalInterval.length * verticalInterval.length;
		var top = new Side(horizontalInterval, verticalInterval.from, Direction.HORIZONTAL);
		var bottom = new Side(horizontalInterval, verticalInterval.to, Direction.HORIZONTAL);
		var left = new Side(verticalInterval, horizontalInterval.from, Direction.VERTICAL);
		var right = new Side(verticalInterval, horizontalInterval.to, Direction.VERTICAL);
		this.sides = [top, bottom, left, right];
		this.circumference = 2 * (horizontalInterval.length + verticalInterval.length);
	};
Rectangle.prototype.withHorizontalInterval = function(horizontalInterval){
		return new Rectangle(horizontalInterval, this.verticalInterval);
	};
	Rectangle.prototype.withVerticalInterval = function(verticalInterval){
		return new Rectangle(this.horizontalInterval, verticalInterval);
	};
	Rectangle.prototype.splitHorizontal = function(borderThickness, splitPoint){
		var split = this.verticalInterval.split(splitPoint);
		return {
			rectangles: [this.withVerticalInterval(split.intervals[0]), this.withVerticalInterval(split.intervals[1])],
			border: this.withVerticalInterval(Interval.around(splitPoint, borderThickness / 2))
		};
	};
	Rectangle.prototype.splitVertical = function(borderThickness, splitPoint){
		var split = this.horizontalInterval.split(splitPoint);
		return {
			rectangles: [this.withHorizontalInterval(split.intervals[0]), this.withHorizontalInterval(split.intervals[1])],
			border: this.withHorizontalInterval(Interval.around(splitPoint, borderThickness / 2))
		};
	};
	Rectangle.prototype.borders = function(other){
		for(var i = 0; i < 4; i++){
			var thisSide = this.sides[i];
			for(var j = 0; j < 4; j++){
				var otherSide = other.sides[j];
				if(thisSide.overlapsWith(otherSide)){
					return true;
				}
			}
		}
		return false;
	};
	Rectangle.prototype.getCommonSidesWith = function(other){
		var result = [];
		for(var i = 0; i < 4; i++){
			var thisSide = this.sides[i];
			for(var j = 0; j < 4; j++){
				var otherSide = other.sides[j];
				var overlap = thisSide.getOverlapWith(otherSide);
				if(overlap){
					result.push(overlap);
				}
			}
		}
		return result;
	};
	Rectangle.prototype.draw = function(context, color){
		context.fillStyle = color;
		context.fillRect(this.horizontalInterval.from, this.verticalInterval.from, this.horizontalInterval.length, this.verticalInterval.length);
	};
	Rectangle.create = function(x, y, width, height){
		var horizontalInterval, verticalInterval;
		horizontalInterval = new Interval(x, x + width);
		verticalInterval = new Interval(y, y + height);
		return new Rectangle(horizontalInterval, verticalInterval);
	};
	return Rectangle;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
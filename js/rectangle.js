var Direction = require("./direction.js");
var Interval = require("./interval.js");

var Rectangle = function(horizontalInterval, verticalInterval, randomValueProvider){
	this.randomValueProvider = randomValueProvider;
	this.horizontalInterval = horizontalInterval;
	this.verticalInterval = verticalInterval;
	this.area = horizontalInterval.length * verticalInterval.length;
};
Rectangle.prototype.withHorizontalInterval = function(horizontalInterval){
	return new Rectangle(horizontalInterval, this.verticalInterval, this.randomValueProvider);
};
Rectangle.prototype.withVerticalInterval = function(verticalInterval){
	return new Rectangle(this.horizontalInterval, verticalInterval, this.randomValueProvider);
};
Rectangle.prototype.splitHorizontal = function(borderThickness){
	var split = this.verticalInterval.split();
	return {
		splitPoint: split.splitPoint,
		rectangles: [this.withVerticalInterval(split.intervals[0]), this.withVerticalInterval(split.intervals[1])],
		border: this.withVerticalInterval(Interval.around(split.splitPoint, borderThickness / 2, this.randomValueProvider))
	};
};
Rectangle.prototype.splitVertical = function(borderThickness){
	var split = this.horizontalInterval.split();
	return {
		splitPoint: split.splitPoint,
		rectangles: [this.withHorizontalInterval(split.intervals[0]), this.withHorizontalInterval(split.intervals[1])],
		border: this.withHorizontalInterval(Interval.around(split.splitPoint, borderThickness / 2, this.randomValueProvider))
	};
};
Rectangle.prototype.draw = function(context, color){
	context.fillStyle = color;
	context.fillRect(this.horizontalInterval.from, this.verticalInterval.from, this.horizontalInterval.length, this.verticalInterval.length);
};
Rectangle.create = function(x, y, width, height, randomValueProvider){
	var horizontalInterval, verticalInterval;
	horizontalInterval = new Interval(x, x + width, randomValueProvider);
	verticalInterval = new Interval(y, y + height, randomValueProvider);
	return new Rectangle(horizontalInterval, verticalInterval, randomValueProvider);
};

module.exports = Rectangle;
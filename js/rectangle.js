var Interval = require("./interval.js");

var Rectangle = function(horizontalInterval, verticalInterval){
	this.horizontalInterval = horizontalInterval;
	this.verticalInterval = verticalInterval;
	this.area = horizontalInterval.length * verticalInterval.length;
};
Rectangle.prototype.withHorizontalInterval = function(horizontalInterval){
	return new Rectangle(horizontalInterval, this.verticalInterval);
};
Rectangle.prototype.withVerticalInterval = function(verticalInterval){
	return new Rectangle(this.horizontalInterval, verticalInterval);
};
Rectangle.prototype.draw = function(context, color){
	context.fillStyle = color;
	context.fillRect(this.horizontalInterval.from, this.verticalInterval.from, this.horizontalInterval.length, this.verticalInterval.length);
};
Rectangle.create = function(){
	var horizontalInterval, verticalInterval;
	if(arguments.length == 4){
		var x = arguments[0],
			y = arguments[1],
			width = arguments[2],
			height = arguments[3];
		horizontalInterval = new Interval(x, x + width),
		verticalInterval = new Interval(y, y + height);
	}else{
		horizontalInterval = arguments[0];
		verticalInterval = arguments[1];
	}
	return new Rectangle(horizontalInterval, verticalInterval);
};

module.exports = Rectangle;
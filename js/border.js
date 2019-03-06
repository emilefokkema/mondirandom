var Interval = require("./interval.js");
var Direction = require("./direction.js");
var Rectangle = require("./rectangle.js");
var Color = require("./color.js");

var Border = function(point, interval, direction, thickness){
	this.point = point;
	this.interval = interval;
	this.direction = direction;
	this.thickness = thickness;
};
Border.prototype.draw = function(context){
	var thicknessInterval = new Interval(this.point - this.thickness/2, this.point + this.thickness / 2);
	var rectangle;
	if(this.direction == Direction.VERTICAL){
		rectangle = Rectangle.create(thicknessInterval, this.interval);
	}else{
		rectangle = Rectangle.create(this.interval, thicknessInterval);
	}
	rectangle.draw(context, Color.BLACK);
};

module.exports = Border;
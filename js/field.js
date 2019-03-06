var Direction = require("./direction.js");
var Distribution = require("./distribution.js");
var Border = require("./border.js");
var Color = require("./color.js");

var Field = function(rectangle, relativeArea){
	this.rectangle = rectangle;
	this.borderThickness = 5;
	this.relativeArea = relativeArea;
	this.directionDistribution = this.getDirectionDistribution(rectangle);
};
Field.prototype.getDirectionDistribution = function(rectangle){
	var result = Distribution.only(Direction.HORIZONTAL).scale(rectangle.verticalInterval.length)
		.add(Distribution.only(Direction.VERTICAL).scale(rectangle.horizontalInterval.length));
	if(rectangle.verticalInterval.length > 10 * rectangle.horizontalInterval.length){
		result = result.except(Direction.VERTICAL);
	}
	if(rectangle.horizontalInterval.length > 10 * rectangle.verticalInterval.length){
		result = result.except(Direction.HORIZONTAL);
	}
	return result;
};
Field.prototype.split = function(createField){
	var direction = this.directionDistribution.getRandomValue([Direction.VERTICAL, Direction.HORIZONTAL]);
	var self = this;
	if(direction == Direction.VERTICAL){
		return this.splitInDirection(
			direction,
			function(horizontalInterval){return createField(self.rectangle.withHorizontalInterval(horizontalInterval));},
			this.rectangle.horizontalInterval,
			this.rectangle.verticalInterval);
	}
	return this.splitInDirection(
		direction,
		function(verticalInterval){return createField(self.rectangle.withVerticalInterval(verticalInterval));},
		this.rectangle.verticalInterval,
		this.rectangle.horizontalInterval);
};
Field.prototype.splitInDirection = function(direction, getFieldFromInterval, intervalToSplit, otherInterval){
	var split = intervalToSplit.split();
	return {
		fields: split.intervals.map(getFieldFromInterval),
		border: new Border(split.splitPoint, otherInterval, direction, this.borderThickness)
	};
};
Field.prototype.draw = function(context, colorDistribution){
	colorDistribution = colorDistribution.add(Distribution.only(Color.WHITE).scale(this.relativeArea));
	var color = colorDistribution.getRandomValue(Color.ALL);
	this.rectangle.draw(context, color);
};

module.exports = Field;
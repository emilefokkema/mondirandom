var f = function(require){
	var Direction = require("./direction");
	var Color = require("./color");
	var Distribution = require("./distribution");

	var Field = function(rectangle, relativeArea, randomValueProvider, borderThickness){
		this.randomValueProvider = randomValueProvider;
		this.rectangle = rectangle;
		this.borderThickness = borderThickness;
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
		var direction = this.randomValueProvider.provideRandomDirection(this.directionDistribution);
		var self = this;
		var rectangleSplit = direction == Direction.VERTICAL ? 
			this.rectangle.splitVertical(this.borderThickness) : 
			this.rectangle.splitHorizontal(this.borderThickness);
		return {
			fields: rectangleSplit.rectangles.map(createField),
			border: rectangleSplit.border
		};
	};
	Field.prototype.draw = function(context, colorDistribution){
		colorDistribution = colorDistribution.add(Distribution.only(Color.WHITE).scale(this.relativeArea));
		var color = this.randomValueProvider.provideRandomColor(colorDistribution);
		this.rectangle.draw(context, color);
	};
	return Field;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
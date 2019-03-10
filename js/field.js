var f = function(require){
	var Direction = require("./direction");
	var Color = require("./color");
	var Distribution = require("./distribution");

	var Field = function(rectangle, relativeArea, randomValueProvider, borderThickness){
		this.randomValueProvider = randomValueProvider;
		this.rectangle = rectangle;
		this.borderThickness = borderThickness;
		this.relativeArea = relativeArea;
	};
	Field.prototype.getDirectionDistribution = function(){
		var result = Distribution.only(Direction.HORIZONTAL).scale(this.rectangle.verticalInterval.length)
			.add(Distribution.only(Direction.VERTICAL).scale(this.rectangle.horizontalInterval.length));
		if(this.rectangle.verticalInterval.length > 10 * this.rectangle.horizontalInterval.length){
			result = result.except(Direction.VERTICAL);
		}
		if(this.rectangle.horizontalInterval.length > 10 * this.rectangle.verticalInterval.length){
			result = result.except(Direction.HORIZONTAL);
		}
		return result;
	};
	Field.prototype.split = function(createField){
		var direction = this.randomValueProvider.provideRandomDirection(this);
		var self = this;
		var rectangleSplit = direction == Direction.VERTICAL ? 
			this.rectangle.splitVertical(this.borderThickness) : 
			this.rectangle.splitHorizontal(this.borderThickness);
		return {
			fields: rectangleSplit.rectangles.map(createField),
			border: rectangleSplit.border
		};
	};
	Field.prototype.getColorDistribution = function(initialDistribution){
		return initialDistribution.add(Distribution.only(Color.WHITE).scale(this.relativeArea));
	};
	Field.prototype.draw = function(context, colorDistribution){
		var color = this.randomValueProvider.provideRandomColor(this, colorDistribution);
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
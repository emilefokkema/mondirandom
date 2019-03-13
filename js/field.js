var f = function(require){
	var Direction = require("./direction");
	var Color = require("./color");
	var Distribution = require("./distribution");

	var Field = function(rectangle, relativeArea, borderThickness, maxSplittableRatio){
		this.maxSplittableRatio = maxSplittableRatio;
		this.neighbors = [];
		this.rectangle = rectangle;
		this.borderThickness = borderThickness;
		this.relativeArea = relativeArea;
	};
	Field.prototype.getDirectionDistribution = function(){
		var result = Distribution.only(Direction.HORIZONTAL).scale(this.rectangle.verticalInterval.length)
			.add(Distribution.only(Direction.VERTICAL).scale(this.rectangle.horizontalInterval.length));
		if(this.rectangle.verticalInterval.length > this.maxSplittableRatio * this.rectangle.horizontalInterval.length){
			result = result.except(Direction.VERTICAL);
		}
		if(this.rectangle.horizontalInterval.length > this.maxSplittableRatio * this.rectangle.verticalInterval.length){
			result = result.except(Direction.HORIZONTAL);
		}
		return result;
	};
	Field.prototype.findNeighbors = function(candidates){
		for(var i=0;i<candidates.length;i++){
			var candidate = candidates[i];
			var commonSides = this.rectangle.getCommonSidesWith(candidate.rectangle);
			if(commonSides.length > 0){
				this.neighbors.push(candidate);
			}
		}
	};
	Field.prototype.notifyNeighborSplit = function(oldNeighbor, newField1, newField2){
		var oldNeighborIndex = this.neighbors.indexOf(oldNeighbor);
		this.neighbors.splice(oldNeighborIndex, 1);
		this.findNeighbors([newField1, newField2]);
	};
	Field.prototype.split = function(createField, randomValueProvider){
		var direction = randomValueProvider.provideRandomDirection(this);
		var self = this;
		var rectangleSplit = direction == Direction.VERTICAL ? 
			this.rectangle.splitVertical(this.borderThickness, randomValueProvider) : 
			this.rectangle.splitHorizontal(this.borderThickness, randomValueProvider);
		var newFields = rectangleSplit.rectangles.map(createField);
		newFields[0].findNeighbors(this.neighbors.concat([newFields[1]]));
		newFields[1].findNeighbors(this.neighbors.concat([newFields[0]]));
		for(var i=0;i<this.neighbors.length;i++){
			this.neighbors[i].notifyNeighborSplit(this, newFields[0], newFields[1]);
		}
		return {
			fields: newFields,
			border: rectangleSplit.border
		};
	};
	Field.prototype.getColorDistribution = function(initialDistribution){
		return initialDistribution.add(Distribution.only(Color.WHITE).scale(this.relativeArea));
	};
	Field.prototype.draw = function(context, colorDistribution, randomValueProvider){
		var color = randomValueProvider.provideRandomColor(this, colorDistribution);
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
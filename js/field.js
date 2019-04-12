var f = function(require){
	var Direction = require("./direction");
	var Color = require("./color");
	var Distribution = require("./distribution");

	var Field = function(rectangle, fieldSplitter, configuration){
		this.neighbors = [];
		this.rectangle = rectangle;
		this.borderThickness = configuration.borderThickness;
		this.relativeArea = rectangle.area / fieldSplitter.totalArea;
		this.fieldSplitter = fieldSplitter;
	};
	Field.prototype.getDirectionDistribution = function(randomValueProviderConfig){
		var maxSplittableRatio = randomValueProviderConfig.maxSplittableRatio;
		var result = Distribution.only(Direction.HORIZONTAL).scale(this.rectangle.verticalInterval.length)
			.add(Distribution.only(Direction.VERTICAL).scale(this.rectangle.horizontalInterval.length));
		if(this.rectangle.verticalInterval.length > maxSplittableRatio * this.rectangle.horizontalInterval.length){
			result = result.except(Direction.VERTICAL);
		}
		if(this.rectangle.horizontalInterval.length > maxSplittableRatio * this.rectangle.verticalInterval.length){
			result = result.except(Direction.HORIZONTAL);
		}
		return result;
	};
	Field.prototype.getSplitPointDistribution = function(direction, randomValueProviderConfig){
		var interval = direction == Direction.VERTICAL ? this.rectangle.horizontalInterval : this.rectangle.verticalInterval;
		var from = interval.from + 0.1 * interval.length;
		var to = interval.from + 0.9 * interval.length;
		return Distribution.continuous(from, to);
	};
	Field.prototype.findNeighbors = function(candidates){
		for(var i=0;i<candidates.length;i++){
			var candidate = candidates[i];
			if(this.rectangle.borders(candidate.rectangle)){
				this.neighbors.push(candidate);
			}
		}
	};
	Field.prototype.notifyNeighborSplit = function(oldNeighbor, newField1, newField2){
		var oldNeighborIndex = this.neighbors.indexOf(oldNeighbor);
		this.neighbors.splice(oldNeighborIndex, 1);
		this.findNeighbors([newField1, newField2]);
	};
	Field.prototype.split = function(createField, valueProvider){
		var direction = valueProvider.provideDirection(this);
		var splitPoint = valueProvider.provideSplitPoint(this, direction);
		var self = this;
		var rectangleSplit = direction == Direction.VERTICAL ? 
			this.rectangle.splitVertical(this.borderThickness, splitPoint) : 
			this.rectangle.splitHorizontal(this.borderThickness, splitPoint);
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
	Field.prototype.getBorderOccupancy = function(neighbor){
		return this.rectangle
				.getCommonSidesWith(neighbor.rectangle)
				.reduce(function(total, newSide){return total + newSide.interval.length;}, 0);
	};
	Field.prototype.getLimitOccupancy = function(neighborColor, neighborColorExclusionLimit){
		switch(neighborColor){
			case Color.WHITE: return neighborColorExclusionLimit.white;
			case Color.BLACK: return neighborColorExclusionLimit.black;
			case Color.RED: return neighborColorExclusionLimit.red;
			case Color.BLUE: return neighborColorExclusionLimit.blue;
			case Color.YELLOW: return neighborColorExclusionLimit.yellow;
		}
	};
	Field.prototype.getNeighborColoringFactor = function(relativeBorderOccupancy, neighborColor, neighborColorExclusionLimit){
		var limitOccupancy = this.getLimitOccupancy(neighborColor, neighborColorExclusionLimit);
		if(limitOccupancy == Infinity){
			return 1;
		}
		if(limitOccupancy == 0){
			return 0;
		}
		return Math.max(1 - relativeBorderOccupancy / limitOccupancy, 0);
	};
	Field.prototype.getColorDistribution = function(fieldColoring, randomValueProviderConfig){
		var lowestColorDistributionFactor = randomValueProviderConfig.lowestColorDistributionFactor;
		var result = Distribution.constant()
			.scale(this.fieldSplitter.smallestRelativeArea * lowestColorDistributionFactor)
			.add(Distribution.only(Color.WHITE).scale(this.relativeArea));
		for(var i=0;i<this.neighbors.length;i++){
			var neighbor = this.neighbors[i];
			var neighborColoring = fieldColoring.getFieldColoring(neighbor);
			if(!neighborColoring){
				continue;
			}
			var relativeBorderOccupancy = this.getBorderOccupancy(neighbor) / this.rectangle.circumference;
			var factor = this.getNeighborColoringFactor(relativeBorderOccupancy, neighborColoring.color, randomValueProviderConfig.neighborColorExclusionLimit);
			result = result.multiplySingleValue(neighborColoring.color, factor);
		}
		return result;
	};
	Field.prototype.color = function(valueProvider, fieldColoring){
		var color = valueProvider.provideColor(this, fieldColoring);
		fieldColoring.colorField(this, color);
	};
	Field.prototype.draw = function(context, fieldColoring){
		var color = fieldColoring.getFieldColoring(this).color;
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
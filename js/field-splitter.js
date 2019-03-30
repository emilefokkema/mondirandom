var f = function(require){
	var Field = require("./field");
	var FieldColoring = require("./field-coloring");
	var Rectangle = require("./rectangle");
	var Color = require("./color");
	var Distribution = require("./distribution");

	var FieldSplitter = function(width, height, configuration){
		this.configuration = configuration;
		this.borders = [];
		this.totalArea = width * height;
		this.smallestRelativeArea = 1;
		this.fields = [this.createField(Rectangle.create(0, 0, width, height))];
	};
	FieldSplitter.prototype.getFieldDistribution = function(randomValueProviderConfig){
		return new Distribution(function(f){return f.relativeArea;}).add(Distribution.constant().scale(this.smallestRelativeArea * randomValueProviderConfig.lowestFieldDistributionFactor));
	};
	FieldSplitter.prototype.createField = function(rectangle){
		var relativeArea = rectangle.area / this.totalArea;
		this.smallestRelativeArea = Math.min(this.smallestRelativeArea, relativeArea);
		return new Field(rectangle, this, this.configuration);
	};
	FieldSplitter.prototype.splitRandomField = function(valueProvider){
		var self = this;
		var field = valueProvider.provideField(this);
		var index = this.fields.indexOf(field);
		var split = field.split(this.createField.bind(this), valueProvider);
		this.borders.push(split.border);
		this.fields.splice(index, 1, split.fields[0], split.fields[1]);
	};
	FieldSplitter.prototype.drawFields = function(context, valueProvider){
		var fieldColoring = new FieldColoring();
		for(var i=0;i<this.fields.length;i++){
			this.fields[i].draw(context, valueProvider, fieldColoring);
		}
	};
	FieldSplitter.prototype.drawBorders = function(context){
		for(var i=0;i<this.borders.length;i++){
			this.borders[i].draw(context, Color.BLACK);
		}
	};
	FieldSplitter.prototype.draw = function(context, valueProvider){
		this.drawFields(context, valueProvider);
		this.drawBorders(context, valueProvider);
	};
	return FieldSplitter;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
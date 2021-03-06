var f = function(require){
	var Field = require("./field");
	var FieldColoring = require("./field-coloring");
	var Rectangle = require("./rectangle");
	var Color = require("./color");
	var Instruction = require("./instruction");
	var Distribution = require("./distribution");
	var TrackingValueProvider = require("./tracking-value-provider");

	var FieldSplitter = function(width, height, configuration){
		this.instruction = new Instruction(width, height, configuration.borderThickness, 0);
		this.fieldColoring = new FieldColoring();
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
	FieldSplitter.prototype.splitAndColor = function(valueProvider, nTimes){
		this.instruction.numberOfSplits += nTimes;
		valueProvider = new TrackingValueProvider(valueProvider, this.instruction);
		for(var i=0;i<nTimes;i++){
			this.splitRandomField(valueProvider);
		}
		for(var i=0;i<this.fields.length;i++){
			this.fields[i].color(valueProvider, this.fieldColoring);
		}
	};
	FieldSplitter.prototype.splitRandomField = function(valueProvider){
		var self = this;
		var field = valueProvider.provideField(this);
		var index = this.fields.indexOf(field);
		var split = field.split(this.createField.bind(this), valueProvider);
		this.borders.push(split.border);
		this.fields.splice(index, 1, split.fields[0], split.fields[1]);
	};
	FieldSplitter.prototype.drawFields = function(context){
		for(var i=0;i<this.fields.length;i++){
			this.fields[i].draw(context, this.fieldColoring);
		}
	};
	FieldSplitter.prototype.drawBorders = function(context){
		for(var i=0;i<this.borders.length;i++){
			this.borders[i].draw(context, Color.BLACK);
		}
	};
	FieldSplitter.prototype.draw = function(context){
		this.drawFields(context);
		this.drawBorders(context);
	};
	return FieldSplitter;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
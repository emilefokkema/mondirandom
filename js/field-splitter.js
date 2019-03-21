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
	FieldSplitter.prototype.getFieldDistribution = function(){
		return new Distribution(function(f){return f.relativeArea;}).add(Distribution.constant().scale(this.smallestRelativeArea * this.configuration.lowestFieldDistributionFactor));
	};
	FieldSplitter.prototype.createField = function(rectangle){
		var relativeArea = rectangle.area / this.totalArea;
		this.smallestRelativeArea = Math.min(this.smallestRelativeArea, relativeArea);
		return new Field(rectangle, this, this.configuration);
	};
	FieldSplitter.prototype.splitRandomField = function(randomValueProvider){
		var self = this;
		var field = randomValueProvider.provideRandomField(this);
		var index = this.fields.indexOf(field);
		var split = field.split(this.createField.bind(this), randomValueProvider);
		this.borders.push(split.border);
		this.fields.splice(index, 1, split.fields[0], split.fields[1]);
	};
	FieldSplitter.prototype.drawFields = function(context, randomValueProvider){
		var fieldColoring = new FieldColoring();
		for(var i=0;i<this.fields.length;i++){
			this.fields[i].draw(context, randomValueProvider, fieldColoring);
		}
	};
	FieldSplitter.prototype.drawBorders = function(context){
		for(var i=0;i<this.borders.length;i++){
			this.borders[i].draw(context, Color.BLACK);
		}
	};
	FieldSplitter.prototype.draw = function(context, randomValueProvider){
		this.drawFields(context, randomValueProvider);
		this.drawBorders(context, randomValueProvider);
	};
	return FieldSplitter;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
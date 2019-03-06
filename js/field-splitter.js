var Field = require("./field.js");
var Rectangle = require("./rectangle.js");
var Color = require("./color.js");
var Distribution = require("./distribution.js");

var FieldSplitter = function(width, height, randomValueProvider, borderThickness){
	this.borderThickness = borderThickness;
	this.randomValueProvider = randomValueProvider;
	this.borders = [];
	this.totalArea = width * height;
	this.smallestRelativeArea = 1;
	this.fields = [this.createField(Rectangle.create(0, 0, width, height, randomValueProvider))];
	this.distribution = new Distribution(function(f){return f.relativeArea;}).add(Distribution.constant().scale(0.05));
};
FieldSplitter.prototype.createField = function(rectangle){
	var relativeArea = rectangle.area / this.totalArea;
	this.smallestRelativeArea = Math.min(this.smallestRelativeArea, relativeArea);
	return new Field(rectangle, relativeArea, this.randomValueProvider, this.borderThickness);
};
FieldSplitter.prototype.splitRandomField = function(){
	var self = this;
	var field = this.randomValueProvider.provideRandomField(this.distribution, this.fields);
	var index = this.fields.indexOf(field);
	var split = field.split(this.createField.bind(this));
	this.borders.push(split.border);
	this.fields.splice(index, 1, split.fields[0], split.fields[1]);
};
FieldSplitter.prototype.drawFields = function(context){
	var colorDistribution = Distribution.constant().scale(this.smallestRelativeArea * 10);
	for(var i=0;i<this.fields.length;i++){
		this.fields[i].draw(context, colorDistribution);
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

module.exports = FieldSplitter;
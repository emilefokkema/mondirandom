var Distribution = require("./distribution.js");
var Field = require("./field.js");
var Rectangle = require("./rectangle.js");

var FieldSplitter = function(width, height){
	this.borders = [];
	this.totalArea = width * height;
	this.smallestRelativeArea = 1;
	this.fields = [this.createField(Rectangle.create(0, 0, width, height))];
	this.distribution = new Distribution(function(f){return f.relativeArea;}).add(new Distribution().scale(0.05));
};
FieldSplitter.prototype.createField = function(rectangle){
	var relativeArea = rectangle.area / this.totalArea;
	this.smallestRelativeArea = Math.min(this.smallestRelativeArea, relativeArea);
	return new Field(rectangle, relativeArea);
};
FieldSplitter.prototype.splitRandomField = function(){
	var self = this;
	var field = this.distribution.getRandomValue(this.fields);
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
		this.borders[i].draw(context);
	}
};

module.exports = FieldSplitter;
var f = function(require){
	var Color = require("./color");
	var base64 = require("./base64");
	var InstructionValueProvider = require("./instruction-value-provider");
	var FieldColoring = require("./field-coloring");

	var Instruction = function(width, height, borderThickness, numberOfSplits){
		this.width = width;
		this.height = height;
		this.fieldIndices = [];
		this.directions = [];
		this.colors = [];
		this.splitPoints = [];
		this.borderThickness = borderThickness;
		this.numberOfSplits = numberOfSplits;
	};
	Instruction.prototype.chooseFieldIndex = function(fieldIndex){
		this.fieldIndices.push(fieldIndex);
	};
	Instruction.prototype.getYear = function(){
		var year = 0;
		for(var i=0;i<this.splitPoints.length && i<20;i++){
			year = (year + this.splitPoints[i] * 35) % 72;
		}
		return 1872 + year;
	};
	Instruction.prototype.getSerialNumber = function(){
		var result = 0;
		for(var i=0;i<this.splitPoints.length && i<20;i++){
			result = (result + this.splitPoints[i] * 5) % 13;
		}
		return 1 + result;
	};
	Instruction.prototype.getTitle = function(){
		return "Untitled "+ this.getSerialNumber() +" (" + this.getYear() + ")";
	};
	Instruction.prototype.toString = function(){
		var readable = ""+this.width+";"+this.height+";"+this.borderThickness+";"+this.numberOfSplits+";"+this.fieldIndices.join(",")+";"+this.directions.join("")+";"+this.colors.map(this.getColorCode).join("")+";"+this.splitPoints.join(",");
		return base64.encode(readable);
	};
	Instruction.prototype.getValueProvider = function(){
		return new InstructionValueProvider(this);
	};
	Instruction.prototype.getColorCode = function(color){
		switch(color){
			case Color.RED: return 'r';
			case Color.BLUE: return 'b';
			case Color.WHITE: return 'w';
			case Color.YELLOW: return 'y';
			case Color.BLACK: return 'z';
		}
	};
	Instruction.parseColorCode = function(code){
		switch(code){
			case 'r': return Color.RED;
			case 'b': return Color.BLUE;
			case 'w': return Color.WHITE;
			case 'y': return Color.YELLOW;
			case 'z': return Color.BLACK;
		}
	};
	Instruction.prototype.chooseSplitPoint = function(splitPoint){
		this.splitPoints.push(splitPoint);
	};
	Instruction.prototype.chooseDirection = function(direction){
		this.directions.push(direction);
	};
	Instruction.prototype.chooseColor = function(color){
		this.colors.push(color);
	};
	Instruction.parse = function(str){
		var readable = base64.decode(str);
		var match = readable.match(/^(\d+(?:\.\d+)?);(\d+(?:\.\d+)?);(\d+);(\d+);(\d+(?:,\d+)*);([01]+);([rbwyz]+);(\d+(?:,\d+)*)$/);
		var intParser = function(x){return parseInt(x);};
		var width = parseInt(match[1]),
			height = parseInt(match[2]),
			borderThickness = parseInt(match[3]),
			numberOfSplits = parseInt(match[4]),
			fieldIndices = match[5].match(/\d+/g).map(intParser),
			directions = match[6].match(/[01]/g).map(intParser),
			colors = match[7].match(/[rbwyz]/g).map(this.parseColorCode),
			splitPoints = match[8].match(/\d+/g).map(intParser);
		var result = new Instruction(width, height, borderThickness, numberOfSplits);
		result.fieldIndices = fieldIndices;
		result.directions = directions;
		result.colors = colors;
		result.splitPoints = splitPoints;
		return result;
	};
	return Instruction;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
(function(){
	var Color = {
		RED:"#E84141",
		BLUE: "#3B3BE2",
		YELLOW: "#FCFC54",
		WHITE: "#fff",
		BLACK: "#383838"};
	Color.ALL = [Color.RED, Color.BLUE, Color.YELLOW, Color.WHITE, Color.BLACK];

	var Direction = {HORIZONTAL:0,VERTICAL:1};

	var Distribution = function(getValueWeight){
		this.getValueWeight = getValueWeight || function(){return 1;};
	};
	Distribution.prototype.scale = function(ratio){
		var newGetValueWeight = (function(old){
			return function(v){
				return ratio * old(v);
			};
		})(this.getValueWeight);
		return new Distribution(newGetValueWeight);
	};
	Distribution.prototype.add = function(other){
		var newGetValueWeight = (function(one, two){
			return function(v){
				return one(v) + two(v);
			};
		})(this.getValueWeight, other.getValueWeight);
		return new Distribution(newGetValueWeight);
	};
	Distribution.prototype.getRandomValue = function(values){
		var totalWeight = 0;
		var weightedValues = [];
		var i, value;
		for(i=0;i<values.length;i++){
			value = values[i];
			var weight = this.getValueWeight(value);
			totalWeight += weight;
			weightedValues.push({value:value, weight:weight});
		}
		var cutOff = totalWeight * Math.random();
		totalWeight = 0;
		for(i=0;i<values.length;i++){
			value = values[i];
			totalWeight += weightedValues[i].weight;
			if(totalWeight >= cutOff){
				return value;
			}
		}
	};
	Distribution.prototype.except = function(value){
		var newGetValueWeight = (function(old){
			return function(v){
				return v == value ? 0 : old(v);
			};
		})(this.getValueWeight);
		return new Distribution(newGetValueWeight);
	};
	Distribution.only = function(singleValue){
		return new Distribution(function(v){return v == singleValue ? 1 : 0;});
	};
	Distribution.constant = function(){
		return new Distribution();
	};

	var DirectionProvider = function(){
		this.directions = [Direction.VERTICAL, Direction.HORIZONTAL];
	};
	DirectionProvider.prototype.provideDirection = function(rectangle){
		var distribution = new Distribution(function(d){
			if(d == Direction.VERTICAL){
				return rectangle.horizontalInterval.length;
			}
			return rectangle.verticalInterval.length;
		});
		return distribution.getRandomValue(this.directions);
	};

	var Interval = function(from, to){
		this.from = from;
		this.to = to;
		this.length = this.to - this.from;
	};
	Interval.prototype.split = function(){
		var ratio = 0.1 + Math.random() * 0.8;
		var newPoint = this.from + ratio * this.length;
		return {
			splitPoint:newPoint,
			intervals: [new Interval(this.from, newPoint), new Interval(newPoint, this.to)]
		};
	};

	var Border = function(point, interval, direction, thickness){
		this.point = point;
		this.interval = interval;
		this.direction = direction;
		this.thickness = thickness;
	};
	Border.prototype.draw = function(context){
		var thicknessInterval = new Interval(this.point - this.thickness/2, this.point + this.thickness / 2);
		var rectangle;
		if(this.direction == Direction.VERTICAL){
			rectangle = new Rectangle(thicknessInterval, this.interval);
		}else{
			rectangle = new Rectangle(this.interval, thicknessInterval);
		}
		rectangle.draw(context, Color.BLACK);
	};

	var Rectangle = function(horizontalInterval, verticalInterval){
		this.horizontalInterval = horizontalInterval;
		this.verticalInterval = verticalInterval;
		this.area = horizontalInterval.length * verticalInterval.length;
	};
	Rectangle.prototype.withHorizontalInterval = function(horizontalInterval){
		return new Rectangle(horizontalInterval, this.verticalInterval);
	};
	Rectangle.prototype.withVerticalInterval = function(verticalInterval){
		return new Rectangle(this.horizontalInterval, verticalInterval);
	};
	Rectangle.prototype.draw = function(context, color){
		context.fillStyle = color;
		context.fillRect(this.horizontalInterval.from, this.verticalInterval.from, this.horizontalInterval.length, this.verticalInterval.length);
	};

	var Field = function(rectangle, relativeArea){
		this.rectangle = rectangle;
		this.directionProvider = new DirectionProvider();
		this.borderThickness = 5;
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
		var direction = this.directionDistribution.getRandomValue([Direction.VERTICAL, Direction.HORIZONTAL]);
		var self = this;
		if(direction == Direction.VERTICAL){
			return this.splitInDirection(
				direction,
				function(horizontalInterval){return createField(self.rectangle.withHorizontalInterval(horizontalInterval));},
				this.rectangle.horizontalInterval,
				this.rectangle.verticalInterval);
		}
		return this.splitInDirection(
			direction,
			function(verticalInterval){return createField(self.rectangle.withVerticalInterval(verticalInterval));},
			this.rectangle.verticalInterval,
			this.rectangle.horizontalInterval);
	};
	Field.prototype.splitInDirection = function(direction, getFieldFromInterval, intervalToSplit, otherInterval){
		var split = intervalToSplit.split();
		return {
			fields: split.intervals.map(getFieldFromInterval),
			border: new Border(split.splitPoint, otherInterval, direction, this.borderThickness)
		};
	};
	Field.prototype.draw = function(context, colorDistribution){
		colorDistribution = colorDistribution.add(Distribution.only(Color.WHITE).scale(this.relativeArea));
		var color = colorDistribution.getRandomValue(Color.ALL);
		this.rectangle.draw(context, color);
	};

	var FieldSplitter = function(width, height){
		this.borders = [];
		this.totalArea = width * height;
		this.smallestRelativeArea = 1;
		this.fields = [this.createField(new Rectangle(new Interval(0, width), new Interval(0, height)))];
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

	var draw = function(width, height, canvasElement){
		canvasElement.setAttribute("width", width);
		canvasElement.setAttribute("height", height);
		var context = canvasElement.getContext("2d");
		var splitter = new FieldSplitter(width, height);
		for(var i=0;i<40;i++){
			splitter.splitRandomField();
		}
		splitter.drawFields(context);
		splitter.drawBorders(context);
	};

	draw(window.innerWidth, window.innerHeight, document.getElementById("canvas"));
})();
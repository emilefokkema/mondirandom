describe("A field", function(){
	var FieldSplitter = require("../js/field-splitter.js");
	var Color = require("../js/color.js");
	var FieldColoring = require("../js/field-coloring.js");
	var splitFieldInDirection = require("./split-field-in-direction.js");
	var Direction = require("../js/direction.js");
	var randomValueProviderConfig = {
			maxSplittableRatio: 10,
			lowestColorDistributionFactor: 1,
			neighborColorExclusionLimit: {
				black:0,
				red:0,
				yellow:0.25,
				blue:0,
				white:Infinity
			}
		};
	var instance,
		configuration = {
			maxSplittableRatio: 10,
			lowestColorDistributionFactor: 1,
			neighborColorExclusionLimit: {
				black:0,
				red:0,
				yellow:0.25,
				blue:0,
				white:Infinity
			}
		};

	describe("that exceeds the max ratio vertically", function(){

		beforeEach(function(){
			var splitter = new FieldSplitter(1, 15, configuration);
			instance = splitter.fields[0];
		});

		it("should only be splittable horizontally", function(){
			var directionDistribution = instance.getDirectionDistribution(randomValueProviderConfig);
			expect(directionDistribution).not.toGiveWeightTo(Direction.VERTICAL);
			expect(directionDistribution).toGiveWeightTo(Direction.HORIZONTAL);
		});
	});

	describe("that has a neighbor that is colored red", function(){
		var neighbor;

		beforeEach(function(){
			var splitter = new FieldSplitter(20, 10, configuration);
			splitFieldInDirection(splitter, splitter.fields[0], Direction.VERTICAL, 10);
			instance = splitter.fields[0];
			neighbor = splitter.fields[1];
		});

		it("should exclude red from its color distribution", function(){
			var fieldColoring = new FieldColoring();
			fieldColoring.colorField(neighbor, Color.RED);
			var colorDistribution = instance.getColorDistribution(fieldColoring, randomValueProviderConfig);
			expect(colorDistribution).not.toGiveWeightTo(Color.RED);
		});
	});

	describe("that has a neighbor that is colored white and occupies a lot of border", function(){
		var neighbor;

		beforeEach(function(){
			var splitter = new FieldSplitter(1, 20, configuration);
			splitFieldInDirection(splitter, splitter.fields[0], Direction.VERTICAL, 0.5);
			instance = splitter.fields[0];
			neighbor = splitter.fields[1];
		});

		it("should not exclude white from its color distribution", function(){
			var fieldColoring = new FieldColoring();
			fieldColoring.colorField(neighbor, Color.WHITE);
			var colorDistribution = instance.getColorDistribution(fieldColoring, randomValueProviderConfig);
			expect(colorDistribution).toGiveWeightTo(Color.WHITE);
		});
	});

	describe("that has a neighbor that is colored yellow but doesn't occupy too much border", function(){
		var neighbor;

		beforeEach(function(){
			var splitter = new FieldSplitter(40, 10, configuration);
			splitFieldInDirection(splitter, splitter.fields[0], Direction.VERTICAL, 20);
			instance = splitter.fields[0];
			neighbor = splitter.fields[1];
		});

		it("should not exclude yellow from its color distribution", function(){
			var fieldColoring = new FieldColoring();
			fieldColoring.colorField(neighbor, Color.YELLOW);
			var colorDistribution = instance.getColorDistribution(fieldColoring, randomValueProviderConfig);
			expect(colorDistribution).toGiveWeightTo(Color.YELLOW);
		});
	});

	describe("that has a neighbor that is colored yellow but occupies too much border", function(){
		var neighbor;

		beforeEach(function(){
			var splitter = new FieldSplitter(10, 10, configuration);
			splitFieldInDirection(splitter, splitter.fields[0], Direction.VERTICAL, 5);
			instance = splitter.fields[0];
			neighbor = splitter.fields[1];
		});

		it("should exclude yellow from its color distribution", function(){
			var fieldColoring = new FieldColoring();
			fieldColoring.colorField(neighbor, Color.YELLOW);
			var colorDistribution = instance.getColorDistribution(fieldColoring, randomValueProviderConfig);
			expect(colorDistribution).not.toGiveWeightTo(Color.YELLOW);
		});
	});

	describe("that is relatively big", function(){

		beforeEach(function(){
			var splitter = new FieldSplitter(10, 10, configuration);
			splitFieldInDirection(splitter, splitter.fields[0], Direction.HORIZONTAL, 1);
			var topField = splitter.fields.find(function(f){return f.rectangle.verticalInterval.from == 0;});
			splitFieldInDirection(splitter, topField, Direction.VERTICAL, 1);
			instance = splitter.fields.find(function(f){return f.rectangle.verticalInterval.from == 1 && f.rectangle.horizontalInterval.from == 0;})
		});

		it("should prefer white over other colors", function(){
			var fieldColoring = new FieldColoring();
			var colorDistribution = instance.getColorDistribution(fieldColoring, randomValueProviderConfig);
			expect(colorDistribution).toPreferTo(Color.RED, Color.WHITE);
			expect(colorDistribution).toPreferTo(Color.BLUE, Color.WHITE);
			expect(colorDistribution).toPreferTo(Color.YELLOW, Color.WHITE);
			expect(colorDistribution).toPreferTo(Color.BLACK, Color.WHITE);
		});
	});

	describe("that exceeds the max ratio horizontally", function(){

		beforeEach(function(){
			var splitter = new FieldSplitter(15, 1, configuration);
			instance = splitter.fields[0];
		});

		it("should only be splittable vertically", function(){
			var directionDistribution = instance.getDirectionDistribution(randomValueProviderConfig);
			expect(directionDistribution).toGiveWeightTo(Direction.VERTICAL);
			expect(directionDistribution).not.toGiveWeightTo(Direction.HORIZONTAL);
		});
	});

	describe("that does not exceed the max ratio", function(){

		beforeEach(function(){
			var splitter = new FieldSplitter(10, 10, configuration);
			instance = splitter.fields[0];
		});

		it("should be splittable in both directions", function(){
			var directionDistribution = instance.getDirectionDistribution(randomValueProviderConfig);
			expect(directionDistribution).toGiveWeightTo(Direction.VERTICAL);
			expect(directionDistribution).toGiveWeightTo(Direction.HORIZONTAL);
		});
	});
});
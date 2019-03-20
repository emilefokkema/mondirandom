describe("A field", function(){
	var FieldSplitter = require("../js/field-splitter.js");
	var Color = require("../js/color.js");
	var splitFieldInDirection = require("./split-field-in-direction.js");
	var TestRandomValueProvider = require("./test-random-value-provider.js");
	var Direction = require("../js/direction.js");
	var instance,
		maxSplittableRatio = 10,
		configuration = {
			maxSplittableRatio: maxSplittableRatio,
			lowestColorDistributionFactor: 1
		};

	describe("that exceeds the max ratio vertically", function(){

		beforeEach(function(){
			var splitter = new FieldSplitter(1, 15, configuration);
			instance = splitter.fields[0];
		});

		it("should only be splittable horizontally", function(){
			var directionDistribution = instance.getDirectionDistribution();
			expect(directionDistribution).not.toGiveWeightTo(Direction.VERTICAL);
			expect(directionDistribution).toGiveWeightTo(Direction.HORIZONTAL);
		});
	});

	describe("that is relatively big", function(){

		beforeEach(function(){
			var splitter = new FieldSplitter(10, 10, configuration);
			splitFieldInDirection(splitter, splitter.fields[0], Direction.HORIZONTAL, 0.1);
			var topField = splitter.fields.find(function(f){return f.rectangle.verticalInterval.from == 0;});
			splitFieldInDirection(splitter, topField, Direction.VERTICAL, 0.1);
			instance = splitter.fields.find(function(f){return f.rectangle.verticalInterval.from == 1 && f.rectangle.horizontalInterval.from == 0;})
		});

		it("should prefer white over other colors", function(){
			var colorDistribution = instance.getColorDistribution();
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
			var directionDistribution = instance.getDirectionDistribution();
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
			var directionDistribution = instance.getDirectionDistribution();
			expect(directionDistribution).toGiveWeightTo(Direction.VERTICAL);
			expect(directionDistribution).toGiveWeightTo(Direction.HORIZONTAL);
		});
	});
});
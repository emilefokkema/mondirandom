describe("A field", function(){
	var FieldSplitter = require("../js/field-splitter.js");
	var TestRandomValueProvider = require("./test-random-value-provider.js");
	var Direction = require("../js/direction.js");
	var instance,
		maxSplittableRatio = 10,
		configuration = {maxSplittableRatio: maxSplittableRatio};

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
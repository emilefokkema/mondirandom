describe("A distribution", function(){
	var Distribution = require("../js/distribution.js");
	var instance;

	describe("that is constant", function(){

		beforeEach(function(){
			instance = Distribution.constant();
		});

		it("should distribute weights evenly", function(){
			var values = [0, 1, 2, 3];
			var weightedValues = instance.getWeightedValues(values).values;
			expect(weightedValues).toEqual([
				{value:0,weight:1},
				{value:1,weight:1},
				{value:2,weight:1},
				{value:3,weight:1}
				])
		});

		describe("but for one value multiplied", function(){
			var newInstance, valueToMultiply = 1, ratio = 0.5;

			beforeEach(function(){
				newInstance = instance.multiplySingleValue(1, 0.5);
			});

			it("should give no weight to the excepted value", function(){
				var values = [0, valueToMultiply, 2, 3];
				var weightedValues = newInstance.getWeightedValues(values).values;
				expect(weightedValues).toEqual([
					{value:0,weight:1},
					{value:valueToMultiply,weight:0.5},
					{value:2,weight:1},
					{value:3,weight:1}
					])
			});
		});

		describe("except a single value", function(){
			var newInstance, valueToExcept = 1;

			beforeEach(function(){
				newInstance = instance.except(valueToExcept);
			});

			it("should give no weight to the excepted value", function(){
				var values = [0, valueToExcept, 2, 3];
				var weightedValues = newInstance.getWeightedValues(values).values;
				expect(weightedValues).toEqual([
					{value:0,weight:1},
					{value:valueToExcept,weight:0},
					{value:2,weight:1},
					{value:3,weight:1}
					])
			});
		});
	});

	describe("that is single-value", function(){
		var singleValue = 1;

		beforeEach(function(){
			instance = Distribution.only(singleValue);
		});

		it("should give weight to only one value", function(){
			var values = [0, singleValue, 2, 3];
			var weightedValues = instance.getWeightedValues(values).values;
			expect(weightedValues).toEqual([
				{value:0,weight:0},
				{value:singleValue,weight:1},
				{value:2,weight:0},
				{value:3,weight:0}
				])
		});
	});
});
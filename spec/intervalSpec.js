describe("an interval", function(){
	var Interval = require("../js/interval.js");
		var TestRandomValueProvider = require("./test-random-value-provider.js");
	var instance;
	
	beforeEach(function(){
		instance = new Interval(1, 3, new TestRandomValueProvider());
	});
	
	it("should have a length", function(){
		expect(instance.length).toBe(2);
	});
	
	it("should contain a point", function(){
		expect(instance.contains(2)).toBe(true);
	});
	
	describe("and an overlapping one", function(){
		var overlappingOne;
		
		beforeEach(function(){
			overlappingOne = new Interval(2, 4, new TestRandomValueProvider());
		});
		
		it("should have an overlap", function(){
			var overlap = instance.getOverlapWith(overlappingOne);
			expect(overlap.from).toBe(2);
			expect(overlap.to).toBe(3);
		})
	})
});
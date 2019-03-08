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
	
	describe("and an overlapping one", function(){
		var overlappingOne;
		
		beforeEach(function(){
			overlappingOne = new Interval(2, 4, new TestRandomValueProvider());
		});
		
		xit("should have an overlap", function(){
			var overlap = instance.getOverlapWith(overlappingOne);
		})
	})
});
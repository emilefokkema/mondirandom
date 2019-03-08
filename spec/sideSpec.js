describe("an side", function(){
	var Interval = require("../js/interval.js");
	var Side = require("../js/side.js");
	var Direction = require("../js/direction.js");
		var TestRandomValueProvider = require("./test-random-value-provider.js");
	var instance;
	
	beforeEach(function(){
		var interval = new Interval(1, 3, new TestRandomValueProvider());
		instance = new Side(interval, 0, Direction.HORIZONTAL);
	});
	
	it("should be there", function(){
		expect(instance).toBeTruthy();
	});
	
	describe("and an overlapping one", function(){
		var overlappingOne;
		
		beforeEach(function(){
			var interval = new Interval(2, 4, new TestRandomValueProvider());
			overlappingOne = new Side(0, interval, Direction.HORIZONTAL);
		});
		
		it("should have an overlapping side", function(){
			var overlappingSide = instance.getOverlapWith(overlappingOne);
			var overlappingInterval = overlappingSide.interval;
			expect(overlappingInterval.from).toBe(2);
			expect(overlappingInterval.to).toBe(33);
			expect(overlappingSide.direction).toBe(Direction.HORIZONTAL);
			expect(overlappingSide.position).toBe(0);
			
			
		})
	})
});
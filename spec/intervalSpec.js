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
	});
	
		describe("and an equal one", function(){
		var equalOne;
		
		beforeEach(function(){
			equalOne = new Interval(1, 3, new TestRandomValueProvider());
		});
		
		it("should have an overlap", function(){
			var overlap = instance.getOverlapWith(equalOne);
			expect(overlap.from).toBe(1);
			expect(overlap.to).toBe(3);
		})
	});
	
		describe("and another overlapping one", function(){
		var overlappingOne;
		
		beforeEach(function(){
			overlappingOne = new Interval(0, 2, new TestRandomValueProvider());
		});
		
		it("should have an overlap", function(){
			var overlap = instance.getOverlapWith(overlappingOne);
			expect(overlap.from).toBe(1);
			expect(overlap.to).toBe(2);
		})
	});
			describe("and a touching one", function(){
		var touchingOne;
		
		beforeEach(function(){
			touchingOne = new Interval(3, 4, new TestRandomValueProvider());
		});
		
		it("should not have an overlap", function(){
			var overlap = instance.getOverlapWith(touchingOne);
			expect(overlap).toBeFalsy();
		})
	});
	 describe("and a non-overlapping one", function(){
		var nonOverlappingOne;
		
		beforeEach(function(){
			nonOverlappingOne = new Interval(4, 5, new TestRandomValueProvider());
		});
		
		it("should not have an overlap", function(){
			var overlap = instance.getOverlapWith(nonOverlappingOne);
			expect(overlap).toBe(null);
		})
	});
});
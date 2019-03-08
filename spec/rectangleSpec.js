describe("A rectangle", function(){
	var Rectangle = require("../js/rectangle.js");
	var Interval = require("../js/interval.js");
	var Direction = require("../js/direction.js")
	var instance;

	beforeEach(function(){
		instance = Rectangle.create(0, 0, 2, 1);
	});
	
	it("have area 2",function(){
		expect(instance.area).toBe(2);
	});

	it("should lead to a new rectangle for a new horizontal interval", function(){
		var newInterval = new Interval(1, 4);
		var newRectangle = instance.withHorizontalInterval(newInterval);
		expect(newRectangle.area).toBe(3);
	});
	
	describe("and a touching one", function(){
		var otherOne;
		
		beforeEach(function(){
			otherOne = Rectangle.create(2, 0, 1, 1);
		});
		
		it("should have a common side", function(){
			var commonSides = instance.getCommonSidesWith(otherOne);
			expect(commonSides.length).toBe(1);
				var commonSide = commonSides[0];
		expect(commonSide.direction).toBe(Direction.VERTICAL);
		expect(commonSide.interval.from).toBe(0);
		expect(commonSide.interval.to).toBe(1);
		});
	
	})
});
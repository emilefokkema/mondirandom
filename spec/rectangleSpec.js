describe("A rectangle", function(){
	var Rectangle = require("../js/rectangle.js");
	var Interval = require("../js/interval.js");
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
});
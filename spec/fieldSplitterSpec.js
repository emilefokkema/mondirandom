describe("A FieldSplitter", function(){
	var FieldSplitter = require("../js/field-splitter.js");
	var Color = require("../js/color.js");
	var FakeContext = require("./fake-context.js");
	var Direction = require("../js/direction.js");
	var TestRandomValueProvider = require("./test-random-value-provider.js");
	var instance;
	
	var splitFieldInDirection = function(field, direction, ratio){
		var randomValueProvider = new TestRandomValueProvider();
		randomValueProvider.randomField = field;
		randomValueProvider.randomDirection = direction;
		randomValueProvider.randomRatio = ratio;
		instance.splitRandomField(randomValueProvider);
	};
	var drawFieldsInColors = function(fieldColors, context){
		var randomValueProvider = new TestRandomValueProvider();
		randomValueProvider.fieldColors = fieldColors;
		instance.draw(context, randomValueProvider);
	};

	beforeEach(function(){
		instance = new FieldSplitter(10, 10, 1);
	});

	it("should be there", function(){
		expect(instance).toBeTruthy();
	});

	describe("when it splits two fields", function(){
		var bottomLeftField, topLeftField, rightField;

		beforeEach(function(){
			splitFieldInDirection(instance.fields[0], Direction.VERTICAL, 0.5);
			var leftField = instance.fields.find(function(f){return f.rectangle.horizontalInterval.from == 0;});
			splitFieldInDirection(leftField, Direction.HORIZONTAL, 0.5);
			bottomLeftField = instance.fields.find(function(f){return f.rectangle.horizontalInterval.from == 0 && f.rectangle.verticalInterval.from == 0;});
			topLeftField = instance.fields.find(function(f){return f.rectangle.horizontalInterval.from == 0 && f.rectangle.verticalInterval.from == 5;});
			rightField = instance.fields.find(function(f){return f.rectangle.horizontalInterval.from == 5 ;});
		});

		it("should have three fields", function(){
			expect(instance.fields.length).toBe(3);
			expect(bottomLeftField).toBeTruthy();
			expect(topLeftField).toBeTruthy();
			expect(rightField).toBeTruthy();
		});

		it("each field should have two neighbors", function(){
			expect(topLeftField.neighbors.length).toBe(2);
			expect(topLeftField.neighbors).toContain(bottomLeftField);
			expect(topLeftField.neighbors).toContain(rightField);

			expect(bottomLeftField.neighbors.length).toBe(2);
			expect(bottomLeftField.neighbors).toContain(topLeftField);
			expect(bottomLeftField.neighbors).toContain(rightField);

			expect(rightField.neighbors.length).toBe(2);
			expect(rightField.neighbors).toContain(topLeftField);
			expect(rightField.neighbors).toContain(bottomLeftField);
		});
	});

	describe("when it splits a random field", function(){

		beforeEach(function(){
			splitFieldInDirection(instance.fields[0], Direction.VERTICAL, 0.2);
		});

		it("should have two fields and one border", function(){
			expect(instance.fields.length).toBe(2);
			expect(instance.borders.length).toBe(1);
		});

		describe("and it is drawn", function(){
			var fakeContext;
			var fillStyleSpy;

			beforeEach(function(){
				fakeContext = new FakeContext();
				spyOn(fakeContext,'fillRect');
				fillStyleSpy = spyOnProperty(fakeContext, 'fillStyle', 'set');
				drawFieldsInColors([
					{field: instance.fields[0], color: Color.RED},
					{field: instance.fields[1], color: Color.BLUE}
				], fakeContext);
			});

			it("should draw two rectangles", function(){
				expect(fillStyleSpy).toHaveBeenCalledWith(Color.RED);
				expect(fillStyleSpy).toHaveBeenCalledWith(Color.BLUE);
				expect(fakeContext.fillRect).toHaveBeenCalledWith(0, 0, 2, 10);
				expect(fakeContext.fillRect).toHaveBeenCalledWith(2, 0, 8, 10);
				expect(fakeContext.fillRect).toHaveBeenCalledWith(1.5, 0, 1, 10);
			});
		});
	});
});
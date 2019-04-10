describe("A FieldSplitter", function(){
	var FieldSplitter = require("../js/field-splitter.js");
	var Color = require("../js/color.js");
	var FakeContext = require("./fake-context.js");
	var Direction = require("../js/direction.js");
	var TestRandomValueProvider = require("./test-random-value-provider.js");
	var splitFieldInDirection = require("./split-field-in-direction.js");
	var instance;
	var initialField;
	var randomValueProviderConfig = {
			maxSplittableRatio: 10,
			lowestColorDistributionFactor: 1,
			lowestFieldDistributionFactor: 1,
			neighborColorExclusionLimit: {
				black:0,
				red:0,
				yellow:0.25,
				blue:0,
				white:Infinity
			}
		};
	var checkNeighbors = function(field, expectedNeighbors){
		expect(field.neighbors.length).toBe(expectedNeighbors.length);
		for(var i=0;i<expectedNeighbors.length;i++){
			expect(field.neighbors).toContain(expectedNeighbors[i]);
		}
	};
	var drawFieldsInColors = function(fieldColors, context){
		var randomValueProvider = new TestRandomValueProvider();
		randomValueProvider.fieldColors = fieldColors;
		instance.draw(context, randomValueProvider);
	};

	beforeEach(function(){
		instance = new FieldSplitter(10, 10, {
			borderThickness: 1
		});
		initialField = instance.fields[0];
	});

	it("should be there", function(){
		expect(instance).toBeTruthy();
	});

	describe("when it has a big field and a small field", function(){
		var bigField, smallField;

		beforeEach(function(){
			splitFieldInDirection(instance, instance.fields[0], Direction.VERTICAL, 1);
			smallField = instance.fields.find(f => f.rectangle.horizontalInterval.from == 0);
			bigField = instance.fields.find(f => f.rectangle.horizontalInterval.from == 1);
		});

		it("should prefer to split the big field", function(){

			var fieldDistribution = instance.getFieldDistribution(randomValueProviderConfig);
			expect(fieldDistribution).toPreferTo(smallField, bigField);
		});
	});

	describe("when it splits two fields", function(){
		var bottomLeftField, topLeftField, rightField;

		beforeEach(function(){
			splitFieldInDirection(instance, instance.fields[0], Direction.VERTICAL, 5);
			var leftField = instance.fields.find(function(f){return f.rectangle.horizontalInterval.from == 0;});
			splitFieldInDirection(instance, leftField, Direction.HORIZONTAL, 5);
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
			checkNeighbors(topLeftField, [bottomLeftField, rightField]);
			checkNeighbors(bottomLeftField, [topLeftField, rightField]);
			checkNeighbors(rightField, [topLeftField, bottomLeftField]);
		});

		describe("and then another one", function(){
			var topLeftLeftField, topLeftRightField;

			beforeEach(function(){
				splitFieldInDirection(instance, topLeftField, Direction.VERTICAL, 2);
				topLeftLeftField = instance.fields.find(function(f){return f.rectangle.horizontalInterval.from == 0 && f.rectangle.horizontalInterval.to == 2;});
				topLeftRightField = instance.fields.find(function(f){return f.rectangle.horizontalInterval.from == 2 && f.rectangle.horizontalInterval.to == 5;});
			});

			it("some fields should have three neighbors", function(){
				checkNeighbors(topLeftLeftField, [topLeftRightField, bottomLeftField]);
				checkNeighbors(topLeftRightField, [topLeftLeftField, bottomLeftField, rightField]);
				checkNeighbors(bottomLeftField, [topLeftLeftField, topLeftRightField, rightField]);
				checkNeighbors(rightField, [topLeftRightField, bottomLeftField]);
			});
		});
	});

	describe("when it splits, colors and is drawn", function(){
		var fakeContext;
		var fillStyleSpy;

		beforeEach(function(){
			var valueProvider = new TestRandomValueProvider();
			valueProvider.randomFieldIndex = 0;
			valueProvider.randomDirection = Direction.VERTICAL;
			valueProvider.randomSplitPoint = 2;
			valueProvider.fieldColors = [Color.RED, Color.BLUE];
			instance.splitAndColor(valueProvider, 1);
			fakeContext = new FakeContext();
			spyOn(fakeContext,'fillRect');
			fillStyleSpy = spyOnProperty(fakeContext, 'fillStyle', 'set');
			instance.draw(fakeContext);
		});

		it("should draw two rectangles", function(){
			expect(fillStyleSpy).toHaveBeenCalledWith(Color.RED);
			expect(fillStyleSpy).toHaveBeenCalledWith(Color.BLUE);
			expect(fakeContext.fillRect).toHaveBeenCalledWith(0, 0, 2, 10);
			expect(fakeContext.fillRect).toHaveBeenCalledWith(2, 0, 8, 10);
			expect(fakeContext.fillRect).toHaveBeenCalledWith(1.5, 0, 1, 10);
		});
	});

	describe("when it splits a random field", function(){
		var field1, field2;

		beforeEach(function(){
			splitFieldInDirection(instance, initialField, Direction.VERTICAL, 2);
			field1 = instance.fields[0];
			field2 = instance.fields[1];
		});

		it("should have two fields and one border", function(){
			expect(instance.fields.length).toBe(2);
			expect(instance.borders.length).toBe(1);
		});

		it("each field should have the other as neighbor", function(){
			checkNeighbors(field1, [field2]);
			checkNeighbors(field2, [field1]);
		});
	});
});
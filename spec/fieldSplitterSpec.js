describe("A FieldSplitter", function(){
	var FieldSplitter = require("../js/field-splitter.js");
	var Color = require("../js/color.js");
	var FakeContext = require("./fake-context.js");
	var Direction = require("../js/direction.js");
	var TestRandomValueProvider = require("./test-random-value-provider.js");
	var instance;
	var randomValueProvider;

	beforeEach(function(){
		randomValueProvider = new TestRandomValueProvider();
		instance = new FieldSplitter(10, 10, randomValueProvider, 1);
	});

	it("should be there", function(){
		expect(instance).toBeTruthy();
	});

	describe("when it splits a random field", function(){

		beforeEach(function(){
			randomValueProvider.randomField = instance.fields[0];
			randomValueProvider.randomDirection = Direction.VERTICAL;
			randomValueProvider.randomRatio = 0.2;
			instance.splitRandomField();
		});

		it("should have two fields and one border", function(){
			expect(instance.fields.length).toBe(2);
			expect(instance.borders.length).toBe(1);
		});

		describe("and it is drawn", function(){
			var fakeContext;
			var fillStyleSpy;

			beforeEach(function(){
				randomValueProvider.randomColor = Color.RED;
				fakeContext = new FakeContext();
				spyOn(fakeContext,'fillRect');
				fillStyleSpy = spyOnProperty(fakeContext, 'fillStyle', 'set');
				instance.draw(fakeContext);
			});

			it("should draw two rectangles", function(){
				expect(fillStyleSpy).toHaveBeenCalledWith(Color.RED);
				expect(fakeContext.fillRect).toHaveBeenCalledWith(0, 0, 2, 10);
				expect(fakeContext.fillRect).toHaveBeenCalledWith(2, 0, 8, 10);
				expect(fakeContext.fillRect).toHaveBeenCalledWith(1.5, 0, 1, 10);
			});
		});
	});
});
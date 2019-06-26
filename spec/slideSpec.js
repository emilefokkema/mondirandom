describe("a slide", function(){
	var Slide = require("../js/slide.js");
	var instance;
	var content = 2;
	var getContent = function(){return content;};

	beforeEach(function(){
		instance = new Slide(undefined, getContent);
	});

	it("should have content", function(){
		expect(instance.content).toBe(content);
	});

	describe("'s next", function(){
		var previous;

		beforeEach(function(){
			previous = instance;
			instance = instance.next();
		});

		it("should have content", function(){
			expect(instance.content).toBe(content);
		});

		describe("'s previous", function(){

			beforeEach(function(){
				instance = instance.previous();
			});

			it("should be the same", function(){
				expect(instance).toBe(previous);
			});
		});
	});

	
});
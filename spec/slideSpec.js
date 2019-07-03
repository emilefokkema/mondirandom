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

	it("should be able to append a slide with a given content", function(){
		var last = instance.next().next().next();
		var newOne = instance.create(42);
		expect(newOne.content).toBe(42);
		expect(newOne.previous()).toBe(last);
	});
	
	describe("that has a max size", function(){
		var maxSize = 3;
		
		beforeEach(function(){
			instance = new Slide(undefined, getContent, maxSize);
		});
		
		it("should not remember more than so many previouses", function(){
			var first = instance;
			var second = first.next();
			var third = second.next();
			var fourth = third.next();
			
			var thirdRemembered = fourth.previous();
			expect(thirdRemembered).toBe(third);
			var secondRemembered = thirdRemembered.previous();
			expect(secondRemembered).toBe(second);
			var secondRememberedPrevious = secondRemembered.previous();
			expect(secondRememberedPrevious).not.toBe(first);
		});
		
		it("should not remember more than so many nexts", function(){
			var first = instance;
			var second = first.previous();
			var third = second.previous();
			var fourth = third.previous();
			
			var thirdRemembered = fourth.next();
			expect(thirdRemembered).toBe(third);
			var secondRemembered = thirdRemembered.next();
			expect(secondRemembered).toBe(second);
			var secondRememberedNext = secondRemembered.next();
			expect(secondRememberedNext).not.toBe(first);
		});
		
	});

	describe("that has a previous with a certain content", function(){
		var previous, previousContent;

		beforeEach(function(){
			var getCountingContent = (function(counter){return function(){return counter++;};})(0);
			instance = new Slide(undefined, getCountingContent);
			previous = instance;
			previousContent = previous.content;
			instance = instance.next().next().next().previous();
		});

		it("should be able to find it using that previous's content", function(){
			var result = instance.find(function(content){return content === previousContent;});
			expect(result).toBe(previous);
		});
	});

	describe("that has a next with a certain content", function(){
		var next, nextContent;

		beforeEach(function(){
			var getCountingContent = (function(counter){return function(){return counter++;};})(0);
			instance = new Slide(undefined, getCountingContent);
			next = instance;
			nextContent = next.content;
			instance = instance.previous().previous().previous().next();
		});

		it("should be able to find it using that next's content", function(){
			var result = instance.find(function(content){return content === nextContent;});
			expect(result).toBe(next);
		});
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
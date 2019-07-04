describe("a slide history", function(){
	var SlideHistory = require("../js/slide-history.js");
	var TestStorage = require("./test-storage.js");
	var instance;
	var storage;
	var content = 2;
	var getContent = function(){return content;};

	beforeEach(function(){
		storage = new TestStorage();
		instance = new SlideHistory(storage, getContent);
	});

	it("should find slide with existing content", function(){
		storage.setItem("slides", [1, 2, 3, 4]);
		var result = instance.findOrCreateSlideWithContent(3);
		expect(result).toBeTruthy();
		expect(result.content).toBe(3);
		expect(result.previous().content).toBe(2);
		expect(result.next().content).toBe(4);
	});
	
	it("should create slide with nonexistent content", function(){
		storage.setItem("slides", [1, 2, 3, 4]);
		var result = instance.findOrCreateSlideWithContent(5);
		expect(result).toBeTruthy();
		expect(result.content).toBe(5);
		var newSlides = storage.getItem("slides");
		expect(newSlides).toEqual([5]);
	});

	it("should reflect the creation of new slides", function(){
		storage.setItem("slides", []);
		var slide = instance.findOrCreateSlideWithContent(content);
		slide.next().previous().previous();
		expect(storage.getItem("slides")).toEqual([content, content, content]);
	});
});
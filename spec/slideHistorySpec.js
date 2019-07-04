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

	describe("that looks for a slide with existing content", function(){
		var slide;

		beforeEach(function(){
			storage.setItem("slides", [1, 2, 3, 4]);
			slide = instance.findOrCreateSlideWithContent(3);
		});

		it("should find it", function(){
			expect(slide).toBeTruthy();
			expect(slide.content).toBe(3);
			expect(slide.previous().content).toBe(2);
			expect(slide.next().content).toBe(4);
		});

		it("should reflect the creation of new slides", function(){
			slide.next().next();
			slide.previous().previous().previous();
			expect(storage.getItem("slides")).toEqual([content, 1, 2, 3, 4, content]);
		});
	});


	describe("that looks for a slide with nonexistent content", function(){
		var slide;

		beforeEach(function(){
			storage.setItem("slides", [1, 2, 3, 4]);
			slide = instance.findOrCreateSlideWithContent(5);
		});

		it("should create it", function(){
			expect(slide).toBeTruthy();
			expect(slide.content).toBe(5);
			var newSlides = storage.getItem("slides");
			expect(newSlides).toEqual([5]);
		});

		it("should reflect the creation of new slides", function(){
			slide.next();
			slide.previous();
			expect(storage.getItem("slides")).toEqual([content, 5, content]);
		});
	});

	describe("that looks for an existing slide", function(){
		var slide;

		beforeEach(function(){
			storage.setItem("slides", [1]);
			slide = instance.findOrCreateSlide();
		});

		it("should find it", function(){
			expect(slide).toBeTruthy();
			expect(slide.content).toBe(1);
		});

		it("should reflect the creation of new slides", function(){
			slide.next();
			slide.previous();
			expect(storage.getItem("slides")).toEqual([content, 1, content]);
		});
	});

	describe("that looks for an nonexistent slide", function(){
		var slide;

		beforeEach(function(){
			storage.setItem("slides", []);
			slide = instance.findOrCreateSlide();
		});

		it("should create one", function(){
			expect(slide).toBeTruthy();
			expect(slide.content).toBe(content);
			expect(storage.getItem("slides")).toEqual([content]);
		});

		it("should reflect the creation of new slides", function(){
			slide.next();
			slide.previous();
			expect(storage.getItem("slides")).toEqual([content, content, content]);
		});
	});
});
describe("A FieldSplitter", function(){
	var FieldSplitter = require("../js/field-splitter.js");
	var instance;

	beforeEach(function(){
		instance = new FieldSplitter(10, 10);
	});

	it("should be there", function(){
		expect(instance).toBeTruthy();
	});

	describe("when it splits a random field", function(){

		beforeEach(function(){
			instance.splitRandomField();
		});

		it("should have two fields and one border", function(){
			expect(instance.fields.length).toBe(2);
			expect(instance.borders.length).toBe(1);
		});
	});
});
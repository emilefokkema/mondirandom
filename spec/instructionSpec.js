describe("An instruction that contains data", function(){
	var Instruction = require("../js/instruction.js");
	var Direction = require("../js/direction.js");
	var Color = require("../js/color.js");
	var stringRepresentation = "MjAwOzEwMDsxOzI7MCwxOzEwO3JieTsxMDAsNTA=";
	var instance;

	describe("that contains data", function(){
		beforeEach(function(){
			instance = new Instruction(200, 100, 1, 2);
			instance.chooseFieldIndex(0);
			instance.chooseDirection(Direction.VERTICAL);
			instance.chooseSplitPoint(100);
			instance.chooseFieldIndex(1);
			instance.chooseDirection(Direction.HORIZONTAL);
			instance.chooseSplitPoint(50);
			instance.chooseColor(Color.RED);
			instance.chooseColor(Color.BLUE);
			instance.chooseColor(Color.YELLOW);
		});

		it("should have this string representation", function(){
			expect(instance.toString()).toBe(stringRepresentation);
		});
	});

	describe("that is parsed", function(){

		beforeEach(function(){
			instance = Instruction.parse(stringRepresentation);
		});

		it("should be there", function(){
			expect(instance.width).toBe(200);
			expect(instance.height).toBe(100);
			expect(instance.borderThickness).toBe(1);
			expect(instance.numberOfSplits).toBe(2);
			expect(instance.fieldIndices).toEqual([0, 1]);
			expect(instance.directions).toEqual([Direction.VERTICAL, Direction.HORIZONTAL]);
			expect(instance.colors).toEqual([Color.RED, Color.BLUE, Color.YELLOW]);
			expect(instance.splitPoints).toEqual([100, 50]);
		});
	});
});
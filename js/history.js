var f = function(require){
	var storage = require("./storage");
	var history = {
		addPaintingInstruction: function(instruction){
			var historyList = storage.getItem("historyList") || [];
			historyList.push(instruction);
			historyList = historyList.slice(-10);
			storage.setItem("historyList", historyList);
		}
	};

	return history;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
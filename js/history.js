var f = function(require){
	var storage = require("./storage");
	var history = {
		addPaintingInstruction: function(instruction){
			var historyList = storage.getItem("historyList") || [];
			historyList.push(instruction);
			historyList.splice(0, Math.max(0, historyList.length - 10));
			storage.setItem("historyList", historyList);
		},
		getAll:function(){
			return storage.getItem("historyList");
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
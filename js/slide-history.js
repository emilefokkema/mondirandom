var f = function(require){
	var Slide = require("./slide");
	var SlideHistory = function(storage, getNewSlideContent){
		this.storage = storage;
		this.getNewSlideContent = getNewSlideContent;
	};
	SlideHistory.prototype.storeContents = function(contents){
		this.storage.setItem("slides", contents);
	};
	SlideHistory.prototype.getContents = function(){
		return this.storage.getItem("slides");
	};
	SlideHistory.prototype.findOrCreateSlideWithContent = function(){

	};
	return SlideHistory;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
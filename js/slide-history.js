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
	SlideHistory.prototype.findOrCreateSlideWithContent = function(content){
		var slide, contents = this.getContents();
		if(contents && contents.length){
			slide = Slide.fromContents(contents, this.getNewSlideContent);
			var found = slide.find(function(c){return c === content;});
			if(found){
				return found;
			}
		}
		slide = new Slide(content, this.getNewSlideContent);
		this.storeContents(slide.getAllContents());
		return slide;
	};
	return SlideHistory;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
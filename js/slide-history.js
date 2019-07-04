var f = function(require){
	var Slide = require("./slide");
	var SlideHistory = function(storage, getNewSlideContent, maxLength){
		this.storage = storage;
		this.getNewSlideContent = getNewSlideContent;
		this.maxLength = maxLength;
	};
	SlideHistory.prototype.storeSlide = function(slide){
		this.storage.setItem("slides", slide.getAllContents());
	};
	SlideHistory.prototype.getSlide = function(){
		var contents = this.storage.getItem("slides");
		if(contents && contents.length){
			return Slide.fromContents(contents, this.getNewSlideContent, this.maxLength, this.storeSlide.bind(this));
		}
		return undefined;
	};
	SlideHistory.prototype.findOrCreateSlide = function(){
		var slide = this.getSlide();
		if(slide){
			return slide;
		}
		slide = new Slide(undefined, this.getNewSlideContent, this.maxLength, this.storeSlide.bind(this));
		this.storeSlide(slide);
		return slide;
	};
	SlideHistory.prototype.findOrCreateSlideWithContent = function(content){
		var slide = this.getSlide();
		if(slide){
			var found = slide.find(function(c){return c === content;});
			if(found){
				return found;
			}
		}
		slide = new Slide(content, this.getNewSlideContent, this.maxLength, this.storeSlide.bind(this));
		this.storeSlide(slide);
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
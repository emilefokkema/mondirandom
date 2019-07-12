var f = function(require){
	var Slide = require("./slide");
	var SlideHistory = function(storage, getNewSlideContent, maxLength){
		this.storage = storage;
		this.getNewSlideContent = getNewSlideContent;
		this.maxLength = maxLength;
	};
	SlideHistory.prototype.storeSlide = function(slide, sequenceIndex){
		var sequences = this.storage.getItem("sequences") || [];
		sequences[sequenceIndex] = slide.getAllContents();
		this.storage.setItem("sequences", sequences);
	};
	SlideHistory.prototype.getSlide = function(index){
		var contents = this.storage.getItem("sequences")[index];
		if(contents && contents.length){
			return Slide.fromContents(contents, this.getNewSlideContent, this.maxLength, this.getStoreFn(index));
		}
		return undefined;
	};
	SlideHistory.prototype.getStoreFn = function(index){
		var self = this;
		return function(slide){
			self.storeSlide(slide, index);
		};
	};
	SlideHistory.prototype.findOrCreateSlide = function(){
		var sequences = this.storage.getItem("sequences") || [];
		if(sequences.length){
			return this.getSlide(0);
		}
		slide = new Slide(undefined, this.getNewSlideContent, this.maxLength, this.getStoreFn(0));
		this.storeSlide(slide, 0);
		return slide;
	};
	SlideHistory.prototype.findOrCreateSlideWithContent = function(content){
		var sequences = this.storage.getItem("sequences") || [];
		for(var i=0;i<sequences.length;i++){
			var sequence = sequences[i];
			if(sequence.find(function(c){return c === content;})){
				return this.getSlide(i).find(function(c){return c === content;});
			}
		}
		slide = new Slide(content, this.getNewSlideContent, this.maxLength, this.getStoreFn(sequences.length));
		this.storeSlide(slide, sequences.length);
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
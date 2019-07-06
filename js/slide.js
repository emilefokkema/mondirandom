var f = function(require){
	var Slide = function(content, getContent, maxLength, onSlideCreated){
		this.content = content === undefined ? getContent() : content;
		this.getContent = getContent;
		this._next = undefined;
		this._previous = undefined;
		this.maxLength = maxLength;
		this.onSlideCreated = onSlideCreated || function(){};
	};
	Slide.prototype.next = function(){
		if(this._next){
			return this._next;
		}
		var next = new Slide(undefined, this.getContent, this.maxLength, this.onSlideCreated);
		next.setPrevious(this);
		this._next = next;
		next.ensureMaxLength(this.maxLength);
		this.onSlideCreated(next);
		return next;
	};
	Slide.prototype.getAtIndex = function(index){
		var i = 0;
		return this.reduce(function(result, slide){
			i++;
			if(result.value === undefined && i == index){
				result.value = slide;
			}
			return result;
		}).value;
	};
	Slide.prototype.getAtRandomIndex = function(){
		var randomIndex = Math.floor(Math.random() * this.getLength());
		return this.getAtIndex(randomIndex);
	};
	Slide.prototype.reduce = function(callback, initialValue, origin){
		if(this._previous && this._previous !== origin){
			initialValue = this._previous.reduce(callback, initialValue, this);
		}
		var newValue;
		if(!this._previous){
			newValue = initialValue === undefined ? this : callback(initialValue, this);
		}else{
			newValue = callback(initialValue, this);
		}
		if(this._next && this._next !== origin){
			return this._next.reduce(callback, newValue, this);
		}
		return newValue;
	};
	Slide.prototype.getAllContents = function(){
		return this.reduce(function(contents, slide){contents.push(slide.content);return contents;}, []);
	};
	Slide.prototype.getLength = function(){
		return this.reduce(function(l){return l + 1;}, 0);
	};
	Slide.prototype.previous = function(){
		if(this._previous){
			return this._previous;
		}
		var previous = new Slide(undefined, this.getContent, this.maxLength, this.onSlideCreated);
		previous.setNext(this);
		this._previous = previous;
		previous.ensureMaxLength(this.maxLength);
		this.onSlideCreated(previous);
		return previous;
	};
	Slide.prototype.destroy = function(){
		this._next = undefined;
		this._previous = undefined;
	};
	Slide.prototype.ensureMaxLength = function(maxLength, origin){
		if(maxLength == 1){
			if(this._next && this._next !== origin){
				this._next.destroy();
				this._next = undefined;
			}
			if(this._previous && this._previous !== origin){
				this._previous.destroy();
				this._previous = undefined;
			}
		}else{
			if(this._next && this._next !== origin){
				this._next.ensureMaxLength(maxLength - 1, this);
			}
			if(this._previous && this._previous !== origin){
				this._previous.ensureMaxLength(maxLength - 1, this);
			}
		}
	};
	Slide.prototype.create = function(content){
		if(this._next){
			return this._next.create(content);
		}
		var next = new Slide(content, this.getContent, this.maxLength, this.onSlideCreated);
		next.setPrevious(this);
		this._next = next;
		next.ensureMaxLength(this.maxLength);
		this.onSlideCreated(next);
		return next;
	};
	Slide.prototype.find = function(matchContent){
		return this.reduce(function(result, slide){
			if(result.value === undefined && matchContent(slide.content)){
				result.value = slide;
			}
			return result;
		},{value:undefined}).value;
	};
	Slide.prototype.setPrevious = function(previous){
		this._previous = previous;
	};
	Slide.prototype.setNext = function(next){
		this._next = next;
	};
	Slide.prototype.toJSON = function(){
		return {content:this.content};
	};
	Slide.fromContents = function(contents, getContent, maxLength, onSlideCreated){
		if(!contents || !contents.length){
			return null;
		}
		var result = new Slide(contents[0], getContent, maxLength, onSlideCreated);
		for(var i=1;i<contents.length;i++){
			result = result.create(contents[i]);
		}
		return result;
	};
	return Slide;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
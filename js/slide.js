var f = function(require){
	var Slide = function(content, getContent){
		this.content = content || getContent();
		this.getContent = getContent;
		this._next = undefined;
		this._previous = undefined;
	};
	Slide.prototype.next = function(){
		if(this._next){
			return this._next;
		}
		var next = new Slide(undefined, this.getContent);
		next.setPrevious(this);
		this._next = next;
		return next;
	};
	Slide.prototype.create = function(content){
		if(this._next){
			return this._next.create(content);
		}
		var next = new Slide(content, this.getContent);
		next.setPrevious(this);
		this._next = next;
		return next;
	};
	Slide.prototype.find = function(matchContent, alreadySearched){
		if(matchContent(this.content)){
			return this;
		}
		if(this._next && alreadySearched !== this._next){
			var nextResult = this._next.find(matchContent, this);
			if(nextResult){
				return nextResult;
			}
		}
		if(this._previous && alreadySearched !== this._previous){
			return this._previous.find(matchContent, this);
		}
		return undefined;
	};
	Slide.prototype.setPrevious = function(previous){
		this._previous = previous;
	};
	Slide.prototype.previous = function(){
		if(this._previous){
			return this._previous;
		}
		var previous = new Slide(undefined, this.getContent);
		previous.setNext(this);
		this._previous = previous;
		return previous;
	};
	Slide.prototype.setNext = function(next){
		this._next = next;
	};
	Slide.prototype.toJSON = function(){
		return {content:this.content};
	};
	return Slide;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
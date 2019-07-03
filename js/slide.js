var f = function(require){
	var Slide = function(content, getContent, maxLength){
		this.content = content || getContent();
		this.getContent = getContent;
		this._next = undefined;
		this._previous = undefined;
		this.maxLength = maxLength;
	};
	Slide.prototype.next = function(){
		if(this._next){
			return this._next;
		}
		var next = new Slide(undefined, this.getContent, this.maxLength);
		next.setPrevious(this);
		this._next = next;
		next.ensureMaxLength(this.maxLength);
		return next;
	};
	Slide.prototype.getAllContents = function(origin){
		if(!origin){
			var previousContents = this._previous ? this._previous.getAllContents(this) : [];
			var nextContents = this._next ? this._next.getAllContents(this) : [];
			return previousContents.concat([this.content]).concat(nextContents);
		}
		var result = [this.content];
		if(this._next && this._next !== origin){
			return result.concat(this._next.getAllContents(this));
		}
		if(this._previous && this._previous !== origin){
			return this._previous.getAllContents(this).concat(result);
		}
		return result;
	};
	Slide.prototype.previous = function(){
		if(this._previous){
			return this._previous;
		}
		var previous = new Slide(undefined, this.getContent, this.maxLength);
		previous.setNext(this);
		this._previous = previous;
		previous.ensureMaxLength(this.maxLength);
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
		var next = new Slide(content, this.getContent);
		next.setPrevious(this);
		this._next = next;
		return next;
	};
	Slide.prototype.getLength = function(origin){
		var count = 1;
		if(this._next && this._next !== origin){
			count += this._next.getLength(this);
		}
		if(this._previous && this._previous !== origin){
			count += this._previous.getLength(this);
		}
		return count;
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
var f = function(require){
	var FieldColoring = function(){
		this.colorings = [];
	};
	FieldColoring.prototype.colorField = function(field, color){
		this.colorings.push({field:field,color:color});
	};
	FieldColoring.prototype.getFieldColoring = function(field){
		return this.colorings.find(function(c){return c.field == field;});
	};
	return FieldColoring;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
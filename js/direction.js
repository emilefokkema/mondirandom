var f = function(require){
	var Direction = {HORIZONTAL:0,VERTICAL:1};
	return Direction;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
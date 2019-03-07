var f = function(require){
	var Color = {
		RED:"#E84141",
		BLUE: "#3B3BE2",
		YELLOW: "#FCFC54",
		WHITE: "#fff",
		BLACK: "#383838"};
	Color.ALL = [Color.RED, Color.BLUE, Color.YELLOW, Color.WHITE, Color.BLACK];
	return Color;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
var f = function(require){
	var encode, decode;
	if(typeof btoa !== "undefined"){
		encode = function(str){return btoa(str);};
		decode = function(str){return atob(str);};
	}else{
		encode = function(str){return Buffer.from(str).toString('base64');};
		decode = function(str){return Buffer.from(str, 'base64').toString('ascii')};
	}

	return {
		encode:encode,
		decode:decode
	};
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
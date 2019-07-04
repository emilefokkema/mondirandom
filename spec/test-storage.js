var f = function(require){
	var TestStorage = function(){
		this.object = {};
	};
	TestStorage.prototype.setItem = function(key, item){
		this.object[key] = item;
	};
	TestStorage.prototype.getItem = function(key){
		return this.object[key];
	};
	return TestStorage;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
var f = function(require){
	var all = JSON.parse(localStorage.getItem("mondirandom") || "{}");
	var setAll = function(){
		localStorage.setItem("mondirandom", JSON.stringify(all));
	};
	setAll();
	var storage = {
		getItem:function(key){
			return all[key];
		},
		setItem:function(key, item){
			all[key] = item;
			setAll();
		}
	};

	return storage;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
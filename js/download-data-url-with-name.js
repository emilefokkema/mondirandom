var f = function(require){
	var downloadDataUrlWithName = function(dataUrl, name){
		var a = document.createElement('a');
		var event = new MouseEvent('click',{});
		a.setAttribute('href',dataUrl);
		a.setAttribute('download',name);
		document.body.appendChild(a);
		a.dispatchEvent(event);
		document.body.removeChild(a);
	};
	return downloadDataUrlWithName;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function"){
	define(f);
}
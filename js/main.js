var f = function(require){
	var Vue = require("vue");
	var Instruction = require("./instruction");
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function" && typeof requirejs !== "undefined"){
	requirejs.config({
	    //To get timely, correct error triggers in IE, force a define/shim exports check.
	    //enforceDefine: true,
	    paths: {
	        vue: [
	            //'https://cdn.jsdelivr.net/npm/vue/dist/vue'
	            'https://cdn.jsdelivr.net/npm/vue?a'
	        ]
	    }
	});
	define(f);
}
var f = function(require){
	var Vue = require("vue");
	var CanvasWithSize = require("./canvas-with-size");
	var Instruction = require("./instruction");
	var configProvider = require("./config-provider");
	var determineBrowser = function(){
		const userAgent = navigator.userAgent;
		let browserName = null;

		if (userAgent.match(/Chrome/i)) {
		  browserName = 'chrome';
		}
		if (userAgent.match(/Firefox/i)) {
		  browserName = 'firefox';
		}

		if (browserName) {
		  document.body.classList.add(`browser--${browserName}`);
		}
	};
	var toggleClass = function(el, className, present){
		var classes = el.getAttribute("class").match(/[^\s]+/g);
		var newClasses = [];
		var cls, match, found = false;
		for(var i=0;i<classes.length;i++){
			cls = classes[i];
			match = cls === className;
			found = found || match;
			if(present || !match){
				newClasses.push(cls);
			}
		}
		if(present && found || !present && !found){
			return;
		}
		if(present && !found){
			newClasses.push(className);
		}
		el.setAttribute("class", newClasses.join(" "));
	};
	determineBrowser();
	new Vue({
		el:"#main",
		data:function(){
			return {
				
			};
		},
		methods:{
			explore:function(){
				toggleClass(document.body, "page--home", false);
			},
			displayMondirandom:function(canvas){
				this.$refs.backgroundDiv.style.backgroundImage = "url("+canvas.toDataURL()+")";
			},
			getCanvas:function(){
				var rect = this.$refs.backgroundDiv.getBoundingClientRect();
				var canvasElement = document.createElement("canvas");
				return new CanvasWithSize(canvasElement, rect.width, rect.height);
			}
		},
		mounted:function(){
			var instruction;
			var queryStringParams = new URLSearchParams(window.location.search);
			var canvas = this.getCanvas();
			var i = queryStringParams.get("i");
			if(i){
				instruction = Instruction.parse(i);
				canvas.displayMondirandom(instruction);
			}else{
				instruction = canvas.createMondirandom(configProvider.getConfig());
				toggleClass(document.body, "page--home", true);
			}
			this.displayMondirandom(canvas);
		}
	});
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
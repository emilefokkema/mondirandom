var f = function(require){
	var Vue = require("vue");
	var CanvasWithSize = require("./canvas-with-size");
	var Instruction = require("./instruction");
	var Slide = require("./slide");
	var configProvider = require("./config-provider");
	var storage = require("./storage");
	var SlideHistory = require("./slide-history");
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
				aboutActive:false,
				slide: undefined,
				config: undefined
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
			},
			toggleAbout:function(){
				this.aboutActive = !this.aboutActive;
			},
			createInstruction:function(){
				return this.getCanvas().createMondirandom(this.config).toString();
			},
			displaySlide:function(slide, pushState){
				this.slide = slide;
				var instruction = Instruction.parse(slide.content);
				var canvas = this.getCanvas();
				canvas.displayMondirandom(instruction);
				this.displayMondirandom(canvas);
				if(pushState){
					window.history.pushState(slide.toJSON(), "", "?i="+slide.content);
				}
				document.title = instruction.getTitle();
			},
			moveNextSlide:function(){
				this.displaySlide(this.slide.next(), true);
			},
			movePreviousSlide:function(){
				this.displaySlide(this.slide.previous(), true);
			}
		},
		mounted:function(){
			this.config = configProvider.getConfig();
			var history = new SlideHistory(storage, this.createInstruction.bind(this), this.config.historyMaxLength);
			var self = this;
			var slide;
			var queryStringParams = new URLSearchParams(window.location.search);
			var i = queryStringParams.get("i");
			if(i){
				slide = history.findOrCreateSlideWithContent(i);
			}else{
				slide = history.findOrCreateSlide();
				toggleClass(document.body, "page--home", true);
			}
			this.displaySlide(slide, true);
			window.addEventListener("popstate", function(event){
				var eventContent = event.state && event.state.content;
				if(!eventContent){
					return;
				}
				var foundSlide = self.slide.find(function(content){return content === eventContent;}) || self.slide.create(eventContent);
				self.displaySlide(foundSlide);
			});
		},
		components:{
			'linkmenu':{
				template:document.getElementById("menu-template").innerHTML,
				methods:{
					onAboutClick:function(){
						this.$emit("about");
					}
				}
			}
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
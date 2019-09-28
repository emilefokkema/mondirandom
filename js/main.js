var f = function(require){
	var Vue = require("vue");
	var CanvasWithSize = require("./canvas-with-size");
	var Instruction = require("./instruction");
	var downloadDataUrlWithName = require("./download-data-url-with-name");
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
				config: undefined,
				deepLinkOverlayActive: false,
				leanBackInterval:undefined
			};
		},
		computed:{
			shareLink:function(){
				if(this.slide){
					return "https://emilefokkema.github.io/mondirandom/?i="+(this.slide.content || "").toString();
				}
				
			},
			leaningBack:function(){
				return this.leanBackInterval !== undefined;
			}
		},
		methods:{
			explore:function(){
				toggleClass(document.body, "page--home", false);
				this.replaceHistoryWithCurrentSlide();
			},
			toggleLeanBack:function(){
				var self = this;
				if(this.leaningBack){
					toggleClass(document.body, "leanback", false);
					clearInterval(this.leanBackInterval);
					this.leanBackInterval = undefined;
				}else{
					toggleClass(document.body, "leanback", true);
					this.leanBackInterval = setInterval(function(){
						self.moveNextSlide();
					}, 5000);
				}
			},
			downloadImage:function(){
				var canvas = this.getCanvas();
				canvas.displayMondirandom(Instruction.parse(this.slide.content));
				downloadDataUrlWithName(canvas.toDataURL("image/png"), "mondirandom.png");
			},
			copyDeepLink:function(){
				this.$refs.deepLinkInput.focus();
				this.$refs.deepLinkInput.select();
				document.execCommand('copy');
			},
			shareDeeplink:function(){
				this.deepLinkOverlayActive = true;
				var instruction = Instruction.parse(this.slide.content);
				var canvas = new CanvasWithSize(this.$refs.thumbnailCanvas, 440, 250);
				canvas.displayMondirandom(instruction);
				this.$refs.deepLinkInput.value = this.shareLink;
				this.$refs.deepLinkInput.focus();
				this.$refs.deepLinkInput.select();
			},
			closeOverlay:function(event){
				if (event.target === this.$refs.overlay || event.target === this.$refs.overlayClose || event.target === this.$refs.svg) {
					this.deepLinkOverlayActive = false;
				}
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
			displaySlide:function(slide){
				this.slide = slide;
				var instruction = Instruction.parse(slide.content);
				var canvas = this.getCanvas();
				canvas.displayMondirandom(instruction);
				this.displayMondirandom(canvas);
				this.setTitle(instruction.getTitle());
			},
			setTitle: function(title){
				document.title = title;
				document.getElementById("og_title").setAttribute("content", title);
			},
			pushCurrentSlideToHistory:function(){
				window.history.pushState(this.slide.toJSON(), "", "?i="+this.slide.content);
			},
			replaceHistoryWithCurrentSlide:function(){
				window.history.replaceState(this.slide.toJSON(), "", "?i="+this.slide.content);
			},
			moveNextSlide:function(){
				this.displaySlide(this.slide.next());
				this.pushCurrentSlideToHistory();
			},
			movePreviousSlide:function(){
				this.displaySlide(this.slide.previous());
				this.pushCurrentSlideToHistory();
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
			this.displaySlide(slide);
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
				props:{
					leaningback:Boolean
				},
				template:document.getElementById("menu-template").innerHTML,
				computed:{
					leanBackText:function(){
						return this.leaningback ? "Stop Leanback Mode" : "Start Leanback Mode";
					}
				},
				methods:{
					onAboutClick:function(){
						this.$emit("about");
					},
					handleDownloadClick:function(event){
						this.$emit("downloadimage");
						event.preventDefault();
					},
					onLeanBackClick:function(){
						this.$emit("toggleleanback");
					}
				}
			},
			'share':{
				template:document.getElementById("share-template").innerHTML,
				props:{
					sharelink:String
				},
				methods:{
					sharedeeplink:function(){
						this.$emit("sharedeeplink");
					},
					shareUrl:function(url){
						window.open(
						  url,
						  'Share',
						  'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600'
						);
					},
					shareFacebook:function(){
						var facebookLink = "https://www.facebook.com/sharer/sharer.php?u="+this.sharelink;
						this.shareUrl(facebookLink);
					},
					shareTwitter:function(){
						var twitterLink = "https://twitter.com/intent/tweet?text=Enjoy%20this%20Mondirandom%20Painting%3A%20&amp;url="+this.sharelink;
						this.shareUrl(twitterLink);
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
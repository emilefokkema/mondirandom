var f = function(require){
	var Instruction = require("./instruction");
	var CanvasWithSize = require("./canvas-with-size");
	var configProvider = require("./config-provider");
	var history = require("./history");
	var Vue = require("../node_modules/vue/dist/vue");
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
	var downloadDataUrlWithName = function(dataUrl, name){
		var a = document.createElement('a');
		var event = new MouseEvent('click',{});
		a.setAttribute('href',dataUrl);
		a.setAttribute('download',name);
		document.body.appendChild(a);
		a.dispatchEvent(event);
		document.body.removeChild(a);
	};

	determineBrowser();

	new Vue({
		el: "#main",
		data:function(){
			return {
				deepLinkOverlayActive:false,
				instruction:undefined,
				historyShown:false,
				historyList:[]
			}
		},
		computed:{
			shareLink:function(){
				return "https://emilefokkema.github.io/mondirandom/?i="+(this.instruction || "").toString();
			}
		},
		methods:{
			downloadImage:function(){
				var canvas = this.getCanvas();
				canvas.displayMondirandom(this.instruction);
				downloadDataUrlWithName(canvas.toDataURL("image/png"), "mondirandom.png");
			},
			onItemSelected:function(data){
				var instruction = Instruction.parse(data.instruction);
				var canvas = this.getCanvas();
				canvas.displayMondirandom(instruction);
				this.displayMondirandom(canvas);
				this.instruction = instruction;
			},
			showHistory:function(){
				this.historyShown = true;
			},
			hideHistory:function(){
				this.historyShown = false;
			},
			shareDeeplink:function(){
				this.deepLinkOverlayActive = true;
				var instruction = this.instruction;
				var canvas = new CanvasWithSize(this.$refs.thumbnailCanvas, 440, 250);
				canvas.displayMondirandom(this.instruction);
				this.$refs.deepLinkInput.value = this.shareLink;
				this.$refs.deepLinkInput.focus();
				this.$refs.deepLinkInput.select();
			},
			copyDeepLink:function(){
				this.$refs.deepLinkInput.focus();
				this.$refs.deepLinkInput.select();
				document.execCommand('copy');
			},
			displayMondirandom:function(canvas){
				this.$refs.backgroundDiv.style.backgroundImage = "url("+canvas.toDataURL()+")";
			},
			getCanvas:function(){
				var rect = this.$refs.backgroundDiv.getBoundingClientRect();
				var canvasElement = document.createElement("canvas");
				return new CanvasWithSize(canvasElement, rect.width, rect.height);
			},
			closeOverlay:function(event){
				if (event.target === this.$refs.overlay || event.target === this.$refs.overlayClose) {
					this.deepLinkOverlayActive = false;
				}
			}
		},
		mounted:function(){
			var self = this;
			var canvas = this.getCanvas();
			this.instruction = canvas.createMondirandom(configProvider.getConfig());
			this.displayMondirandom(canvas);
			history.addPaintingInstruction(this.instruction.toString());
			window.addEventListener("click", function(event){
				if (event.target.className !== 'content') {
				  return;
				}
				self.hideHistory();
			});
			window.addEventListener("wheel", function(event){
				if (
				  Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
				  event.deltaY === 0
				) {
				  return;
				}

				if (event.deltaY > 0) {
				  self.showHistory();
				} else {
				  self.hideHistory();
				}
			});
			this.historyList = history.getAll();
		},
		components:{
			'share':{
				props:{
					sharelink:String
				},
				methods:{
					shareUrl:function(url){
						window.open(
						  url,
						  'Share',
						  'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600'
						);
					},
					shareDeepLink:function(){
						this.$emit("sharedeeplink");
					},
					shareFacebook:function(){
						var facebookLink = "https://www.facebook.com/sharer/sharer.php?u="+this.sharelink;
						this.shareUrl(facebookLink);
					},
					shareTwitter:function(){
						var twitterLink = "https://twitter.com/intent/tweet?text=Enjoy%20this%20Mondirandom%20Painting%3A%20&amp;url="+this.sharelink;
						this.shareUrl(twitterLink);
					}
				},
				template:document.getElementById("share-template").innerHTML
			},
			'history':{
				props:{
					instructions:Array
				},
				template:document.getElementById("historyTemplate").innerHTML,
				methods:{
					onItemSelected:function(data){
						this.$emit("itemselected", data);
					}
				},
				computed:{
					items:function(){
						return this.instructions && this.instructions.map(function(i){return {instruction: i};}) || [];
					},
					placeholders:function(){
						var number = 10;
						if(this.instructions){
							number -= this.instructions.length;
						}
						return Array.apply(null, new Array(number)).map(function(x, i){return {index: i};});
					}
				},
				components:{
					'placeholder':{
						template:document.getElementById("placeholderTemplate").innerHTML
					},
					'item':{
						props:{
							instruction: String
						},
						data:function(){
							return {
								title: "Nameless"
							};
						},
						methods:{
							select:function(){
								this.$emit("itemselected", {instruction:this.instruction});
							}
						},
						mounted:function(){
							var div = this.$refs.imagediv;
							var rect = div.getBoundingClientRect();
							var canvasElement = document.createElement("canvas");
							var canvas = new CanvasWithSize(canvasElement, rect.width, rect.height);
							var parsedInstruction = Instruction.parse(this.instruction);
							canvas.displayMondirandom(parsedInstruction);
							var dataUrl = canvasElement.toDataURL();
							div.style.backgroundImage = "url("+dataUrl+")";
						},
						template:document.getElementById("itemTemplate").innerHTML
					}
				}
			},
			'linkmenu':{
				data:function(){
					return {
						open:false,
						timer:undefined
					};
				},
				methods:{
					openNewTab:function(url){
						chrome.tabs.create({
						  url
						});
					},
					updateTabLocation:function(url){
						chrome.tabs.update({
						  url
						});
					},
					handleDownloadClick:function(event){
						this.$emit("downloadimage");
						event.preventDefault();
					},
					handleClick:function(event){
						const target = event.currentTarget;
						const url = target.href;

						if (target.href && (window.chrome && chrome.tabs)) {
							if (target.target === '_blank') {
								this.openNewTab(url);
							} else {
								this.updateTabLocation(url);
							}

							event.preventDefault();
						}
					},
					doOpen:function(){
						clearTimeout(this.timer);
						this.timer = setTimeout(() => {this.open = true;}, 50);
					},
					doClose:function(){
						clearTimeout(this.timer);
						this.timer = setTimeout(() => {this.open = false;}, 50);
					}
				},
				template:document.getElementById("menu-template").innerHTML
			}
		}
	});
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function" && typeof requirejs !== "undefined"){
	define(f);
}

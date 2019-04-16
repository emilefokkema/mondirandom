var f = function(require){
	var Instruction = require("./instruction");
	var CanvasWithSize = require("./canvas-with-size");
	var configProvider = require("./config-provider");
	var history = require("./history");
	var Vue = require("vue");

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
			onItemSelected:function(data){
				var instruction = Instruction.parse(data.instruction);
				this.getCanvas().displayMondirandom(instruction);
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
			getCanvas:function(){
				return new CanvasWithSize(document.getElementById("main_canvas"), window.innerWidth, window.innerHeight);
			},
			closeOverlay:function(event){
				if (event.target === this.$refs.overlay || event.target === this.$refs.overlayClose) {
					this.deepLinkOverlayActive = false;
				}
			}
		},
		mounted:function(){
			var self = this;
			this.instruction = this.getCanvas().createMondirandom(configProvider.getConfig());
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
			}
		}
	});
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function" && typeof requirejs !== "undefined"){
	requirejs.config({
		paths:{
			vue:["../node_modules/vue/dist/vue"]
		}
	});
	define(f);
}

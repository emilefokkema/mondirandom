var f = function(require){
	var Instruction = require("./instruction");
	var CanvasWithSize = require("./canvas-with-size");
	var configProvider = require("./config-provider");
	var Vue = require("vue");
	var RandomValueProvider = require("./random-value-provider");
	var FieldSplitter = require("./field-splitter");

	new Vue({
		el: "#main",
		data:function(){
			return {
				shareLink:"",
				deepLinkOverlayActive:false,
				instruction:undefined
			}
		},
		methods:{
			shareDeeplink:function(){
				this.deepLinkOverlayActive = true;
				var instruction = this.instruction;
				var canvas = new CanvasWithSize(this.$refs.thumbnailCanvas, 440, 250);
				var splitter = new FieldSplitter(instruction.width, instruction.height, {borderThickness: instruction.borderThickness});
				splitter.splitAndColor(instruction.getValueProvider(), instruction.numberOfSplits);
				canvas.fitDrawingOfSize(instruction.width, instruction.height);
				splitter.draw(canvas.context);
				this.$refs.deepLinkInput.value = this.shareLink;
				this.$refs.deepLinkInput.focus();
				this.$refs.deepLinkInput.select();
			},
			copyDeepLink:function(){
				this.$refs.deepLinkInput.focus();
				this.$refs.deepLinkInput.select();
				document.execCommand('copy');
			},
			closeOverlay:function(event){
				if (event.target === this.$refs.overlay || event.target === this.$refs.overlayClose) {
					this.deepLinkOverlayActive = false;
				}
			}
		},
		mounted:function(){
			var width = window.innerWidth,
				height = window.innerHeight,
				canvasElement = document.getElementById("main_canvas"),
				canvas = new CanvasWithSize(canvasElement, width, height);
			var config = configProvider.getConfig();
			var splitter = new FieldSplitter(width, height, {borderThickness: config.borderThickness});
			splitter.splitAndColor(new RandomValueProvider(config.random), config.numberOfSplits);
			splitter.draw(canvas.context);
			this.instruction = splitter.instruction;
			this.shareLink = "https://emilefokkema.github.io/mondirandom/?i="+this.instruction.toString();
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

var f = function(require){
	var Instruction = require("./instruction");
	var CanvasWithSize = require("./canvas-with-size");
	var configProvider = require("./config-provider");
	var Vue = require("vue");

	new Vue({
		el: "#main",
		data:function(){
			return {shareLink:""}
		},
		mounted:function(){
			var width = window.innerWidth,
				height = window.innerHeight,
				canvasElement = document.getElementById("main_canvas"),
				canvas = new CanvasWithSize(canvasElement, width, height),
				instruction = Instruction.createForCanvas(canvas, configProvider.getConfig());
			this.shareLink = "https://emilefokkema.github.io/mondirandom/?i="+instruction.toString();
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
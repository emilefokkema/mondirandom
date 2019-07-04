var f = function(require){
	var configProvider = {
		getConfig: function(){
			return {
				historyMaxLength: 50,
				numberOfSplits: 40,
				borderThickness: 5,
				random: {
					maxSplittableRatio: 10,
					lowestColorDistributionFactor: 10,
					lowestFieldDistributionFactor: 10,
					neighborColorExclusionLimit: {
						black:0,
						red:0.1,
						yellow:0.1,
						blue:0.1,
						white:Infinity
					}
				}
			};
		}
	};

	return configProvider;
}

if(typeof module !== "undefined" && typeof require == "function"){
	module.exports = f(require);
}
else if(typeof define == "function" && typeof requirejs !== "undefined"){
	define(f);
}
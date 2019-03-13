beforeEach(function(){
	jasmine.addMatchers({
		toGiveWeightTo:function(){
			return {
				compare:function(distribution, value){
					var weightedValue = distribution.getWeightedValues([value]).values[0];
					return {
						pass: weightedValue.weight > 0
					};
				}
			};
		}
	});
});
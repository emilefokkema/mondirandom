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
		},
		toPreferTo:function(){
			return {
				compare:function(distribution, value1, value2){
					var weightedValues = distribution.getWeightedValues([value1, value2]);
					var weightedValue1 = weightedValues.values[0];
					var weightedValue2 = weightedValues.values[1];
					return {
						pass: weightedValue1.weight < weightedValue2.weight
					};
				}
			};
		}
	});
});
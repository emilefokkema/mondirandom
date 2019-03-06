var FakeContext = function(){
	
};
Object.defineProperties(FakeContext.prototype, {
	fillStyle: {
		set:function(){},
		configurable:true
	},
	fillRect:{
		value: function(){},
		configurable:true,
		writable:true
	}
});

module.exports = FakeContext;
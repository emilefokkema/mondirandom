chrome.tabs.onCreated.addListener(function(tab){
	setTimeout(function(){
		chrome.tabs.executeScript(tab.id, {file:"content-script.js"});
	},1);
	
});
const { exec } = require('child_process');
const fs = require('fs');

exec('browserify js/newtab.js | minify --js > dist/main.js', function(err, stdout, stderr){
	if (err) {
		console.log(err);
		//return;
	}

	// the *entire* stdout and stderr (buffered)
	console.log(stdout);
	console.log(stderr);
});

var dir = './dist';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
var filesToCopy = [
	"manifest.json",
	"newtab.css",
	"icon_128.png",
	"icon_48.png",
	"icon_16.png"
];
for(var i=0;i<filesToCopy.length;i++){
	fs.copyFile(filesToCopy[i], 'dist/'+filesToCopy[i], (err) => {
	  if (err) throw err;
	});
}
fs.readFile('newtab.html', function(err, buf){
	if (err) throw err;
	var originalIndex = buf.toString();
	var newIndex = originalIndex.replace(/<!-- 1 -->[\w\W]*?<!-- 1 -->/, "<script src=\"main.js\"></script>");
	fs.writeFile("dist/newtab.html", newIndex, function(err, data) {
	  if (err) throw err;
	});
});
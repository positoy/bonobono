var fs = require('fs');

fs.readdir('/home/choidora/Documents/Test', function(err, data){
	console.log(data);
});

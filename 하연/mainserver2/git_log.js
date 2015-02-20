var exec = require('child_process').exec;
var async= require('async');

var __DIR = './user_data/projects/';
global.finalArray = [];

module.exports = function() {
	return {
		logTree: logTree_
	};
}


function logTree_ (project_name, draw_handler) 
{
	var DIR_PROJECT = __DIR + project_name;
	var DIR_PROJECT_ORIGIN = DIR_PROJECT + "/origin";
	//var DIR_PROJECT_USER = DIR_PROJECT + "/_" + user_name;

	var task1 = function(callback) {
		var cmd1 = "cd " + DIR_PROJECT_ORIGIN;
		var cmd2 = "git log --pretty=format:\"%h##%cn##%s##%cd##%cr\"";
		
		var cmd = cmd1 + ";" + cmd2;

		var child = exec(cmd, function(error, stdout, stderr) {
			if (error !== null)
			{
				console.log("logTree cmd error");
				console.log(error);
			}
			else
			{
				//console.log("logTree cmd success------");
				//console.log(stdout);
				//console.log("stdout's type: " + typeof(stdout));	//string

				var logArray = stdout.split('\n');	//log split
				for(idx in logArray) {
					var data = new Object();	// create object (==JSON object)
					var splitArray = logArray[idx].split('##');	//info split
					data.commit_hash = splitArray[0];
					data.committer_name = splitArray[1];
					data.commit_msg = splitArray[2];
					data.commit_date = splitArray[3];
					data.commit_date_rel = splitArray[4];
					finalArray.push(data);
				}


				console.log("log(finalArray)의 개수: " + finalArray.length);
				console.log("finalArray의 type: " + typeof(finalArray));	//object (array)
				console.log(finalArray);

				callback(null, true);
			}
		});
	};

	var callback = function(err, result)
	{
		if (result === true)
		{
			draw_handler(finalArray);	//draw_handler에 finalArray 전달
			//handler();
		}
	};

	async.waterfall([task1], callback);

};
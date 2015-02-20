var async = require('async');
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;


exports.log_tree = function(handler) {

	var task1 = function(callback)	
	{
		var cmd = "git log";
		var child = exec(cmd,function(error,stdout,stderr) {
			if(error !== null) 
			{
				console.log("log_tree() cmd error");
				console.log(error);
			}
			else
			{
				console.log(stdout);
				console.log("type: " + typeof(stdout));
				callback(null);
			}
		});
	};

	var callback = function(err, result)
	{
		if (result === true)
			handler();
	};

	async.waterfall([task1], callback);

}
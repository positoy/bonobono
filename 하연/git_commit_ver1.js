var async = require('async');
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;


exports.our_commit = function(project_name, user_name, commit_message, handler) {

	console.log("our_commit 성공!");
	//var goal = "\n[git] commit project '" + project_name + "'";
	//console.log(goal);

	// "git add --all" : staging
	var task0 = function(callback)
	{
		var cmd = "cd projects & cd " + project_name + "& cd " + user_name + "&" + "git add --all";	//window (-a도 됨)
		//var cmd = "cd projects ; cd " + project_name + ";" + "cd " + user_name + ";" + "pushd;" + "git add --a"	//linux
		var child = exec(cmd, function(error, stdout, stderr) {
			if(error !== null) 
			{
				console.log("task0 error");
				console.log(error);
			}
			else {
				console.log("successful: " + cmd);
				callback(null);
			}

		});
	};

	// "git commit -m 'commit message'" : commit with message.
	var task1 = function(callback)
	{
		var cmd = "cd projects & cd " + project_name + "& cd " + user_name + "&" + "git commit -m \"" + commit_message + "\"";	//window
		//var cmd = "popd;" + "git commit -m \"" + commit_message + "\"";	//linux
		var child = exec(cmd, function(error, stdout, stderr) {
			if (error !== null)
			{
				console.log("task1 error");
				console.log(error);
			}
			else
			{
				console.log("successful: " + cmd);
				callback(null);
			}
		});
	};

	// acknowledge for the "commit request"
	var callback = function(err, successful) {
		//
	};

	async.waterfall([task0, task1], callback);
};

exports.our_push = function(project_name, user_name, handler) {

	var goal = "\n[git] push project '" + project_name + "'";
	console.log(goal);
	
	// "git push origin master" : push project's master branch to the origin(remote repository).
	var task0 = function(callback) 
	{
		var cmd = "cd projects & cd " + project_name + "& cd " + user_name + "&" + "git push origin master";
		var child = exec(cmd, function(error, stdout, stderr) {
			if (error !== null)
			{
				console.log("push task0 error");
				console.log(error);
			}
			else
			{
				console.log("successful: " + cmd + " : push completed. congratulations!");
				callback(null);
			}
		});

	};

	// acknowledge for the "push request"
	var callback = function(err, successful) {
		// if (successful)
		// {
		// 	if (typeof handler === "function")
		// 		handler();
		// 	else
		// 		console.log("handler 함수 아님.")
		// }
	};

	async.waterfall([task0], callback);
};

exports.our_pull = function(project_name, user_name, handler) {

	var goal = "\n[git] pull project '" + project_name + "'";
	console.log(goal);

	var task0 = function(callback) {
		var cmd = "cd projects & cd " + project_name + "& cd " + user_name + "&" + "git pull origin master";
		var chile = exec(cmd, function(error,stdout, stderr) {
			if (error !== null)
			{
				console.log("pull task0 error");
				console.log(error);
			}
			else
			{
				console.log("successful: " + cmd + " : pull completed. congratulations!");
				callback(null, true);
			}
		});

	};

	// acknowledge for the "pull request"
	var callback = function(err, successful) {
		// if (successful)
		// {
		// 	if (typeof handler === "function")
		// 		handler();
		// 	else
		// 		console.log("handler 함수 아님.")
		// }
	};

	async.waterfall([task0], callback);
}
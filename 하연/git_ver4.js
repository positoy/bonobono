var async = require('async');
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;

var __DIR = './user_data/projects/';

exports.create_new_bare = function(project_name, user_name, handler) {

	var DIR_PROJECT = __DIR + project_name;
	var DIR_PROJECT_ORIGIN = DIR_PROJECT + "/origin";
	var DIR_PROJECT_USER = DIR_PROJECT + "/_" + user_name;

	var goal = "\n[git] create bare repository";
	console.log(goal);

	// condition check
	var task0 = function(callback)
	{
		// directory duplicate must be checked.
		// 디비 확인(같은이름의 다른 프로젝트 존재 여부 확인) 등등등..
		callback(null);
	};
	
	// "git --bare init origin" : create origin and bare init(bare repository).
	var task1 = function(callback) 
	{
		//var cmd = "cd projects & cd " + project_name + "&" + "git --bare init origin";
		var cmd = "cd " + DIR_PROJECT +" & " + "git --bare init origin";
		var child = exec(cmd, function(error, stdout, stderr) {
			if (error !== null)
			{
				console.log("create_new task1 error");
				console.log(error);
			}
			else
			{
				console.log("successful: " + cmd);
				console.log("bare init completed.");
				callback(null);
			}
		});
	};

	// "git clone origin user_name" : create origin and bare init(bare repository).
	var task2 = function(callback) 
	{
		//var cmd = "cd projects & cd " + project_name + "&" + "git clone origin _" + user_name;
		var cmd = "cd " + DIR_PROJECT + " & " + "git clone origin _" + user_name;
		
		var child = exec(cmd, function(error, stdout, stderr) {
			if (error !== null)
			{
				console.log("create_new task2 error");
				console.log(error);
			}
			else
			{
				console.log("successful: " + cmd);
				console.log("create user's git completed.");
				callback(null);
			}
		});
	};

	// acknowledge for the "create_new_bare request"
	var callback = function(err, successful) {
		//
	};
	async.waterfall([task0, task1, task2], callback);
};


exports.our_join = function(project_name, user_name, handler) {

	var DIR_PROJECT = __DIR + project_name;
	var DIR_PROJECT_ORIGIN = DIR_PROJECT + "/origin";
	var DIR_PROJECT_USER = DIR_PROJECT + "/_" + user_name;

	var goal = "\n[git] join to the bare repository";
	console.log(goal);

	// condition check
	var task0 = function(callback)
	{
		// directory duplicate must be checked.
		// 디비 확인(같은이름의 다른 프로젝트 존재 여부 확인) 등등등..
		callback(null);
	};

	// "git clone origin user_name" : create origin and bare init(bare repository).
	var task1 = function(callback) 
	{
		//var cmd = "cd projects & cd " + project_name + "&" + "git clone origin _" + user_name;
		var cmd = "cd " + DIR_PROJECT + " & " + "git clone origin _" + user_name;
		
		var child = exec(cmd, function(error, stdout, stderr) {
			if (error !== null)
			{
				console.log("our_join task1 error");
				console.log(error);
			}
			else
			{
				console.log("successful: " + cmd);
				console.log("join completed.");
				callback(null);
			}
		});
	};

	// acknowledge for the "join request"
	var callback = function(err, successful) {
		//
	};
	async.waterfall([task0, task1], callback);
};

exports.our_commit = function(project_name, user_name, commit_message, handler) {

	var DIR_PROJECT = __DIR + project_name;
	var DIR_PROJECT_ORIGIN = DIR_PROJECT + "/origin";
	var DIR_PROJECT_USER = DIR_PROJECT + "/_" + user_name;

	console.log("our_commit 성공!");
	//var goal = "\n[git] commit project '" + project_name + "'";
	//console.log(goal);

	// "git add --all" : staging
	var task0 = function(callback)
	{
		//var cmd = "cd projects & cd " + project_name + "& cd _" + user_name + "&" + "git add --all";	//window (-a도 됨)
		//var cmd = "cd projects ; cd " + project_name + ";" + "cd _" + user_name + ";" + "pushd;" + "git add --a"	//linux
		var cmd = "cd " + DIR_PROJECT_USER + " & " + "git add --all";	//window (-a도 됨)

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
		//var cmd = "cd projects & cd " + project_name + "& cd _" + user_name + "&" + "git commit -m \"" + commit_message + "\"";	//window
		//var cmd = "popd;" + "git commit -m \"" + commit_message + "\"";	//linux
		var cmd = "cd " + DIR_PROJECT_USER + " & " + "git commit -m \"" + commit_message + "\"";	//window
		
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

	var DIR_PROJECT = __DIR + project_name;
	var DIR_PROJECT_ORIGIN = DIR_PROJECT + "/origin";
	var DIR_PROJECT_USER = DIR_PROJECT + "/_" + user_name;

	var goal = "\n[git] push project '" + project_name + "'";
	console.log(goal);
	
	// "git push origin master" : push project's master branch to the origin(remote repository).
	var task0 = function(callback) 
	{
		//var cmd = "cd projects & cd " + project_name + "& cd _" + user_name + "&" + "git push origin master";
		var cmd = "cd " + DIR_PROJECT_USER + " & " + "git push origin master";
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

	var DIR_PROJECT = __DIR + project_name;
	var DIR_PROJECT_ORIGIN = DIR_PROJECT + "/origin";
	var DIR_PROJECT_USER = DIR_PROJECT + "/_" + user_name;

	var goal = "\n[git] pull project '" + project_name + "'";
	console.log(goal);

	var task0 = function(callback) 
	{
		//var cmd = "cd projects & cd " + project_name + "& cd _" + user_name + "&" + "git pull origin master";
		var cmd "cd " + DIR_PROJECT_USER + " & " + "git pull origin master";
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


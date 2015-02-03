var async = require('async');
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;

var __userDir = './user_data/projects/';
var __child = null;

// child
// login, view, create, join, invite
// load, file reload, save, build, apk, edit, connection

exports.create = function(project) {

	var goal = "[git] create '" + project + "'";
	console.log(goal);

	// condition check
	var task0 = function(callback)
	{
		// directory duplicate must be checked.

		callback(null);
	};

	// "mkdir project" : create new project directory.
	var task1 = function(callback)
	{
		var cmd = "mkdir " + __userDir + project;
		var child = exec(cmd, function(error, stdout, stderr) {

			if (error !== null)
			{
				sys.puts(error);
			}
			else
			{
				sys.puts(stdout);
				callback(null);
			}
		});
	};

	// "mkdir project/origin" : create new project directory.
	var task2 = function(callback)
	{
		var cmd = "mkdir " + __userDir + project + "/origin";
		var child = exec(cmd, function(error, stdout, stderr) {

			if (error !== null)
			{
				sys.puts(error);
			}
			else
			{
				sys.puts(stdout);
				callback(null);
			}
		});
	};

	// "git init" in the created directory.
	var task3 = function(callback)
	{
		var cmd = "git init " + __userDir + project + "/origin";
		var child = exec(cmd, function(error, stdout, stderr) {

			// directory duplicate must be checked.
			if (error !== null)
			{
				sys.puts(error);
			}
			else
			{
				sys.puts(stdout);
				callback(null, true);
			}
		});
	};

	// acknowledge for the "create request"
	var callback = function(err, result)
	{
		if (result === true)
			console.log(goal + " ok.");
	};

	async.waterfall([task0, task1, task2, task3], callback);
};

/****** execute a unix command with node.js MORE CONCISELY **

var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
exec("ls -la", puts);

*************************************************************/

exports.join = function(project, id, email) {

	var projectDir = __userDir + project;
	var projectDir_origin = projectDir + "/origin";
	var projectDir_user = projectDir + "/_" + id;

	var goal = "[git] join(clone) '" + project + "' with id '" + id + "'";
	console.log(goal);

	// condition check
	var task0 = function(callback)
	{
		// project existence must be checked.
		// directory duplicate must be checked.
		// project join permission must be checked.

		callback(null);
	};

	// "git clone" origin project.
	var task1 = function(callback)
	{
		var cmd = "git clone " + projectDir_origin + " " + projectDir_user;
		var child = exec(cmd, function(error, stdout, stderr) {

			// directory duplicate must be checked.
			if (error !== null)
			{
				sys.puts(error);
			}
			else
			{
				sys.puts(stdout);
				callback(null);
			}
		});
	};

	// "git config --local user.name id"
	// "git config --local user.email email"
	// append string
	// "[user]
	//  	email = user_email
	//		name = user_id
	// "
	// to '_user/.git/config' file.
	var task2 = function(callback)
	{
		var str1 = "[user]\n";
		var str2 = "\temail = " + email + "\n";
		var str3 = "\tname = " + id + "\n";



		var configFile = projectDir_user + "/.git/config";

		fs.appendFile(configFile, str1+str2+str3, function(err) {
			if (err)
			{
				throw err;
			}
			else
			{
				sys.puts("config update.");
				callback(null, true);
			}
		});
	}

	// acknowledge for the "create request"
	var callback = function(err, result)
	{
		if (result === true)
			console.log(goal + " ok.");
	};

	async.waterfall([task0, task1, task2], callback);
};

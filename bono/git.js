var async = require('async');
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;

var __DIR = './user_data/projects/';
var __child = null;

// child
// login, view, create, join, invite
// load, file reload, save, build, apk, edit, connection

exports.create = function(project_name, user_name, user_email, handler) {

	var context = "[git create project] : ";
	var DIR_PROJECT = __DIR + project_name;
	var DIR_PROJECT_ORIGIN = DIR_PROJECT + "/origin";
	var DIR_PROJECT_USER = DIR_PROJECT + "/_" + user_name;

	console.log(context, project_name)

	// condition check
	var task0 = function(callback)
	{
		// directory duplicate must be checked.

		callback(null);
	};

	// central repository
	var task1 = function(callback)
	{
		var cmd = "git --bare init " + DIR_PROJECT_ORIGIN;
		var child = exec(cmd, function(error, stdout, stderr) {

			if (error !== null)
			{
				console.log(context, "error-", cmd);
				console.log(error);
			}
			else
			{
				console.log(context, "successful-", cmd)
				callback(null);
			}
		});
	};

	// clone repository
	var task2 = function(callback)
	{
		var cmd = "git clone " + DIR_PROJECT_ORIGIN + " " + DIR_PROJECT_USER;
		var child = exec(cmd, function(error, stdout, stderr) {

			// directory duplicate must be checked.
			if (error !== null)
			{
				console.log(context, "error-", cmd);
				console.log(error);
			}
			else
			{
				console.log(context, "successful-", cmd);
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
	var task3 = function(callback)
	{
		var str1 = "[user]\n";
		var str2 = "\temail = " + user_email + "\n";
		var str3 = "\tname = " + user_name + "\n";

		var configFile = DIR_PROJECT_USER + "/.git/config";

		fs.appendFile(configFile, str1+str2+str3, function(err) {
			if (err)
			{
				throw err;
			}
			else
			{
				console.log("successful: config update.");
				callback(null);
			}
		});
	}

	// clone repository를 안드로이드 프로젝트로 만들기
	var task4 = function(callback)
	{
		var cmd = "android create project --name " + project_name + " --activity MainActivity --package com.bonobono." + project_name + " --target 10 --path " + DIR_PROJECT_USER;
		var child = exec(cmd, function(error, stdout, stderr) {

			if (error !== null)
			{
				console.log(context, "error-", cmd);
				console.log(error);
			}
			else
			{
				console.log(context, "successful-", cmd)
				callback(null);
			}
		});
	};

	// 빌드에 필요한 라이브러리 카피하기
	var task5 = function(callback)
	{
		var cmd1 = "cp -rf ./user_data/build/appcompat_v7 " + DIR_PROJECT;
		var cmd2 = "cp " + DIR_PROJECT + "/appcompat_v7/libs/android-support-v4.jar " + DIR_PROJECT_USER + "/libs"

		var cmd = cmd1 + ";" + cmd2;

		var child = exec(cmd, function(error, stdout, stderr) {

			if (error !== null)
			{
				console.log(context, "error-", cmd);
				console.log(error);
			}
			else
			{
				console.log(context, "successful-", cmd)
				callback(null);
			}
		});
	};

	// git add, commit, push
	var task6 = function(callback)
	{
		var cmd1 = "cd " + DIR_PROJECT_USER;
		var cmd2 = "git add --a";
		var cmd3 = 'git commit -m "first commit"'
		var cmd4 = "git push origin master"

		var cmd = cmd1 + ";" + cmd2 + ";" + cmd3 + ";" + cmd4;
		var child = exec(cmd, function(error, stdout, stderr) {

			if (error !== null)
			{
				console.log(context, "error-", cmd);
				console.log(error);
			}
			else
			{
				console.log(context, "successful-", cmd)
				callback(null, true);
			}
		});
	};

	// acknowledge for the "create request"
	var callback = function(err, result)
	{
		if (result === true)
			handler();
	};

	async.waterfall([task0, task1, task2, task3, task4, task5, task6], callback);
};

/****** execute a unix command with node.js MORE CONCISELY **

var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { console.log(stdout) }
exec("ls -la", puts);

*************************************************************/

exports.join = function(project_name, user_name, user_email, handler) {

	var DIR_PROJECT = __DIR + project_name;
	var DIR_PROJECT_ORIGIN = DIR_PROJECT + "/origin";
	var DIR_PROJECT_USER = DIR_PROJECT + "/_" + user_name;

	var goal = "\n[git] join(clone) '" + project_name + "' with id '" + user_name + "'";
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
		var cmd = "git clone " + DIR_PROJECT_ORIGIN + " " + DIR_PROJECT_USER;
		var child = exec(cmd, function(error, stdout, stderr) {

			// directory duplicate must be checked.
			if (error !== null)
			{
				console.log(error);
			}
			else
			{
				console.log("successful: " + cmd);
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
		var str2 = "\temail = " + user_email + "\n";
		var str3 = "\tname = " + user_name + "\n";

		var configFile = DIR_PROJECT_USER + "/.git/config";

		fs.appendFile(configFile, str1+str2+str3, function(err) {
			if (err)
			{
				throw err;
			}
			else
			{
				console.log("successful: config update.");
				callback(null, true);
			}
		});
	}

	// acknowledge for the "create request"
	var callback = function(err, result)
	{
		if (result === true)
			final_handler();
	};

	async.waterfall([task0, task1, task2], callback);
};

var async = require('async');
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;

/* (X)
exports.directory_issue = function() {
	//"cd (~~~~)"	<==여기가 문제임 .. 몇번 써줘야 될지 정하는 부분 (V)
	// 					: 세번 인듯 (V)
	//**현재 cd 위치를 옮겨버린거니까 다른 함수 이어서 쓸 때 cd를 홈으로 초기화 시켜주거나
	//  하는 동작 필요 ()
	var task = function(callback) 
	{
		var cmd = "cd .. & cd .. & cd ..";	//윈도우
		//var cmd = "cd - ; cd - ; cd - ;";	//리눅스 (X)
		//car cmd = popd;	//리눅스 
		var child = exec(cmd, function(error, stdout, stderr) {
			if(error !== null) 
			{
				console.log("directory_issue() error");
				console.log(error);
			}
			else {
				console.log("successful: " + cmd);
				
				var child = exec("cd", function(error, stdout, stderr) {
					if(error !== null) 
					{
						console.log("eeeeeerror");
						console.log(error);
					}
					else {
						console.log("현재디렉토리: ");
						callback(null);
					}

				});

				callback(null);
			}

		});
	}
}
exports.directory_move = function(project_name, user_name, handler) {

	// "cd projects; cd project_name; cd user_name;" : move to user's directory
	var task = function(callback)
	{	
		// 1. git bash에서 일단 cd가 해당 프로젝트 디렉토리여야 함. 이동부분 수정 필요 (V)
		// 프로젝트의 깃 경로(프로젝트 경로): 서버코드가 있는 폴더가 홈/projects/project_name/user_id/files...
		// 서버코드가 있는 폴더가 홈/projects/project_name/user_id/ 요까지 cd로 들어와줘야됨.

		var cmd = "cd projects & cd " + project_name + "&" + "cd " + user_name + "&";	//윈도우
		//var cmd = "cd projects; cd " + project_name + ";" + "cd " + user_name + ";";	//리눅스
		var child = exec(cmd, function(error, stdout, stderr) {
			if(error !== null) 
			{
				console.log("directory_move() error");
				console.log(error);
			}
			else {
				console.log("successful: " + cmd);
				callback(null);
			}

		});
	};

}*/


/* (X)
// 깃허브가 아닌 origin 폴더를 bare repositry로 할것이므로 노사용
// 얘는 따로 함수로 빼서 처음에 한번만 되도록 해야함 (V)
// "git config --global push.default matching"  <== 바뀐 모든 프렌치 푸시
// "git remote add origin https://github.com/p22ju/bonotest.git"  <== 원격저장소 추가 (처음 딱한번만 세팅)
exports.our_commit_config = function(remote_repository_url, handler) {

	console.log("our_commit_config 성공");

	var task2 = function(callback)
	{
		var cmd = "cd projects & cd " + project_name + "& cd " + user_name + "&";
		var git_cmd = "git config --global push.default matching"+ "&" + "git remote add origin ~~origin폴더가 있는 내컴터의 경로~~";	//window
		//var cmd = "git push";	//linux
		var child = exec(cmd + git_cmd, function(error, stdout, stderr) {
						//*****↑ 여기 확인!!!! ()
			if (error !== null)
			{
				console.log("task2 error");
				console.log(error);
			}
			else
			{
				console.log("successful: " + cmd + " push config--");
				callback(null);
			}
		});
	};
}*/

exports.create_new_bare = function(project_name, user_name, handler) {

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
		var cmd = "cd projects & cd " + project_name + "&" + "git --bare init origin";
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
		var cmd = "cd projects & cd " + project_name + "&" + "git clone origin " + user_name;
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

	// acknowledge for the "create_new request"
	var callback = function(err, successful) {
		//
	};
	async.waterfall([task0, task1, task2], callback);
};


exports.our_join = function(project_name, user_name, handler) {

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
		var cmd = "cd projects & cd " + project_name + "&" + "git clone origin " + user_name;
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

	// acknowledge for the "create_new request"
	var callback = function(err, successful) {
		//
	};
	async.waterfall([task0, task1], callback);
};




exports.our_commit = function(project_name, user_name, commit_message, handler) {

	console.log("our_commit 성공!");
	//var goal = "\n[git] commit project '" + project_name + "'";
	//console.log(goal);

	// "git add --all" : staging
	var task0 = function(callback)
	{
		//****논의해볼것****// (V)
		// 사용자가 commit할 각각의 js파일을 구분할 것인가.
		// if) git status must be checked.(untracked file 있나 없나 확인해야됨)
		
		// 1. git bash에서 일단 cd가 해당 프로젝트 디렉토리여야 함. 이동부분 수정 필요 (V: directory_move 함수(V,X))
		// 프로젝트의 깃 경로(프로젝트 경로): 서버코드가 있는 폴더가 홈/projects/project_name/user_id/files...
		// 서버코드가 있는 폴더가 홈/projects/project_name/user_id/ 요까지 cd로 들어와줘야됨.
		//**현재 cd 위치를 옮겨버린거니까 다른 함수 이어서 쓸 때 cd를 홈으로 초기화 시켜주거나
		//  하는 동작 필요할 듯 (directory_issue함수) (V,X)
		// 2. git add --all; 확인 (V)
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
		//commit_message 사용자가''(V)
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
	var callback = function(err, result)
	{
		if (result === true)
			handler();
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

	/******************************
	/////////개중요//////// (V)
	// 아이디, 패스워드 물어보는 부분 어떻게 할 것인가
	// 깃허브를 사용하는 시에 문제점임.
	// origin 폴더를 bare repository로 생성해 사용함으로써 해결. ()
	******************************/

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







// 이 부분 개선 (V)
	//  git remote add origin <원격 서버 주소>, git push origin master,
	//  => http://rogerdudler.github.io/git-guide/index.ko.html
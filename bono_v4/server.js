var fs = require('fs');
var path = require('path');

// BONOBONO MODULES
var db = require('./db.js')();
var git = require('./git.js');
var gitTree = require('./git_log.js')();

// express 4.0
var express = require('express');
// serve_static - uploading server files to serve for client
var serve_static = require('serve-static');
// body-parser - getting params when post method is requested
var bodyParser = require('body-parser');
// jQuery File Tree - make file tree for client for browsing
var filetree = require('./lib/jqueryFileTree_srv.js');

// make server
var sys = require('sys');
var exec  = require('child_process').exec;

var app = express();


// sessoin ************************************
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(session({
	secret : 'Android Web IDE',
	resave : false,
	saveUninitialized : true,
	cookie: {
		maxAge : 60 * 1000000
	}
}));

app.use(cookieParser());
// sessoin ************************************


// middleware installation
app.use(serve_static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.Router());

var http = require('http').Server(app);
var io = require('socket.io')(http);

var __DIR = './user_data/projects/';
var _GLOBAL={};

// method - get /           *******************************************
app.get('/', function(req, res){
	if(req.session.user_id){
		res.redirect('/main?id=' + req.session.user_id);
	}
	else{
		fs.readFile('login.html', function(err, data){
			res.send(data.toString());
		});
	}
});

app.get('/make_dir', function(req, res){
	var path = req.param("path");

	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!path : " + path);
	fs.mkdir(path, function(){
		console.log("make_dir complete");
		res.send("make_dir complete");
	});
});


app.get('/delete_file', function(req, res){
	var path = req.param("path");
	var stats = fs.stat(path, function(err, stat){
		var isDir = stat.isDirectory();
		if(isDir){
			fs.rmdir(path, function(){
				console.log("Folder Deleted..");
				res.send("Folder Deleted..");
			});
		}else{
			fs.unlink(path, function(){
				console.log("File Deleted..");
				res.send("File Deleted..");
			});
		}
	});
});


// ********************************************************


// method - get /signUp : Sign Up for new User
app.get('/signUp', function(req, res){
	fs.readFile('signUp.html', function(err, data){
		res.send(data.toString());
	});
});

// method - get /main   ************************************************
app.get('/main', function(req, res){
	var user_id = req.param("id");
	//console.log('user id : ' + user_id);
	if(req.session.user_id){
		fs.readFile('main.html', function(err, data){
			res.send(data.toString());
		});
	}
	else{
		res.redirect('/');
	}
});



// method - get /select_project
app.get('/select_project', function(req, res){

	var context = "[/select_project] : ";
	var user_id = req.param("id");

	console.log(context, user_id, "project list request");

	function projectlist_request_handler(projectlist_request_successful, projectList, res) {
		var res = res;

		if (projectlist_request_successful) {
			res.send(projectList);
		} else {
			res.send(null);
			console.log(context, "failure");
		}
	}


	db.userproject.list(user_id, projectlist_request_handler, res);

});

// method - get /select_project
app.get('/project_info', function(req, res){

	var context = "[/project_info] : ";
	var project_name = req.param("project");
	_GLOBAL.project_name = project_name;
	_GLOBAL.project_path = __DIR+project_name;
	console.log("js: proj_name "+_GLOBAL.project_name);
	console.log("js: proj_path "+_GLOBAL.project_path);

	console.log(context, "project information request");

	function project_info_handler(project_info_successful, projectObj, res)
	{
		var res = res;

		if (project_info_successful)
		{
			res.send(projectObj);
		}
		else
		{
			res.send(null);
			console.log(context, "failure");
		}
	}

	db.projectinfo.info(project_name, project_info_handler, res);

});


//*************************************************************************************
//*********
//GitTree
//*********
function draw_handler(_finalObject, res) {
	var log_diff_cnt = 0;
	var origin_pos = _finalObject.origin_position;
	var my_pos = _finalObject. my_position;
	var res_html = "";
	var drawTreeArray = [];
	var arr_length;
	
	
	console.log("draw_handler======================");
	//console.log(typeof(_finalObject));	//object
	console.log(_finalObject);
	console.log("origin:" + _finalObject.originLogTreeArray.length);
	console.log("user:" + _finalObject.userLogTreeArray.length);


	if(_finalObject.originLogTreeArray.length <= _finalObject.userLogTreeArray.length) 
	{	
		drawTreeArray = _finalObject.userLogTreeArray;
	}
	else
	{
		drawTreeArray = _finalObject.originLogTreeArray;
	}
	//console.log("drawTree:" + drawTreeArray.length);
	//console.log(drawTreeArray);

	arr_length = drawTreeArray.length - 1;


	//git log가 존재 안하면
	if(_finalObject.origin_no_commits_flag || _finalObject.user__no_commits_flag) 
	{
		if(_finalObject.origin_no_commits_flag) 
		{
			//console.log("origin no commit");
			//***************************
			//origin에 git log아무것도 없을 때의 동작
			//***************************
		}

		if(_finalObject.user_no_commits_flag) 
		{
			//console.log(_finalObject.my_name + " no commit");
			//***************************
			//_user_name folder에 git log아무것도 없을 때의 동작
			//***************************
		}
		
	}
	//git log가 존재하면
	else
	{	
		
		//_finalObject.originLogTreeArray 로 되어있는 부분 수정 필요
		//log_diff_cnt 동작  -- 일단 이건 무시함......
		for(idx in _finalObject.originLogTreeArray)
		{
			if(_finalObject.originLogTreeArray[idx].commit_hash !== _finalObject.my_position) 
			{
				log_diff_cnt++;
			}	
			else
			{
				break;
			}
		}

		console.log("drawTree:" + drawTreeArray.length);
		console.log(drawTreeArray);		
		
		for(var i in drawTreeArray){
			var com_msg = drawTreeArray[i].commit_msg;
			if(com_msg.length > 30){
				var temp = com_msg.slice(0, 30);
				com_msg = temp.concat("...");
			}
			if(origin_pos === drawTreeArray[i].commit_hash){
				res_html += '<div class="git_tree_node node_origin" data-hash="' 
						  + drawTreeArray[i].commit_hash + '" data-name="' 
						  + drawTreeArray[i].committer_name + '" data-date="' 
						  + drawTreeArray[i].commit_date + '" data-msg="' 
						  + com_msg + '">o</div>';
			}else if(my_pos === drawTreeArray[i].commit_hash){
				res_html += '<div class="git_tree_node node_user" data-hash="' 
						  + drawTreeArray[i].commit_hash + '" data-name="' 
						  + drawTreeArray[i].committer_name + '" data-date="' 
						  + drawTreeArray[i].commit_date + '" data-msg="' 
						  + com_msg + '">m</div>';
			}else if(origin_pos === drawTreeArray[i].commit_hash && my_pos === drawTreeArray[i].commit_hash){
				res_html += '<div class="git_tree_node node_origin_user" data-hash="' 
						  + drawTreeArray[i].commit_hash + '" data-name="' 
						  + drawTreeArray[i].committer_name + '" data-date="' 
						  + drawTreeArray[i].commit_date + '" data-msg="' 
						  + com_msg + '">o_m</div>';
			}else{
				res_html += '<div class="git_tree_node node_normal" data-hash="' 
						  + drawTreeArray[i].commit_hash + '" data-name="' 
						  + drawTreeArray[i].committer_name + '" data-date="' 
						  + drawTreeArray[i].commit_date + '" data-msg="' 
						  + com_msg + '">n</div>';
			}
			if(i != arr_length)
				res_html += "<div class='git_tree_edge'></div>";
		}
		
		console.log("&&&&&&&&&&&&&&&&&&&&&&&&&res_html = " +res_html);
	}
	res.send(res_html);
}

//****pull push commit 버튼을 누를때마다 실행되게
app.get('/makeGitTree', function(req, res){
	var path = req.param('path');
	var id = req.param('id');
	console.log("/makeGitTree : " +path + " / " +id);
	gitTree.logTree(path, id, draw_handler, res);
	//console.log("&&&&&&&&&&&&&&&&&&&&&&&&&res_html = " +res_html);
});








//child : run
app.get('/btm_menu_run', function(request, response){

	var context = "[/btm_menu_run] : ";

	console.log(context, "connected");

	var user_id = request.param("id");
	var project_name = request.param("project");

	var path = "./user_data/projects/" + project_name + "/_" + user_id;

	console.log(_GLOBAL.cur_project_target);
	console.log(path);
	fs.readFile(path+"/test.keystore", 'utf8', function(err, data) {
  		if(err){
  			var cmd = "cp ./user_data/build/test.keystore " + path+"/test.keystore";
  			var key = exec(cmd, function(error, stdout, stderr) {

				if (error !== null)
				{
					console.log(error);
				}
				else
				{
					console.log(context, "key successful-", cmd);
					//callback(null);
				}
			});
  		}
  	});



	var filecontent;
	var key_none;
	//local.properties update
	fs.readFile(path+"/local.properties", 'utf8', function(err, fd) {
		console.log(path+"/local.properties");
		//console.log("read success\n"+fd);
		if(err) throw err;
		filecontent=fd;
		//console.log("change\n"+filecontent);
  		key_none = filecontent.search("#key");
  		console.log("key is " + key_none);
  		if(key_none===-1){
  			filecontent = filecontent + "#key\nkey.store=./test.keystore\nkey.alias=test\nkey.store.password=helloworld\nkey.alias.password=helloworld\n";
  			console.log("change\n"+filecontent);
  			fs.writeFile(path+"/local.properties", filecontent, function(err) {
  				if(err) throw err;
  				console.log('File write completed');
			});
  		}
  	});


	// 빌드 끝내고 apk 파일도 전송해 줘야함.
	var child = exec("cd " + path +"; "+ " ant clean release", function(err, stdout ,stderr){

		if (err === null)
		{
			console.log(context, "	successful");
			sys.print('stdout : '+ stdout);
			response.send(stdout);
		}
		else
		{
			console.log(context, "error");
			sys.print('stderr : ' + stderr);
			response.send(stderr);
		}
	});
});





app.get('/updatetarget', function(req, res){

	var filePath = req.param('path');

	//console.log("+++++++++++++++++++++++ : " + filePath);


	_GLOBAL.cur_project_path = "./user_data/projects/"+filePath;
	console.log("readfilejs "+_GLOBAL.cur_project_path);

	fs.readFile(_GLOBAL.cur_project_path+"project.properties", 'utf8', function(err, data) {
		console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!@@@@@@@@@@@@@@@@@@ : " +data);
 		var n = data.search("target=");

		var resTarget = data.substring(n+7,data.length-1);
		console.log("res : " + resTarget);

		_GLOBAL.cur_project_target = resTarget;
		//console.log("again : "+ _GLOBAL.cur_project_target);


		var child = exec("cd " + _GLOBAL.cur_project_path +"; android update project -p . -t "+ _GLOBAL.cur_project_target +";" + " cd ../appcompat_v7; "+ "android update project -p . -t "+ _GLOBAL.cur_project_target +"; " , function(err, stdout ,stderr){
			var context = "[/update target] : ";

			//console.log(context, "connected");
			//console.log("in "+ _GLOBAL.cur_project_target);
			if (err === null)
			{
				console.log(context, "	successful");
				sys.print('stdout : '+ stdout);
				res.send(stdout);
			}
			else
			{
				console.log(context, "error");
				sys.print('stderr : ' + stderr);
				res.send(stderr);
			}
		});
	});




});


/**********************************************************************
												POST MESSAGE HANDLERS
**********************************************************************/

/**********
 LOGIN
 **********/
// *********************************************************************

app.get('/logout', function(req, res){
	delete req.session.user_id;
	res.send("logout");
});

app.post('/login', function(req, res){

	var context = "[/login] : ";

	var user_id = req.body.id;
	var user_pwd = req.body.pwd;

	console.log(context, user_id, "login request");

	function login_handler(login_successful, res)
	{
		if (login_successful)
		{
			req.session.user_id = user_id;
			res.send("login_successed");
		}
		else
		{
			res.send("login_failed");
		}
	}

	db.userinfo.login(user_id, user_pwd, login_handler, res);
});

/**********
 JOIN
 **********/
app.post('/join', function(req, res){

	var context = "[/join] : ";

	var user_id = req.body.id;
	var user_pwd = req.body.pwd;
	var user_email = req.body.email;

	console.log(context, user_id, "join request");

	function join_handler(join_successful, res)
	{
		if (join_successful)
		{
			res.send("join_successed");
		}
		else
		{
			res.send("join_failed");
		}
	}

	db.userinfo.join(user_id, user_pwd, user_email, join_handler, res);
});

/***************
 PROJECT CREATE
 ***************/
app.post('/project_create', function(req, res){

	var context = "[/project_create] : ";

	var user_id = req.body.id;
	var project_name = req.body.pname;
	var project_desc = req.body.pdesc;

	console.log(context, "project creation request");

	function project_create_handler(project_create_successful, res)
	{
		if (project_create_successful)
		{
			res.send("project_create_successed");
		}
		else
		{
			res.send("project_create_failed");
		}
	}

	db.projectinfo.create(user_id, project_name, project_desc, project_create_handler, res);
});

/***************
 PROJECT INVITE
 ***************/
app.post('/project_invite', function(req, res){

	var context = "[/project_invite] : ";

	var user_id = req.body.id;

	var inv_id = req.body.inv_id;
	var inv_project = req.body.inv_project;
	var inv_msg = req.body.inv_msg;

	console.log(context, "user invitation request");

	function project_invite_handler(project_invite_successful, res)
	{
		if (project_invite_successful)
		{
			res.send("project_invite_successed");
		}
		else
		{
			res.send("project_invite_failed");
		}
	}

	db.invitation.invite(user_id, inv_id, inv_project, inv_msg, project_invite_handler, res);
});


// app.post('/project_create')
// app.post('/project_load')
// app.post('/project_list')
// app.post('/project_participate')
// app.post('/project_invite')

/*********************
 EDITOR - FILE SAVE
**********************/
// method = post /file_save : save file when client press 'Ctrl + S'
app.post('/file_save', function(req, res){
	var fileName = req.body.fileName;
	var contents = req.body.contents;
	var user_id = req.body.id;
	var project_name = req.body.project;

	var path = "./user_data/projects/" + project_name + "/_" + user_id;

	fs.writeFile(fileName, contents, 'utf8', function(err){
		if(err) throw err;
		console.log("### Save Complete ###");
	});
	
	console.log(_GLOBAL.cur_project_target);
	console.log(path);

	var antcompile = exec("cd " + path +"; "+ " ant compile", function(err, stdout ,stderr){

		if (err === null)
		{
			console.log( "compile successful");
			sys.print('stdout : '+ stdout);
		
		}
		else
		{
			console.log("compile error");
			var start = stdout.search("part!");
			stdout = stdout.substring(start+6,stdout.length);
			
			sys.print(stdout);
			//res.send(stderr);
		}
	});
	res.sendStatus(200);
});

/*********************
 EDITOR - FILE TREE
**********************/
// method - post /req_filetree : request file tree
app.post('/req_filetree', function(req, res){

	var context = "[/req_filetree] : ";

	var __PROJECT_BASE_DIR = "./user_data/projects/";
	var dir = req.body.dir;

	if (dir.search(__PROJECT_BASE_DIR) == -1)
	{
		//req.body.dir = dir.substr(__PROJECT_BASE_DIR.length);
		dir = __PROJECT_BASE_DIR.concat(dir);
	}


	console.log("File Tree : " +dir);

	filetree.getDirList(dir, res);
});

/*********************
 EDITOR - OPEN FILE
**********************/
// method - post //openfile : request open file
app.post('/openFile', function(req, res){

	var context = "[/openFile] : ";

	var __PROJECT_BASE_DIR = "./user_data/projects/";
	var filePath = req.body.path;

	if (filePath.search(__PROJECT_BASE_DIR) == -1)
	{
		filePath = __PROJECT_BASE_DIR + req.body.path;
	}

	console.log(context, filePath);

	if(filePath){
		fs.readFile(filePath, 'utf-8', function(err, data){
			//console.log(data);
			res.send(data);
		});
	}
});


/**********************************************************************
													SOCKTE.IO HANDLERS
**********************************************************************/

/********************
 PROJECT INVITE LIST
*********************/
/*
io.of('/project_invitelist')
	.on('connection', function(socket){

		var context = "[/project_invitelist] : ";
		console.log(context, "a user connected (socket.io)");

		// 초대리스트 요청
		socket.on('invitelist_request',function(user_id){

			// DB에서 사용자 프로젝트 목록 가져오기
			// project item : {name, desc, member(null), date(null), owner(null)}

			function invitelist_request_handler(arr, socket)
			{
				var socket = socket;

				// successful		arr.length != 0
				// failure			arr.length == 0
				socket.emit('invitelist_response', JSON.stringify(arr));
			}

			db.invitation.list(user_id, invitelist_request_handler, socket);
		});

		// 초대 수락
		socket.on('invitelist_accept', function(json){

			var obj = JSON.parse(json);
			var user_id = obj.id;
			var project_name = obj.project;

			function invitelist_accept_handler(invite_accept_successful, socket)
			{
				var socket = socket;

				if (invite_accept_successful)
				{
					socket.emit('invitelist_accept_response', 'success');
				}
				else
				{
					socket.emit('invitelist_accept_response', 'failure');
				}
			}

			// execute db
			db.user.login(o.user, o.password, login_handler, socket);
		});

		// 초대 거절
		socket.on('invitelist_decline',function(json){

			var o = JSON.parse(json);

			console.log("[login, " + o.user + "] : login request.");

			// for db
			// handler
			function login_handler(login_successful, socket)
			{
				var socket = socket;

				if (login_successful) {
					socket.emit('list_response', 'success');
				} else {
					socket.emit('list_response', 'failure');
				}
			}

			// execute db
			db.user.login(o.user, o.password, login_handler, socket);
		});
});
*/


/*********************
  EDITOR CONTEXT
 *********************/

// io.of('/eidtor')
// 	.on('connection', function(socket){
//
// 		var context = "[/project_invitelist] : ";
// 		console.log(context, "a user connected (socket.io)");
//
// 		// COMMIT
// 		socket.on('commit',function(user_id){
//
// 			// DB에서 사용자 프로젝트 목록 가져오기
// 			// project item : {name, desc, member(null), date(null), owner(null)}
//
// 			function invitelist_request_handler(arr, socket)
// 			{
// 				var socket = socket;
//
// 				// successful		arr.length != 0
// 				// failure			arr.length == 0
// 				socket.emit('push', JSON.stringify(arr));
// 			}
//
// 			db.invitation.list(user_id, invitelist_request_handler, socket);
// 		});
//
// 		// PUSH
// 		socket.on('pull', function(json){
//
// 			var obj = JSON.parse(json);
// 			var user_id = obj.id;
// 			var project_name = obj.project;
//
// 			function invitelist_accept_handler(invite_accept_successful, socket)
// 			{
// 				var socket = socket;
//
// 				if (invite_accept_successful)
// 				{
// 					socket.emit('invitelist_accept_response', 'success');
// 				}
// 				else
// 				{
// 					socket.emit('invitelist_accept_response', 'failure');
// 				}
// 			}
//
// 			// execute db
// 			db.user.login(o.user, o.password, login_handler, socket);
// 		});
//
// 		// PULL
// 		socket.on('invitelist_decline',function(json){
//
// 			var o = JSON.parse(json);
//
// 			console.log("[login, " + o.user + "] : login request.");
//
// 			// for db
// 			// handler
// 			function login_handler(login_successful, socket)
// 			{
// 				var socket = socket;
//
// 				if (login_successful) {
// 					socket.emit('list_response', 'success');
// 				} else {
// 					socket.emit('list_response', 'failure');
// 				}
// 			}
//
// 			// execute db
// 			db.user.login(o.user, o.password, login_handler, socket);
// 		});
// });
//

io.on('connection', function(socket){

		var context = "[/editor] : ";
		console.log(context, "a user connected (socket.io)");

		///////////////////
		// PULL
		///////////////////
		socket.on('pull',function(data){

			if (typeof data.project === "undefined")
			{
				socket.emit("pull_response", null);
				return;
			}

			function pull_handler(pull_successful, socket, msg)
			{
				var socket = socket;
				var data = {};

				data.reason = msg;

				if (pull_successful === true)
					data.result = "successful";
				else
					data.result = "fail";

				socket.emit("pull_response", data);
			}

			git.pull(data.project, data.id, pull_handler, socket);
		});

		///////////////////
		// COMMIT
		///////////////////
		socket.on('commit',function(data){

			if (typeof data.project === "undefined")
			{
				socket.emit("commit_response", null);
				return;
			}

			function commit_handler(commit_successful, socket, msg)
			{
				var socket = socket;
				var data = {};

				data.reason = msg;

				if (commit_successful === true)
					data.result = "successful";
				else
					data.result = "fail";

				socket.emit("commit_response", data);
			}

			git.commit(data.project, data.id, commit_handler, socket);
			var path = req.param('path');
			var id = req.param('id');
			console.log("/makeGitTree : " +path + " / " +id);
			gitTree.logTree(path, id, draw_handler, res);
			//console.log("&&&&&&&&&&&&&&&&&&&&&&&&&res_html = " +res_html);
		});


		///////////////////
		// PUSH
		///////////////////
		socket.on('push',function(data){

			if (typeof data.project === "undefined")
			{
				socket.emit("push_response", null);
				return;
			}


			function push_handler(push_successful, socket, msg)
			{
				var socket = socket;
				var data = {};

				data.reason = msg;

				if (push_successful === true)
					data.result = "successful";
				else
					data.result = "fail";

				socket.emit("push_response", data);
			}

			git.push(data.project, data.id, push_handler, socket);
		});

});

// server start listening
http.listen(8000, function(){
	console.log('Server Start');
});

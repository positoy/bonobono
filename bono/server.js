var fs = require('fs');
var path = require('path');

// BONOBONO MODULES
var db = require('./db.js')();


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

// middleware installation
app.use(serve_static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.Router());

var http = require('http').Server(app);
var io = require('socket.io')(http);


// method - get /
app.get('/', function(req, res){
	fs.readFile('login.html', function(err, data){
		res.send(data.toString());
	});
});


// method - get /signUp : Sign Up for new User
app.get('/signUp', function(req, res){
	fs.readFile('signUp.html', function(err, data){
		res.send(data.toString());
	});
});


// method - get /main
app.get('/main', function(req, res){
	var user_id = req.param("id");
	//console.log('user id : ' + user_id);
	fs.readFile('main.html', function(err, data){
		res.send(data.toString());
	});
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

//child : run
app.get('/btm_menu_run', function(request, response){

	var context = "[/btm_menu_run] : ";

	console.log(context, "connected");

	var user_id = request.param("id");
	var project_name = request.param("project");

	var path = "./user_data/projects/" + project_name + "/_" + user_id;

	// 빌드 끝내고 apk 파일도 전송해 줘야함.
	var child = exec("cd " + path +"; ant clean release", function(err, stdout ,stderr){

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


/**********************************************************************
												POST MESSAGE HANDLERS
**********************************************************************/

/**********
 LOGIN
 **********/
app.post('/login', function(req, res){

	var context = "[/login] : ";

	var user_id = req.body.id;
	var user_pwd = req.body.pwd;

	console.log(context, user_id, "login request");

	function login_handler(login_successful, res)
	{
		if (login_successful)
		{
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

	fs.writeFile(fileName, contents, 'utf8', function(err){
		if(err) throw err;
		console.log("### Save Complete ###");
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


// server start listening
http.listen(8000, function(){
	console.log('Server Start');
});

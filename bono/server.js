var http = require('http');
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
var app = express();

// middleware installation
app.use(serve_static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.Router());

// method - get /
app.get('/', function(req, res){
	fs.readFile('login.html', function(err, data){
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
	var user_id = req.param("id");
	//console.log('user id : ' + user_id);
	
	fs.readdir("/home/positoy/Documents/bono", function(err, files){

		if (err)
		{
			console.log("error occured.");
		}
/*
		for(var i in files){
			console.log(files[i]);
		}
*/
		res.send(files);
	});
});

/**********
 LOGIN
 **********/
app.post('/login', function(req, res){

	var context = "[/login] : ";

	var user_id = req.body.id;
	var user_pwd = req.body.pwd;
	
	console.log(context, user_id, "login request")

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

	db.userinfo.login(user_id, user_pwd, login_handler, res)
});

/**********
 JOIN
 **********/
app.post('/join', function(req, res){

	var context = "[/join] : ";

	var user_id = req.body.id;
	var user_pwd = req.body.pwd;
	var user_email = req.body.email;
	
	console.log(context, user_id, "join request")

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

	db.userinfo.join(user_id, user_pwd, user_email, join_handler, res)
});

/***************
 PROJECT CREATE
 ***************/
app.post('/project_create', function(req, res){

	var context = "[/project_create] : ";

	var user_id = req.body.id;
	var project_name = req.body.pname;
	var project_desc = req.body.pdesc;
	
	console.log(context, "project creation request")

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

	db.projectinfo.create(user_id, project_name, project_desc, project_create_handler, res)
});

/***************
 PROJECT INVITE
 ***************/
app.post('/project_invite', function(req, res){

	var context = "[/project_invite] : ";

	var user_id = req.body.id;
	var invited_id = req.body.invited;
	var project_name = req.body.pname;
	
	console.log(context, "user invitation request")

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

	db.invitation.invite(user_id, invited_id, project_name, project_invite_handler, res)
});


// app.post('/project_create')
// app.post('/project_load')
// app.post('/project_list')
// app.post('/project_participate')
// app.post('/project_invite')

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

// method - post /req_filetree : request file tree
app.post('/req_filetree', function(req, res){
	filetree.getDirList(req, res);
});

// method - post //openfile : request open file
app.post('/openFile', function(req, res){
	var filePath = req.body.path;
	
	//console.log(filePath);
	
	if(filePath){
		fs.readFile(filePath, 'utf-8', function(err, data){
			//console.log(data);
			res.send(data);
		});	
	}
});

// server start listening
http.createServer(app).listen(8000, function(){
	console.log('Server Start');
});
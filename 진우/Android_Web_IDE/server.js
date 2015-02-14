var http = require('http');
var fs = require('fs');
var path = require('path');

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
	
	fs.readdir("C:\Users\Hayeon\Desktop\bonobono\Áø¿ì\Android_Web_IDE\js_client", function(err, files){
/*
		for(var i in files){
			console.log(files[i]);
		}
*/
		res.send(files);
	});
});

// method - get /login
app.post('/login', function(req, res){
	var user_id = req.body.id;
	var user_pwd = req.body.pwd;
	
	if(user_id == "cwlsn88" && user_pwd == "cwlsn88"){
		//console.log("login complete");
		res.send("login_successed");
	}
	else{
		//console.log("login failed");
		res.send("login_failed");
	}
});

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
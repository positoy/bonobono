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
	console.log('### User Request : Get ###');
	fs.readFile('main.html', function(err, data){
		res.send(data.toString());
	});
});

// method - post //jqueryFileTree_srv.js : request file tree
app.post('/jqueryFileTree_srv.js', function(req, res){
	filetree.getDirList(req, res);
});

// method - post //openfile : request open file
app.post('/openFile', function(req, res){
	var filePath = req.body.path;
	
	fs.readFile(filePath, 'utf-8', function(err, data){
		//console.log(data);
		res.send(data);
	});
});

// server start listening
http.createServer(app).listen(8000, function(){
	console.log('Server Start');
});
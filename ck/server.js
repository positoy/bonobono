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

// project directory
var __projectDir = './user_data/projects';

/**
 * bono_modules
 */
var git = require('./bono_modules/git.js');
var db = require('./bono_modules/db.js')

// middleware installation
app.use(serve_static(__dirname + '/public_html'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.Router());

/* file tree function */

// method - post //jqueryFileTree_srv.js : request file tree
app.post('/jqueryFileTree_srv.js', function(req, res){
	req.body.dir = __projectDir + req.body.dir;
	filetree.getDirList(req, res);
});

// method - post
app.post('/create', function(req, res){

	var project_name = req.body.name;
	var project_desc = req.body.desc;
	
	git.create(project_name);

	/*************************************** DB PROJECT CREATE ****

		db.project.create(project_name, project_desc);

	 *************************************************************/

	// user_id needed. (session?)
	var user_id;
	
	// user_email has to be gotten from DB
	var user_email;

	git.join(project_name, user_id, user_email);

	/*********************************** DB USERPROJECT CREATE ****

		db.userproject.create(user_id, project_name);

	 *************************************************************/
});

app.post('/join', function(req, res){

	var project_name = req.body.name;
	
	// user_id needed. (session?)
	var user_id;
	
	// user_email has to be gotten from DB
	var user_email;

	git.join(project_name, user_id, user_email);

	/*********************************** DB USERPROJECT CREATE ****

		db.userproject.create(user_id, project_name);

	 *************************************************************/
});



// server start listening
http.createServer(app).listen(8000, function(){
	console.log('Server Start');
});
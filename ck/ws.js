// var http = require('http');
// var fs = require('fs');
// var path = require('path');

// // express 4.0
// var express = require('express');
// // serve_static - uploading server files to serve for client
// var serve_static = require('serve-static');
// // body-parser - getting params when post method is requested
// var bodyParser = require('body-parser');

// // make server
// var app = express();

// // middleware installation
// app.use(serve_static(__dirname));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.Router());

// app.use("/", express.static(__dirname + "/web"));

// // server start listening
// http.createServer(app).listen(8000, function(){
// 	console.log('Server Start');
// });

// var ws = require("nodejs-websocket")

// // Scream server example: "hi" -> "HI!!!"
// var server = ws.createServer(function (conn) {
//     console.log("New connection")
//     conn.on("text", function (str) {
//         console.log("Received "+str)
//         conn.sendText(str.toUpperCase()+"!!!")
//     })
//     conn.on("close", function (code, reason) {
//         console.log("Connection closed")
//     })
// }).listen(8001)

var git = require('./git.js');

/******************************************* USAGE **

  git.create("project_name");

  git.join("project_name", "user_id", "user_email");

 ****************************************************/
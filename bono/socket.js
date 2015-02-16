// socket.io & express
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser');
var fs = require('fs');

// serving static content
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

// bonobono modules
var git = require('./git.js');
var db = require('./db.js')();


// global variables

/*************
 LOGIN
 *************/
io.of('/login')
  .on('connection', function(socket){

    console.log("[login] : a user connected.")

    socket.on('login_request',function(json){

      var o = JSON.parse(json);

      console.log("[login, " + o.user + "] : login request.");

      // for db
      // handler
      function login_handler(login_successful, socket)
      {
        var socket = socket;

        if (login_successful) {
          socket.emit('login_response', 'success');
        } else {
          socket.emit('login_response', 'failure');
        }
      }

      // execute db
      db.user.login(o.user, o.password, login_handler, socket);
    });
  });


/*************
 JOIN
 *************/
io.of('/join')
  .on('connection', function(socket){

    console.log("[join] : a user connected.")

    socket.on('join_request',function(json){

      var o = JSON.parse(json);

      console.log("[join, " + o.user + "] : join requested.");

      // for db
      // handler
      function join_handler(join_successful, socket)
      {
        var socket = socket;

        if (join_successful) {
          socket.emit('join_response', 'success');
        } else {
          socket.emit('join_response', 'failure');
        }
      }

      // execute db
      db.user.create(o.user, o.password, o.email, join_handler, socket);

    });
  });


/*************
 PROJECT VIEW
 *************/
io.of('/p_view')
  .on('connection', function(socket){

    console.log("[project view] : a user connected.");

    socket.on('p_view_request',function(id){
      console.log("[project view, " + id + "] : project list request.");

      // for db
      // project list handler
      function pview_handler(pview_successful, socket, str_projectList)
      {
        var socket = socket;

        if (pview_successful) {
          socket.emit('p_view_response', str_projectList);

        } else {
          socket.emit('p_view_response', 'failure');

        }
      }

      // execute db
      db.user.view(id, pview_handler, socket);
    });
  });


/************
 PROJECT CREATE
 ************/
io.of('/p_create')
  .on('connection', function(socket){

    console.log("[project create] : a user connected.")

    socket.on('p_create_request',function(j){

      // o.user_name, o.project_name, o.project_desc
      var o = JSON.parse(j);

      console.log("[project create, " + o.user_name + "] : project create request, " + o.project_name)

      // 0. db : check project name duplicate
      // 1. db : get user email
      // 2. git : new project (create origin folder and git init)
      // 3. db : add new project
      // 4. git : join project (create folder and git clone)
      // 5. db : add userproject

      // for db
      // project list handler
      function pcreate_handler(pcreate_successful, socket)
      {
        var socket = socket;

        if (pcreate_successful) {
          socket.emit('p_create_response', 'success');

        } else {
          socket.emit('p_create_response', 'failure');

        }
      }

      db.user.create_project(o, pcreate_handler, socket);
    });
  });

/*********
 PROJECT JOIN
 ***********/
io.of('/p_join')
  .on('connection', function(socket){

    console.log("[join project] : a user connected.")

    socket.on('p_join_request',function(json){

      // o.user, o.project.name, o.project.desc
      var o = JSON.parse(json);
      console.log("[join project, " + o.user_name + "] : request for project '" + o.project_name + "'")

      // 0. db : 프로젝트가 존재하는지 검사
      // 1. db : 사용자의 이메일주소 받아오기
      // 2. git : 폴더생성 & git clone
      // 3. db : insert into userproject

      function pjoin_handler(pjoin_successful, socket)
      {
        var socket = socket;

        if (pjoin_successful) {
            socket.emit('p_join_response', 'success');

        } else {
            socket.emit('p_join_response', 'failure');
        }
      }

      db.user.join_project(o, pjoin_handler,socket);
    });
  });



/*********************
 PROJECT LOAD
 *********************/
var filetree = require('./lib/jqueryFileTree_srv.js');

app.post('/p_load', function(req, res){
  console.log("[project load] : " + req.body.dir);
  filetree.getDirList(req, res);
});

app.post('/openFile', function(req, res){
  var filePath = req.body.path;
  console.log("[open file] : " + filePath);

  fs.readFile(filePath, 'utf-8', function(err, data){
    res.send(data);
  });
});


/**************
 socket.io
 **************/

http.listen(3000, function(){
  console.log('listening on *:3000');
});

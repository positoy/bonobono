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


// global variables

/*************
 VIEW
 *************/
io.of('/view')
  .on('connection', function(socket){

    console.log("[view] : a user connected.")

    socket.on('pinfo_request',function(id){
      console.log("[view, " + id + "] : json requested.");
      // DB에서 id의 모든 프로젝트를 조회해서 json으로 전송해준다.
      var j = '[{"name":"bono","description":"awesome project"},{"name":"happy_project","description":"you will be happy"}]';

      socket.emit('pinfo_response', j);
    });
  });

/************
 CREATE
 ************/
io.of('/create')
  .on('connection', function(socket){

    console.log("[create] : a user connected.")

    socket.on('create_request',function(j){

      // o.user, o.project.name, o.project.desc
      var o = JSON.parse(j);

      var user_name = o.user;
      var user_email = user_name + "@gmail.com"; // get email forom db using user name
      var project_name = o.project_name;
      var project_desc = o.project_desc;

      console.log("[create, " + user_name + "] : request for project '" + project_name + "'")

      // DB에서 프로젝트 이름이 중복되는지 확인
      var projectExist = false;
      if (projectExist)
      {
        socket.emit('create_response', 'failure');
      }
      else
      {
        //// ORIGIN REPOSITORY 생성
        // DB에 프로젝트 정보 등록 - db.project.create(project.name, project.desc);

        //// LOCAL REPOSITORY 생성
        // DB에 프로젝트 join 정보 등록 - db.userproject.create(user_id, project_name);

        git.create(project_name, user_name, user_email);

        socket.emit('create_response', 'success');
      }
    });
  });

/*********
 JOIN
 ***********/
io.of('/join')
  .on('connection', function(socket){

    console.log("[join] : a user connected.")

    socket.on('join_request',function(j){

      // o.user, o.project.name, o.project.desc
      var o = JSON.parse(j);

      var user_name = o.user;
      var user_email = user_name + "@gmail.com"; // get email forom db using user name
      var project_name = o.project_name;

      console.log("[join, " + user_name + "] : request for project '" + project_name + "'")

      // DB에서 프로젝트 이름이 중복되는지 확인
      var projectExist = false;
      if (projectExist)
      {
        socket.emit('join_response', 'failure');
      }
      else
      {
        //// LOCAL REPOSITORY 생성
        // DB에 프로젝트 join 정보 등록 - db.userproject.create(user_id, project_name);

        git.join(project_name, user_name, user_email);

        socket.emit('join_response', 'success');
      }
    });
  });


/*********************
 LOAD
 *********************/
var filetree = require('./lib/jqueryFileTree_srv.js');

app.post('/load', function(req, res){
  console.log("/load : " + req.body.dir);
  filetree.getDirList(req, res);
});

app.post('/openFile', function(req, res){
  var filePath = req.body.path;
  console.log("/openFile : " + filePath);

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

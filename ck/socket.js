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
      console.log("[create, " + o.user + "] : request for project '" + o.project.name + "'.")

      // DB에서 프로젝트 이름이 중복되는지 확인
      var projectExist = false;
      if (projectExist)
      {
        socket.emit('create_response', 'failure');
      }
      else
      {
        //// 1. ORIGIN REPOSITORY 생성

        // git : origin repository 생성
        git.create(project.name);

        // DB에 프로젝트 정보 등록 - db.project.create(project.name, project.desc);

        //// 2. LOCAL REPOSITORY 생성
        var user_name, user_email;
        user_name = o.name;
        user_email = o.name + '@gmail.com'; // db에서 얻어오기

        // git : local repository 생성
        git.join(o.project.name, user_name, user_email);

        // DB에 프로젝트 join 정보 등록 - db.userproject.create(user_id, project_name);

        socket.emit('create_response', 'success');
      }
    });
  });

/*********
 JOIN
 ***********/


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

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

      console.log("[join, " + o.user + "] : json requested.");

      // DB : check if o.user already exists
      var same_id_exist = null;

      if (same_id_exist)
      {
        socket.emit('id_exists', "1");
      }
      else
      {
        // DB : create a new record for user
        var join_successful = null;

        if (join_successful)
        {
          socket.emit('join_response', 'success');
        }
        else
        {
          socket.emit('join_response', 'failure');
        }
      }
    });
  });



/*************
 PROJECT VIEW
 *************/
io.of('/p_view')
  .on('connection', function(socket){

    console.log("[project view] : a user connected.")

    socket.on('p_view_request',function(id){
      console.log("[project view, " + id + "] : json requested.");
      // DB에서 id의 모든 프로젝트를 조회해서 json으로 전송해준다.
      var j = '[{"name":"bono","description":"awesome project"},{"name":"happy_project","description":"you will be happy"}]';

      socket.emit('p_view_response', j);
    });
  });

/************
 PROJECT CREATE
 ************/
io.of('/p_create')
  .on('connection', function(socket){

    console.log("[project create] : a user connected.")

    socket.on('p_create_request',function(j){

      // o.user, o.project.name, o.project.desc
      var o = JSON.parse(j);

      var user_name = o.user;
      var user_email = user_name + "@gmail.com"; // get email forom db using user name
      var project_name = o.project_name;
      var project_desc = o.project_desc;

      console.log("[project create, " + user_name + "] : request for project '" + project_name + "'")

      // DB에서 프로젝트 이름이 중복되는지 확인
      var projectExist = false;
      if (projectExist)
      {
        socket.emit('p_create_response', 'failure');
      }
      else
      {
        //// ORIGIN REPOSITORY 생성
        // DB에 프로젝트 정보 등록 - db.project.create(project.name, project.desc);

        //// LOCAL REPOSITORY 생성
        // DB에 프로젝트 join 정보 등록 - db.userproject.create(user_id, project_name);

        git.create(project_name, user_name, user_email);

        socket.emit('p_create_response', 'success');
      }
    });
  });

/*********
 PROJECT JOIN
 ***********/
io.of('/p_join')
  .on('connection', function(socket){

    console.log("[project join] : a user connected.")

    socket.on('p_join_request',function(j){

      // o.user, o.project.name, o.project.desc
      var o = JSON.parse(j);

      var user_name = o.user;
      var user_email = user_name + "@gmail.com"; // get email forom db using user name
      var project_name = o.project_name;

      console.log("[project join, " + user_name + "] : request for project '" + project_name + "'")

      // DB에서 프로젝트 이름이 중복되는지 확인
      var projectExist = false;
      if (projectExist)
      {
        socket.emit('p_join_response', 'failure');
      }
      else
      {
        //// LOCAL REPOSITORY 생성
        // DB에 프로젝트 join 정보 등록 - db.userproject.create(user_id, project_name);

        git.join(project_name, user_name, user_email);

        socket.emit('p_join_response', 'success');
      }
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

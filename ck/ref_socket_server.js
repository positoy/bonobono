var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){

  // 알아두자. 이런것도 있다. (모두에게)
  io.emit('some event', { for: 'everyone' });

  //
  io.emit('some event', { for: 'everyone' });

  // 접속자를 제외하고 브로드캐스트
  socket.broadcast.emit('hi');

  socket.on('chat message', function(msg){
    // 수신한 메시지를 전송자를 포함한 모두에게 전송
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

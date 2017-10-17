var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

users = [];

io.on('connection', function(socket){
  socket.on('username', function(name) {
    socket.nickname = name;
    users.push(socket.nickname);
    message = '[' + new Date().toLocaleTimeString('en-US') + '] ' + name + ' connected';
    io.emit('system message', message);
    console.log(message);

    socket.on('chat message', function(msg){
      socket.broadcast.emit('chat message', msg);
      console.log('[' + msg.timestamp + '] ' + msg.username + ': ' + msg.message);
    });

    socket.on('disconnect', function(){
      message = '[' + new Date().toLocaleTimeString('en-US') + '] ' + name + ' disconnected';
      io.emit('system message', message);
      console.log(message);
    });
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
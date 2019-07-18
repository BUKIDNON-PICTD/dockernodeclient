var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var iocilent = require('socket.io-client');
var clientid = 'rufy2';
var server = iocilent.connect('http://localhost:9000');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res) {
  server.emit('message', {
    clientid: clientid,
    message: "OLA! FROM CLIENT"
  });
  res.send('Got a POST request');
})

server.emit('clientcheckin', clientid);
server.on('disconnect', () => {
  console.log('you have been disconnected');
});

server.on('clientonline', (data) => {
  console.log(data.clientid + ' is connected');
});

server.on('clientoffline', (data) => {
  console.log(data.clientid + ' is disconnected');
});

server.on('login', (data) => {
  connected = true;
  console.log(data.numClients + " clients online");
});

server.on('message', (data) => {
  console.log("message from " + data.clientid +" : "+ data.message);
});

server.on('reconnect', () => {
  console.log('you have been reconnected');
  if (clientid) {
    server.emit('clientcheckin', clientid);
  }
});

server.on('reconnect_error', () => {
  console.log('attempt to reconnect has failed');
});

http.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = http.address();
  console.log("Running Panganud Client at ", addr.address + ":" + addr.port);
});

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var path = require('path');
var io = require('socket.io')(http);
var fs = require('fs');
Tail = require('tail').Tail;
var logfile = "/home/cale/.local/share/WSJT-X/ALL.TXT"

app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../', 'index.html'));
});

io.on('connection', function(socket){
  console.log('a user connected');

  tail = new Tail(logfile);

  tail.on("line", function(data) {
    if (data.includes("CQ")) {
        var gridsquare;
        var arr;
        arr = data.substring(data.indexOf("CQ")).split(" ");
        gridsquare = arr[arr.length-1];

        // Check whether gridsquare is 4 characters long.
        if (gridsquare.length == 4) {
          console.log("New grid square. Sending message. "+gridsquare);
          io.emit('new grid square', gridsquare);
        } else {
          console.log("New grid square is irregular: "+gridsquare);
        }
    }
  });

  tail.on("error", function(error) {
    console.log('ERROR: ', error);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});






// var http = require('http');
//
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World!');
// }).listen(8080);





// const { Socket } = require('qtdatastream').socket;
// const { QUserType } = require('qtdatastream').types;
// const net = require('net');
//
// var client = net.Socket();.local/share/WSJT-X/

//
// // Connect to a Qt socket
// // and write something into the socket
// client.connect(2237, "127.0.0.1", function(){
//     const qtsocket = new Socket(client);
//
//     // Here data is the already parsed response
//     qtsocket.on('data', function(data) {
//         console.log(data);
//     });
//
//     // Write something to the socket
//     // qtsocket.write({
//     //     "AString": "BString",
//     //     "CString": 42
//     // });
// });

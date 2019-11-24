var express = require('express');
var app = express();
var http = require('http').createServer(app);
var path = require('path');
var io = require('socket.io')(http);
var fs = require('fs');
Tail = require('tail').Tail;
var logfile = "/home/cale/.local/share/WSJT-X/ALL.TXT"
var mycallsign = "K4HCK";
var workingcallsign = "";
var workinggridsquare = "";

app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../', 'index.html'));
});

io.on('connection', function(socket){
  console.log('a user connected');

  tail = new Tail(logfile);

  tail.on("line", function(data) {
    // Parse single line from WSJT-X ALL.TXT into an array.
    var qso = data.split(" ");
    qso = qso.filter(item => item !== "");
    console.log(qso);

    if (qso.includes("CQ")) {
        var gridsquare;
        gridsquare = qso[qso.length-1];

        // Check whether gridsquare is 4 characters long.
        if (gridsquare.length == 4) {
          console.log("New grid square. Sending message. "+gridsquare);
          io.emit('new CQ square', gridsquare);
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

// 191124_165730    14.074 Tx FT8      0  0.0 1711 K7IE K4HCK EM65
// 191124_165945    14.074 Tx FT8      0  0.0 1271 W1AVK K4HCK R-16
// 191124_170000    14.074 Rx FT8    -15 -0.1 1270 K4HCK W1AVK RRR
// 191124_170015    14.074 Tx FT8      0  0.0 1271 W1AVK K4HCK 73






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

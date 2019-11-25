var express = require('express');
var app = express();
var http = require('http').createServer(app);
var path = require('path');
var io = require('socket.io')(http);
var fs = require('fs');
Tail = require('tail').Tail;
var fetch = require('node-fetch');
var logfile = "/home/cale/.local/share/WSJT-X/ALL.TXT"
var mycallsign = "K4HCK";
var mygridsquare = "EM65";
var workingcallsign = "";
var workinggridsquare = "";
var callingcq = false;

app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../', 'index.html'));
});

gethaminfo = function(callsign) {
  let url = "http://api.hamdb.org/v1/"+callsign+"/json/k4hck-gridmapper";
  let settings = { method: "Get" };

  fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
      console.log(json);
      io.emit('get ham info', json);
    });
}

io.on('connection', function(socket){
  console.log('a user connected');

  tail = new Tail(logfile);

  tail.on("line", function(data) {
    // Parse single line from WSJT-X ALL.TXT into an array.
    var qso = data.split(" ");
    qso = qso.filter(item => item !== "");
    //console.log(qso);

    if (qso.includes(mycallsign) && qso[7].includes("CQ")) {
      // I'm calling CQ / first call.
      console.log("I'm Calling CQ.");
      callingcq = true;
    } else if (qso.includes(mycallsign) && qso.includes(mygridsquare)) {
      // I'm responding to a CQ call. Grab station's callsign.
      workingcallsign = qso[7];
      callingcq = false;
      console.log("I'm working callsign "+ workingcallsign);
    } else if (qso.includes(mycallsign) && callingcq) {
      // My second transmit aftter calling CQ. Grab station's callsign.
      workingcallsign = qso[8];
      console.log("My second transmit after calling CQ. Working "+ workingcallsign);
      callingcq = false;
      // Get Ham's info.
      gethaminfo(workingcallsign);
    } else if (qso.includes(mycallsign) && qso.includes(workingcallsign) && (qso[9].includes("R-") || qso[9].includes("R+") || qso[9].includes("RRR"))) {
      // Received report or report recieved.
      console.log("R or RRR with "+workingcallsign);
      callingcq = false;
      // Get Ham's info.
      gethaminfo(workingcallsign);
    } else if (qso.includes(mycallsign) && qso.includes(workingcallsign) && qso[9].includes("73")) {
      // QSO is ending.
      callingcq = false;
      workingcallsign = "";
      console.log("QSO is ending.");
    } else if (qso.includes("CQ")) {
        var gridsquare;
        gridsquare = qso[qso.length-1];

        // Check whether gridsquare is 4 characters long.
        if (gridsquare.length == 4) {
          //console.log("New grid square. Sending message. "+gridsquare);
          io.emit('new CQ square', gridsquare);
   //        testjson = { "hamdb":
   // { "version": "1",
   //   "callsign":
   //    { "call": "KG5EM",
   //      "class": "E",
   //      "expires": "07/30/2029",
   //      "status": "A",
   //      "grid": "EM16bk",
   //      "lat": "36.4222780",
   //      "lon": "-97.9149160",
   //      "fname": "EDWARD",
   //      "mi": "F",
   //      "name": "MURPHY",
   //      "suffix": "",
   //      "addr1": "2802 SCISSORTAIL LANE",
   //      "addr2": "ENID",
   //      "state": "OK",
   //      "zip": "73703",
   //      "country": "United States" },
   //   "messages": { "status": "K" } } };
   //   io.emit('get ham info', testjson);
        } else {
          //console.log("New grid square is irregular: "+gridsquare);
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

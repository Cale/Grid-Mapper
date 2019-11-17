
//var start = document.getElementById("link");

// start.addEventListener('click', function() {
//     console.log("clicked");
//     chrome.system.cpu.getInfo(function(){})
//     var socket = 0;
//     chrome.sockets.udp.create(function (createInfo) //Create socket entry
//     {
//        socket = createInfo.socketId;
//        console.log(socket);
//     });
//     // chrome.sockets.udp.bind(integer socketId, string address, integer port, function callback)
//     // chrome.sockets.udp.create({}, function (socketInfo) {
//     //     // The socket is created, now we can send some data
//     //     var socketId = socketInfo.socketId;
//     //     var arrayBuffer = stringToArrayBuffer("hello");
//     //     chrome.sockets.udp.send(socketId, stringToArrayBuffer("hello"), "127.0.0.1", 2237, function(sendInfo) {
//     //         console.log("sent " + sendInfo.bytesSent);
//     //         if (sendInfo.resultCode < 0) {
//     //             console.log("Error listening: " + chrome.runtime.lastError.message);
//     //         }
//     //     });
//     // });
// });
//
// function stringToArrayBuffer(string) {
//     var buffer = new ArrayBuffer(string.length * 2);
//     var bufferView = new Uint16Array(buffer);
//     for (var i = 0, stringLength = string.length; i < stringLength; i++) {
//         bufferView = string.charCodeAt(i);
//     }
//     return buffer;
// }

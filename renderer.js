// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const ipc = require('electron').ipcRenderer;

ipc.on('draw my grid', (event, mygridsquare) => {
  console.log('Drawing my grid')
  // Draw my grid square on map.
  var mygridcoords = L.Maidenhead.indexToBBox(mygridsquare);
  L.rectangle([[mygridcoords[0], mygridcoords[1]], [mygridcoords[2], mygridcoords[3]]], {
    name: mygridsquare,
    color: "#0000ff",
    fillOpacity: 0.75,
    stroke: false,
  }).addTo(mygrid);
})

ipc.on('new CQ grid', (event, msg, gridcolor) => {
 $("#map").prepend(msg);
 var coords = L.Maidenhead.indexToBBox(msg);

 L.rectangle([[coords[0], coords[1]], [coords[2], coords[3]]], {
   name: msg,
   color: gridcolor,
   fillOpacity: 0.75,
   stroke: false,
 }).addTo(cqgrids);
})

ipc.on('draw working grid square', (event, callinggrid) => {

})

ipc.on('get ham info', (event, haminfo) => {
  $("#working-station").html("");

  if (haminfo["hamdb"]["messages"]["status"] == "NOT_FOUND") {
    $("#working-station").append("<p>Callsign not found.");
  } else {
    var callinggrid = haminfo["hamdb"]["callsign"]["grid"].slice(0,4);
    var callingstation = haminfo["hamdb"]["callsign"]["call"];
    var firstname = haminfo["hamdb"]["callsign"]["fname"].toLowerCase();
    var lastname = haminfo["hamdb"]["callsign"]["name"].toLowerCase();
    var city = haminfo["hamdb"]["callsign"]["addr2"].toLowerCase();

    $("#working-station").append("<h1>"+callingstation+"</h1>\
      <h2>"+callinggrid+"</h2>\
      <p>"+firstname.charAt(0).toUpperCase() + firstname.slice(1)+" "+lastname.charAt(0).toUpperCase() + lastname.slice(1)+"\
      <br>"+city.charAt(0).toUpperCase() + city.slice(1)+", "+haminfo["hamdb"]["callsign"]["state"]+"\
      <br>"+haminfo["hamdb"]["callsign"]["country"]+"</p>\
      <p><a href='https://qrz.com/lookup/"+callingstation+"' target='_blank'>View on QRZ</a></p>");

      workinggrid.clearLayers();

      var coords = L.Maidenhead.indexToBBox(callinggrid);

      L.rectangle([[coords[0], coords[1]], [coords[2], coords[3]]], {
        name: callinggrid,
        color: "#ff0000",
        fillOpacity: 0.75,
        stroke: false,
      }).addTo(workinggrid);
  }

  $( "#ham-info" ).fadeIn( "slow", function() {});
})

ipc.on('clear working grid', (event) => {
  workinggrid.clearLayers();
})

ipc.on('draw worked grid', (event, grid) => {
  var coords = L.Maidenhead.indexToBBox(grid);

  L.rectangle([[coords[0], coords[1]], [coords[2], coords[3]]], {
    name: grid,
    color: "#00ff00",
    fillOpacity: 0.5,
    stroke: true,
  }).addTo(workedgrids);
})

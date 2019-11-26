var mycallsign = "K4HCK";
var mygridsquare = "EM65";
var workingcallsign = "";

// Initialize Leaflet.js map (https://leafletjs.com/)
var map = L.map('map').setView([35.85, -88.39], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialize Leaflet.Maidenhead library (https://gitlab.com/IvanSanchez/leaflet.maidenhead)
// L.maidenhead({
//   precision: 4,
//
//   polygonStyle: {
// 		color: "#ffffff",
// 		weight: .4,
// 		fill: false,
// 		//fillColor: "transparent",
// 		//fillOpacity: 0,
// 	}
//  }).addTo(map);

// Initialize layers to hold grid squares.
 var cqgrids = new L.FeatureGroup();
 var mygrid = new L.FeatureGroup();
 var workinggrid = new L.FeatureGroup();
 cqgrids.addTo(map);
 mygrid.addTo(map);
 workinggrid.addTo(map);

// Draw my grid square on map.
var mygridcoords = L.Maidenhead.indexToBBox(mygridsquare);
L.rectangle([[mygridcoords[0], mygridcoords[1]], [mygridcoords[2], mygridcoords[3]]], {
  name: mygridsquare,
  color: "#0000ff",
  fillOpacity: 0.75,
  stroke: false,
}).addTo(mygrid);

// Receive and draw events.
$(function () {
  var socket = io();
  socket.on('new CQ square', function(msg){

    var coords = L.Maidenhead.indexToBBox(msg);

    L.rectangle([[coords[0], coords[1]], [coords[2], coords[3]]], {
      name: msg,
      color: "#f9f502",
      fillOpacity: 0.75,
      stroke: false,
    }).addTo(cqgrids);
  });
  socket.on('get ham info', function(haminfo) {
    workinggrid.clearLayers();
    var callinggrid = haminfo["hamdb"]["callsign"]["grid"].slice(0,4);
    var callingstation = haminfo["hamdb"]["callsign"]["call"];
    var firstname = haminfo["hamdb"]["callsign"]["fname"].toLowerCase();
    var lastname = haminfo["hamdb"]["callsign"]["name"].toLowerCase();
    var city = haminfo["hamdb"]["callsign"]["addr2"].toLowerCase();

    $("#working-station").html("");
    $("#working-station").append("<h1>"+callingstation+"</h1>\
      <h2>"+callinggrid+"</h2>\
      <p>"+firstname.charAt(0).toUpperCase() + firstname.slice(1)+" "+lastname.charAt(0).toUpperCase() + lastname.slice(1)+"\
      <br>"+city.charAt(0).toUpperCase() + city.slice(1)+", "+haminfo["hamdb"]["callsign"]["state"]+"\
      <br>"+haminfo["hamdb"]["callsign"]["country"]+"</p>\
      <p><a href='https://qrz.com/lookup/"+callingstation+"' target='_blank'>View on QRZ</a></p>");

      $( "#ham-info" ).fadeIn( "slow", function() {});

      var coords = L.Maidenhead.indexToBBox(callinggrid);

      L.rectangle([[coords[0], coords[1]], [coords[2], coords[3]]], {
        name: callinggrid,
        color: "#ff0000",
        fillOpacity: 0.75,
        stroke: false,
      }).addTo(workinggrid);
  });
});

// Remove grids calling CQ every 15 seconds before new grids are decoded.
window.setInterval(function() {
    var date = new Date();
    if(date.getSeconds() === 58 || date.getSeconds() === 13 || date.getSeconds() === 28 || date.getSeconds() === 43) {
        cqgrids.clearLayers();
        //map.removeLayer(cqgrids);
    }
}, 1000); // Repeat every second

window.onload = window.onresize = function () {
    var mapcontainer = document.getElementById("map");
    var height = window.innerHeight;
    mapcontainer.style.height = height + "px";
}

$( "#close a" ).click(function() {
  workinggrid.clearLayers();
  $( "#ham-info" ).fadeOut( "fast", function() {
    // Animation complete.
  });
});

// 191124_165730    14.074 Tx FT8      0  0.0 1711 K7IE K4HCK EM65
// 191124_165945    14.074 Tx FT8      0  0.0 1271 W1AVK K4HCK R-16
// 191124_170000    14.074 Rx FT8    -15 -0.1 1270 K4HCK W1AVK RRR
// 191124_170015    14.074 Tx FT8      0  0.0 1271 W1AVK K4HCK 73

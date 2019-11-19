
// Initialize Leaflet.js map (https://leafletjs.com/)
var map = L.map('map').setView([35.85, -88.39], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialize Leaflet.Maidenhead library (https://gitlab.com/IvanSanchez/leaflet.maidenhead)
L.maidenhead({
  precision: 4,

  polygonStyle: {
		color: "#ffffff",
		weight: .4,
		fill: true,
		fillColor: "transparent",
		fillOpacity: 0,
	}
 }).addTo(map);

// Initialize layer to hold grids calling CQ
 var cqgrids = new L.FeatureGroup();
 cqgrids.addTo(map);

// Push grids to the page
$(function () {
  var socket = io();
  socket.on('new grid square', function(msg){

    var coords = L.Maidenhead.indexToBBox(msg);

    L.rectangle([[coords[0], coords[1]], [coords[2], coords[3]]], {
      name: msg,
      color: "#f9f502",
      fillOpacity: 0.75,
      stroke: false,
    }).addTo(cqgrids);
  });
});

// Remove grids calling CQ every 15 seconds before new grids are decoded.
window.setInterval(function() {
    var date = new Date();
    if(date.getSeconds() === 58 || date.getSeconds() === 13 || date.getSeconds() === 28 || date.getSeconds() === 43) {
        cqgrids.clearLayers();
    }
}, 1000); // Repeat every second

window.onload = window.onresize = function () {
    var mapcontainer = document.getElementById("map");
    var height = window.innerHeight;
    mapcontainer.style.height = height + "px";
}

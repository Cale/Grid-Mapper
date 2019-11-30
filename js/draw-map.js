var mycallsign = "K4HCK";
var mygridsquare = "EM65";

// Initialize Leaflet.js map (https://leafletjs.com/)
var map = L.map('map', {zoomControl: false}).setView([35.85, -88.39], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.control.zoom({
     position:'topright'
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

// // Draw my grid square on map.
// var mygridcoords = L.Maidenhead.indexToBBox(mygridsquare);
// L.rectangle([[mygridcoords[0], mygridcoords[1]], [mygridcoords[2], mygridcoords[3]]], {
//   name: mygridsquare,
//   color: "#0000ff",
//   fillOpacity: 0.75,
//   stroke: false,
// }).addTo(mygrid);

// Remove grids calling CQ every 15 seconds before new grids are decoded.
window.setInterval(function() {
    var date = new Date();
    if(date.getSeconds() === 58 || date.getSeconds() === 13 || date.getSeconds() === 28 || date.getSeconds() === 43) {
        cqgrids.clearLayers();
        //map.removeLayer(cqgrids);
    }
}, 1000); // Repeat every second

window.onload = window.onresize = function () {
    var height = window.innerHeight;
    document.getElementById("map").style.height = height + "px";
    document.getElementById("ham-info").style.height = height + "px";
}

$( "#close a" ).click(function() {
  workinggrid.clearLayers();
  $( "#ham-info" ).fadeOut( "fast", function() {
    // Animation complete.
  });
});

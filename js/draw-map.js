var mycallsign = "K4HCK";
var mygridsquare = "EM65";

// Initialize Leaflet.js map (https://leafletjs.com/)
var map = L.map('map', {zoomControl: false}).setView([35.85, -88.39], 4);

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
 var workedgrids = new L.FeatureGroup();
 cqgrids.addTo(map);
 mygrid.addTo(map);
 workinggrid.addTo(map);
 workedgrids.addTo(map);

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent('<div class="gridpopup">' + L.Maidenhead.latLngToIndex(e.latlng["lat"], e.latlng["lng"], 4) + '</div>')
        .openOn(map);
}

map.on('click', onMapClick);

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

$( ".close" ).click(function() {
  workinggrid.clearLayers();
  $( "#ham-info" ).fadeOut( "fast", function() {
    // Animation complete.
  });
});

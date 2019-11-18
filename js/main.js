
// Initialize Leaflet.js map (https://leafletjs.com/)
var map = L.map('map').setView([35.85, -88.39], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// L.marker([51.5, -0.09]).addTo(map)
//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//     .openPopup();

// Initialize Leaflet.Maidenhead library (https://gitlab.com/IvanSanchez/leaflet.maidenhead)
L.maidenhead({
  precision: 4,

  polygonStyle: {
		color: "#444444",
		weight: 0.25,
		fill: true,
		fillColor: "transparent",
		fillOpacity: 0,
	}
 }).addTo(map);



 L.rectangle([[52, -8], [53, -6]], {
   color: "red",
 }).addTo(map);

// Push grids to the page
$(function () {
  var socket = io();
  // $('form').submit(function(e){
  //   e.preventDefault(); // prevents page reloading
  //   socket.emit('chat message', $('#m').val());
  //   $('#m').val('');
  //   return false;
  // });
  socket.on('new grid square', function(msg){
    $('#raw-data').append($('<li>').text(msg));

    var coords = L.Maidenhead.indexToBBox(msg);

    L.rectangle([[coords[0], coords[1]], [coords[2], coords[3]]], {
      color: "red",
    }).addTo(map);
  });
});

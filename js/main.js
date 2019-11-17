
// Initialize map
var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();

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
  });
});

var locations = [
   {lat: 33.658676, lng: -117.865189},
   {lat: 33.631679, lng: -117.797173},
   {lat: 33.676562, lng: -117.743917},
   {lat: 33.652574, lng: -117.821889},
   {lat: 33.658618, lng: -117.851987},
   {lat: 33.631646, lng: -117.757172},
   {lat: 33.676577, lng: -117.768121},
   {lat: 33.652598, lng: -117.859182}
];

var markers = [];
var map;

function initMap() {
   map = new google.maps.Map(document.getElementById("map"), {
       zoom: 11,
       center: {lat: 33.645072, lng: -117.835021}
   });


   infoWindow = new google.maps.InfoWindow;

   if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(function(position) {
           var pos = {
               lat: position.coords.latitude,
               lng: position.coords.longitude
           };

           infoWindow.setPosition(pos);
           infoWindow.setContent('Your Location');
           infoWindow.open(map);
           map.setCenter(pos);
           drop();
       }, function() {
           handleLocationError(true, infoWindow, map.getCenter());
       });
   } else {
       // Browser doesn’t support Geolocation
       handleLocationError(false, infoWindow, map.getCenter());
   }
   // var eventlatLng;
   google.maps.event.addListener(map, "click", function(event) {

       //    if(event.latLng)    {
       //      eventlatLng = event.latLng;
       //     $(‘#dialog’).html(‘Add marker ?’);

       //  }


       $('.close').click(function () {
           $('#post').modal();

       });
       // write create model from scratch
       // make text button in the header nav bar to show
       //then valiadate submit
       //use z-index above map
       //show and hide method based on click
       //
       placeMarker(event.latLng);

   });

   function placeMarker(position) {
       var marker = new google.maps.Marker({
           position: position,
           map: map,
           icon: image
       });
   }


}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
   infoWindow.setPosition(pos);
   infoWindow.setContent(browserHasGeolocation ?
       "Error: The Geolocation service failed." :
       "Error: Your browser doesn\‘t support geolocation.");
   infoWindow.open(map);
}

function drop() {
   clearMarkers();
   for (var i = 0; i < locations.length; i++) {
       addMarkerWithTimeout(locations[i], i * 100);
       var markers = locations.map(function (position) {
           return new google.maps.Marker({
               position: position,
               map: map,
               icon: image

           });
       });

       // Add a marker clusterer to manage the markers.
       var markerCluster = new MarkerClusterer(map, markers,
           { imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m" });

   }
}

var image = "../img/markerU.png";

function addMarkerWithTimeout(position, timeout) {
   window.setTimeout(function() {
       markers.push(new google.maps.Marker({
           position: position,
           map: map,
           animation: google.maps.Animation.DROP,
           icon: image
       }));
   }, timeout);
}

var infoWindow = new google.maps.InfoWindow({
   content: "<h2> User Post </h2>"
});
markers.addListener("click", function () {
   infoWindow.open(map, markers)

});

function clearMarkers() {
   for (var i = 0; i < markers.length; i++) {
       markers[i].setMap(null);
   }
   markers = [];
}

function addMarker(cords) {

}
// Make sure we wait to attach our handlers until the DOM is fully loaded.
// $(function() {
var locations = [
  { lat: 33.658676, lng: -117.865189 },
  { lat: 33.631679, lng: -117.797173 },
  { lat: 33.676562, lng: -117.743917 },
  { lat: 33.652574, lng: -117.821889 },
  { lat: 33.658618, lng: -117.851987 },
  { lat: 33.631646, lng: -117.757172 },
  { lat: 33.676577, lng: -117.768121 },
  { lat: 33.652598, lng: -117.859182 }
];

var markers = [];
var map;
var image = "/assets/img/markerU.png";

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
    center: { lat: 33.645072, lng: -117.835021 }
  });
  console.log("inside initmap");

  infoWindow = new google.maps.InfoWindow();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent("Your Location");
        infoWindow.open(map);
        map.setCenter(pos);
        drop();
      },
      function() {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation or user doesn't accept / deny location
    handleLocationError(false, infoWindow, map.getCenter());
  }
  // var eventlatLng;
  google.maps.event.addListener(map, "click", function(event) {
    addModal();
    // if()
    placeMarker(event.latLng);
  });

  function placeMarker(location) {
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      icon: image
    });
    locations.push(marker);
    marker.addListener("click", addModal);
  }

  function addModal() {
    $("#create").modal("show");
    if ($("#submitExpression") === false) {
    }
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

function drop() {
  clearMarkers();
  for (var i = 0; i < locations.length; i++) {
    addMarkerWithTimeout(locations[i], i * 100);
    var markers = locations.map(function(position) {
      return new google.maps.Marker({
        position: position,
        map: map,
        icon: image
      });
    });

    // Add a marker clusterer to manage the markers.
    var markerCluster = new MarkerClusterer(map, markers, {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
    });
  }
}

function addMarkerWithTimeout(position, timeout) {
  window.setTimeout(function() {
    markers.push(
      new google.maps.Marker({
        position: position,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: image
      })
    );
  }, timeout);
}

// var infoWindow = new google.maps.InfoWindow({
//    content: '<h2> User Post </h2>'
// });
// markers.addListener('click', function () {
//   infoWindow.open(map, markers)

//});

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function addMarker(cords) {}

$("#view").on("show.bs.modal", function() {
  //Send the POST request.
  $.ajax("/api/expression", {
    type: "GET"
  }).then(function(data, status) {
    console.log("got all expression");
    console.log(data);
    console.log(status);
    // $(".identicon").attr("src", "data:image/png;base64," + data.indenticon);
    // $("#username-create").html(data.id);
    // $("#pin-create").html(data.pin);
    // $("#expression").val("just let yourself go!");
  });
});

$("#create").on("show.bs.modal", function() {
  //Send the POST request.
  $.ajax("/api/user", {
    type: "POST"
  }).then(function(data, status) {
    console.log("created new user");
    console.log(data);
    console.log(status);
    $(".identicon").attr("src", "data:image/png;base64," + data.indenticon);
    $("#username-create").html(data.id);
    $("#pin-create").html(data.pin);
    $("#expression").val("just let yourself go!");
  });
});

$(".create-form").on("submit", function(event) {
  // Make sure to preventDefault on a submit event.
  event.preventDefault();

  var newMessage = {
    msg: $("#expression")
      .val()
      .trim()
  };

  var username = $("#username-create").text();

  var lat = getRandomInRange(-180, 180, 6);
  var lng = getRandomInRange(-180, 180, 6);

  // Send the POST request.
  $.ajax("/api/expression", {
    type: "POST",
    data: {
      message: newMessage.msg,
      lat: lat,
      lng: lng,
      userId: username
    }
  }).then(function() {
    console.log("created new expression");
    // Reload the page to get the updated list
    // location.reload();
  });
});

function getRandomInRange(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
  // .toFixed() returns string, so ' * 1' is a trick to convert to number
}
// });

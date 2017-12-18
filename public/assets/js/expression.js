// Make sure we wait to attach our handlers until the DOM is fully loaded.
// $(function() {

//array to store marker locations, needs to be global
var markers = [];
//google map object, needs to be global
var map;
//lat of clicked marker, needs to be global
var clickedLat;
//lng of clicked marker, needs to be global
var clickedLng;

//initilize google map display on page
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
    center: {
      lat: 33.645072,
      lng: -117.835021
    }
  });

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

        //call function to display markers on the map
        displayMarkers();
      },
      function() {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation or user doesn't accept / deny location
    handleLocationError(false, infoWindow, map.getCenter());
  }

  //add click event to map, call function to add a new expression
  google.maps.event.addListener(map, "click", function(e) {
    console.log("Inside Add Marker Click Event!");
    clickedLat = e.latLng.lat();
    clickedLng = e.latLng.lng();
    // console.log(clickedLat.toFixed(6));
    // console.log(clickedLng.toFixed(6));
    viewCreateExpressionModal();
  });

  //add event to redraw the markers on the map when map is dragged
  map.addListener("dragend", function() {
    console.log("Map Bounds Changed! (Dragged)");
    displayMarkers();
  });

  //add event to redraw the markers on the map when map is zommed
  map.addListener("zoom_changed", function() {
    console.log("Map Bounds Changed! (Zoom)");
    displayMarkers();
  });
}

function viewCreateExpressionModal() {
  $("#create").modal("show");
}

function closeCreateExpressionModal() {
  $("#create").modal("hide");
}

function viewExpressionModal() {
  $("#view").modal("show");
}

function closeExpressionModal() {
  $("#view").modal("hide");
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

//function to get markers within current viewport from the database and display them on the map
function displayMarkers() {
  //clear current markers in viewport
  clearMarkers();

  var bounds = map.getBounds();
  console.log(bounds);
  var NECorner = bounds.getNorthEast();
  var SWCorner = bounds.getSouthWest();
  var latNE = NECorner.lat();
  var lngNE = NECorner.lng();
  var latSW = SWCorner.lat();
  var lngSW = SWCorner.lng();

  //get the expressions to display on screen
  $.ajax("/api/expression/" + latNE + "/" + lngNE + "/" + latSW + "/" + lngSW, {
    type: "GET"
  }).then(function(data, status) {
    console.log("got all expressions in view");

    //setup for loop to run through the results
    for (var i = 0; i < data.length; i++) {
      //convert lat/long into google format
      var myLatLng = new google.maps.LatLng(
        parseFloat(data[i].lat),
        parseFloat(data[i].lng)
      );

      //setup a new marker with the lat/long
      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: "/assets/img/markerU.png"
      });

      //add the click event to the marker
      marker.addListener("click", function() {
        console.log("Marker Clicked!");
        // console.log(this);
        clickedLat = this.position.lat();
        clickedLng = this.position.lng();
        // console.log(clickedLat.toFixed(6));
        // console.log(clickedLng.toFixed(6));
        viewExpressionModal();
      });

      //push the marker onto the array, rinse, repeat
      markers.push(marker);
    }
    // console.log(markers);
  });

  // Add a marker clusterer to manage the markers.
  // var markerCluster = new MarkerClusterer(map, markers, {
  //   imagePath:
  //     "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
  // });
}

//remove markers from current map display
function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

//run this function when the view expression modal is opened
$("#view").on("show.bs.modal", function() {
  // console.log(clickedLat);
  // console.log(clickedLng);
  //Send the POST request.
  $.ajax(
    "/api/expression/" + clickedLat.toFixed(6) + "/" + clickedLng.toFixed(6),
    {
      type: "GET"
    }
  ).then(function(data, status) {
    console.log("got expression for this location");
    // console.log(data);
    // console.log(status);

    var expressionHTML = "";

    for (i = 0; i < data.length; i++) {
      var displayTime = moment
        .utc(data[i].createdAt)
        .local()
        .format("MM/DD/YYYY, h:mm a");
      // console.log(displayTime);

      expressionHTML +=
        "<div class='row'><div class='col-sm-8'><div class='timestamp'>" +
        displayTime +
        "</div></div><div class='col-sm-4'><div class='userTag'><div class='PIN'>" +
        data[i].UserId +
        "</div><div class='PIN-label'>UN:</div><img class='identicon' src='data:image/png;base64," +
        data[i].indenticon +
        "'></div></div></div><div class='row'><div class='col-lg-12'><hr><p>" +
        data[i].message +
        "</p><p><br /></p><p><button type='button' class='btn btn-info' data-dismiss='modal' data-toggle='modal' data-target='#reply'>dm user</button></p></div></div>";
    }

    $("#expression-view").html(expressionHTML);
  });
});

//run this function when the create expression modal is opened
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
    $("#expression-create").val("just let yourself go!");
  });
});

$(".create-form").on("submit", function(event) {
  // Make sure to preventDefault on a submit event.
  event.preventDefault();

  var newMessage = {
    msg: $("#expression-create")
      .val()
      .trim()
  };

  var username = $("#username-create").text();

  // Send the POST request.
  $.ajax("/api/expression", {
    type: "POST",
    data: {
      message: newMessage.msg,
      lat: clickedLat,
      lng: clickedLng,
      userId: username
    }
  }).then(function() {
    console.log("created new expression");
    // reload the markers on the map
    displayMarkers();
    //close the modal
    closeCreateExpressionModal();
  });
});

// });

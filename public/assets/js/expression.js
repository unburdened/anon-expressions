// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
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
});

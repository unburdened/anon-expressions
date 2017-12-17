// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory
app.use(express.static("public"));

// Routes
// =============================================================
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: false }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  // seedDatabase();
});

function seedDatabase() {
  //seed the database w/ 1000 entries
  const dwGen = require("diceware-generator");
  const enEFF = require("diceware-wordlist-en-eff");
  const dwOptions = { language: enEFF, wordcount: 3, format: "string" };
  const loremIpsum = require("lorem-ipsum");

  for (i = 0; i <= 1000; i++) {
    const tmp = dwGen(dwOptions);
    const username = tmp.replace(/\s+/g, "-");
    const pin = Math.floor(Math.random() * 8999) + 1000;
    db.User.create({ id: username, pin: pin }).then(function(dbExp) {
      const lat = Math.floor(Math.random() * 999999) / 1000000 + 33;
      // console.log(lat);
      const lng = Math.floor(Math.random() * 999999) / 1000000 - 118;
      // console.log(lng);
      const newMessage = loremIpsum({
        count: 1,
        units: "sentences"
      });
      // console.log(newMessage);
      db.Expression.create({
        message: newMessage,
        lat: lat,
        lng: lng,
        UserId: username
      });
    });
  }
}

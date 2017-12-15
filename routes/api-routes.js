// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const dwGen = require("diceware-generator");
const enEFF = require("diceware-wordlist-en-eff");
const hasha = require("hasha");
const Identicon = require("identicon.js");

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {
  // GET route for retrieving all of the expressions
  app.get("/api/expression", function(req, res) {
    db.Expression.findAll({}).then(function(dbExp) {
      res.json(dbExp);
    });
  });

  // GET rotue for retrieving expressions in current map view
  app.get("/api/expression/:latNW/:lngNW/:latSE/:lngSE", function(req, res) {
    db.Expression.findAll({
      where: {
        lat: { [Op.between]: [req.params.latSE, req.params.latNW] },
        lng: { [Op.between]: [req.params.lngNW, req.params.lngSE] }
      }
    }).then(function(dbExp) {
      res.json(dbExp);
    });
  });

  // POST route for generating a new user
  app.post("/api/user", function(req, res) {
    const dwOptions = {
      language: enEFF,
      wordcount: 3,
      format: "string"
    };

    const tmp = dwGen(dwOptions);
    const username = tmp.replace(/\s+/g, "-");
    console.log(tmp);

    var pin = Math.floor(Math.random() * 8999) + 1000;

    const hash = hasha(username, { algorithm: "md5" });
    console.log(hash);

    var r = Math.floor(Math.random() * 254) + 1;
    var g = Math.floor(Math.random() * 254) + 1;
    var b = Math.floor(Math.random() * 254) + 1;

    var identOptions = {
      foreground: [r, g, b, 255], // rgba black
      background: [255, 255, 255, 255], // rgba white
      margin: 0.1, // 10% margin
      size: 24, // 24px square
      format: "png" // use PNG
    };

    var newProperty = "indenticon";
    var newIdenticon = new Identicon(hash, identOptions).toString();
    // console.log(data);

    db.User.create({
      id: username,
      pin: pin
    }).then(function(dbExp) {
      dbExp.dataValues[newProperty] = newIdenticon;
      console.log(dbExp);
      res.json(dbExp);
    });
  });

  // POST route for creating a new expression
  app.post("/api/expression", function(req, res) {
    console.log(req);
    db.Expression.create({
      message: req.body.message,
      lat: req.body.lat,
      lng: req.body.lng,
      UserId: req.body.userId
    }).then(function(dbExp) {
      res.json(dbExp);
    });
  });

  // DELETE route for deleting posts
  app.delete("/api/epxression/:uuid", function(req, res) {
    db.Expression.destroy({
      where: {
        uuid: req.params.uuid
      }
    }).then(function(dbExp) {
      res.json(dbExp);
    });
  });

  // PUT route for updating posts
  app.put("/api/expression", function(req, res) {
    db.Expression.update(req.body, {
      where: {
        uuid: req.body.uuid
      }
    }).then(function(dbExp) {
      res.json(dbExp);
    });
  });
};

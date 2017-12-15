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
  app.get("/api/expression/:latNW/:longNW/:latSE/:longSE", function(req, res) {
    db.Expression.findAll({
      where: {
        lat: { [Op.between]: [req.params.latSE, req.params.latNW] },
        long: { [Op.between]: [req.params.longNW, req.params.longSE] }
      }
    }).then(function(dbExp) {
      res.json(dbExp);
    });
  });

  // POST route for creating a new expression
  app.post("/api/expression", function(req, res) {
    const dwOptions = {
      language: enEFF,
      wordcount: 3,
      format: "string"
    };

    const tmp = dwGen(dwOptions);
    const username = tmp.replace(/\s+/g, "-");
    console.log(tmp);

    var pin = Math.floor(Math.random() * 9998) + 1;

    db.User.create({
      id: username,
      pin: pin
    }).then(function() {
      db.Expression.create({
        message: req.body.message,
        lat: req.body.lat,
        long: req.body.long,
        UserId: username
      }).then(function(dbExp) {
        res.json(dbExp);
      });
    });

    // const hash = hasha(username, { algorithm: "md5" });
    // console.log(hash);

    // var options2 = {
    //   foreground: [0, 0, 0, 255], // rgba black
    //   background: [255, 255, 255, 255], // rgba white
    //   margin: 0.1, // 10% margin
    //   size: 24, // 420px square
    //   format: "png" // use SVG instead of PNG
    // };

    // // create a base64 encoded SVG
    // var data = new Identicon(hash, options2).toString();
    // console.log(data);

    // db.Post.create(req.body).then(function(dbPost) {
    //   res.json(dbPost);
  });
  // });

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

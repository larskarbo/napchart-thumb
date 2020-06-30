var Napchart = require("napchart");
var Parse = require("parse/node");
// const { createCanvas, registerFont } = require('canvas')

Parse.initialize(
  "osxjLrTMW7cJ6r6IPOpDYXyuBzBRSzQTaNeza7O6",
  "rijTlVRNfqPPV2X9MLnRAP1UDzQbz7UTRjfCOaQ6"
);
Parse.serverURL = 'https://pg-app-57gagyy9xq3pta5kvgpzs2dh6gv7w5.scalabl.cloud/1/';
// Parse.initialize("napchart");
// Parse.serverURL = "http://localhost:1337/1/";

// var Canvas = require("canvas"),
//   Image = Canvas.Image,
//   canvas = new Canvas(200, 200),
//   ctx = canvas.getContext("2d");

const { createCanvas, loadImage } = require("canvas");

module.exports = function(req, res) {
  var chartid = req.query.chartid;
  var width = req.query.width * 1; // * 1 to ensure they are numbers not strings
  var height = req.query.height * 1;
  var shape = req.query.shape;

  if (
    typeof chartid == "undefined" ||
    typeof width == "undefined" ||
    typeof height == "undefined"
  ) {
    return res.send("Invalid request");
  }

  // registerFont('server/Consolas.ttf', {family: 'Consolas'})
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const Chart = Parse.Object.extend("Chart");
  const query = new Parse.Query(Chart);
  query.equalTo("chartid", chartid);
  query
    .find()
    .then(results => {
      console.log("results: ", results);
      const chart = results[0];
      console.log();
      const data = {
        id: chartid,
        metaInfo: {
          title: chart.get("title"),
          description: chart.get("description")
        },
        ...chart.get("chartData"),
      };

      if (typeof shape != "undefined") {
        data.shape = shape
      }



      var mynapchart = Napchart.init(ctx, data, {
        interaction: false,
        font: "Consolas",
        background: "white",
        baseFontSize: "noscale:1.5"
      });

      canvas.pngStream().pipe(res);
    })
    .catch(err => {
      console.log('err: ', err);
      return res.status(404).send("404");
    });
};

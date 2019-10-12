var database = require("./database/database");
var Napchart = require("napchart");
var Parse = require("parse/node");
// const { createCanvas, registerFont } = require('canvas')

Parse.initialize(
  "OSJ8w3oiFSPTFTuY3f6E6C70TMiHJNVOCLQErM67",
  "qbv0Wqk2htSWiJRZiZy42MHaJMCCSTLhMrSiHQQ7"
);
Parse.serverURL =
  "https://pg-app-ceeyhg3pmff1ff3x1wu4dzhxfddts7.scalabl.cloud/1/";

var Canvas = require("canvas"),
  Image = Canvas.Image,
  canvas = new Canvas(200, 200),
  ctx = canvas.getContext("2d");

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

  var canvas = new Canvas(width, height); //createCanvas(width, height)
  var ctx = canvas.getContext("2d");

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
        ...chart.get("chartData")
      };

      if (typeof shape == "undefined") {
        shape = chart.chartData.shape;
      }

      var chartData = {
        elements: chart.chartData.elements,
        colorTags: chart.chartData.colorTags,
        lanes: chart.chartData.lanes,
        shape
      };

      var mynapchart = Napchart.init(ctx, chartData, {
        interaction: false,
        font: "Consolas",
        background: "white",
        baseFontSize: "noscale:1.5"
      });

      canvas.pngStream().pipe(res);
    })
    .catch(err => {
      return res.status(404).send("404");
    });

};

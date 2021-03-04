var Napchart = require("napchart");


const { createCanvas, loadImage } = require("canvas");
const { request } = require("./request");

module.exports = async function(req, res) {
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

  const data = await request("GET", "/getChart/" + chartid)
  

  if (typeof shape != "undefined") {
    data.chartData.shape = shape
  }

  var mynapchart = Napchart.init(ctx, data.chartData, {
    interaction: false,
    font: "Consolas",
    background: "white",
    baseFontSize: "noscale:1.5"
  });

  canvas.pngStream().pipe(res);
};

var Napchart = require("napchart");

var firebase = require("firebase/app");

const { createCanvas, loadImage } = require("canvas");

module.exports = async function(req, res) {
  var db = firebase.firestore();
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

  const data = await db
  .collection('charts')
  .doc(chartid)
  .get()
  .then((snapshot) => {
    const result = snapshot.data()
    if (result === undefined) {
      console.log('Chart with ID ' + chartid + ' not found.')
      return
    }
    return result
  })

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
};

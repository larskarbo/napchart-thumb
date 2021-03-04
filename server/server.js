var express = require("express");
var app = express();
var path = require("path");
var getImage = require("./getImage");

var bodyParser = require("body-parser");

const { request } = require("./request");


app.use(bodyParser.json());
app.get("/api/getImage", getImage);

app.post("/api/create", async function (req, res) {
  console.log(req.body.data);
  var data = JSON.parse(req.body.data);

  request('POST', '/createChart', {
    chartData: data.chartData,
    title: data.metaInfo.title,
    description: data.metaInfo.description,
  })
    .then((result) => {
      console.log('res: ', res)
      const { chartid } = result
      
      res.send({ chartid });
      console.log("chartid: ", chartid);
    })
    .catch((err) => {
      console.error("things didn't work... " + err)
      res.send(500)
    })
});

app.get("/api/get", async function (req, res) {
  var chartid = req.query.chartid;

  request("GET", "/getChart/" + chartid).then((result) => {
    console.log('res: ', result);
    if (result === undefined) {
      res.status(404).send("Chart with ID " + chartid + " not found.");
      return;
    }
    // want it to be the same as previous version
    res.send({
      chartData: result.chartData,
      chartid: chartid,
      title: result.title,
      description: result.description,
    });
  });
});

var port = process.env.PORT || 1771;

app.listen(port, "0.0.0.0", function () {
  console.log(`listening at ${port}`);
});

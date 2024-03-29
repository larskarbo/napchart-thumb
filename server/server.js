var express = require("express");
var app = express();
var path = require("path");
var getImage = require("./getImage");

var bodyParser = require("body-parser");

const { request } = require("./request");


app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)
app.get("/api/getImage", getImage);

app.post("/alt/api/create", async function (req, res) {
  var data = req.body

  request('POST', '/createSnapshot', {
    chartData: data.chartData,
    title: data.metaInfo.title,
    description: data.metaInfo.description,
    api_flag_user: "thumbbot"
  })
    .then((result) => {
      console.log('res: ', res)
      const { chartid } = result
      
      res.send({ chartid });
      console.log("chartid: ", chartid);
    })
    .catch((err) => {
      console.error("things didn't work... " + err)
      if(err.response){
        return res.send(err.response.status, err.message)
      }
      res.send(500)
    })
});

app.post("/api/create", async function (req, res) {
  console.log('req.body: ', req.body);
  console.log(req.body.data);
  var data = JSON.parse(req.body.data);

  request('POST', '/createChart', {
    chartData: data.chartData,
    title: data.metaInfo.title,
    description: data.metaInfo.description,
    api_flag_user: "thumbbot"
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

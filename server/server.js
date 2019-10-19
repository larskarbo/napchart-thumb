var express = require("express");
var app = express();
var path = require("path");
var getImage = require("./getImage");

var bodyParser = require("body-parser");
var Parse = require("parse/node");
Parse.initialize(
  "osxjLrTMW7cJ6r6IPOpDYXyuBzBRSzQTaNeza7O6",
  "rijTlVRNfqPPV2X9MLnRAP1UDzQbz7UTRjfCOaQ6"
);
Parse.serverURL =
  "https://pg-app-57gagyy9xq3pta5kvgpzs2dh6gv7w5.scalabl.cloud/1/";
app.use(bodyParser.json());
app.get("/api/getImage", getImage);

app.post("/api/create", function(req, res) {
  var data = JSON.parse(req.body.data);

  const results = Parse.Cloud.run("createChart", data).then(response => {
    res.send(response);
  });
});

app.get("/api/get", function(req, res) {
  var chartid = req.query.chartid;

  const Chart = Parse.Object.extend("Chart");
  const query = new Parse.Query(Chart);
  query.equalTo("chartid", chartid);
  query.find().then(results => {
    console.log("results: ", results);
    const chart = results[0];
    res.send(results[0]);
  });
});

var port = process.env.PORT || 1771;

app.listen(port, "0.0.0.0", function() {
  console.log(`listening at ${port}`);
});

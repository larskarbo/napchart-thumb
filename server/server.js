var express = require("express");
var app = express();
var path = require("path");
var getImage = require("./getImage");

var bodyParser = require("body-parser");

var firebase = require("firebase/app");

// Add the Firebase products that you want to use
// require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDZIH0Vogv07ZWCUMwPn1gaBaF_6rAP_zg",
  authDomain: "napchart-1abe4.firebaseapp.com",
  databaseURL: "https://napchart-1abe4.firebaseio.com",
  projectId: "napchart-1abe4",
  storageBucket: "napchart-1abe4.appspot.com",
  messagingSenderId: "747326670843",
  appId: "1:747326670843:web:39891acdbdf5df1cd8ed5e",
  measurementId: "G-NP62410MLV",
};
firebase.initializeApp(firebaseConfig);

app.use(bodyParser.json());
app.get("/api/getImage", getImage);

app.post("/api/create", async function (req, res) {
  console.log(req.body.data);
  var db = firebase.firestore();
  var data = JSON.parse(req.body.data);
  console.log('data: ', data);

  const dataForServer = {
    ...data.chartData,
    ...data.metaInfo
  }

  const generateRandomId = () => {
    const alphabet = 'abcdefghijklmnopqrstuwxyz0123456789'
    let id = ''
    for (var i = 0; i < 5; i++) {
      id += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
    }
    return id
  }
  
  const isIdAlreadyTaken = (id) => {
    return db
      .collection('charts')
      .doc(id)
      .get()
      .then((doc) => {
        return doc.exists
      })
  }

  const getUniqueChartId = async () => {
    let id = generateRandomId()
    while (await isIdAlreadyTaken(id)) {
      id = generateRandomId()
    }
    return id
  }

  getUniqueChartId().then((chartid) => {
    console.error('generated unique id')
    console.error(chartid)
    return db
      .collection('charts')
      .doc(chartid)
      .set(dataForServer)
      .then((docRef) => {
        
        res.send(chartid)
        console.log('chartid: ', chartid);
      })


  })

  console.log('chartid: ', chartid);


});

app.get("/api/get", async function (req, res) {
  var chartid = req.query.chartid;
  var db = firebase.firestore();

  const data = await db
    .collection("charts")
    .doc(chartid)
    .get()
    .then((snapshot) => {
      const result = snapshot.data();
      if (result === undefined) {
        res.status(404).send("Chart with ID " + chartid + " not found.");
        return;
      }
      // want it to be the same as previous version
      res.send({
        chartData: {
          elements: result.elements,
          colorTags: result.colorTags,
          shape: result.shape,
          lanes: result.lanes,
          lanesConfig: result.lanesConfig,
        },
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

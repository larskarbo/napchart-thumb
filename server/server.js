var express = require('express')
var app = express()
var path = require('path')
var getImage = require('./getImage')
// ENVIRONMENTAL:
require('dotenv').config()
process.env.URL = process.env.URL || 'https://napchart.com/'


app.get('/api/getImage', api.getImage)

var port = process.env.PORT || 8080

app.listen(port, "0.0.0.0", function () {
  console.log(`listening at ${port}`)
})
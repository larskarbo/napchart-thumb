var express = require('express')
var app = express()
var path = require('path')
var getImage = require('./getImage')
// ENVIRONMENTAL:


app.get('/api/getImage', getImage)

var port = process.env.PORT || 1771

app.listen(port, "0.0.0.0", function () {
  console.log(`listening at ${port}`)
})
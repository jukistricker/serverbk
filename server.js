global.reqlib = require('app-root-path').require
require('dotenv').config()
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var cors = require('cors')
const multer = require('multer');

var app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(multer().any())

app.use(cookieParser());
app.use('/api', require('./controllers')())

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

console.log("hehe",process.env.PORT); // => 3000

const http = require('http');
const https = require('https');
const url = require('url');


const SELF_PING_URL = process.env.SELF_PING_URL || `http://localhost:${port}/api/ping`;

setInterval(() => {
  console.log("⏰ Self-pinging...", SELF_PING_URL);

  try {
    const parsedUrl = url.parse(SELF_PING_URL);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    client.get(SELF_PING_URL, (res) => {
      console.log(`✅ Self-ping response: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error("❌ Self-ping failed:", err.message);
    });

  } catch (error) {
    console.error("❌ Ping setup error:", error.message);
  }

}, 10 * 60 * 1000);  // Ping mỗi 10 phút


module.exports = app;

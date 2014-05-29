var express = require("express");
var logfmt = require("logfmt");
var fs = require('fs');
var index = fs.readFileSync('Framework/index.html');
var app = express();
app.use(express.static('Framework'));
app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
    res.end(index);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});
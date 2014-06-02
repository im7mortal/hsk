"use strict";
var express = require("express");
var logfmt = require("logfmt");
var fs = require('fs');
var pg = require('pg');
var index = fs.readFileSync('Framework/index.html');
var app = express();
app.use(express.static('Framework'));
app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
    res.end(index);
});
app.get('/lol', function(req, res) {
    console.log(req);
    setTimeout(function(){}, 5000);
    res.end('Ваш голос принят: ' + new Date());
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});

//var pg = require('pg');
//
//pg.connect(process.env.DATABASE_URL, function(err, client) {
//    var query = client.query('SELECT * FROM your_table');
//
//    query.on('row', function(row) {
//        console.log(JSON.stringify(row));
//    });
//});
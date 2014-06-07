"use strict";
var express = require("express");
var logfmt = require("logfmt");
var fs = require('fs');
var index = fs.readFileSync('Framework/index.html');
var app = express();
var url = require('url');




app.use(express.static('Framework'));
app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
    res.end(index);
});
app.get('/vote', function(req, res) {
//    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    var url_parts = url.parse(req.url, true);

    insertRating(url_parts.query.name);
    var lite = selectRating();
    res.end(lite);
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});


var pg = require("pg");

var conString = "postgres://kyhetrqttjglpi:949BScb2C_YjRZKFH2eA5ngz7-@ec2-54-235-245-180.compute-1.amazonaws.com:5432/d3i4729gmg7s1o";

var client = new pg.Client(conString);
client.connect();

client.query("CREATE TABLE IF NOT EXISTS tryhsk(rating string)");
function insertRating(value) {
    client.query("INSERT INTO tryhsk(rating) values($1)", [value]);
}
function selectRating() {
    return client.query("SELECT rating FROM tryhsk");
}
//// client.query("INSERT INTO emps(firstname, lastname) values($1, $2)", ['Ronald', 'McDonald']);
//// client.query("INSERT INTO emps(firstname, lastname) values($1, $2)", ['Mayor', 'McCheese']);
//
//var query = client.query("SELECT firstname, lastname FROM emps ORDER BY lastname, firstname");
//query.on("row", function (row, result) {
//    result.addRow(row);
//});
//query.on("end", function (result) {
//    console.log(JSON.stringify(result.rows, null, "    "));
//    client.end();
//});
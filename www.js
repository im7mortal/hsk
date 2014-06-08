"use strict";
var express = require("express")
    , logfmt = require("logfmt")
    , fs = require('fs')
    , pg = require("pg")
    , url = require('url')
    , app = express();

var index = fs.readFileSync('Framework/index.html');
app.use(express.static('Framework'));
app.use(logfmt.requestLogger());
app.get('/', function (req, res) {
    res.end(index);
});


app.get('/vote', function (req, res) {
    var url_parts = url.parse(req.url, true);
    insertRating(url_parts.query.id, url_parts.query.amount, url_parts.query.rights, res);
});

var port = Number(process.env.PORT || 5000);

app.listen(port, function () {
    console.log("Listening on " + port);
});




function insertRating(id, amount, rights, res) {
    var conString = "postgres://kyhetrqttjglpi:949BScb2C_YjRZKFH2eA5ngz7-@ec2-54-235-245-180.compute-1.amazonaws.com:5432/d3i4729gmg7s1o",
        client = new pg.Client(conString);
    client.connect();
    client.query("CREATE TABLE IF NOT EXISTS hsk (id char(64) PRIMARY KEY,amount char(64),rights char(64), date char(64))");
    client.query("UPDATE hsk SET amount=$1, rights=$2 WHERE id=$3 ", [amount, rights, id]);
    var query = client.query({
        text: "SELECT amount FROM hsk WHERE id = $1",
        values: [id]
    });
    query.on('row', function (row) {
        console.log(row.amount);
        res.end(row.amount);
        client.end();
    });
}






//function insertRating(id, amount, rights, res) {
//    var conString = "postgres://sssr:hui@localhost/postgres",
//        client = new pg.Client(conString);
//    client.connect();
//    client.query("CREATE TABLE IF NOT EXISTS hsk (id char(64) PRIMARY KEY,amount char(64),rights char(64), date char(64))");
//    client.query("UPDATE hsk SET amount=$1, rights=$2 WHERE id=$3 ", [amount, rights, id]);
//    var query = client.query({
//        text: "SELECT amount FROM hsk WHERE id = $1",
//        values: [id]
//    });
//    query.on('row', function (row) {
//        console.log(row.amount);
//        res.end(row.amount);
//        client.end();
//    });
//}

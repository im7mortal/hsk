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
//    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    var url_parts = url.parse(req.url, true);
    insertRating(url_parts.query.name, url_parts.query.id);

});
var port = Number(process.env.PORT || 5000);

app.listen(port, function () {
    console.log("Listening on " + port);
});

function insertRating(value, id) {
    var conString = "postgres://sssr:hui@localhost/postgres",
        client = new pg.Client(conString);
    client.connect();
    client.query("INSERT INTO  users (rating, id ) values($1,$2)", [value, id]);
    var query = client.query({
        text: "SELECT rating FROM users where id = $1",
        values: ['700']
    });
    query.on('row', function (row) {
        console.log(row.rating);
        res.end(row.rating);
        console.log(JSON.stringify(row.rows, null, "    "));
        client.end();
    });
}

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
    insertRating(url_parts.query.id, res);
//    insertRating(url_parts.query.id, url_parts.query.amount, url_parts.query.rights, res);







//
//    var conString = "postgres://kyhetrqttjglpi:949BScb2C_YjRZKFH2eA5ngz7-@ec2-54-235-245-180.compute-1.amazonaws.com:5432/d3i4729gmg7s1o";
//        pg.connect(conString, function(err, client, done) {
//
//            var handleError = function(err) {
//                if(!err) return false;
//                done(client);
//                res.writeHead(500, {'content-type': 'text/plain'});
//                res.end('An error occurred');
//                return true;
//            };
//
//            // record the visit
//            client.query('INSERT INTO visit (date) VALUES ($1)', [new Date()], function(err, result) {
//                if(handleError(err)) return;
//
//                // get the total number of visits today (including the current visit)
//                client.query('SELECT COUNT(date) AS count FROM visit', function(err, result) {
//
//                    // handle an error from the query
//                    if(handleError(err)) return;
//
//                    // return the client to the connection pool for other requests to reuse
//                    done();
//                    res.writeHead(200, {'content-type': 'text/plain'});
//                    res.end('You are visitor number ' + result.rows[0].count);
//                });
//            });
//        });


});

var port = Number(process.env.PORT || 5000);

app.listen(port, function () {
    console.log("Listening on " + port);
});


function insertRating(id, res) {
//    var conString = "postgres://kyhetrqttjglpi:949BScb2C_YjRZKFH2eA5ngz7-@ec2-54-235-245-180.compute-1.amazonaws.com:5432/d3i4729gmg7s1o"
    var conString = "postgres://sssr:hui@localhost/postgres",

        client = new pg.Client(conString);
        client.connect();


//
//    var query = client.query('SELECT amount,rights FROM hsk WHERE id = $1', [id], function (err, result) {
//        if (result.rows.length > 0) {
//            client.query("UPDATE hsk SET amount=$1, rights=$2, date=$4 WHERE id=$3 ", [amount, rights, id, new Date()]);
//        } else {
//            client.query("INSERT INTO hsk (id, amount, rights, date) VALUES ($1, $2, $3, $4);", [id, amount, rights, new Date()]);
//        }
//    });


    var query = client.query('SELECT amount,rights FROM hsk WHERE id = $1', [id], function (err, result) {
        var a, b, c;
        a = parseInt(result.rows[0].amount);
        b = parseInt(result.rows[0].rights);
        if (a < 100) {
            res.end('hui');
            return
        }
        c = (b * b) / (a * a);

        var str = {
            rating: c,
            amount: a,
            rights: b
        };
        str = JSON.stringify(str);

        res.end(str);
    });

}
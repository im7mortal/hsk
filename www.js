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

//@todo  ПОМОЕМУ КЛИЕНТ БД НЕ ЗАКРЫВАЕТСЯ
app.get('/register', function (req, res) {
//    res.end('lol');
    console.log('otdal');
    var url_parts = url.parse(req.url, true);
    getRegister(url_parts.query.id, res);
});

app.get('/rating', function (req, res) {
    var url_parts = url.parse(req.url, true);
    console.log(url_parts.query);
    insertRating(url_parts.query.id,url_parts.query.amount,url_parts.query.rights, res);
});


var port = Number(process.env.PORT || 5000);

app.listen(port, function () {
    console.log("Listening on " + port);
});




function getRegister(id, res) {
    var conString = "postgres://kyhetrqttjglpi:949BScb2C_YjRZKFH2eA5ngz7-@ec2-54-235-245-180.compute-1.amazonaws.com:5432/d3i4729gmg7s1o"
//    var conString = "postgres://sssr:hui@localhost/postgres"
        , client = new pg.Client(conString);

    client.connect();

    var query = client.query('SELECT amount,rights FROM hsk WHERE id = $1', [id], function (err, result) {
        if (result.rows.length > 0) {
            var a, b, c, str;
            a = parseInt(result.rows[0].amount);
            b = parseInt(result.rows[0].rights);
            if (a < 100) {
                str = {
                    rating: 0,
                    amount: a,
                    rights: b
                };
                str = JSON.stringify(str);

                res.end(str);
                return
            }
            c = (b * b) / (a * a);

            str = {
                rating: c,
                amount: a,
                rights: b
            };
            str = JSON.stringify(str);

            res.end(str);


        } else {
            client.query("INSERT INTO hsk (id, amount, rights, date) VALUES ($1, $2, $3, $4);", [id, '0', '0', new Date()], function (err, result) {
                var str = {
                    rating: 0,
                    amount: 0,
                    rights: 0
                };
                str = JSON.stringify(str);
                res.end(str);
            });
        }
    })}

function insertRating(id, amount, rights, res) {
    var conString = "postgres://kyhetrqttjglpi:949BScb2C_YjRZKFH2eA5ngz7-@ec2-54-235-245-180.compute-1.amazonaws.com:5432/d3i4729gmg7s1o"
//    var conString = "postgres://sssr:hui@localhost/postgres"
        , client = new pg.Client(conString);

    client.connect();

    var query = client.query("UPDATE hsk SET amount=$1, rights=$2, date=$4 WHERE id=$3 ", [amount, rights, id, new Date()], function (err, result) {
        var query = client.query('SELECT amount,rights FROM hsk WHERE id = $1', [id], function (err, result) {
            var a, b, c;
            console.log(amount + '  ' + id + '  ' + rights + '  ');
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

    });
}


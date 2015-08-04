"use strict";
var express = require("express")
	, logfmt = require("logfmt")
	, fs = require('fs')
	, pg = require("pg")
	, url = require('url')
	, app = express();
var port = Number(process.env.PORT || 5000);

var index = fs.readFileSync('tryhsk.github.com/index.html');
var t = true;
app.use('/', function(req, res, next) {
	if (t) console.log(req.headers); // '/admin/new'
	t = false;
	next();
});
app.use(express.static('tryhsk.github.com'));
app.use(logfmt.requestLogger());
//app.use(express.favicon('Framework/public/img/ico.png', { maxAge: 2592000000 }));
app.listen(port, function () {
	console.log("Listening on " + port);
});

app.get('/', function (req, res) {
	res.set({
		'Cache-Control': 'public, max-age=345600',
		'Expires': new Date(Date.now() + 345600000).toUTCString()
	});
	res.end(index);
});

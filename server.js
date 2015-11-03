'use strict'; // jshint node: true, browser: false, esnext:true

var express = require('express');
var proxy   = require('http-proxy').createProxyServer({});
var app     = express();

proxy.on('error', function () { }); // ignore proxy errors

// Http calls debug
app.use(require('morgan')('dev'));

// SET ROUTES

app.use('/app/libs', express.static(__dirname + '/app/libs'));
app.use('/app',      express.static(__dirname + '/app'));
app.get('/app/*', (req, res) => res.status(404).send("404 - Not Found"));
app.all('/api/*', (req, res) => proxy.web(req, res, { target: 'https://api.cbd.int:443', secure: false }));

// SET TEMPLATE

app.get('/*', (req, res) => res.sendFile(__dirname + '/app/template.html'));

// START HTTP SERVER

app.listen(process.env.PORT || 3000, function () {
	console.info(`Server listening on ${this.address().port}`);
});

process.on('SIGTERM', ()=>process.exit());

'use strict'; // jshint node: true, browser: false, esnext:true

var express = require('express');
var proxy   = require('http-proxy').createProxyServer({});
var app     = express();

var version = (process.env.VERSION || String(new Date().getTime()));

proxy.on('error', function () { }); // ignore proxy errors

// Http calls debug
app.use(require('morgan')('dev'));

// SET ROUTES

app.use('/app/libs', express.static(__dirname + '/app/libs', { setHeaders: setCustomCacheControl }));
app.use('/app',      express.static(__dirname + '/app'     , { setHeaders: setCustomCacheControl }));
app.get('/app/*', (req, res) => res.status(404).send("404 - Not Found"));

app.all('/api/*', (req, res) => proxy.web(req, res, { target: 'https://api.cbddev.xyz', changeOrigin: true }));
///non angularjs file for activating email
app.get('/activate', (req, res) => res.sendFile(__dirname + '/app/views/activate.html'));

// SET TEMPLATE

app.get('/*', (req, res) => {
	res.cookie('VERSION', version);
	res.sendFile(__dirname + '/app/template.html');
});

// START HTTP SERVER

app.listen(process.env.PORT || 8000, function () {
	console.info(`Server listening on ${this.address().port}`);
});

process.on('SIGTERM', ()=>process.exit());

function setCustomCacheControl(res, path) {
	if(res.req.query.v == version) {
     	res.setHeader('Cache-Control', 'public, max-age=86400000')
   	}
}

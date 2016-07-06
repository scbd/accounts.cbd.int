'use strict'; // jshint node: true, browser: false, esnext:true

var express = require('express');
var proxy   = require('http-proxy').createProxyServer({});
var app     = express();

var version = (process.env.VERSION || String(new Date().getTime()/10000-145430280|0)).substr(0, 7); // 1234567
var cookieParser = require('cookie-parser')

proxy.on('error', function () { }); // ignore proxy errors

// Http calls debug
app.use(require('morgan')('dev'));
app.use(cookieParser());

// SET ROUTES

app.use('/app/libs', express.static(__dirname + '/app/libs', { setHeaders: setCustomCacheControl }));
app.use('/app',      express.static(__dirname + '/app'     , { setHeaders: setCustomCacheControl }));
app.use('/',         express.static(__dirname + '/public'  , { setHeaders: setCustomCacheControl }));
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

//============================================================
//
//
//============================================================
function setCustomCacheControl(res, path) {

	var versionWrong = false;
	var versionMatch = false;

	versionWrong |= res.req.query.v && res.req.query.v!=version;
	versionWrong |= res.req.cookies.VERSION && res.req.cookies.VERSION!=version;
	versionMatch |= res.req.query.v && res.req.query.v==version;
	versionMatch |= res.req.cookies.VERSION && res.req.cookies.VERSION==version;

	if(versionWrong || !versionMatch)
		return res.setHeader('Cache-Control', 'public, max-age=0');

	res.setHeader('Cache-Control', 'public, max-age=86400000');
}

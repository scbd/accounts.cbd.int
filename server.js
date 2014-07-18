/* jshint node: true, browser: false */
'use strict';
// LOG UNHANDLED EXCEPTION AND EXIT
process.on('uncaughtException', function (err) {
  console.error((new Date()).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

// CREATE HTTP SERVER AND PROXY

var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var proxy   = require('http-proxy').createProxyServer({});

// LOAD CONFIGURATION

var oneDay = 86400000;

app.configure(function() {

    app.use(express.logger('dev'));
    app.use(express.compress());

    app.set('port', process.env.PORT || 3000, '127.0.0.1');
    app.use('/app/libs',         express.static(__dirname + '/app/libs', { maxAge: 28*oneDay }));
    app.use('/app',              express.static(__dirname + '/app'));
});

// SET ROUTES

app.get   ('/app/*', function(req, res) { res.send('404', 404); } );
app.get   ('/api/*', function(req, res) { proxy.web(req, res, { target: 'https://api.cbd.int:443', secure: false }); } );
app.put   ('/api/*', function(req, res) { proxy.web(req, res, { target: 'https://api.cbd.int:443', secure: false }); } );
app.post  ('/api/*', function(req, res) { proxy.web(req, res, { target: 'https://api.cbd.int:443', secure: false }); } );
app.delete('/api/*', function(req, res) { proxy.web(req, res, { target: 'https://api.cbd.int:443', secure: false }); } );

// SET TEMPLATE

app.get('/*', function (req, res) { res.sendfile(__dirname + '/app/template.html'); });

// START HTTP SERVER

server.listen(app.get('port'), '0.0.0.0');
server.on('listening', function () {
	console.log('Server listening on %j', this.address());
});

// LOG PROXY ERROR & RETURN http:500

proxy.on('error', function (e, req, res) {
    console.error(new Date().toUTCString() + ' error proxying: '+req.url);
    console.error('proxy error:', e);
    res.send( { code: 500, source:'accounts/proxy', message : 'proxy error', proxyError: e }, 500);
});

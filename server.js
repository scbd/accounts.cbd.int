var fs = require('fs');
var http = require('http');
var express = require('express');
var httpProxy = require('http-proxy');

// CREATE HTTP SERVER AND PROXY
        
var app = express();
var server = http.createServer(app);
var proxy = new httpProxy.RoutingProxy();

// LOAD CONFIGURATION

var oneDay = 86400000;

app.configure(function() {
    app.set('port', process.env.PORT || 3000, '127.0.0.1');
    app.use('/app/libs',         express.static(__dirname + '/app/libs', { maxAge: 28*oneDay }));
    app.use('/app',              express.static(__dirname + '/app'));
});

// SET ROUTES

app.get   ('/app/*', function(req, res) { res.send('404', 404); } );

app.get   ('/api/*', function(req, res) { proxy.proxyRequest(req, res, { changeOrigin: true, host: 'api.cbd.int', port: 80 }); } );
app.put   ('/api/*', function(req, res) { proxy.proxyRequest(req, res, { changeOrigin: true, host: 'api.cbd.int', port: 80 }); } );
app.post  ('/api/*', function(req, res) { proxy.proxyRequest(req, res, { changeOrigin: true, host: 'api.cbd.int', port: 80 }); } );
app.delete('/api/*', function(req, res) { proxy.proxyRequest(req, res, { changeOrigin: true, host: 'api.cbd.int', port: 80 }); } );

// SET TEMPLATE

app.get('/*', function(req, res) {
	fs.readFile(__dirname + '/app/template.html', 'utf8', function (error, text) { 
		res.send(text); 
	});
});

// START HTTP SERVER

console.log('Server listening on port ' + app.get('port') + '.');
server.listen(app.get('port'));
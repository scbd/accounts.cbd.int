'use strict';
// CREATER ADD & ADD MIDDLEWARES
var express      = require('express');
var morgan       = require('morgan');
var proxy        = require('http-proxy').createProxyServer({});
var app          = express();


// Configure options
app.use(morgan('dev'));
app.set('views', `${__dirname}/app`);
app.set('view engine', 'ejs');

var apiUrl      = process.env.API_URL || 'https://api.cbddev.xyz';
var gitVersion  = (process.env.COMMIT || 'UNKNOWN').substr(0, 7);
var date        = new Date();
var year        = date.getFullYear();

console.info(`info: accounts.cbd.int`);
console.info(`info: Git version: ${gitVersion}`);
console.info(`info: API address: ${apiUrl}`);
console.info(`info: IS DEV: ${process.env.IS_DEV}`);

// Configure static files to serve
app.use('/favicon.png',   express.static(__dirname + '/app/images/favicon.png', { maxAge: 24*60*60*1000 }));
app.use('/app',           express.static(__dirname + '/app'     , { setHeaders: setCustomCacheControl }));
app.all('/app/*',         function(req, res) { res.status(404).send(); } );

app.all('/api/*', function(req, res) { proxy.web(req, res, { target: apiUrl, secure: false, changeOrigin:true } ); } );
///non angularjs file for activating email
app.get('/activate', (req, res) => res.sendFile('views/activate.html'));

// SET TEMPLATE

app.get('/*', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0')
  res.render('template', { gitVersion: gitVersion, year:year });
});

app.all('/app/*', (req, res) => res.status(404).send("404 - Not Found"));
// START HTTP SERVER

app.listen(process.env.PORT || 8000, function () {
	console.info(`Server listening on ${this.address().port}`);
});
// Handle proxy errors ignore

proxy.on('error', function (e,req, res) {
    console.error('proxy error:', e);
    res.status(502).send();
});
process.on('SIGTERM', ()=>process.exit());

//============================================================
//
//
//============================================================
function setCustomCacheControl(res, path) {

	if(res.req.query && res.req.query.v && res.req.query.v==gitVersion && gitVersion!='UNKNOWN')
        return res.setHeader('Cache-Control', 'public, max-age=86400000'); // one day

    res.setHeader('Cache-Control', 'public, max-age=0');
}

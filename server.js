'use strict';
// CREATER ADD & ADD MIDDLEWARES
var _            = require('lodash');
var express      = require('express');
var proxy        = require('http-proxy').createProxyServer({});
var app          = express();


// Configure options
app.set('views', `${__dirname}/app`);
app.set('view engine', 'ejs');

var domains     =(process.env.DOMAINS  || 'cbddev.xyz').split(';').map(o=>o.trim()).filter(o=>!!o);
var apiUrl      = process.env.API_URL  || `https://api.${domains[0]}`;
var gitVersion  = (process.env.VERSION || process.env.COMMIT || `UNKNOWN-${Math.random()*1985|0}`);
var date        = new Date();
var year        = date.getFullYear();
var captchaV2key= process.env.CAPTCHA_V2_KEY || '';
var captchaV3key= process.env.CAPTCHA_V3_KEY || '';

console.info(`info: accounts.cbd.int`);
console.info(`info: Git version: ${gitVersion}`);
console.info(`info: API address: ${apiUrl}`);
console.info(`info: IS DEV: ${process.env.IS_DEV}`);

// Configure static files to serve
app.use('/favicon.png',   express.static(__dirname + '/app/images/favicon.png', { maxAge: 24*60*60*1000 }));
app.use('/app',           express.static(__dirname + '/app'     , { setHeaders: setCustomCacheControl }));
app.use('/app/libs',      express.static(__dirname + '/node_modules/@bower_components', { setHeaders: setCustomCacheControl }));

app.get('/app/authorize.html', (req, res) => {
  var trustedDomains = domains.map(domain=>`/(^|.+\\.)${_.escapeRegExp(domain)}$/i`);
  setCustomCacheControl(res);
  res.render('authorize', { trustedDomains:  trustedDomains.join(', ') });
});

app.all('/app/*',         function(req, res) { res.status(404).send(); } );

app.all('/api/*', function(req, res) { proxy.web(req, res, { target: apiUrl, secure: false, changeOrigin:true } ); } );
///non angularjs file for activating email
app.get('/activate', (req, res) => res.sendFile(__dirname + '/app/views/activate.html'));

// SET TEMPLATE

app.get('/*', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0')
  res.render('template', { gitVersion: gitVersion, year:year, captchaV2key, captchaV3key });
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

	if(res.req.query && res.req.query.v && res.req.query.v==gitVersion && gitVersion.startsWith('UNKNOWN'))
        return res.setHeader('Cache-Control', 'public, max-age=86400000'); // one day

    res.setHeader('Cache-Control', 'public, max-age=0');
}

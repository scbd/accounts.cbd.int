'use strict';

import      express      from 'express'                   ;
import      HttpProxy    from 'http-proxy'                ;
import      samlEndPoint from './saml/index.js'           ;
import * as url          from 'url'                       ;
import      winston      from './saml/services/logger.js' ;

import { bundleUrls, cdnHost } from './app/boot.js';

const __dirname  = url.fileURLToPath(new URL('.', import.meta.url));

const proxy = HttpProxy.createProxyServer({});
const app   = express                    (  );


// Configure options
app.set('views', `${__dirname}/app`);
app.set('view engine', 'ejs');

var apiUrl      = process.env.API_URL || 'https://api.cbddev.xyz';
var gitVersion  = (process.env.VERSION || process.env.COMMIT || `UNKNOWN-${Math.random()*1985|0}`);
var date        = new Date();
var year        = date.getFullYear();
var captchaV2key= process.env.CAPTCHA_V2_KEY || '';
var captchaV3key= process.env.CAPTCHA_V3_KEY || '';
let appVersion = process.env.TAG      || gitVersion;

winston.info(`info: accounts.cbd.int`);
winston.info(`info: Git version: ${gitVersion}`);
winston.info(`info: API address: ${apiUrl}`);
winston.info(`info: IS DEV: ${process.env.IS_DEV}`);

samlEndPoint(app)
app.use(                       function(req,res,next) { res.setHeader('X-Frame-Options', 'DENY' ); next(); });
app.use('/app/authorize.html', function(req,res,next) { res.setHeader('X-Frame-Options', 'ALLOW'); next(); });

// Configure static files to serve
app.use('/favicon.png',   express.static(__dirname + '/app/images/favicon.png', { maxAge: 24*60*60*1000 }));

app.use('/app',           express.static(__dirname + '/dist/app', { setHeaders: setCustomCacheControl }));
app.use('/app',           express.static(__dirname + '/app', { setHeaders: setCustomCacheControl }));
app.all('/app/*',         function(req, res) { res.status(404).send(); } );

app.all('/api/*', function(req, res) { proxy.web(req, res, { target: apiUrl, secure: false, changeOrigin:true } ); } );
///non angularjs file for activating email
app.get('/activate', (req, res) => res.sendFile(__dirname + '/app/views/activate.html'));


// SET TEMPLATE

app.get('/*', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0')
  res.render('template', { 
    gitVersion: gitVersion, year:year, captchaV2key, captchaV3key,
    baseUrl: req.headers.base_url || '/',
    appVersion: appVersion,

    cdnHost            : cdnHost,
    angularBundle      : bundleUrls.angularBundle,
    initialCss         : bundleUrls.initialCss
  }); 
});


// app.all('/app/*', (req, res) => res.status(404).send("404 - Not Found"));
// START HTTP SERVER

app.listen(process.env.PORT || 8000, function () {
	winston.info(`Server listening on ${this.address().port}`);
});
// Handle proxy errors ignore

proxy.on('error', function (e,req, res) {
    winston.error('proxy error:', e);
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

  // Error Handler
  app.use((err, req, res) => {

    if(err instanceof ApiError)
        return res.status(err.status).send({ status:err.status, message: err.message });

    res.status(500).send({ status: 500, message:  "Internal server Error"} );

    winston.error("*** Unhandled Exception:", err);
  })


  process.on('uncaughtException', function (err) {
    winston.error(`*** Uncaught Exception: ${err.message}\n${err.stack}`);
  });
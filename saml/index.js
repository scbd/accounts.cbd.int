import fs              from 'fs'
import path            from 'path'
import express         from 'express'
import cookieParser    from 'cookie-parser'
import ApiError        from './helpers/api-error.js';
import loadUser        from './middlewares/load-user.js'
import loadAbsolutUrl  from './middlewares/absolute-url.js'
import loadInstitution from './middlewares/load-institution.js'
import requestTimeout  from './middlewares/request-timeout.js'
import saveResponseBody from './middlewares/save-response-body.js'
import $await          from './middlewares/await.js';
import controller           from './controller.js'
import morgan          from 'morgan'
import { port, appDomain, authIssuer, certPath, jwtSecret, requestTtl } from './config.js'

export default (router) => {
  // const router = express.Router();

  morgan.token('user',  (req)=> { 
    return req.user ? `\n${JSON.stringify(req.user, null, ' ')}` : '';
  });

  morgan.token('result',(req, res)=> {
    if(res.statusCode && res.statusCode<400) return 'success';
    let message = res?.body?.message;

    return message ? `(${message})` : '';
  });

  router.use('/saml', morgan(':method :url :status :result :response-time ms - :res[content-length] - :user ')); // same as dev + user
  router.use('/saml', saveResponseBody);
  router.use('/saml', requestTimeout({ ttl: requestTtl }));

  router.use('/saml', $await(loadAbsolutUrl()));
  router.use('/saml', $await(cookieParser()));
  router.use('/saml', $await(loadInstitution({ appDomain })));
  router.use('/saml', $await(loadUser({ encryptionKey: jwtSecret, issuer: authIssuer })));

  const cert = path.join(certPath, 'cert.pem')
  const certExists = fs.existsSync(path)

  if(certExists)
  router.use(`/saml`, controller({
    authIssuer, 
    basePath: `/saml`,
    certificate : {
      cert: fs.readFileSync(path.join(certPath, 'cert.pem')),
      key:  fs.readFileSync(path.join(certPath, 'cert.key'))
    }, 
  }));

  // Error Handler
  router.use((err, req, res, next)=>{

    if(err instanceof ApiError)
        return res.status(err.status).send({ status:err.status, message: err.message });

    res.status(400).send({ status: 500, message:  "Internal server Error"} );

    console.error("*** Unhandled Exception:", err);
  })

  process.on('uncaughtException', function (err) {
    console.error(`*** Uncaught Exception: ${err.message}\n${err.stack}`);
  });
}






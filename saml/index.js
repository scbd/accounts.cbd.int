import fs               from 'fs'                                 ;
import path             from 'path'                               ;
import cookieParser     from 'cookie-parser'                      ;
import ApiError         from './services/api-error.js'            ;
import loadUser         from './middlewares/load-user.js'         ;
import loadAbsolutUrl   from './middlewares/absolute-url.js'      ;
import requestTimeout   from './middlewares/request-timeout.js'   ;
import saveResponseBody from './middlewares/save-response-body.js';
import $await           from './middlewares/await.js'             ;
import controller       from './controller.js'                    ;

import { authIssuer, certPath, requestTtl } from './config.js'

export default (router) => {

  router.use('/saml', saveResponseBody);
  router.use('/saml', requestTimeout({ ttl: requestTtl }));

  router.use('/saml', $await(loadAbsolutUrl()));
  router.use('/saml', $await(cookieParser()));
  router.use('/saml', $await(loadUser()));

  const cert       = path.join(certPath, 'idp.crt')
  const certExists = fs.existsSync(cert)

  if(certExists)
    router.use(`/saml`, controller({
      authIssuer, 
      basePath    : `/saml`,
      certificate : {
                      cert: fs.readFileSync(path.join(certPath, 'idp.crt')),
                      key:  fs.readFileSync(path.join(certPath, 'idp.key'))
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
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

import { authIssuer, cert, certKey, requestTtl } from './config.js'

export default (router) => {

  router.use('/saml', saveResponseBody);
  router.use('/saml', requestTimeout({ ttl: requestTtl }));

  router.use('/saml', $await(loadAbsolutUrl()));
  router.use('/saml', $await(cookieParser()));
  router.use('/saml', $await(loadUser()));

  const certExists = fs.existsSync(cert)

  if(certExists)
    router.use(`/saml`, controller({
      authIssuer, 
      basePath    : `/saml`,
      certificate : {
                      cert: fs.readFileSync(cert),
                      key : fs.readFileSync(certKey)
                    }, 
    }));


}
import   _         from 'lodash'                     ;
import   request   from 'superagent'                 ;
import { apiUrl  } from '#~/saml/config.js'          ;
import   winston   from '#~/saml/services/logger.js' ;

export default  function () {
    return async (req, res, next) => {
        
        try {
            const { authenticationToken } = req.cookies;

            if(!authenticationToken) return next();

            winston.debug('loadUser.getAuthUser',`${apiUrl}/api/v2013/authentication/user`);
            
            req.user = await getAuthUser(authenticationToken)
            next();
        }
        catch(err) {
            winston.debug(err)

            delete req.user; // make sure anonymous on error
            next();
        }
    }
}

//class Skip { constructor(message) { this.message = message } }

async function getAuthUser(token){

    winston.debug('loadUser.getAuthUser',`${apiUrl}/api/v2013/authentication/user`)

    const { _body } = await request.get(`${apiUrl}/api/v2013/authentication/user`)
                            .set('Authorization', `Bearer ${token}`)

    winston.debug('loadUser.getAuthUser._body', _body)

    return _body
}
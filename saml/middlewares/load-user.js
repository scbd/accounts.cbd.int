import   _         from 'lodash'             ;
import   request   from 'superagent'         ;
import { apiUrl  } from '#~/saml//config.js' ;

export default  function () {
    return async (req, res, next) => {
        
        try {
            const { authenticationToken } = req.cookies;

            if(!authenticationToken) return next();

            req.user = await getAuthUser(authenticationToken)
            next();
        }
        catch(err) {
            delete req.user; // make sure anonymous on error
            next();
        }
    }
}

//class Skip { constructor(message) { this.message = message } }

async function getAuthUser(token){
    const { _body } = await request.get(`${apiUrl}/api/v2013/authentication/user`)
                            .set('Authorization', `Bearer ${token}`)

    return _body
}
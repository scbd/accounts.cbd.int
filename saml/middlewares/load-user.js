import _        from 'lodash'                 ;
import jwt      from 'jsonwebtoken'           ;
import ApiError from '../helpers/api-error.js';

const { JsonWebTokenError, NotBeforeError, TokenExpiredError } = jwt;

export default function ({ encryptionKey, issuer }) {
    return (req, res, next) => {

        const { institution } = req;
        const { authorizationToken } = req.cookies;

        if(authorizationToken) {

            try {

                const claims = jwt.verify(authorizationToken, encryptionKey, { issuer });

                if(claims.aud !== 'participant' ) throw new Skip('Invalid audience');
                if(claims.institution!==institution.toUpperCase()) throw new Skip('Invalid institution ');

                req.user = { 
                    ..._.omit(claims, 'iss','iat','exp','aud'),
                    uid : `${claims.sub}@${claims.institution}.${claims.iss}`.toLocaleLowerCase(),
                }; // Load user
            }
            catch(err) {

                if(err instanceof Skip)                   { console.error(`Error Load-user: ${err.message}`); }
                else if(err instanceof TokenExpiredError) { console.error('Error Load-user: token expired'); }
                else if(err instanceof NotBeforeError)    { throw new ApiError(403, 'authentication is not ready to be used'); }
                else if(err instanceof JsonWebTokenError) { console.error('Error Load-user: authentication token is invalid'); }
                else { 
                    console.error(`Error Load-user:`, err);
                }
            }
        }

        next();
    }
}

class Skip { constructor(message) { this.message = message } }

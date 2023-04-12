import _ from 'lodash';
import jwt from 'jsonwebtoken';
import { authIssuer, jwtSecret } from '../../../config.js'
const { JsonWebTokenError, NotBeforeError, TokenExpiredError } = jwt;

const preSharedPathRe = /^\/([-a-z0-9]{12,14})$/i;

function normalizePreSharedCode(c) {
    return c.replace(/-/g, '').toUpperCase();
}

export default function(req, res, next) {

    let userOverrides  = null;
    let claimOverrides = null;

    try {
        const { user, institution, authnRequest } = req;
        const { relayState } = authnRequest || {};

        if(!user)       return next();
        if(!relayState) return next();

        const relayStateUrl = new URL(relayState, 'http://locahost');
        const returnUrl     = new URL(relayStateUrl.searchParams.get('return_url'));
        const claimsJWT     = returnUrl.searchParams.get('claims');
        const { pathname }  = returnUrl;
        const isPreShared   = preSharedPathRe.test(pathname);

        if(!claimsJWT)
            throw new Error("No claims provided");

        const claims = jwt.verify(claimsJWT, jwtSecret, { issuer: authIssuer });

        if(isPreShared){
            const pathLinkCode  = normalizePreSharedCode(pathname.replace(preSharedPathRe, '$1'));
            const claimLinkCode = normalizePreSharedCode(claims.linkCode);

            if(pathLinkCode!=claimLinkCode) throw new Error("Unable to match pre-shared code ");
        } 

        if(claims.institution!==institution.toUpperCase()) throw new Error("Invalid institution ");
        if(claims.aud!=="claims") throw new Error("Invalid audience");
        if(claims.sub!==user.sub) throw new Error("Invalid subject");

        const { firstName, lastName, nameplate, audioStreamId, videoStreamId, caps } = claims;

        userOverrides  = { ..._.pickBy({ firstName, lastName, nameplate },     (o)=>o!==undefined) }
        claimOverrides = { ..._.pickBy({ audioStreamId, videoStreamId, caps }, (o)=>o!==undefined), overrideReason: 'Valid signed claims' }
    }
    catch(err) {

             if(err instanceof TokenExpiredError) { console.error('Load-user-dynamic-roles: claims token Expired');  }
        else if(err instanceof NotBeforeError)    { console.error('Load-user-dynamic-roles: claims token is not ready to be used');  } 
        else if(err instanceof JsonWebTokenError) { console.error(`Load-user-dynamic-roles ${err.message}`); }
        else {  console.error(`Error Load-user-dynamic-roles:`, err); }

        res.redirect("/signin?error=invalidSamlSignature");
    }

    if(userOverrides)  req.user = { ...req.user, ...userOverrides };
    if(claimOverrides) req.user = { ...req.user, claims: claimOverrides };

    next();
}

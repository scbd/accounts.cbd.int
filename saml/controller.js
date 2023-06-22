import x509  from 'x509.js';
import util  from 'util'   ;
import samlp from 'samlp'  ;

import * as authnClasses         from './services/saml-constants/authn-context-classes.js';
import   profileMapper   from '#~/saml/service-providers/profile-mapper.js' ;
import   ApiError       from './services/api-error.js'      ;
import   $await         from './middlewares/await.js'       ;
import   securize       from './middlewares/security.js'    ;
import { Router       } from 'express'                      ;
import { findProvider } from './service-providers/index.js' ;

const samlp_parseRequest = util.promisify(samlp.parseRequest);


export default function Controller({ certificate, authIssuer, basePath }) {

    if(!certificate) throw new Error("No certificate provided")

    if(!authIssuer)  throw new Error("No authIssuer provided")

    dumpCertificateInformation(certificate.cert);

    const router = Router();

    router.get ('/metadata',  $await(getIdPMetadata));
    router.get ('/signin',    $await(parseSamlRequest), $await(securizeOrLogin), $await(providerHooks), $await(sendSamlResponse));
    router.post('/signin',    $await(parseSamlRequest), $await(securize({})),    $await(providerHooks), $await(sendSamlResponse));

    return router;

    //////////////////////////////
    //////////////////////////////

    function securizeOrLogin(req, res, next) {

        try {
            securize()(req, res, next);
        }
        catch (err) {

            if(err.status==401 && req.absoluteUrl && !req.query?.noloop)
            {
                const { absoluteUrl } = req;

                const redirectUrl = `/signin?returnUrl=${encodeURIComponent(`${absoluteUrl}&noloop=1`)}`;

                return res.redirect(redirectUrl);
            }

            throw err;
        }
    }

    /** ********************
     * 
     */
    async function baseOptions() {
        try {
            return {
                issuer: `https://${authIssuer}${basePath}`,
                profileMapper: wrapProfileClass(profileMapper),
                cert: certificate.cert,
                key: certificate.key,
                redirectEndpointPath: basePath,
                postEndpointPath: basePath,
                logoutEndpointPaths: {}
            }
        }
        catch (err) {
            throw new ApiError(404, 'Base options for IdP not found or configured');
        }
    }

    /** ********************
     * 
     */
    async function getIdPMetadata(req, res, next) {

        const options = { ... await baseOptions(req.institution), key: null };

        samlp.metadata(options)(req, res, next)
    }

    /** ********************
     * 
     */
    async function parseSamlRequest(req, res, next) {

        let data = null;

        try {
            data = await samlp_parseRequest(req);
        }
        catch(err) {
            console.error('Error parsing saml request:', err?.message || err)            
        }

        if (!data)
            throw new ApiError(400, "Invalid SAMLRequest");

        const validProvider = getProvider(data.issuer);

        req.authnRequest = {
            relayState: req?.query?.RelayState || req?.body?.RelayState,
            id: data.id,
            issuer: data.issuer,
            destination: data.destination,
            acsUrl: data.assertionConsumerServiceURL,
            forceAuthn: data.forceAuthn === 'true'
        };

        next();
    }

    /** ********************
     * 
     */
    async function sendSamlResponse(req, res, next) {

        const { authnRequest } = req;
        
        if(!authnRequest)        throw new ApiError(400, "Invalid SAML Request");
        if(!authnRequest.acsUrl) throw new ApiError(400, "Invalid SAML Request: no assertion Consumer Service URL");

        const { issuer } = authnRequest;
    
        const authOptions = {
            ... await baseOptions(req.institution, issuer ),
            signAssertion             : false                   ,
            signResponse              : true                    ,
            includeAttributeNameFormat: false                   ,
            lifetimeInSeconds         : 5*60                    , // 5 minutes
            authnContextClassRef      : authnClasses.unspecified,
            inResponseTo              : authnRequest.id         ,
            acsUrl                    : authnRequest.acsUrl     ,
            recipient                 : authnRequest.acsUrl     ,
            destination               : authnRequest.acsUrl     ,
            forceAuthn                : authnRequest.forceAuthn ,
            RelayState                : authnRequest.relayState ,
            getPostURL: function (audience, samlRequestDom, req, callback) {
                return callback( null, authnRequest.acsUrl)
            }
        };
    
        samlp.auth(authOptions)(req, res, next);
    }


    async function providerHooks(req, res, next) {

        const { authnRequest } = req;
        
        if(!authnRequest)        throw new ApiError(400, "Invalid SAML Request");
        if(!authnRequest.acsUrl) throw new ApiError(400, "Invalid SAML Request: no assertion Consumer Service URL");

        const { issuer }  = authnRequest;
        const provider    = await getProvider(issuer);
        const middlewares = [...(provider.middlewares || [])];

        const innerNext = (err)=>{
            try {
                if(err) throw err;

                const hook = middlewares.shift();

                if(hook) $await(hook)(req, res, innerNext);
                else     next();
            }
            catch(e) {
                console.error('ProviderHook error', e)
                next(e);
            }
        };

        innerNext();
    }
}

async function getProvider(serviceProviderID) {

    var provider = await findProvider(serviceProviderID);

    if(!provider)
        throw new ApiError(400, `Invalid SAMLRequest - Unknown SP Issuer: ${serviceProviderID}`)

    return provider;
}

function wrapProfileClass(ProfileClass) {
    const wrappedProfileClass = function(user) {
        return new ProfileClass(user);
    }

    wrappedProfileClass.prototype.metadata = ProfileClass.prototype.metadata

    return wrappedProfileClass
}

function dumpCertificateInformation(certBuffer) {

    const certificate = x509.parseCert(certBuffer);

    const { subject, notAfter } = certificate;
    const expiresIn = ((new Date(notAfter) - new Date()) / 24 / 60 / 60 / 1000) | 0;
    const expired   =  (new Date(notAfter) - new Date()) < 0;


    console.log(`
=============================================
=============================================
==         CERTIFICATE INFORMATION         ==
=============================================
== subject:    ${subject?.commonName}
== expires:    ${new Date(notAfter).toISOString()}
== expires in: ${expiresIn} days ${expired ? 'EXPIRED!!!! ': ''}
=============================================
=============================================
`);


}
import path from 'path'

// if(!process.env.AUTH_ISSUER)    throw new Error("missing env: AUTH_ISSUER")
// if(!process.env.APP_DOMAIN)     throw new Error("missing env: APP_DOMAIN")

export const port         = parseInt(process.env.PORT || 8000);
export const authIssuer   = process.env.AUTH_ISSUER   || 'accounts-saml.localhost';
export const appDomain    = process.env.APP_DOMAIN    || 'accounts-saml.localhost';
export const certPath     = process.env.CERT_PATH     || path.join(path.resolve(), 'certs');
export const requestTtl   = process.env.REQUEST_TTL   && parseInt(process.env.REQUEST_TTL) || 20 * 1000;
export const apiUrl       = process.env.API_URL       || 'https://api.cbddev.xyz'
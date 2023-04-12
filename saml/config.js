import path from 'path'

// if(!process.env.AUTH_ISSUER)    throw new Error("missing env: AUTH_ISSUER")
// if(!process.env.APP_DOMAIN)     throw new Error("missing env: APP_DOMAIN")
// if(!process.env.CERT_PATH)      throw new Error("missing env: CERT_PATH")
//if(!process.env.JWT_SECRET)     throw new Error("missing env: JWT_SECRET")

export const port         = parseInt(process.env.PORT || 8000);
export const authIssuer   = process.env.AUTH_ISSUER   || 'accounts.cbddev.xyz'
export const appDomain    = process.env.APP_DOMAIN    || 'accounts.cbddev.xyz'
export const certPath     = process.env.CERT_PATH     || path.join(path.resolve(), appDomain.includes('.cbddev.xyz')? 'certs/dev':'certs');
export const requestTtl   = process.env.REQUEST_TTL   && parseInt(process.env.REQUEST_TTL) || 20 * 1000;
export const jwtSecret    = process.env.JWT_SECRET;

console.log('certPath', certPath)
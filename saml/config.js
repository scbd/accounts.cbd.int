import path from 'path'

export const authIssuer   = process.env.AUTH_ISSUER   || 'accounts-saml.cbddev.xyz';
export const certPath     = process.env.CERT_PATH     || path.join(path.resolve(), 'certs');
export const requestTtl   = process.env.REQUEST_TTL   && parseInt(process.env.REQUEST_TTL) || 20 * 1000;
export const apiUrl       = process.env.API_URL       || 'https://api.cbddev.xyz'
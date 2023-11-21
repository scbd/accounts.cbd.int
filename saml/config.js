import path from 'path'

export const authIssuer   = process.env.AUTH_ISSUER   || 'accounts.cbddev.xyz';
export const cert         = process.env.CERT          || path.join(path.resolve(), 'certs/idp.crt');
export const certKey      = process.env.CERT_KEY      || path.join(path.resolve(), 'certs/idp.key');
export const requestTtl   = process.env.REQUEST_TTL   && parseInt(process.env.REQUEST_TTL) || 20 * 1000;
export const apiUrl       = process.env.API_URL       || 'https://api.cbddev.xyz'
//Full list 3.4 at https://docs.oasis-open.org/security/saml/v2.0/saml-authn-context-2.0-os.pdf

/**
 * 3.4.1 The Internet Protocol class is applicable when a principal is authenticated through the 
 * use of a provided IP address
 */
export const internetProtocol = ' urn:oasis:names:tc:SAML:2.0:ac:classes:InternetProtocol';

/** 
 * 3.4.2 The Internet Protocol Password class is applicable when a principal is authenticated through the use of a
 * provided IP address, in addition to a username/password
 */
export const internetProtocolPassword = 'urn:oasis:names:tc:SAML:2.0:ac:classes:InternetProtocolPassword';

/** 
 * 3.4.3 This class is applicable when the principal has authenticated using a password to a local authentication
 * authority, in order to acquire a Kerberos ticket. That Kerberos ticket is then used for subsequent network
 * authentication.
 */
export const kerberos = 'urn:oasis:names:tc:SAML:2.0:ac:classes:Kerberos';

/**
 * 3.4.8 The Password class is applicable when a principal authenticates to an authentication authority through the
 * presentation of a password over an unprotected HTTP session
 */
export const password = 'urn:oasis:names:tc:SAML:2.0:ac:classes:Password';

/**
 * 3.4.9 The PasswordProtectedTransport class is applicable when a principal authenticates to an authentication
 * authority through the presentation of a password over a protected session.
 */
export const passwordProtectedTransport = 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport';

/**
 * 3.4.10 The PreviousSession class is applicable when a principal had authenticated to an authentication authority
 * at some point in the past using any authentication context supported by that authentication authority.
 * Consequently, a subsequent authentication event that the authentication authority will assert to the relying
 * party may be significantly separated in time from the principal's current resource access request.
 * 
 * The context for the previously authenticated session is explicitly not included in this context class because
 * the user has not authenticated during this session, and so the mechanism that the user employed to
 * authenticate in a previous session should not be used as part of a decision on whether to now allow
 * access to a resource.
 */
export const previousSession = 'urn:oasis:names:tc:SAML:2.0:ac:classes:PreviousSession';

/**
 * 3.4.15 The Smartcard class is identified when a principal authenticates to an authentication authority using a
 * smartcard.
 */
export const smartcard = 'urn:oasis:names:tc:SAML:2.0:ac:classes:Smartcard';

/**
 * 3.4.16 The SmartcardPKI class is applicable when a principal authenticates to an authentication authority through
 * a two-factor authentication mechanism using a smartcard with enclosed private key and a PIN.
 */
export const smartcardPKI = 'urn:oasis:names:tc:SAML:2.0:ac:classes:SmartcardPKI';

/**
 * 3.4.23 This class indicates that the principal authenticated by means of a client certificate, secured with the
 * SSL/TLS transport.
 */
export const tlsClientCertificate = 'urn:oasis:names:tc:SAML:2.0:ac:classes:TLSClient';

/**
 * 3.4.24 The TimeSyncToken (OTP) class is applicable when a principal authenticates through a time synchronization
token.
 */
export const timeSyncToken = 'urn:oasis:names:tc:SAML:2.0:ac:classes:TimeSyncToken';

/**
 * 3.4.25 The Unspecified class indicates that the authentication was performed by unspecified means.
 */
export const unspecified = 'The Unspecified class indicates that the authentication was performed by unspecified means.';

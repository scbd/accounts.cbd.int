// https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-saml-tokens

export const uid = {
    id: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
    optional: false,
    displayName: 'User UID',
    description: 'Unique identifier of the user'
}

export const email = {
  id: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email',
  optional: false,
  displayName: 'E-Mail Address',
  description: 'The e-mail address of the user'
}

export const username = {
    id: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
    optional: true,
    displayName: 'Username',
    description: 'The unique name of the user'
};

export const givenname = {
    id: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
    optional: true,
    displayName: 'Given name / First name',
    description: 'The given name of the user'
};
  
export const surname = {
    id: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
    optional: true,
    displayName: 'Surname / Last name',
    description: 'The surname / last name of the user'
};

export const name = {
    id: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
    optional: true,
    displayName: 'Name',
    description: 'Provides a human readable value that identifies the subject of the token. This value is not guaranteed to be unique within a tenant and is designed to be used only for display purposes.'
};
export const identityProvider = {
    id: 'http://schemas.microsoft.com/identity/claims/identityprovider',
    optional: true,
    displayName: 'Identity Provider',
    description: 'Provider who identified the user'
}

export const claims = [
    uid,
    email,
    username,
    givenname,
    surname,
    identityProvider,
    name
];

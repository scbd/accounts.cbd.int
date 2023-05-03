accounts.cbd.int
================

https://accounts.cbd.int

[![Dependency Status](https://david-dm.org/scbd/accounts.cbd.int.svg)](https://david-dm.org/scbd/accounts.cbd.int)
[![Circle CI](https://circleci.com/gh/scbd/accounts.cbd.int/tree/master.svg?style=shield)](https://circleci.com/gh/scbd/accounts.cbd.int/tree/master)



SAML

    ENV Vars:

        AUTH_ISSUER - accounts-saml.cbddev.xyz
        API_URL     - https://api.cbddev.xyz

    Secrets:

        certs/idp.key
        certs/idp.crt
        saml/scripts/bioland/index.js - exports default object of SP's 

        { "https://rjh.bioland.cbddev.xyz":{ "entityID": 'https://rjh.bioland.cbddev.xyz', provider: {...}}
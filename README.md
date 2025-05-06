accounts.cbd.int
================

https://accounts.cbd.int

[![Dependency Status](https://david-dm.org/scbd/accounts.cbd.int.svg)](https://david-dm.org/scbd/accounts.cbd.int)
[![Circle CI](https://circleci.com/gh/scbd/accounts.cbd.int/tree/master.svg?style=shield)](https://circleci.com/gh/scbd/accounts.cbd.int/tree/master)



SAML

    ENV Vars:

        AUTH_ISSUER - accounts.cbddev.xyz
        API_URL     - https://api.cbddev.xyz
        SITE_ALERT  - (Optional) |  Message to display on the top bar. if empty/not set the Alert Bar will no show
        SITE_ALERT_LEVEL - (Optional) |  Color level: `primary`, `secondary`, `info`, `success`, `warning`, `danger`. Default: danger |

    Secrets:

        certs/idp.key
        certs/idp.crt
        saml/service-providers/list.js - list of SP's 
import webRead       from '#~/saml/helpers/web-reader.js';
import spParser      from '../../parsers/service-providers.js'
import profileMapper from './profile-mapper.js'
import claimOverrides from './middleware-claims-override.js'

export default async function load() {

    const   provider   = spParser(await webRead('https://rjh.bioland.cbddev.xyz/saml/metadata'));
    const { entityID } = provider;

    return {
        entityID,
        provider,
        profileMapper,
        middlewares: [ claimOverrides ]
    }
}
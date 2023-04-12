import webRead       from '../../../helpers/web-reader.js';
import spParser      from '../../parsers/service-providers.js'
import profileMapper from '../bioland-dev/profile-mapper.js'
import claimOverrides from '../bioland-dev/middleware-claims-override.js'

export default async function load() {

    const provider = spParser(await webRead('https://rest.interactio.dev/auth/saml/metadata'));

    const { entityID } = provider;

    return {
        entityID,
        provider,
        profileMapper,
        middlewares: [claimOverrides]
    }
}
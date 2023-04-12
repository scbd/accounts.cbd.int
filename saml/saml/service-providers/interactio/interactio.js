import webRead       from '../../../helpers/web-reader.js';
import spParser      from '../../parsers/service-providers.js'
import profileMapper from './interactio-profile-mapper.js'
import claimOverrides from './middleware-claims-override.js'

export default async function load() {

    const provider = spParser(await webRead('https://cbd.interactio.com/api/saml/metadata'));

    const { entityID } = provider;

    return {
        entityID,
        provider,
        profileMapper,
        middlewares: [claimOverrides]
    }
}
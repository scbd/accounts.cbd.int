import webRead       from '#~/saml/services/web-reader.js'  ;
import spParser      from '../../services/saml-sp-parser.js';
import profileMapper from './profile-mapper.js'             ;

export default async function load() {

    const   provider   = spParser(await webRead('https://rjh.bioland.cbddev.xyz/saml/metadata'));
    const { entityID } = provider;

    return {
        entityID,
        provider,
        profileMapper
    }
}
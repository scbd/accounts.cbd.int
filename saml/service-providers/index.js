import profileMapper from './profile-mapper.js'                ;
import webRead       from '#~/saml/services/web-reader.js'     ;
import spParser      from '#~/saml/services/saml-sp-parser.js' ;
import winston       from '#~/saml/services/logger.js'         ;

const providers_cache = {}

export async function findProvider(entityID) {
    const spList = await getSpList()

    winston.debug('findProvider.spList', spList)

    winston.debug('findProvider.providers_cache', providers_cache)

    if(!spList[entityID]) return undefined;
    if(isCached(entityID)) return providers_cache[entityID];

    const metaData = await readServiceProviderMeta(spList[entityID]);

    winston.debug('findProvider.metaData', metaData)

    if(!metaData) return undefined;

    providers_cache[entityID] = { ...metaData, profileMapper };

    return providers_cache[entityID]
}

async function readServiceProviderMeta(url){

    try{
        const   provider   = spParser(await webRead(url));
        const { entityID } = provider;

        return { entityID, provider };
    }catch(e){

        return undefined;
    }
}

function isCached(entityID){
    if(!providers_cache[entityID]) return undefined;

    if(isChacheExpired(entityID)) return undefined;

    return providers_cache[entityID];
}

function isChacheExpired(entityID){
    if(!providers_cache[entityID] || !providers_cache[entityID]?.provider?.validUntil) return false;

    const validUntil = new Date(providers_cache[entityID].provider.validUntil);

    return new Date() > validUntil;
}

async function getSpList(){
    try {
        return (await import('./list.js')).default
    } catch (e) {
        return []
    }
}
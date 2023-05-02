import webRead       from '#~/saml/services/web-reader.js'   ;
import spParser      from '../../services/saml-sp-parser.js' ;
import profileMapper from './profile-mapper.js'              ;
import configGit     from 'bioland-config'                   ;

export default async function load() {
    const serviceProviders      = {}
    const serviceProvidersArray = []
    

    for (const url of getMetaDataUrls())
        serviceProvidersArray.push(readServiceProviderMeta(url))

    const settled = (await Promise.allSettled(serviceProvidersArray))
                        .filter(({ status })=> status === 'fulfilled')
                        .map(({ value })=>value)
                        .filter( x => x)
                        
    for (const sp of settled) 
        serviceProviders[sp.entityID] = sp
    
    return serviceProviders
}

async function readServiceProviderMeta(url){

    try{
        const   provider   = spParser(await webRead(url));
        const { entityID } = provider;

        return {
            entityID,
            provider,
            profileMapper
        }
    }catch(e){
        return undefined
    }
}
function getMetaDataUrls(){
    const urls  = []
    const isDev = process.env.IS_DEV

    for (const code of configGit.siteCodes) {
        if(hasRedirectTo(code) && !isDev) 
            urls.push(`https://${hasRedirectTo(code)}/saml/metadata`)
        else{
            const url = isDev? `https://${code}.bioland.cbddev.xyz/saml/metadata` : `https://${code}.chm-cbd.net/saml/metadata`
            
            urls.push(url)
        }
    }

    return urls
}

function hasRedirectTo(code){
    return (configGit?.sites[code] || {})?.redirectTo
}
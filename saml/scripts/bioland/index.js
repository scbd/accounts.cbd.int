import webRead      from '#~/saml/services/web-reader.js'   ;
import spParser     from '../../services/saml-sp-parser.js' ;
import configGit    from 'bioland-config'                   ;
import configGitDev from 'bioland-dev'               ;
import fs           from 'fs-extra'                         ;

const isDev = process.argv.includes('-d')

await load()

export default async function load() {
    const serviceProviders      = {}
    const serviceProvidersArray = []

    for (const url of getMetaDataUrls())
        serviceProvidersArray.push(readServiceProviderMeta(url))

    const settled = (await Promise.allSettled(serviceProvidersArray))
                        .filter(({ status }) => status === 'fulfilled')
                        .map(({ value }) => value)
                        .filter( x => x)
                        
    for (const sp of settled) 
        serviceProviders[sp.entityID] = sp
    
        writeFile (serviceProviders) 
    return serviceProviders
}

async function readServiceProviderMeta(url){

    try{
        const   provider   = spParser(await webRead(url));
        const { entityID } = provider;

        return {
            entityID,
            provider
        }
    }catch(e){
        return undefined
    }
}

function getMetaDataUrls(){
    const urls  = []

    const config = isDev? configGitDev : configGit

    for (const code of config.siteCodes) {
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

function writeFile (data) {
    const cleanData = 'export default ' +JSON.stringify(data)
    const ctx =  process.env.PWD || process.env.INIT_CWD

    fs.ensureFileSync(`${ctx}/saml/service-providers/bioland/list.js`)
    
    return fs.writeFileSync(`${ctx}/saml/service-providers/bioland/list.js`, cleanData)
}
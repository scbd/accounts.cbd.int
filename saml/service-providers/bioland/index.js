import   profileMapper   from './profile-mapper.js' ;
import { resolve       } from 'path'                ;
import   fs              from 'fs-extra'            ;

const ctx =  process.env.PWD || process.env.INIT_CWD

export default async function load() {
    if(!fileExists()) return {}

    const serviceProviders  = (await (import(resolve(`${ctx}/saml/service-providers/bioland/list.js`)))).default

    for (const key in serviceProviders)
        serviceProviders[ key ] = { ...serviceProviders[key], profileMapper };

    return serviceProviders
}

function fileExists () {
    return fs.existsSync(resolve(`${ctx}/saml/service-providers/bioland/list.js`))
}
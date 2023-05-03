import biolandLoader from './bioland/index.js'

const providers_cache = {}

export async function getProviders() {

    if(!Object.keys(providers_cache).length) {

        const providers = { ...(await biolandLoader()) };

        for (const key in providers)
            providers_cache[ key ] = { ...providers[key] };
    }

    return providers_cache;
}

export async function findProvider(entityID) {

    const providers = await getProviders();

    return providers[ entityID ];
}
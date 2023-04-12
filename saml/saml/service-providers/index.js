import interactioSpLoader    from './interactio/interactio.js';

let providers_cache = null;

export async function getProviders() {

    if(!providers_cache) {

        let providers = [
            await interactioSpLoader(),
        ];

        for(let provider of providers) {
            providers_cache = providers_cache || {};
            providers_cache[provider.entityID] = { ...provider };
        }
    }

    return providers_cache;
}

export async function findProvider(entityID) {

    const providers = await getProviders();

    return providers[entityID];
}


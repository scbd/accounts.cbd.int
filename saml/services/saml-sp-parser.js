import xmldom from 'xmldom';
import xpath  from 'xpath' ;


const NAMESPACES = {
    "md":   "urn:oasis:names:tc:SAML:2.0:metadata",
    "mdui": "urn:oasis:names:tc:SAML:metadata:ui",
    "alg": "urn:oasis:names:tc:SAML:metadata:algsupport",
}

export default function parse(input) {

    var xDoc = new xmldom.DOMParser().parseFromString(input.toString());

    if (!xDoc || !xDoc.documentElement) {
        throw new Error('Invalid SAML SP metadata');    
    }

    const displayInformation        = loadDisplayInformation(xDoc);
    const entityID                  = loadEntityID(xDoc);
    const validUntil                = loadValidUntil(xDoc);
    const digestMethods             = loadDigestMethods(xDoc);
    const signingMethods            = loadSigningMethods(xDoc);
    const nameIDFormats             = loadNameIDFormats(xDoc);
    const assertionConsumerServices = loadAssertionConsumerServices(xDoc);
    const singleLogoutServices      = loadSingleLogoutServices(xDoc);

    const {
        protocolSupport,
        authnRequestsSigned,
        wantAssertionsSigned } = loadSpFlags(xDoc);


    const spInfo = {
        entityID,
        displayInformation,
        validUntil,
        protocolSupport,
        authnRequestsSigned,
        wantAssertionsSigned,
        nameIDFormats,
        assertionConsumerServices,
        singleLogoutServices,
        digestMethods,
        signingMethods
    }

    return spInfo;
}


function loadSingleLogoutServices(xDoc) {
 
    const select           = xpath.useNamespaces(NAMESPACES);
    const xSpSsoDescriptor = select(`/md:EntityDescriptor/md:SPSSODescriptor`, xDoc)[0];

    const xSingleLogoutServices = select(`./md:SingleLogoutService`,   xSpSsoDescriptor); 

    const singleLogoutServices = xSingleLogoutServices.map(x=>{
        const binding   = select(`./@Binding`, x)[0]?.value;
        const location  = select(`./@Location`,x)[0]?.value;

        return { binding, location, }
    });

    return singleLogoutServices;
}

function loadAssertionConsumerServices(xDoc) {
 
    const select           = xpath.useNamespaces(NAMESPACES);
    const xSpSsoDescriptor = select(`/md:EntityDescriptor/md:SPSSODescriptor`, xDoc)[0];

    const xAssertionConsumerServices = select(`./md:AssertionConsumerService`,   xSpSsoDescriptor); 

    const assertionConsumerServices = xAssertionConsumerServices.map(x=>{
        const binding   = select(`./@Binding`,   x)[0]?.value;
        const location  = select(`./@Location`,  x)[0]?.value;
        const isDefault = select(`./@isDefault`, x)[0]?.value == 'true';
        let   index     = select(`./@index`,     x)[0]?.value;

        if(index)
            index = parseInt(index);

        return { binding, location, isDefault, index }
    })

    assertionConsumerServices.sort((a,b) => {

        const indexA = a.index ?? 1000;
        const indexB = b.index ?? 1000;

        if(indexA<indexB) return -1;
        if(indexA>indexB) return  1;

        return 0

    });

    return assertionConsumerServices;    
}

function loadNameIDFormats(xDoc) {

    const select           = xpath.useNamespaces(NAMESPACES);
    const xSpSsoDescriptor = select(`/md:EntityDescriptor/md:SPSSODescriptor`, xDoc)[0];
    const nameIDFormats    = select(`./md:NameIDFormat`, xSpSsoDescriptor).map(n=>n.textContent);

    return nameIDFormats;
}

function loadSpFlags(xDoc) {

    const select           = xpath.useNamespaces(NAMESPACES);
    const xSpSsoDescriptor = select(`/md:EntityDescriptor/md:SPSSODescriptor`, xDoc)[0];

    const protocolSupport      = select(`./@protocolSupportEnumeration`,   xSpSsoDescriptor)[0]?.value; //"urn:oasis:names:tc:SAML:2.0:protocol" 
    const authnRequestsSigned  = select(`./@AuthnRequestsSigned`,          xSpSsoDescriptor)[0]?.value == 'true'; 
    const wantAssertionsSigned = select(`./@WantAssertionsSigned`,         xSpSsoDescriptor)[0]?.value == 'true'; 

    return {
        protocolSupport,
        authnRequestsSigned,
        wantAssertionsSigned
    }
}

function loadSigningMethods(xDoc) {

    const select = xpath.useNamespaces(NAMESPACES);
    const algs   = select(`/md:EntityDescriptor/md:Extensions/alg:SigningMethod/@Algorithm`, xDoc).map(alg=>alg?.value);

    return algs;
}

function loadDigestMethods(xDoc) {

    const select = xpath.useNamespaces(NAMESPACES);
    const algs   = select(`/md:EntityDescriptor/md:Extensions/alg:DigestMethod/@Algorithm`, xDoc).map(alg=>alg?.value);

    return algs;
}

function loadEntityID(xDoc) {

    const select   = xpath.useNamespaces(NAMESPACES);
    const entityID = select(`/md:EntityDescriptor/@entityID`,xDoc)[0]?.value 

    if(!entityID)
        throw new Error("entityID not found in SP metadata")

    return entityID;
}

function loadValidUntil(xDoc) {

    const select = xpath.useNamespaces({ "md":  "urn:oasis:names:tc:SAML:2.0:metadata" });

    let validUntil = select(`/md:EntityDescriptor/@validUntil`,                    xDoc)[0]?.value 
                  || select(`/md:EntityDescriptor/md:SPSSODescriptor/@validUntil`, xDoc)[0]?.value;

    if(validUntil)
        validUntil = new Date(validUntil);

    return validUntil;
}

function loadDisplayInformation(xDoc) {

    const select = xpath.useNamespaces(NAMESPACES);

    const xUIInfo = select(`/md:EntityDescriptor/md:SPSSODescriptor/md:Extensions/mdui:UIInfo`, xDoc)[0];

    if(!xUIInfo)
        return;

    const displayName = loadLString(select(`./mdui:DisplayName`, xUIInfo));
    const description = loadLString(select(`./mdui:Description`, xUIInfo));
    const logoUrl     = select(`./mdui:Logo`,        xUIInfo)[0]?.textContent;

    return {
        displayName,
        description,
        logoUrl
    }
}

function loadLString(xmlLocalizedText) {

    if(!xmlLocalizedText || !xmlLocalizedText.lenght)
        return;

    const text = {};
        
    xmlLocalizedText.forEach(x => {

        const locale = select('./@xml:lang').value;
        const text   = x.textContent;

        text[locale] = text;

    });

    return text;

}
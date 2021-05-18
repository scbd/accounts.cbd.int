var document = { location : { hostname: '' }  };

var DOMAINS = ["cbd.int", "staging.cbd.int", "cbddev.xyz"];
var HOSTS   = ["www", "absch", "chm", "bch", "beta.bch"];

var trustedHosts = [
    [/^staging\.cbd\.int$/i, /.*\.staging\.cbd\.int$/i],
    [/^cbddev\.xyz$/i, /.*\.cbddev\.xyz$/i],
    [/^cbd\.int$/i, /.*\.cbd\.int$/i]
];

for(domain of DOMAINS) {

    document.location.hostname = `accounts.${domain}`;

    for(otherDomain of DOMAINS) {

        receiveMessage({origin: `http://localhost`});
        receiveMessage({origin: `http://localhost:1234`});
    
        for(host        of HOSTS) {
    //   receiveMessage({origin:  `http://${host}.${otherDomain}`});
            receiveMessage({origin: `https://${host}.${otherDomain}`});
        }
    }
}

function receiveMessage(event) {

    var secureDomain = document.location.hostname.replace(/[^\.]+\./, '');
    var origin = event.origin;

    if(origin=='http://localhost' || /^http:\/\/localhost:/.test(origin)) origin = 'https://localhost.'+secureDomain;

    var originDomain = origin.match(/(?:^(https)\:\/\/)([^\.]+)\.([^\/]+)/)[3];
    var isTrustedDomain = false;

    all:for (var j = 0; j < trustedHosts.length; j++) {
        var domainMatched = false;
        var originMatched = false;
        for (var i = 0; i < trustedHosts[j].length; i++) {
            var trustedHost = trustedHosts[j][i];
            // If the secure domain was matched then the origin domain needs to be on same domain, case for 4 level domains
            // eg absch.staging.cbd.int
            domainMatched = domainMatched || trustedHost.test(secureDomain);
            originMatched = originMatched || trustedHost.test(originDomain);
            
            if(domainMatched && originMatched){
                isTrustedDomain = true;
                break all;
            }
        }
        
        if(domainMatched || originMatched)
            break;
    }
    if(!isTrustedDomain){
        console.log(`isTrusted: ${isTrustedDomain?'Yes':'No '} - Accessing ${document.location.hostname} from ${event.origin}`);
    }
    return console.log(`isTrusted: ${isTrustedDomain?'Yes':'No '} - Accessing ${document.location.hostname} from ${event.origin}`);

    if(isTrustedDomain){

        var message = JSON.parse(event.data);

        if(message.type=='getAuthenticationToken') {
            
            var response = { 
                type                : 'authenticationToken', 
                authenticationToken : getCookie('authenticationToken'), 
                authenticationEmail : getCookie('email'), 
                expiration         : getCookie('expiration') 
            };
            if(response && response.expiration){
                if(new Date(response.expiration).getTime() <= new Date().getTime()){
                    response.sessionexpired = true;
                }
            }
            window.parent.postMessage(JSON.stringify(response), event.origin);
        }

        if(message.type=='setAuthenticationToken') {

            if(message.authenticationToken) setCookie('authenticationToken', message.authenticationToken, message.expiration);
            else                            setCookie('authenticationToken', null); //Delete the cookie

            if(message.authenticationEmail)        setCookie('email', message.authenticationEmail, 365);
            if(message.authenticationEmail===null) setCookie('email', null); //Delete the cookie

            if(message.expiration)        setCookie('expiration', message.expiration, 365);
            else                          setCookie('expiration', null); //Delete the cookie
        }
    }
}

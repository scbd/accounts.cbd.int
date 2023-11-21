export default function loadAbsoluteUrl() {

    return (req, res, next)=> {
        const path = req.originalUrl;
        const host = req.headers['x-forwarded-host'] || req.headers['host'];
    
        let protocol = req.headers['x-forwarded-proto'] || req.protocol;
        
        if(req.headers['x-iisnode-https'] && req.headers['x-iisnode-https'] == 'on') 
            protocol = 'https';

        req.absoluteUrl = `${protocol}://${host}${path}`;

        next()
    }
  }
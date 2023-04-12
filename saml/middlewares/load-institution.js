import ApiError from '../helpers/api-error.js';

export default function({ appDomain }) {
    
  return (req,res,next) => {

    let institution = req.headers['x-institution'];
    
    if(!institution) {
      const host = req.headers['x-forwarded-host'] || req.headers['host'];

      const institutionRe = /^([a-z]+)\..*/;
  
      if(institutionRe.test(host))
        institution = host.replace(institutionRe, "$1");
    }

    if(!institution)
        throw new ApiError(400, "Invalid institution");
    
    req.institution       = institution;
    req.institutionDomain = `${institution}.${appDomain}`;
    
    next();
  };
}

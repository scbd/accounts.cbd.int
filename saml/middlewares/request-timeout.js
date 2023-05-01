import ApiError from '../services/api-error.js';

export default function (options = {}) {

    const ttl = options?.ttl || 20 * 1000;

    console.log(`Request will automatically timeout after: ${ttl / 1000} seconds if no response is sent`);

    return (req, res, next) => {

        res.setTimeout(ttl, function(){
            const err = new ApiError(408, 'Request timed out. Please try again');
            res.status(err.status).send({ status: err.status, message: err.message });
        });
       
       next();
    }
}
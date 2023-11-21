export default function asyncWrap(asyncMiddleware) {
    
    return async (req,res,next) => {

        try {
            await asyncMiddleware(req,res,next);
        }
        catch(e) {
            next(e);
        }
    }
}
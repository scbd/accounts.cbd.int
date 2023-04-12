import ApiError from '../helpers/api-error.js';

export default function({ roles }) {

  roles = roles || [];

  return (req,res,next) => {
    
    if(!req.user)
      throw new ApiError(401, "Authentication required")

    if(roles.length)
      throw new Error("Roles/Tags checking not implemented")

    next();
  }
}

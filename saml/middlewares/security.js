import ApiError from '../services/api-error.js';

export default  () => (req, res ,next) => {
    const { userID, isAuthenticated } = req.user || {}

    if(!isAuthenticated || userID == 1)
      throw new ApiError(401, "Authentication required")

    next();
}

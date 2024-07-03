import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

/**
 * 
 * @param {boolean} validateAdmin 
 * @returns void
 */
const validateUser = (validateAdmin = false) => (req, res, next) => {
    const authToken = req.headers.authorization;


    if (!authToken) throw new ApiError(401, "token missing");

    if (!authToken.startsWith("Bearer ")) throw new ApiError(401, "Bearer token required");

    const token = authToken.replace("Bearer ", "");
    const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
    if (!decodedToken) throw new ApiError(401, "token expired or invalid.")


    // pass the request further if the requester is (user and validateAdmiN=false)
    // or requester is (admin and validateAdmin=true)
    if (!validateAdmin || (validateAdmin && decodedToken.admin)) {
        req.user = { _id: decodedToken._id, email: decodedToken.email, admin: decodedToken.admin };
        next()
    } else {
        // here the requester is (user) trying to get into admin territory
        throw new ApiError(403, "Forbidden for normal user");
    }
}

export { validateUser };
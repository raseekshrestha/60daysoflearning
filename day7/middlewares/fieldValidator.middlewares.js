import { ApiError } from "../utils/ApiError.js"

const fieldValidator = (requiredFields) => (req, res, next) => {
    const missingFields = requiredFields.filter(field => !req.body[field])
    if (missingFields.length > 0) {
        throw new ApiError(400, `field ${missingFields.join(", ")} is required`)
    }
    next()

}
export default fieldValidator;
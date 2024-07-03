import { ApiError } from "../utils/ApiError.js"


const fieldValidator = (requiredFields) => (req, res, next) => {
    const emptyFields = requiredFields.filter(field => !req.body[field])
    if (emptyFields.length > 0) {
        throw new ApiError(400, emptyFields.join(",") + " field missing")
    }
    next()
}

export { fieldValidator };
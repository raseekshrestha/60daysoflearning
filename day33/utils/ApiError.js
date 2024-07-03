
class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong :(", data) {
        super(message);
        this.statusCode = statusCode || 500;
        this.message = message;

    }
}

export { ApiError };
class BassError extends Error {
    constructor(statusCode, isOperational, message) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}

module.exports = BassError;
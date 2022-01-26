const BassError = require('./BaseError');
class NotFoundError extends BassError {
    constructor(message) {
        super(404, true, message);
    }
}

module.exports = NotFoundError;
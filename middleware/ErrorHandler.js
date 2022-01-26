const BaseError = require('../lib/BaseError');
const PageNotFoundError = require('../lib/PageNotFoundError');

function listenUncaughtError(server) {
    process.on('uncaughtException', (err) => {
        handleUncaughtError(err, server);
    });

    process.on('unhandledRejection', (reason) => {
        handleUncaughtError(reason, server);
    })
}

function handleUncaughtError(reason, server) {
    if(reason instanceof Error) {
        console.log(reason.stack);
    }
    else {
        console.log(reason);
    }

    // Not accept requests anymore
    server.close(err => {
        if(err) {
            console.err(err.stack);
        }
        else {
            console.info('Server closed successfully');
        }
        process.exit(1);
    });
}

function logError(err) {
    if(err instanceof Error) {
        console.log(err.stack);
    }
    else {
        console.log(err);
    }
}

function isOperational(err) {
    if(err instanceof BaseError) {
        return err.isOperational;
    }
    return false;
}

function handleError(err, req, res, next) {
    if(isOperational(err)) {
        if(err instanceof PageNotFoundError) {
            return res.status(404).end();
        }
        else {
            return res.status(err.statusCode || 500).json(
                {
                    error: {message: err.message}
                }
            );
        }
    }
    else {
        logError(err);
        process.emit('uncaughtException', err);
        res.status(500).end();
    }
}

module.exports = {
    handleError,
    listenUncaughtError
}
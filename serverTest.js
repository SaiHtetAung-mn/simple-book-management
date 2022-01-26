const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);

app.get('/', (req, res, next) => {
    res.status(200).end("Lee pal");
});

app.get('/*', (req, res, next) => {
    // let isFromBrowser = new RegExp('text/htm', 'gi').test(req.headers.accept);
    // if(isFromBrowser) {
    //     return res.status(404).end("404 not found");
    // }
    next(new Error("Lee"));
});

app.use(ErrorHandler().handleError);

server.listen(3000, () => {
    console.log(`Server running...`);

    process.on('uncaughtException', (err) => {
        console.log(err.stack);
        server.close((err) => {
            if(err) {
                console.log(err.message);
            }
            else {
                console.log('Server closed successfully...');
            }
            process.exit(1);
        })
    });
});


class BaseError extends Error {
    constructor (statusCode, isOperational, message) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}

class ApiNotFoundError extends BaseError {
    constructor(message) {
        super(404, true, message);
    }
}

function isOperationalError(err) {
    if(err instanceof BaseError) {
        return err.isOperational;
    }
    return false;
}

function ErrorHandler() {
    function logError(err) {
        console.log(err.stack);
    }

    this.handleError = function(err, req, res, next) {
        if(isOperationalError(err)) {
            logError(err);
            res.status(err.statusCode || 500).json(
                {error: 
                    {message: err.message}
                }
            );
        }
        else {
            res.status(500).end();
            process.emit('uncaughtException', err);
        }
    }
    return this;
}

ErrorHandler();
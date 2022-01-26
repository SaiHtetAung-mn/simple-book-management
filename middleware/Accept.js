const PageNotFoundError = require('../lib/PageNotFoundError');

module.exports = function(req, res, next) {
    // check the request comes from browser and if true, return not found

    let accept = req.headers.accept;
    const regex = /text\/htm/gi;
    if(regex.test(accept)) {
        next(new PageNotFoundError('Page not found'));
    }
    else {
        next();
    }
}
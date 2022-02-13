const http = require('http');
const express = require('express');
const ErrorHandler = require('./middleware/ErrorHandler');
let server_instance = null;

// Routers
const indexRouter = require('./routes/index.route');
const bookRouter = require('./routes/book.route');

class Server {
    constructor() {
        if(!server_instance || !(server_instance instanceof Server)) {
            server_instance = this;
            this.initApp();
            this.configApp();
            this.handleRoute();
        }
        return server_instance;
    }

    initApp() {
        this.port = process.env.port || 4000;
        this.app = express();
        this.server = http.createServer(this.app);
    }
    configApp() {
        this.app.set('view engine', 'ejs');
        this.app.use(express.json());
        this.app.use("/public", express.static(__dirname+"/public"));

        // listen for process uncaught error
        ErrorHandler.listenUncaughtError(this.server);
    }
    handleRoute() {
        this.app.use('/', indexRouter);
        this.app.use('/api/books', bookRouter);

        // Page not found route
        this.app.get("/*", (req, res, next) => res.status(404).end('Page not found'));

        // Error middleware
        this.app.use(ErrorHandler.handleError);
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log(`Server running on ${this.port}`);
        })
    }
}

module.exports = Server;

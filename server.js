const http = require('http');
const express = require('express');
let server_instance = null;

// Routers
const indexRouter = require('./routes/index.route');
const bookRouter = require('./routes/book.route');

class Server {
    port = process.env.port || 3000;

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
        this.app = express();
        this.server = http.createServer(this.app);
    }
    configApp() {
        this.app.set('view engine', 'ejs');
        this.app.use(express.json());
        this.app.use("/public", express.static(__dirname+"/public"));
    }
    handleRoute() {
        this.app.use('/', indexRouter);
        this.app.use('/books', bookRouter);

        // Route exception
        this.app.all("/*", (req, res, next) => res.status(404).end());
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log(`Server running on ${this.port}`);
        })
    }
}

module.exports = Server;
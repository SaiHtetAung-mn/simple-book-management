const express = require('express');
const database = require('../lib/Database');
const indexRouter = express.Router();

indexRouter.get('/', async (req, res, next) => {
    try {
        res.setHeader('content-type', 'text/html');
        let categories = await database.getAllCategories();
        res.locals.categories = categories;
        res.render('index');
    }
    catch(err) {
        next(err);
    }
});

module.exports = indexRouter;
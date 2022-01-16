const express = require('express');
const database = require('../lib/database');
const indexRouter = express.Router();

indexRouter.get('/', async (req, res) => {
    let categories = await database.getAllCategories() || [];
    res.locals.categories = categories;
    res.render('index');
});

module.exports = indexRouter;
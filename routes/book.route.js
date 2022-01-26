const express = require('express');
const AcceptMiddleware = require('../middleware/Accept');
const database = require('../lib/Database');
const BassError = require('../lib/BaseError');
const bookRouter = express.Router();

bookRouter.use(AcceptMiddleware);

bookRouter.route('/')
.get(async (req, res, next) => {
    try {
        let b = {};
        if(req.query.filter) {
            const category_id = req.query.filter.category ?? '';
            b = await database.getBooksFilteredByCategory(category_id);
        }
        else if(req.query.search) {
            const query = req.query.search.title ?? '';
            b = await database.getBooksBySearchQuery(query);
        }
        else {
            b = await database.getAllBooks();
        }
        res.status(200).json(b);
    }
    catch(err) {
        next(err);
    }
})

.post(async (req, res, next) => {
    let book = req.body;
    try {
        let book_props = ['isbn', 'title', 'author', 'category_id'];
        let isEveryProp = book_props.every(prop => book.hasOwnProperty(prop));
        if(!isEveryProp) {
            return next(new BassError(400, true, 'Incorrect parameter'));
        }
        let addedBook = await database.insertOneBook(book);
        let category = await database.getCategoryById(addedBook['category_id']);
        addedBook['category_name'] = category['name'];
        if(addedBook) {
            res.status(201).json(addedBook);
        }
    }
    catch(err) {
        next(err);
    }
})

bookRouter.delete('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let isDone = await database.deleteBookById(id);
        if(isDone) {
            res.status(200).end();
        }
        res.status(200).end();
    }
    catch(err) {
        next(err);
    }
})

.put('/:id', async (req, res, next) => {
    try {
        let isDone = await database.updateBookById(req.params.id, req.body ?? {});
        if(isDone) {
            res.status(200).end();
        }
    }
    catch(err) {
        next(err);
    }
})


module.exports = bookRouter;
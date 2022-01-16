const express = require('express');
const {Book} = require('../lib/book');
const database = require('../lib/database');
const bookRouter = express.Router();

bookRouter.route('/')
.get(async (req, res) => {
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
        console.log(err);
        res.status(500).end();
    }
})

.post(async (req, res) => {
    let book = req.body;
    try {
        let book_props = ['isbn', 'title', 'author', 'category_id'];
        let isEveryProp = book_props.every(prop => book.hasOwnProperty(prop));
        if(!isEveryProp) {
            return res.status(400).end();
        }
        let addedBook = await database.insertOneBook(book);
        let category = await database.getCategoryById(addedBook['category_id']);
        addedBook['category_name'] = category['name'];
        if(addedBook) {
            res.status(201).json(addedBook);
        }
    }
    catch(err) {
        res.status(500).end();
    }
})

bookRouter.delete('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let isDone = await database.deleteBookById(id);
        if(isDone) {
            res.status(200).end();
        }
        res.status(200).end();
    }
    catch(err) {
        console.log(err);
        res.status(400).end();
    }
})

.put('/:id', async (req, res) => {
    try {
        let isDone = await database.updateBookById(req.params.id, req.body ?? {});
        if(isDone) {
            res.status(200).end();
        }
        else {
            res.status(400).end();
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).end();
    }
})


module.exports = bookRouter;
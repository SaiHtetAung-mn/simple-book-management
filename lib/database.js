const fs = require('fs');
const path = require('path');
const bookFilePath = path.join(__dirname, '..', 'db', 'books.json');
const categoryFilePath = path.join(__dirname, '..', 'db', 'category.json');

let books = require('../db/books.json');
let categories = require('../db/category.json');

function getAllBooks() {
    return new Promise((resolve, reject) => {
        /* books from above can be returned but this just return reference 
        so if somewhere this value is changed, books props also change*/
        try {
            fs.readFile(bookFilePath,async (err, data) => {
                if(err) {
                    throw err;
                }
                else {
                    let b = JSON.parse(data.toString());
                    for(let i=0; i<b.length; i++) {
                        let category = await getCategoryById(b[i]['category_id']);
                        b[i]['category_name'] = category['name'];
                    }
                    resolve(b);
                }
            })
        }
        catch(err) {
            reject(err);
        }
    });
}

function getBookById(id) {
    return new Promise((resolve, reject) => {
        let book = '';
        for(let i=0; i<books.length; i++) {
            if(books[i]['id'] == id) {
                book = books[i];
                break;
            }
        }
        resolve(book);
    })
}

function  getBooksFilteredByCategory(category_id) {
    return new Promise(async (resolve, reject) => {
        try {
            let allBooks = await getAllBooks() || [];
            let filteredBooks = allBooks.filter(b => {
                return b['category_id'] == category_id;
            });
            resolve(filteredBooks);
        }
        catch(err) {
            reject(err);
        }
    })
}

function getBooksBySearchQuery(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let allBooks = await getAllBooks() || [];
            const regex = new RegExp(`${query}`, 'gi');
            let filteredBooks = allBooks.filter(b => {
                return regex.test(b['title']);
            });
            resolve(filteredBooks);
        }
        catch(err) {
            reject(err);
        }
    })
}

function getAllCategories() {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile(categoryFilePath, (err, data) => {
                if(err) {
                    throw err;
                }
                else {
                    resolve(JSON.parse(data.toString()));
                }
            })
        }
        catch(err) {
            reject(err);
        }
    })
}

function getCategoryById(id) {
    return new Promise((resolve, reject) => {
        let category = '';
        for(let i=0; i<categories.length; i++) {
            if(categories[i]['id'] == id) {
                category = categories[i];
                break;
            }
        }
        resolve(category);
    })
}

function insertOneBook(book={}) {
    return new Promise(async (resolve, reject) => {
        try {
            let newId = String(Date.now());
            book.id = newId;
            books.push(book);
            updateBooks();
            resolve(book);
        }
        catch(err) {
            reject(err);
        }
    });
}

function updateBookById(id, book={}) {
    return new Promise((resolve, reject) => {
        try {
            let flag = false;
            for(let i=0; i<books.length; i++) {
                if(books[i]['id'] ==id) {
                    ['isbn', 'title', 'author', 'category_id'].forEach(prop => {
                        if(book[prop]) {
                            books[i][prop] = book[prop];
                        }
                    });
                    flag = true;
                    break;
                }
            }
            if(flag) {
                updateBooks();
                resolve(true);
            }
            else {
                reject(false);
            }
        }
        catch(err) {
            reject(err);
        }
    })
}

function deleteBookById(id) {
    return new Promise(async (resolve, reject) => {
        let book = await getBookById(id);
        if(book) {
            books = books.filter(b => {
                return b['id'] != id;
            });
            updateBooks();
            resolve(true);
        }
        else {
            reject(new Error(`No book with id: ${id}`));
        }
    })
}

function updateBooks() {
    updateDatabase(bookFilePath, books);
}

function updateCategories() {
    updateDatabase(categoryFilePath, categories);
}

function updateDatabase(filePath, data) {
    try {
        fs.stat(filePath, (err, stats) => {
            if(err) {
                throw err;
            }
            else if(stats.isDirectory()) {
                throw new Error('No such file exists');
            }
        });
        let writeStream = fs.createWriteStream(filePath);
        let d = JSON.stringify(data);
        writeStream.write(d, err => {
            if(err) {
                throw new Error('Error updating books database');
            }
        })
    }
    catch(err) {
        console.log(err.message);
    }
}

module.exports = {
    getAllBooks, 
    getAllCategories, 
    getCategoryById, 
    insertOneBook, 
    deleteBookById,
    updateBookById,
    getBooksFilteredByCategory,
    getBooksBySearchQuery
};
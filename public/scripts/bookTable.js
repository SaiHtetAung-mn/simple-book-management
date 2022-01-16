import * as addBookModal from './addBook.js';
import * as updateBookModal from './updateBook.js';

const book_table_body = document.getElementById('book-table-body');
const add_book_btn = document.getElementById('add-book-btn');
const category_filter = document.getElementById('category-filter');
const book_search = document.getElementById('book-search');
const search_result_text = document.getElementById('search-result');

export function initialize() {
    initEventListener();
    fetchBooks(null, null);
}

function initEventListener() {
    add_book_btn.addEventListener('click',  addBookModal.openModal);
    category_filter.addEventListener('change', filterByCategory);
    book_search.addEventListener('change', searchBook);
}

export async function fetchBooks(categoryIdToFilter=null, titleToSearch=null) {
    let url = '/books';
    if(categoryIdToFilter) {
        url += `?filter[category]=${categoryIdToFilter}`;
    }
    else if(titleToSearch) {
        url += `?search[title]=${titleToSearch}`;
    }
    const options = {
        method: 'GET'
    };
    try {
        let books = await (await fetch(url, options)).json();
        renderAllBooks(books);
    }
    catch(err) {
        console.log(err.message);
    }
}

function filterByCategory() {
    const categoryId = category_filter.value;
    if(categoryId == 'all') {
        fetchBooks(null, null); 
    }
    else {
        fetchBooks(categoryId, null);
    }
}

function searchBook() {
    const searchQuery = book_search.value;
    if(searchQuery) {
        search_result_text.classList.add('search-result-show');
    }
    else {
        search_result_text.classList.remove('search-result-show');
    }
    fetchBooks(null, searchQuery);
}

export function renderAllBooks(books=[]) {
    if(Array.isArray(books) && book_table_body) {
        book_table_body.innerHTML = ""; // clear table body 
        books.forEach(book => {
            let book_row = createBookRow(book);
            book_table_body.appendChild(book_row);
        })
    }
}

export function renderOneBook(book={}) {
    if(book_table_body) {
        let book_row = createBookRow(book);
        book_table_body.appendChild(book_row);
    }
}

function createBookRow(book) {
    let row = document.createElement('tr');
    const bookProps = ['isbn', 'title', 'author', 'category_name'];
    bookProps.forEach(book_prop => {
        let column = document.createElement('td');
        // column.classList.add('table-ellipsis');
        // column.setAttribute('title', `${book[book_prop]}`);
        column.innerText = book[book_prop] ?? '';
        row.appendChild(column);
    });
    let action_column = document.createElement('td');
    let edit_btn = createTableActionBtn(book, 'edit');
    let delete_btn = createTableActionBtn(book, 'delete');
    action_column.appendChild(edit_btn);
    action_column.appendChild(delete_btn);
    row.appendChild(action_column);
    return row;
}

function createTableActionBtn(book, actionType) {
    let button = document.createElement('button');
    button.classList.add('btn', 'table-btn');
    if(actionType == 'delete') {
        button.classList.add('table-delete-btn');
        button.innerText = 'Delete';
        button.addEventListener('click', () => {
            deleteBook(book.id);
        });
    }
    else {
        button.classList.add('table-edit-btn');
        button.innerText = 'Edit';
        button.addEventListener('click', () => {
            updateBook(book);
        })
    }
    
    return button;
}

export async function submitNewBook(book) {
    const url = '/books';
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        };
        let newBook = await (await fetch(url, options)).json();
        renderOneBook(newBook);
    }
    catch(err) {
        console.log(err.message);
    }
}

export async function submitUpdatedBook(book={}) {
    try {
        const url = `/books/${book.id ?? ''}`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        }
        let res = await fetch(url, options);
        if(res.ok) {
            let category_id = category_filter.value; // Current filter value
            fetchBooks(category_id, null);
        }
    }
    catch(err) {
        console.log(err);
    }
}

export function updateBook(book) {
    updateBookModal.openModal(book);
}

export async function deleteBook(id) {
    const url = `/books/${id}`;
    const options = {
        method: 'DELETE'
    };

    try {
        if((await fetch(url, options)).ok) {
            fetchBooks();
        }
    }
    catch(err) {
        console.log(err.message);
    }
}
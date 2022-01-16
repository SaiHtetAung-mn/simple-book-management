import { submitUpdatedBook } from "./bookTable.js";

const modal = document.getElementById('update-book-modal');
const modal_close_btn = document.getElementById('update-book-modal-close-btn');
const modal_submit_btn = document.getElementById('update-book-modal-submit-btn');

const isbn = document.getElementById('update-book-modal-isbn');
const title = document.getElementById('update-book-modal-title');
const author = document.getElementById('update-book-modal-author');
const category = document.getElementById('update-book-modal-category');

let iniBook = {}; // set value by passed var of openModal called on click edit button 

initialize();

function initialize() {
    if(modal_close_btn) {
        modal_close_btn.addEventListener('click', closeModal);
    }
    if(modal_submit_btn) {
        modal_submit_btn.addEventListener('click', updateBook);
    }
}

async function updateBook() {
    let updatedBook = {};
    if(isbn.value !== iniBook.isbn) {
        updatedBook.isbn = isbn.value;
    }
    if(title.value !== iniBook.title) {
        updatedBook.title = title.value;
    }
    if(author.value !== iniBook.author) {
        updatedBook.author = author.value;
    }
    if(category.value != iniBook['category_id']) {
        updatedBook['category_id'] = category.value;
    }

    if(Object.keys(updatedBook).length !== 0) {
        console.log('update');
        updatedBook.id = iniBook.id;
        submitUpdatedBook(updatedBook);
    }
    closeModal();
}

export function openModal(bookToUpdate) {
    iniBook = bookToUpdate;
    setModalFormValue(bookToUpdate);
    if(modal) {
        modal.style.display = "block";
    }
}

function setModalFormValue(book={}) {
    isbn.value = book.isbn ?? '';
    title.value = book.title ?? '';
    author.value = book.author ?? '';
    category.value = book['category_id'] ?? 1;
}

function closeModal() {
    if(modal) {
        modal.style.display = "none";
    }
}
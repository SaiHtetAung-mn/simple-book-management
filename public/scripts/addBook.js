import {submitNewBook} from "./bookTable.js";

const modal = document.getElementById('add-book-modal');
const modalForm = document.getElementById('add-book-modal-form');
const modal_close_btn = document.getElementById('add-book-modal-close-btn');
const modal_clear_btn = document.getElementById('add-book-modal-clear-btn');
const modal_submit_btn = document.getElementById('add-book-modal-submit-btn');

const isbn = document.getElementById('add-book-modal-isbn');
const title = document.getElementById('add-book-modal-title');
const author = document.getElementById('add-book-modal-author');
const category = document.getElementById('add-book-modal-category');

initialize();

function initialize() {
    if(modal_close_btn) {
        modal_close_btn.addEventListener('click', closeModal);
    }
    if(modal_clear_btn) {
        modal_clear_btn.addEventListener('click', clearForm);
    }
    if(modal_submit_btn) {
        modal_submit_btn.addEventListener('click', addBook);
    }
}

async function addBook() {
    const book = {
        isbn: isbn.value, 
        title: title.value, 
        author: author.value, 
        category_id: category.value
    };
    submitNewBook(book);
    closeModal();
}

export function openModal() {
    clearForm();
    if(modal) {
        modal.style.display = "block";
    }
}

function closeModal() {
    if(modal) {
        modal.style.display = "none";
    }
}

function clearForm() {
    if(modalForm) {
        modalForm.reset();
    }
}
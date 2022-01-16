export default function Book(book={}) {
    this.isbn = book.isbn ?? '';
    this.title = book.title ?? '';
    this.author = book.author ?? '';
    this.category = book.category ?? '';
}
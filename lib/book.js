function Book(book={}) {
    this.isbn = book.isbn ?? '';
    this.title = book.title ?? '';
    this.author = book.author ?? '';
    this.category = book.category ?? '';

    // return {
    //     getISBN: () => this.isbn,
    //     getTitle: () => this.title,
    //     getAuthor: () => this.author,
    //     getCategory: () => this.category,
    //     setISBN: (isbn) => {this.isbn = isbn},
    //     setTitle: (title) => {this.title = title},
    //     setAuthor: (author) => {this.author = author},
    //     setCategory: (category) => {this.category = category} 
    // }
} 

function bindBookArray(books=[]) {
    if(Array.isArray(books)) {
        let temp = books.map(book => {
            return new Book(book);
        });
        return temp;
    }
    return [];
}

module.exports = {Book, bindBookArray};
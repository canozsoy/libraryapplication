const bookAccess = require('../db_access/book_access');
const bookInstanceAccess = require('../db_access/bookinstance_access');
const authorAccess = require('../db_access/author_access');
const genreAccess = require('../db_access/genre_access');

const bookList = async () => bookAccess.findAllBooks();

const getBooks = async () => bookAccess.findBookByQuery({}, 'title');

const getBookById = async (id) => bookAccess.findBookById(id);

const getBookDetail = async (id) => {
    const [book, bookInstance] = await Promise.all([
        bookAccess.findBookByIdPopulateAuthorAndGenre(id),
        bookInstanceAccess.findBookInstanceByQuery({ book: id }, {}),
    ]);

    if (!book) {
        const err = (new Error('Book not Found'));
        err.status = 404;
        throw err;
    }

    return { book, bookInstance };
};

const bookCreateGet = async () => {
    const [authors, genres] = await Promise.all([
        authorAccess.findAllAuthors(),
        genreAccess.findAllGenres(),
    ]);

    return { authors, genres };
};

const bookCreatePost = async (body) => bookAccess.createBook(body);

const bookDeleteGet = async (id) => {
    const [book, bookInstance] = await Promise.all([
        bookAccess.findBookById(id),
        bookInstanceAccess.findBookInstanceByQuery({ book: id }, {}),
    ]);

    if (!book) {
        throw new Error('BOOK_NOT FOUND');
    }

    return { book, bookInstance };
};

const deleteBookPost = async (id) => {
    const { book, bookInstance } = await bookDeleteGet(id);

    if (bookInstance.length > 0) {
        throw {
            book,
            bookInstance,
        };
    }

    await bookAccess.deleteBook(id);
};

const bookUpdateGet = async (id) => {
    const [book, { authors, genres }] = await Promise.all([
        bookAccess.findBookByIdPopulateAuthorAndGenre(id),
        bookCreateGet(),
    ]);

    if (!book) {
        const err = new Error('Book not found');
        err.status = 404;
        throw err;
    }

    // Mark our selected genres as checked
    genres.forEach((x, i) => {
        book.genre.forEach((y, j) => {
            if (genres[i].id.toString() === book.genre[j].id.toString()) {
                genres[i].checked = 'true';
            }
        });
    });

    return { book, authors, genres };
};

const bookUpdatePost = (id, body) => bookAccess.updateBook(id, body);

module.exports = {
    getBooks,
    getBookById,
    bookList,
    getBookDetail,
    bookCreateGet,
    bookDeleteGet,
    deleteBookPost,
    bookUpdateGet,
    bookUpdatePost,
    bookCreatePost,
};

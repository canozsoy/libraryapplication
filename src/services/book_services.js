const Book = require('../models/book');
const authorServices = require('./author_services');
const genreServices = require('./genre_services');
const bookInstanceServices = require('./bookinstance_services');

const findBookByAuthorId = async (id) => Book.find(
    { author: id },
    'title summary',
).exec();

const findAllBooks = async () => Book.find({}, 'title author')
    .populate('author').exec();

const findBookById = async (id) => Book.findById(id)
    .exec();

const findBookByIdPopulateAuthorAndGenre = async (id) => Book.findById(id)
    .populate('author')
    .populate('genre')
    .exec();

const getBookDetail = async (id) => {
    const [book, bookInstance] = await Promise.all([
        findBookByIdPopulateAuthorAndGenre(id),
        bookInstanceServices.findBookInstanceByBookId(id),
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
        authorServices.findAllAuthors(),
        genreServices.findAllGenres(),
    ]);

    return { authors, genres };
};

const createBook = async (body) => {
    const book = new Book(body);
    await book.save();

    return book;
};

const bookDeleteGet = async (id) => {
    const [book, bookInstance] = await Promise.all([
        findBookById(id),
        bookInstanceServices.findBookInstanceByBookId(id),
    ]);

    if (!book) {
        throw new Error('BOOK_NOT FOUND');
    }

    return { book, bookInstance };
};

const deleteBook = async (id) => Book.findByIdAndRemove(id);

const deleteBookPost = async (id) => {
    const { book, bookInstance } = await bookDeleteGet(id);

    if (bookInstance.length > 0) {
        throw {
            book,
            bookInstance,
        };
    }

    await deleteBook(id);
};

const bookUpdateGet = async (id) => {
    const [book, { authors, genres }] = await Promise.all([
        findBookByIdPopulateAuthorAndGenre(id),
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

const updateBook = async (id, body) => Book.findByIdAndUpdate(id, body, {}).exec();

const bookUpdatePost = (id, body) => updateBook(id, body);

module.exports = {
    findBookByAuthorId,
    findAllBooks,
    getBookDetail,
    bookCreateGet,
    createBook,
    bookDeleteGet,
    deleteBookPost,
    bookUpdateGet,
    bookUpdatePost,
};

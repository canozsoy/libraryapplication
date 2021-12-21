const Book = require('../models/book');

const createBook = async (body) => {
    const book = new Book(body);
    await book.save();

    return book;
};

const deleteBook = async (id) => Book.findByIdAndRemove(id);

const findBookByQuery = async (query, select) => Book.find(
    query,
    select,
).exec();

const findAllBooks = async () => Book.find({}, 'title author')
    .populate('author').exec();

const findBookById = async (id) => Book.findById(id)
    .exec();

const updateBook = async (id, body) => Book.findByIdAndUpdate(id, body, {}).exec();

const findBookByIdPopulateAuthorAndGenre = async (id) => Book.findById(id)
    .populate('author')
    .populate('genre')
    .exec();

module.exports = {
    createBook,
    deleteBook,
    findBookByQuery,
    findAllBooks,
    findBookById,
    findBookByIdPopulateAuthorAndGenre,
    updateBook,
};

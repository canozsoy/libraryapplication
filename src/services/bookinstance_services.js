const bookInstanceAccess = require('../db_access/bookinstance_access');
const bookAccess = require('../db_access/book_access');

const bookInstanceList = async () => bookInstanceAccess.findAllBookInstances('book');

const bookInstanceDetail = async (id) => {
    const bookInstance = await bookInstanceAccess.findBookInstanceById(id, 'book');

    if (!bookInstance) {
        const err = new Error('Book copy not found');
        err.status = 404;
        throw err;
    }

    return bookInstance;
};

const bookInstanceCreateGet = async () => bookAccess.findBookByQuery({}, 'title');

const bookInstanceCreatePost = async (body) => bookInstanceAccess.createBookInstance(body);

const bookInstanceDeleteGet = async (id) => {
    const [book, imprint] = await Promise.all([
        bookInstanceAccess.findBookInstanceById(id, 'book'),
        bookInstanceAccess.findBookInstanceByQuery({ book: id }, 'imprint'),
    ]);

    if (!book) {
        throw new Error('NOT_FOUND_BOOK');
    }

    return { book, imprint };
};

const bookInstanceDeletePost = async (id) => {
    await Promise.all([
        bookInstanceAccess.findBookInstanceById(id, 'book'),
        bookInstanceAccess.findBookInstanceByQuery({ book: id }, 'imprint'),
    ]);

    await bookInstanceAccess.findAndRemoveBookInstanceById(id);
};

const bookInstanceUpdateGet = async (id) => {
    const [bookInstance, book] = await Promise.all([
        bookInstanceAccess.findBookInstanceById(id, 'book'),
        bookAccess.findBookByQuery({}, {}),
    ]);

    if (!bookInstance) {
        const err = new Error('Book copy not found');
        err.status = 404;
        throw err;
    }

    return { bookInstance, book };
};

const bookInstanceUpdatePost = async (id, body) => bookInstanceAccess
    .findAndUpdateBookInstanceById(id, body);

module.exports = {
    bookInstanceList,
    bookInstanceDetail,
    bookInstanceCreateGet,
    bookInstanceCreatePost,
    bookInstanceDeleteGet,
    bookInstanceDeletePost,
    bookInstanceUpdateGet,
    bookInstanceUpdatePost,
};

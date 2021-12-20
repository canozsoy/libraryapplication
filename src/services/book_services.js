const Book = require('../models/book');

const findBookByAuthorId = async (id) => Book.find(
    { author: id },
    'title summary',
).exec();

module.exports = {
    findBookByAuthorId,
};

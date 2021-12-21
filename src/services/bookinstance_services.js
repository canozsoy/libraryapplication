const BookInstance = require('../models/bookinstance');

const findBookInstanceByBookId = (id) => BookInstance.find({ book: id })
    .exec();

module.exports = {
    findBookInstanceByBookId,
};

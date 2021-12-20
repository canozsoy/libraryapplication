const Book = require('../models/book');
const BookInstance = require('../models/bookinstance');
const Author = require('../models/author');
const Genre = require('../models/genre');

const index = async (req, res) => {
    let metaData;
    let error;
    try {
        metaData = await Promise.all([
            Book.countDocuments({}).exec(),
            BookInstance.countDocuments({}).exec(),
            BookInstance.countDocuments({ status: 'Available' }).exec(),
            Author.countDocuments({}).exec(),
            Genre.countDocuments({}).exec(),
        ]);
    } catch (err) {
        error = err;
    }
    return res.render('index', {
        title: 'Local Library Home',
        error,
        data: metaData,
    });
};

module.exports = {
    index,
};

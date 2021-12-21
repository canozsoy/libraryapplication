const { validationResult } = require('express-validator');
const bookServices = require('../services/book_services');

const createPost = async (req, res, next) => {
    const errors = validationResult(req);
    const { body } = req;

    if (!errors.isEmpty()) {
        let book;
        try {
            book = await bookServices.getBooks();
        } catch (err) {
            return next(err);
        }
        return res.render('bookinstance_form', {
            title: 'Create BookInstance',
            book_list: book,
            selected_book: body.id,
            errors: errors.array(),
            body,
        });
    }
    return next();
};

const updatePost = async (req, res, next) => {
    const errors = validationResult(req);
    const { body } = req;
    const { id } = req.params;
    // eslint-disable-next-line no-underscore-dangle
    body._id = id;

    if (!errors.isEmpty()) {
        let book;
        try {
            book = await bookServices.getBookById(id);
        } catch (err) {
            return next(err);
        }

        return res.render('bookinstance_form', {
            title: 'Update Book Instance',
            book_list: book,
            bookInstance: body,
        });
    }
    return next();
};

module.exports = {
    createPost,
    updatePost,
};

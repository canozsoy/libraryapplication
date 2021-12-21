const { validationResult } = require('express-validator');
const bookServices = require('../services/book_services');

const createPost = async (req, res, next) => {
    const errors = validationResult(req);
    const { body } = req;

    if (!errors.isEmpty()) {
        let authors;
        let genres;
        try {
            ({ authors, genres } = await bookServices.bookCreateGet());
        } catch (err) {
            return next(err);
        }

        genres.forEach((x, i) => {
            if (body.genre.indexOf(genres[i].id) > -1) {
                genres[i].checked = 'true';
            }
        });

        return res.render('book_form', {
            title: 'Create Book',
            authors,
            genres,
            book: body,
            errors: errors.array(),
        });
    }

    return next();
};

const updatePost = createPost;

module.exports = {
    createPost,
    updatePost,
};

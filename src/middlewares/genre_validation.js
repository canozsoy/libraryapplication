const { validationResult } = require('express-validator');
const genreServices = require('../services/genre_services');

const createPost = (req, res, next) => {
    const errors = validationResult(req);
    const { body } = req;

    if (!errors.isEmpty()) {
        return res.render('genre_form', {
            title: 'Create Genre',
            genre: body,
            errors: errors.array(),
        });
    }
    return next();
};

const updatePost = async (req, res, next) => {
    const { id } = req.params;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        let errorResult;
        try {
            errorResult = await genreServices.genreUpdateGet(id);
        } catch (err) {
            return next(err);
        }

        return res.render('author_form', {
            title: 'Update Genre',
            genre: errorResult,
            errors: errors.array(),
        });
    }

    return next();
};

module.exports = {
    createPost,
    updatePost,
};

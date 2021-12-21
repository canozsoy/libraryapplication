const { validationResult } = require('express-validator');
const authorServices = require('../services/author_services');

const createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('author_form', {
            title: 'Create Author',
            author: req.body,
            errors: errors.array(),
        });
    }
    return next();
};

const updatePost = async (req, res, next) => {
    const { id } = req.params;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        let oldAuthor;
        try {
            oldAuthor = await authorServices.authorUpdateGet(id);
        } catch (err) {
            return next(err);
        }

        return res.render('author_form', {
            title: 'Update Author',
            author: oldAuthor,
            errors: errors.array(),
        });
    }

    return next();
};

module.exports = {
    createPost,
    updatePost,
};

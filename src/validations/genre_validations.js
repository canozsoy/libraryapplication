const { body } = require('express-validator');

const createPost = body('name', 'Genre name required')
    .trim()
    .isLength({ min: 1 })
    .escape();

const updatePost = createPost;

module.exports = {
    createPost,
    updatePost,
};

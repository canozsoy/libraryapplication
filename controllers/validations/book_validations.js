const { body } = require('express-validator');

const createPost = [
    body('title', 'Title must not be empty.').trim()
        .isLength({ min: 1 })
        .escape(),
    body('author', 'Author must not be empty.').trim()
        .isLength({ min: 1 })
        .escape(),
    body('summary', 'Summary must not be empty.').trim()
        .isLength({ min: 1 })
        .escape(),
    body('isbn', 'ISBN must not be empty').trim()
        .isLength({ min: 1 })
        .escape(),
    body('genre.*').escape(),
];

const updatePost = createPost;

module.exports = {
    createPost,
    updatePost,
};

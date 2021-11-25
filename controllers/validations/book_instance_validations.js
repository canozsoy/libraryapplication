const { body } = require('express-validator');

const createPost = [
    body('book', 'Book must be specified')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('imprint', 'Imprint must be specified').trim()
        .isLength({ min: 1 })
        .escape(),
    body('status')
        .escape(),
    body('due_back', 'Invalid date')
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
];

const updatePost = [
    body('book', 'Book name must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('imprint', 'Imprint must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('due_back', 'Due back must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('status', 'Status must not be empty')
        .trim()
        .isLength({ min: 1 }),
];

module.exports = {
    createPost,
    updatePost,
};

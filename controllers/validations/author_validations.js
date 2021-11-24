const { body } = require('express-validator');

const createPostValidations = [
    body('first_name').trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('First name must be specified.')
        .isAlphanumeric()
        .withMessage('First name has non-alpha-numeric characters.'),
    body('family_name').trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Family name must be specified.')
        .isAlphanumeric()
        .withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth')
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    body('date_of_death', 'Invalid date of death')
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
];

const updatePost = [
    body('first_name', 'First name must be specified').trim()
        .isLength({ min: 1 })
        .escape(),
    body('family_name', 'Family name must be specified').trim()
        .isLength({ min: 1 })
        .escape(),
    body('date_of_birth', 'Invalid date of birth')
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    body('date_of_death', 'Invalid date of death')
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
];

module.exports = {
    createPostValidations,
    updatePost,
};

const async = require('async');
const { body, validationResult } = require('express-validator');
const Author = require('../models/author');
const Book = require('../models/book');

const authorList = (req, res, next) => {
    Author.find()
        .sort([['family_name', 'ascending']])
        .exec((err, res1) => {
            if (err) {
                return next(err);
            }
            res.render('author_list', { title: 'Author List', author_list: res1 });
        });
};

const authorDetail = (req, res, next) => {
    async.parallel({
        author(callback) {
            Author.findById(req.params.id)
                .exec(callback);
        },
        author_books(callback) {
            Book.find({ author: req.params.id }, 'title summary')
                .exec(callback);
        },
    }, (err, results) => {
        if (err) return next(err);
        if (results.author == null) {
            const err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.author_books });
    });
};

const authorCreateGet = (req, res) => {
    res.render('author_form', { title: 'Create Author' });
};

const authorCreatePost = [
    body('first_name').trim().isLength({ min: 1 }).escape()
        .withMessage('First name must be specified.')
        .isAlphanumeric()
        .withMessage('First name has non-alpha-numeric characters.'),
    body('family_name').trim().isLength({ min: 1 }).escape()
        .withMessage('Family name must be specified.')
        .isAlphanumeric()
        .withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
        } else {
            const author = new Author(
                {
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    date_of_birth: req.body.date_of_birth,
                    date_of_death: req.body.date_of_death,
                },
            );
            author.save((err) => {
                if (err) return next(err);
                res.redirect(author.url);
            });
        }
    },
];

const authorDeleteGet = function (req, res, next) {
    async.parallel({
        author(callback) {
            Author.findById(req.params.id).exec(callback);
        },
        authors_books(callback) {
            Book.find({ author: req.params.id }).exec(callback);
        },
    }, (err, results) => {
        if (err) { return next(err); }
        if (results.author == null) { // No results.
            res.redirect('/catalog/authors');
        }
        // Successful, so render.
        res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books });
    });
};

const authorDeletePost = function (req, res, next) {
    async.parallel({
        author(callback) {
            Author.findById(req.body.authorid).exec(callback);
        },
        authors_books(callback) {
            Book.find({ author: req.body.authorid }).exec(callback);
        },
    }, (err, results) => {
        if (err) { return next(err); }
        // Success
        if (results.authors_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books });
        } else {
            // Author has no books. Delete object and redirect to the list of authors.
            Author.findByIdAndRemove(req.body.authorid, (err) => {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/catalog/authors');
            });
        }
    });
};

const authorUpdateGet = (req, res, next) => {
    Author.findById(req.params.id).exec((err, results) => {
        if (err) {
            return next(err);
        }
        res.render('author_form', { title: 'Update Author', author: results });
    });
};

const authorUpdatePost = [
    body('first_name', 'First name must be specified').trim().isLength({ min: 1 }).escape(),
    body('family_name', 'Family name must be specified').trim().isLength({ min: 1 }).escape(),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),
    (req, res, next) => {
        const errors = validationResult(req);
        const author = new Author(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
                _id: req.params.id,
            },
        );
        if (!errors.isEmpty()) {
            Author.findById(req.params.id).exec((err, results) => {
                if (err) {
                    return next(err);
                }
                res.render('author_form', { title: 'Update Author', author: results, errors: errors.array() });
            });
        } else {
            Author.findByIdAndUpdate(req.params.id, author, {}, (err, results) => {
                if (err) {
                    return next(err);
                }
                res.redirect(results.url);
            });
        }
    },
];

module.exports = {
    authorList,
    authorDetail,
    authorCreateGet,
    authorCreatePost,
    authorDeleteGet,
    authorDeletePost,
    authorUpdateGet,
    authorUpdatePost,
};

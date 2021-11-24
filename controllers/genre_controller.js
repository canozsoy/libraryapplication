const async = require('async');
const { body, validationResult } = require('express-validator');
const Genre = require('../models/genre');
const Book = require('../models/book');

// Display list of all Genre.
const genreList = function (req, res, next) {
    Genre.find()
        .sort([['name', 'ascending']])
        .exec((err, res1) => {
            if (err) next(err);
            res.render('genre_list', { title: 'Genre List', genre_list: res1 });
        });
};

// Display detail page for a specific Genre.
const genreDetail = function (req, res, next) {
    async.parallel({
        genre: (callback) => {
            Genre.findById(req.params.id)
                .exec(callback);
        },
        genre_books: (callback) => {
            Book.find({ genre: req.params.id })
                .exec(callback);
        },
    }, (err, result) => {
        if (err) return next(err);
        if (result.genre == null) {
            const err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        res.render('genre_detail', { title: 'Genre Detail', genre: result.genre, genre_books: result.genre_books });
    });
};

// Display Genre create form on GET.
const genreCreateGet = function (req, res, next) {
    res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
const genreCreatePost = [
    body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const genre = new Genre(
            { name: req.body.name },
        );
        if (!errors.isEmpty()) {
            res.render('genre_form', { title: 'Create Genre', genre, errors: errors.array() });
        } else {
            Genre.findOne({ name: req.body.name })
                .exec((err, found_genre) => {
                    if (err) { return next(err); }
                    if (found_genre) {
                        res.redirect(found_genre.url);
                    } else {
                        genre.save((err) => {
                            if (err) { return next(err); }
                            res.redirect(genre.url);
                        });
                    }
                });
        }
    },
];

// Display Genre delete form on GET.
const genreDeleteGet = function (req, res, next) {
    async.parallel({
        genre(callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        books(callback) {
            Book.find({ genre: req.params.id }).exec(callback);
        },
    }, (err, results) => {
        if (err) return next(err);
        if (results.genre == null) {
            res.redirect('/catalog/genres');
        }
        res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, books: results.books });
    });
};

// Handle Genre delete on POST.
const genreDeletePost = function (req, res, next) {
    async.parallel({
        genre(callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        books(callback) {
            Book.find({ genre: req.params.id }).exec(callback);
        },
    }, (err, results) => {
        if (err) return next(err);
        if (results.books.length > 0) {
            res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, books: results.books });
        } else {
            Genre.findByIdAndRemove(req.params.id, (err1) => {
                if (err1) return next(err1);
                res.redirect('/catalog/genres');
            });
        }
    });
};

// Display Genre update form on GET.
const genreUpdateGet = function (req, res, next) {
    Genre.findById(req.params.id)
        .exec((err, result) => {
            if (err) {
                return next(err);
            }
            res.render('genre_form', { title: 'Update Genre', genre: result });
        });
};

// Handle Genre update on POST.
const genreUpdatePost = [
    body('name', 'Name must not be empty').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        const genre = new Genre(
            {
                name: req.body.name,
            },
        );
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            Genre.findById(req.params.id)
                .exec((err, result) => {
                    if (err) return next(err);
                    res.render('author_form', { title: 'Update Genre', genre: result, errors: errors.array() });
                });
        } else {
            Genre.findByIdAndUpdate(req.param.id, genre, {}, (err, results) => {
                if (err) {
                    return next(err);
                }
                res.redirect(results.url);
            });
        }
    },
];

module.exports = {
    genreList,
    genreDetail,
    genreCreateGet,
    genreCreatePost,
    genreDeleteGet,
    genreDeletePost,
    genreUpdateGet,
    genreUpdatePost,
};

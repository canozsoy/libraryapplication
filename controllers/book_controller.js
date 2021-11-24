const async = require('async');
const { body, validationResult } = require('express-validator');
const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');

const index = (req, res) => {
    async.parallel({
        book_count: (callback) => {
            Book.countDocuments({}, callback);
        },
        book_instance_count: (callback) => {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: (callback) => {
            BookInstance.countDocuments({ status: 'Available' }, callback);
        },
        author_count: (callback) => {
            Author.countDocuments({}, callback);
        },
        genre_count: (callback) => {
            Genre.countDocuments({}, callback);
        },
    }, (err, results) => {
        res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
};

// Display list of all books.
const bookList = (req, res, next) => {
    Book.find({}, 'title author')
        .populate('author')
        .exec(((err, res1) => {
            if (err) { return next(err); }
            res.render('book_list', { title: 'Book List', book_list: res1 });
        }));
};

// Display detail page for a specific book.
const bookDetail = function (req, res, next) {
    async.parallel({
        book(callback) {
            Book.findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec(callback);
        },
        book_instance(callback) {
            BookInstance.find({ book: req.params.id })
                .exec(callback);
        },
    }, (err, results) => {
        if (err) return next(err);
        if (results.book == null) {
            const err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        res.render('book_detail', { title: results.book.title, book: results.book, book_instances: results.book_instance });
    });
};

// Display book create form on GET.
const bookCreateGet = function (req, res, next) {
    async.parallel({
        authors(callback) {
            Author.find(callback);
        },
        genres(callback) {
            Genre.find(callback);
        },
    }, (err, results) => {
        if (err) { return next(err); }
        res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
    });
};

// Handle book create on POST.
const bookCreatePost = [
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined') req.body.genre = [];
            else req.body.genre = new Array(req.body.genre);
        }
        next();
    },
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        const book = new Book(
            {
                title: req.body.title,
                author: req.body.author,
                summary: req.body.summary,
                isbn: req.body.isbn,
                genre: req.body.genre,
            },
        );
        if (!errors.isEmpty()) {
            async.parallel({
                authors(callback) {
                    Author.find(callback);
                },
                genres(callback) {
                    Genre.find(callback);
                },
            }, (err, results) => {
                if (err) return next(err);
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked = 'true';
                    }
                }
                res.render('book_form', {
                    title: 'Create Book', authors: results.authors, genres: results.genres, book, errors: errors.array(),
                });
            });
        } else {
            book.save((err) => {
                if (err) return next(err);
                res.redirect(book.url);
            });
        }
    },
];

// Display book delete form on GET.
const bookDeleteGet = function (req, res, next) {
    async.parallel({
        book(callback) {
            Book.findById(req.params.id).exec(callback);
        },
        bookinstance(callback) {
            BookInstance.find({ book: req.params.id }).exec(callback);
        },
    }, (err, results) => {
        if (err) return next(err);
        if (results.book == null) {
            res.redirect('/catalog/books');
        }
        res.render('book_delete', { title: 'Delete Book', book: results.book, book_instances: results.bookinstance });
    });
};

// Handle book delete on POST.
const bookDeletePost = function (req, res, next) {
    async.parallel({
        book(callback) {
            Book.findById(req.params.id).exec(callback);
        },
        bookinstances(callback) {
            BookInstance.find({ book: req.params.id }).exec(callback);
        },
    }, (err, results) => {
        if (err) return next(err);
        if (results.bookinstances.length > 0) {
            res.render('book_delete', { title: 'Delete Book', book: results.book, book_instances: results.bookinstance });
        } else {
            Book.findByIdAndRemove(req.body.bookid, (err1) => {
                if (err1) return next(err1);
                res.redirect('/catalog/books');
            });
        }
    });
};

// Display book update form on GET.
const bookUpdateGet = function (req, res, next) {
    // Get book, authors and genres for form.
    async.parallel({
        book(callback) {
            Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
        },
        authors(callback) {
            Author.find(callback);
        },
        genres(callback) {
            Genre.find(callback);
        },
    }, (err, results) => {
        if (err) { return next(err); }
        if (results.book == null) { // No results.
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        // Mark our selected genres as checked.
        for (let all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
            for (let book_g_iter = 0; book_g_iter < results.book.genre.length; book_g_iter++) {
                if (results.genres[all_g_iter]._id.toString() === results.book.genre[book_g_iter]._id.toString()) {
                    results.genres[all_g_iter].checked = 'true';
                }
            }
        }
        res.render('book_form', {
            title: 'Update Book', authors: results.authors, genres: results.genres, book: results.book,
        });
    });
};

// Handle book update on POST.
const bookUpdatePost = [

    // Convert the genre to an array
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined') req.body.genre = [];
            else req.body.genre = new Array(req.body.genre);
        }
        next();
    },

    // Validate and sanitise fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        const book = new Book(
            {
                title: req.body.title,
                author: req.body.author,
                summary: req.body.summary,
                isbn: req.body.isbn,
                genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre,
                _id: req.params.id, // This is required, or a new ID will be assigned!
            },
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                authors(callback) {
                    Author.find(callback);
                },
                genres(callback) {
                    Genre.find(callback);
                },
            }, (err, results) => {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked = 'true';
                    }
                }
                res.render('book_form', {
                    title: 'Update Book', authors: results.authors, genres: results.genres, book, errors: errors.array(),
                });
            });
        } else {
            // Data from form is valid. Update the record.
            Book.findByIdAndUpdate(req.params.id, book, {}, (err, thebook) => {
                if (err) { return next(err); }
                // Successful - redirect to book detail page.
                res.redirect(thebook.url);
            });
        }
    },
];

module.exports = {
    index,
    bookList,
    bookDetail,
    bookCreateGet,
    bookCreatePost,
    bookDeleteGet,
    bookDeletePost,
    bookUpdateGet,
    bookUpdatePost,
};

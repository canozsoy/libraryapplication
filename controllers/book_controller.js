const { validationResult } = require('express-validator');
const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');
const bookValidations = require('./validations/book_validations');

const index = async (req, res) => {
    let metaData;
    let error;
    try {
        metaData = await Promise.all([
            Book.countDocuments({}).exec(),
            BookInstance.countDocuments({}).exec(),
            BookInstance.countDocuments({ status: 'Available' }).exec(),
            Author.countDocuments({}).exec(),
            Genre.countDocuments({}).exec(),
        ]);
    } catch (err) {
        error = err;
    }
    return res.render('index', {
        title: 'Local Library Home',
        error,
        data: metaData,
    });
};

// Display list of all books.
const bookList = async (req, res, next) => {
    let book;
    try {
        book = await Book.find({}, 'title author')
            .populate('author');
    } catch (err) {
        return next(err);
    }
    return res.render('book_list', { title: 'Book List', book_list: book });
};

// Display detail page for a specific book.
const bookDetail = async (req, res, next) => {
    let book;
    let bookInstance;
    try {
        [book, bookInstance] = await Promise.all([
            Book.findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec(),
            BookInstance.find({ book: req.params.id })
                .exec(),
        ]);
    } catch (err) {
        return next(err);
    }

    if (!book) {
        const err = (new Error('Book not found')).status(404);
        return next(err);
    }

    return res.render('book_detail', {
        title: book.title,
        book,
        book_instances: bookInstance,
    });
};

// Display book create form on GET.
const bookCreateGet = async (req, res, next) => {
    let authors;
    let genres;
    try {
        [authors, genres] = await Promise.all([
            Author.find().exec(),
            Genre.find().exec(),
        ]);
    } catch (err) {
        return next(err);
    }

    return res.render('book_form', {
        title: 'Create Book',
        authors,
        genres,
    });
};

// Handle book create on POST.
const bookCreatePost = [
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined') {
                req.body.genre = [];
            } else {
                req.body.genre = new Array(req.body.genre);
            }
        }
        next();
    },
    bookValidations.createPost,
    async (req, res, next) => {
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
            let authors;
            let genres;
            try {
                [authors, genres] = await Promise.all([
                    Author.find().exec(),
                    Genre.find().exec(),
                ]);
            } catch (err) {
                return next(err);
            }

            genres.forEach((x, i) => {
                if (book.genre.indexOf(genres[i].id) > -1) {
                    genres[i].checked = 'true';
                }
            });

            return res.render('book_form', {
                title: 'Create Book',
                authors,
                genres,
                book,
                errors: errors.array(),
            });
        }
        try {
            await book.save();
        } catch (err) {
            return next(err);
        }
        return res.redirect(book.url);
    },
];

// Display book delete form on GET.
const bookDeleteGet = async (req, res, next) => {
    let book;
    let bookInstance;
    try {
        [book, bookInstance] = await Promise.all([
            Book.findById(req.params.id).exec(),
            BookInstance.find({ book: req.params.id }).exec(),
        ]);
    } catch (err) {
        return next(err);
    }

    if (!book) {
        return res.redirect('/catalog/books');
    }

    return res.render('book_delete', {
        title: 'Delete Book',
        book,
        book_instances: bookInstance,
    });
};

// Handle book delete on POST.
const bookDeletePost = async (req, res, next) => {
    let book;
    let bookInstance;
    try {
        [book, bookInstance] = await Promise.all([
            Book.findById(req.params.id).exec(),
            BookInstance.find({ book: req.params.id }).exec(),
        ]);
    } catch (err) {
        return next(err);
    }

    if (bookInstance.length > 0) {
        return res.render('book_delete', {
            title: 'Delete Book',
            book,
            book_instances: bookInstance,
        });
    }

    try {
        await Book.findByIdAndRemove(req.body.bookid);
    } catch (err) {
        return next(err);
    }
    return res.redirect('/catalog/books');
};

// Display book update form on GET.
const bookUpdateGet = async (req, res, next) => {
    // Get book, authors and genres for form.
    let results;
    try {
        results = await Promise.all([
            Book.findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec(),
            Author.find(),
            Genre.find(),
        ]);
    } catch (err) {
        return next(err);
    }

    if (!results.book) { // No results.
        const err = (new Error('Book not found')).status(404);
        return next(err);
    }
    // Success.
    // Mark our selected genres as checked.

    results.genres.forEach((x, i) => {
        results.book.genre.forEach((y, j) => {
            if (results.genres[i].id.toString() === results.book.genre[j].id.toString()) {
                results.genres[i].checked = 'true';
            }
        });
    });

    return res.render('book_form', {
        title: 'Update Book',
        authors: results.authors,
        genres: results.genres,
        book: results.book,
    });
};

// Handle book update on POST.
const bookUpdatePost = [

    // Convert the genre to an array
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined') {
                req.body.genre = [];
            } else {
                req.body.genre = new Array(req.body.genre);
            }
        }
        next();
    },
    bookValidations.updatePost,
    // Process request after validation and sanitization.
    async (req, res, next) => {
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
            let authors;
            let genres;
            try {
                [authors, genres] = await Promise.all([
                    Author.find().exec(),
                    Genre.find().exec(),
                ]);
            } catch (err) {
                return next(err);
            }

            genres.forEach((x, i) => {
                if (book.genre.indexOf(genres[i].id) > -1) {
                    genres[i].checked = 'true';
                }
            });

            return res.render('book_form', {
                title: 'Update Book',
                authors,
                genres,
                book,
                errors: errors.array(),
            });
        }
        // Data from form is valid. Update the record.
        let updatedBook;
        try {
            updatedBook = await Book.findByIdAndUpdate(req.params.id, book, {}).exec();
        } catch (err) {
            return next(err);
        }

        return res.redirect(updatedBook.url);
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

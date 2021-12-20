const { validationResult } = require('express-validator');
const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');
const bookInstanceValidation = require('../schemas/book_instance_schemas');

// Display list of all BookInstances.
const bookInstanceList = async (req, res, next) => {
    let bookInstances;
    try {
        bookInstances = await BookInstance.find()
            .populate('book')
            .exec();
    } catch (err) {
        return next(err);
    }

    return res.render('bookinstance_list', {
        title: 'Book Instance List',
        bookinstance_list: bookInstances,
    });
};

// Display detail page for a specific BookInstance.
const bookInstanceDetail = async (req, res, next) => {
    let bookInstance;
    try {
        bookInstance = await BookInstance.findById(req.params.id)
            .populate('book')
            .exec();
    } catch (err) {
        return next(err);
    }

    if (!bookInstance) {
        const err = (new Error('Book copy not found')).status(404);
        return next(err);
    }

    return res.render('bookinstance_detail', {
        title: `Copy: ${bookInstance.book.title}`,
        bookinstance: bookInstance,
    });
};

// Display BookInstance create form on GET.
const bookInstanceCreateGet = async (req, res, next) => {
    let book;
    try {
        book = await Book.find({}, 'title').exec();
    } catch (err) {
        return next(err);
    }

    return res.render('bookinstance_form', {
        title: 'Create BookInstance',
        book_list: book,
    });
};

// Handle BookInstance create on POST.
const bookInstanceCreatePost = [
    bookInstanceValidation.createPost,
    async (req, res, next) => {
        const errors = validationResult(req);
        const bookInstance = new BookInstance(
            {
                book: req.body.book,
                imprint: req.body.imprint,
                status: req.body.status,
                due_back: req.body.due_back,
            },
        );
        if (!errors.isEmpty()) {
            let book;
            try {
                book = await Book.find({}, 'title').exec();
            } catch (err) {
                return next(err);
            }
            return res.render('bookinstance_form', {
                title: 'Create BookInstance',
                book_list: book,
                selected_book: bookInstance.id,
                errors: errors.array(),
                bookInstance,
            });
        }
        try {
            await bookInstance.save();
        } catch (err) {
            return next(err);
        }

        return res.redirect(bookInstance.url);
    },
];

// Display BookInstance delete form on GET.
const bookInstanceDeleteGet = async (req, res, next) => {
    let book;
    let imprint;
    try {
        [book, imprint] = await Promise.all([
            BookInstance.findById(req.params.id)
                .populate('book').exec(),
            BookInstance.find({ book: req.params.id }, 'imprint')
                .exec(),
        ]);
    } catch (err) {
        return next(err);
    }
    if (!book) {
        return res.redirect('/catalog/book-instances');
    }

    return res.render('bookinstance_delete', {
        title: 'Delete Book Instance',
        book,
        imprint,
    });
};

// Handle BookInstance delete on POST.
const bookInstanceDeletePost = async (req, res, next) => {
    try {
        await Promise.all([
            BookInstance.findById(req.params.id).populate('book').exec(),
            BookInstance.find({ book: req.params.id }, 'imprint').exec(),
        ]);
    } catch (err) {
        return next(err);
    }

    try {
        await BookInstance.findByIdAndRemove(req.body.bookinstanceid).exec();
    } catch (err) {
        return next(err);
    }
    return res.redirect('/catalog/book-instances');
};

// Display BookInstance update form on GET.
const bookInstanceUpdateGet = async (req, res, next) => {
    let bookInstance;
    let book;
    try {
        [bookInstance, book] = await Promise.all([
            BookInstance.findById(req.params.id).populate('book').exec(),
            Book.find().exec(),
        ]);
    } catch (err) {
        return next(err);
    }
    if (!bookInstance) {
        const err = (new Error('Book copy not found')).status(404);
        return next(err);
    }
    return res.render('bookinstance_form', {
        title: 'Update Book Instance',
        book_list: book,
        bookinstance: bookInstance,
    });
};

// Handle bookinstance update on POST.
const bookInstanceUpdatePost = [
    bookInstanceValidation.updatePost,
    async (req, res, next) => {
        const errors = validationResult(req);
        const bookInstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            due_back: req.body.due_back,
            status: req.body.status,
            _id: req.params.id,
        });
        if (!errors.isEmpty()) {
            let book;
            try {
                book = await Book.findById(req.params.id).exec();
            } catch (err) {
                return next(err);
            }
            return res.render('bookinstance_form', {
                title: 'Update Book Instance',
                book_list: book,
                bookInstance,
            });
        }
        let updatedBookInstance;
        try {
            updatedBookInstance = await BookInstance
                .findByIdAndUpdate(req.params.id, bookInstance, {})
                .exec();
        } catch (err) {
            return next(err);
        }
        return res.redirect(updatedBookInstance.url);
    },
];

module.exports = {
    bookInstanceList,
    bookInstanceDetail,
    bookInstanceCreateGet,
    bookInstanceCreatePost,
    bookInstanceDeleteGet,
    bookInstanceDeletePost,
    bookInstanceUpdateGet,
    bookInstanceUpdatePost,
};

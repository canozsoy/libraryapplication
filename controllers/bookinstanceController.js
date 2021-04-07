let BookInstance = require('../models/bookinstance');
const {body, validationResult} = require("express-validator");
let Book = require("../models/book");
let async = require("async");

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res, next) {
    BookInstance.find()
        .populate("book")
        .exec((err, res1) => {
            if (err) {return next(err)}
            res.render("bookinstance_list", {title: "Book Instance List", bookinstance_list: res1});
        });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {
    BookInstance.findById(req.params.id)
        .populate("book")
        .exec(function (err, results) {
            if (err) return next(err);
            if (results == null) {
                const err = new Error("Book copy not found");
                err.status = 404;
                return next(err);
            }
            res.render("bookinstance_detail", {title: "Copy: " + results.book.title, bookinstance: results});
        })
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next) {
    Book.find({}, "title")
        .exec(function (err, results) {
            if (err) return next(err);
            res.render("bookinstance_form", {title: "Create BookInstance", book_list: results});
        });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    body("book", "Book must be specified").trim().isLength({min: 1}).escape(),
    body("imprint", "Imprint must be specified").trim().isLength({min: 1}).escape(),
    body("status").escape(),
    body("due_back", "Invalid date").optional({checkFalsy: true}).isISO8601().toDate(),
    (req, res, next) => {
    const errors = validationResult(req);
    let bookinstance = new BookInstance (
        {
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
        }
    );
    if (!errors.isEmpty()) {
        Book.find({}, "title")
            .exec(function (err, results) {
                if (err) return next(err);
                res.render("bookinstance_form", {title: "Create BookInstance", book_list: results, selected_book: bookinstance._id, errors: errors.array(), bookinstance: bookinstance});
            });
        return;
    }
    else {
        bookinstance.save(function (err) {
            if (err) {return next(err);}
            res.redirect(bookinstance.url);
        });
    }
    }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res, next) {
    async.parallel({
        book: function (callback) {
            BookInstance.findById(req.params.id).populate("book").exec(callback);
        },
        imprint: function (callback) {
            BookInstance.find({"book": req.params.id}, "imprint").exec(callback);
        }
    }, function (err, results) {
        if (err) return next(err);
        if (results.book == null) {
            res.redirect("/catalog/bookinstances");
        }
        res.render("bookinstance_delete", {title: "Delete Book Instance", book: results.book, imprint: results.imprint})
    })
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res, next) {
    async.parallel({
        book: function (callback) {
            BookInstance.findById(req.params.id).populate("book").exec(callback);
        },
        imprint: function (callback) {
            BookInstance.find({"book": req.params.id}, "imprint").exec(callback);
        },
    }, function (err, result) {
        if (err) return next(err);
        BookInstance.findByIdAndRemove(req.body.bookinstanceid, function deleteBookInstance(err1) {
            if (err1) return next (err1);
            res.redirect("/catalog/bookinstances");
        });
    });
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res, next) {
    async.parallel({
        bookinstance: function (callback) {
            BookInstance.findById(req.params.id).populate("book").exec(callback);
        },
        book: function (callback) {
            Book.find(callback);
        },
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results.bookinstance == null) {
            let err = new Error("Book copy not found");
            err.status = 404;
            return next(err);
        }
        res.render("bookinstance_form", {title: "Update Book Instance", book_list: results.book, bookinstance: results.bookinstance});
    });
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
    body("book", "Book name must not be empty").trim().isLength({min: 1}).escape(),
    body("imprint", "Imprint must not be empty").trim().isLength({min: 1}).escape(),
    body("due_back", "Due back must not be empty").trim().isLength({min: 1}).escape(),
    body("status", "Status must not be empty").trim().isLength({min:1}),

    (req, res, next) => {
        const errors = validationResult(req);
        const bookinstance = new BookInstance ({
            book: req.body.book,
            imprint: req.body.imprint,
            due_back: req.body.due_back,
            status: req.body.status,
            _id: req.params.id
        });
        if (!errors.isEmpty()) {
            Book.findById(req.params.id).exec(function (err, results) {
                if (err) return next(err);
                res.render("bookinstance_form", {title: "Update Book Instance", book_list: book, bookinstance: bookinstance})
            });
        } else {
            BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function (err, results1) {
                if (err) return next(err);
                res.redirect(results1.url);
            })
        }


    }
]

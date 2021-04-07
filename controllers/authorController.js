let Author = require("../models/author");
let async = require("async");
let Book = require("../models/book");
const {body, validationResult} = require("express-validator");

exports.author_list = (req, res, next) => {
    Author.find()
        .sort([["family_name", "ascending"]])
        .exec((err, res1) =>  {
            if (err) {
                return next(err)
            }
            res.render("author_list", {title: "Author List", author_list: res1});
        })
};

exports.author_detail = (req, res, next) => {
    async.parallel({
        author: function (callback) {
            Author.findById(req.params.id)
                .exec(callback)
        },
        author_books: function (callback) {
            Book.find({"author": req.params.id}, "title summary")
                .exec(callback)
        },
    }, function (err, results) {
        if (err) return next(err);
        if (results.author == null) {
            const err = new Error("Author not found");
            err.status = 404;
            return next(err);
        }
        res.render("author_detail", {title: "Author Detail", author: results.author, author_books: results.author_books});
    });
};

exports.author_create_get = (req, res) => {
    res.render("author_form", {title: "Create Author"});
}

exports.author_create_post = [
    body("first_name").trim().isLength({min: 1}).escape().withMessage("First name must be specified.")
        .isAlphanumeric().withMessage("First name has non-alpha-numeric characters."),
    body("family_name").trim().isLength({min: 1}).escape().withMessage("Family name must be specified.")
        .isAlphanumeric().withMessage("Family name has non-alphanumeric characters."),
    body("date_of_birth", "Invalid date of birth").optional({checkFalsy: true}).isISO8601().toDate(),
    body("date_of_death", "Invalid date of death").optional({checkFalsy: true}).isISO8601().toDate(),
    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render("author_form", {title: "Create Author", author: req.body, errors: errors.array()});
        return;
    }
    else {
        let author = new Author (
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
            }
        );
        author.save(function (err) {
            if (err) return next(err);
            res.redirect(author.url);
        });
    }
    }
];

exports.author_delete_get = function(req, res, next) {

    async.parallel({
        author: function(callback) {
            Author.findById(req.params.id).exec(callback);
        },
        authors_books: function(callback) {
            Book.find({ 'author': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.author==null) { // No results.
            res.redirect('/catalog/authors');
        }
        // Successful, so render.
        res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
    });
};

exports.author_delete_post = function(req, res, next) {

    async.parallel({
        author: function(callback) {
            Author.findById(req.body.authorid).exec(callback)
        },
        authors_books: function(callback) {
            Book.find({ 'author': req.body.authorid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.authors_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
            return;
        }
        else {
            // Author has no books. Delete object and redirect to the list of authors.
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/catalog/authors');
            })
        }
    });
};


exports.author_update_get = (req, res, next) => {
    Author.findById(req.params.id).exec(function (err, results) {
        if (err) {
            return next(err);
        }
        res.render("author_form", {title: "Update Author", author: results});
    });
};

exports.author_update_post = [
    body("first_name", "First name must be specified").trim().isLength({min: 1}).escape(),
    body("family_name", "Family name must be specified").trim().isLength({min: 1}).escape(),
    body("date_of_birth", "Invalid date of birth").optional({checkFalsy: true}).isISO8601().toDate(),
    body("date_of_death", "Invalid date of death").optional({checkFalsy: true}).isISO8601().toDate(),
    (req, res, next) => {
    const errors = validationResult(req);
    const author = new Author (
        {
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
            _id: req.params.id
        }
    );
    if (!errors.isEmpty()) {
        Author.findById(req.params.id).exec(function (err, results) {
            if (err) {
                return next(err);
            }
            res.render("author_form", {title: "Update Author", author: results , errors: errors.array()});
        });
    } else {
        Author.findByIdAndUpdate(req.params.id, author, {}, function (err, results) {
            if (err) {
                return next(err);
            }
            res.redirect(results.url);
        });
    }
    }
];



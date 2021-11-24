const { validationResult } = require('express-validator');
const Author = require('../models/author');
const Book = require('../models/book');
const authorValidation = require('./validations/author_validations');

const authorList = async (req, res, next) => {
    let authors;
    try {
        authors = await Author.find()
            .sort([['family_name', 'ascending']])
            .exec();
    } catch (err) {
        return next(err);
    }
    return res.render('author_list', { title: 'Author List', author_list: authors });
};

const authorDetail = async (req, res, next) => {
    let author;
    let authorBooks;
    try {
        [author, authorBooks] = await Promise.all([
            Author.findById(req.params.id)
                .exec(),
            Book.find({ author: req.params.id }, 'title summary')
                .exec(),
        ]);
    } catch (err) {
        return next(err);
    }
    if (!author) {
        const err = (new Error('Author not found')).status(404);
        return next(err);
    }
    return res.render('author_detail', {
        title: 'Author Detail',
        author,
        author_books: authorBooks,
    });
};

const authorCreateGet = (req, res) => {
    res.render('author_form', { title: 'Create Author' });
};

const authorCreatePost = [
    authorValidation.createPostValidations,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('author_form', {
                title: 'Create Author',
                author: req.body,
                errors: errors.array(),
            });
        }
        const author = new Author(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
            },
        );
        try {
            await author.save();
        } catch (err) {
            return next(err);
        }
        return res.redirect(author.url);
    },
];

const authorDeleteGet = async (req, res, next) => {
    let author;
    let authorBooks;
    try {
        [author, authorBooks] = await Promise.all([
            Author.findById(req.params.id).exec(),
            Book.find({ author: req.params.id }).exec(),
        ]);
    } catch (err) {
        return next(err);
    }
    if (!author) {
        return res.redirect('/catalog/authors');
    }

    return res.render('author_delete', {
        title: 'Delete Author',
        author,
        author_books: authorBooks,
    });
};

const authorDeletePost = async (req, res, next) => {
    let author;
    let authorBooks;
    try {
        [author, authorBooks] = await Promise.all([
            Author.findById(req.body.authorid).exec(),
            Book.find({ author: req.body.authorid }).exec(),
        ]);
    } catch (err) {
        return next(err);
    }

    if (authorBooks.length > 0) {
        return res.render('author_delete', {
            title: 'Delete Author',
            author,
            author_books: authorBooks,
        });
    }

    try {
        await Author.findByIdAndRemove(req.body.authorid).exec();
    } catch (err) {
        return next(err);
    }

    return res.redirect('/catalog/authors');
};

const authorUpdateGet = async (req, res, next) => {
    let author;
    try {
        author = await Author.findById(req.params.id).exec();
    } catch (err) {
        return next(err);
    }

    return res.render('author_form', {
        title: 'Update Author',
        author,
    });
};

const authorUpdatePost = [
    authorValidation.updatePost,
    async (req, res, next) => {
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
            let oldAuthor;
            try {
                oldAuthor = await Author.findById(req.params.id).exec();
            } catch (err) {
                return next(err);
            }

            return res.render('author_form', {
                title: 'Update Author',
                author: oldAuthor,
                errors: errors.array(),
            });
        }
        let updatedAuthor;
        try {
            updatedAuthor = await Author.findByIdAndUpdate(req.params.id, author, {}).exec();
        } catch (err) {
            return next(err);
        }

        return res.redirect(updatedAuthor.url);
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

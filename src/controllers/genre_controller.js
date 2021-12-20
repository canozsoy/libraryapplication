const { validationResult } = require('express-validator');
const Genre = require('../models/genre');
const Book = require('../models/book');
const genreValidations = require('../validations/genre_validations');

// Display list of all Genre.
const genreList = async (req, res, next) => {
    let genre;
    try {
        genre = await Genre.find()
            .sort([['name', 'ascending']])
            .exec();
    } catch (err) {
        return next(err);
    }

    return res.render('genre_list', {
        title: 'Genre List',
        genre_list: genre,
    });
};

// Display detail page for a specific Genre.
const genreDetail = async (req, res, next) => {
    let genre;
    let genreBooks;
    try {
        [genre, genreBooks] = await Promise.all([
            Genre.findById(req.params.id)
                .exec(),
            Book.find({ genre: req.params.id })
                .exec(),
        ]);
    } catch (err) {
        return next(err);
    }

    if (!genre) {
        const err = new Error('Genre not found');
        err.status = 404;
        return next(err);
    }
    return res.render('genre_detail', {
        title: 'Genre Detail',
        genre,
        genre_books: genreBooks,
    });
};

// Display Genre create form on GET.
const genreCreateGet = (req, res) => res.render('genre_form', { title: 'Create Genre' });

// Handle Genre create on POST.
const genreCreatePost = [
    genreValidations.createPost,
    async (req, res, next) => {
        const errors = validationResult(req);
        const genre = new Genre(
            { name: req.body.name },
        );
        if (!errors.isEmpty()) {
            return res.render('genre_form', {
                title: 'Create Genre',
                genre,
                errors: errors.array(),
            });
        }
        let foundGenre;
        try {
            foundGenre = await Genre.findOne({ name: req.body.name }).exec();
        } catch (err) {
            return next(err);
        }
        if (foundGenre) {
            return res.redirect(foundGenre.url);
        }
        try {
            await genre.save();
        } catch (err) {
            return next(err);
        }
        return res.redirect(genre.url);
    },
];

// Display Genre delete form on GET.
const genreDeleteGet = async (req, res, next) => {
    let genre;
    let books;
    try {
        [genre, books] = await Promise.all([
            Genre.findById(req.params.id).exec(),
            Book.find({ genre: req.params.id }).exec(),
        ]);
    } catch (err) {
        return next(err);
    }

    if (!genre) {
        return res.redirect('/catalog/genres');
    }
    return res.render('genre_delete', {
        title: 'Delete Genre',
        genre,
        books,
    });
};

// Handle Genre delete on POST.
const genreDeletePost = async (req, res, next) => {
    let genre;
    let books;
    try {
        [genre, books] = await Promise.all([
            Genre.findById(req.params.id).exec(),
            Book.find({ genre: req.params.id }).exec(),
        ]);
    } catch (err) {
        return next(err);
    }

    if (books.length > 0) {
        return res.render('genre_delete', {
            title: 'Delete Genre',
            genre,
            books,
        });
    }

    try {
        await Genre.findByIdAndRemove(req.params.id);
    } catch (err) {
        return next(err);
    }
    return res.redirect('/catalog/genres');
};

// Display Genre update form on GET.
const genreUpdateGet = async (req, res, next) => {
    let genre;
    try {
        genre = await Genre.findById(req.params.id).exec();
    } catch (err) {
        return next(err);
    }

    return res.render('genre_form', {
        title: 'Update Genre',
        genre,
    });
};

// Handle Genre update on POST.
const genreUpdatePost = [
    genreValidations.updatePost,
    async (req, res, next) => {
        const genre = {
            name: req.body.name,
        };
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errorResult;
            try {
                errorResult = await Genre.findById(req.params.id);
            } catch (err) {
                return next(err);
            }

            return res.render('author_form', {
                title: 'Update Genre',
                genre: errorResult,
                errors: errors.array(),
            });
        }
        let successResult;
        try {
            successResult = await Genre.findByIdAndUpdate(req.params.id, genre, {}).exec();
        } catch (err) {
            return next(err);
        }

        return res.redirect(successResult.url);
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

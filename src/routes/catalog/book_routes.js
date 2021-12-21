const express = require('express');
const bookController = require('../../controllers/book_controller');
const genreFormat = require('../../middlewares/genre_format');
const bookSchemas = require('../../schemas/book_schemas');
const bookValidations = require('../../middlewares/book_validation');

const router = express.Router();

router.route('/create')
    .get(bookController.bookCreateGet)
    .post(
        genreFormat,
        bookSchemas.createPost,
        bookValidations.createPost,
        bookController.bookCreatePost,
    );

router.route('/:id/delete')
    .get(bookController.bookDeleteGet)
    .post(bookController.bookDeletePost);

router.route('/:id/update')
    .get(bookController.bookUpdateGet)
    .post(
        genreFormat,
        bookSchemas.updatePost,
        bookValidations.updatePost,
        bookController.bookUpdatePost,
    );

router.get('/:id', bookController.bookDetail);

router.get('/', bookController.bookList);

module.exports = router;

const express = require('express');

const router = express.Router();
const bookController = require('../controllers/book_controller');
const authorController = require('../controllers/author_controller');
const genreController = require('../controllers/genre_controller');
const bookInstanceController = require('../controllers/book_instance_controller');

// Book routes

router.get('/', bookController.index);

router.route('/book/create')
    .get(bookController.bookCreateGet)
    .post(bookController.bookCreatePost);

router.route('book/:id/delete')
    .get(bookController.bookDeleteGet)
    .post(bookController.bookDeletePost);

router.route('/book/:id/update')
    .get(bookController.bookUpdateGet)
    .post(bookController.bookUpdatePost);

router.get('/book/:id', bookController.bookDetail);

router.get('/books', bookController.bookList);

// Author routes

router.route('/author/create')
    .get(authorController.authorCreateGet)
    .post(authorController.authorCreatePost);

router.route('/author/:id/delete')
    .get(authorController.authorDeleteGet)
    .post(authorController.authorDeletePost);

// GET request to update Author.
router.route('/author/:id/update')
    .get(authorController.authorUpdateGet)
    .post(authorController.authorUpdatePost);

router.get('/author/:id', authorController.authorDetail);

router.get('/authors', authorController.authorList);

// Genre routes

router.route('/genre/create')
    .get(genreController.genreCreateGet)
    .post(genreController.genreCreatePost);

router.route('genre/:id/delete')
    .get(genreController.genreDeleteGet)
    .post(genreController.genreDeletePost);

router.route('/genre/:id/update')
    .get(genreController.genreUpdateGet)
    .post(genreController.genreUpdatePost);

router.get('/genre/:id', genreController.genreDetail);

router.get('/genres', genreController.genreList);

// Book instance routes

router.route('/book-instance/create')
    .get(bookInstanceController.bookinstanceCreateGet)
    .post(bookInstanceController.bookInstanceCreatePost);

router.route('/book-instance/:id/delete')
    .get(bookInstanceController.bookInstanceDeleteGet)
    .post(bookInstanceController.bookInstanceDeletePost);

router.route('/book-instance/:id/update')
    .get(bookInstanceController.bookInstanceUpdateGet)
    .post(bookInstanceController.bookInstanceUpdatePost);

router.get('/book-instance/:id', bookInstanceController.bookinstanceDetail);

router.get('/book-instances', bookInstanceController.bookinstanceList);

module.exports = router;
